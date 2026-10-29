import express, { Request, Response } from 'express';
import { createServer as createViteServer } from 'vite';
import path from 'path';
import { fileURLToPath } from 'url';
import dotenv from 'dotenv';
import { GoogleGenAI } from '@google/genai';

dotenv.config();

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

const app = express();
const PORT = Number(process.env.PORT) || 3000;

app.use(express.json());
app.use(express.urlencoded({ extended: true }));

// Initialize GoogleGenAI SDK with required telemetry header
const ai = new GoogleGenAI({
  apiKey: process.env.GEMINI_API_KEY || '',
  httpOptions: {
    headers: {
      'User-Agent': 'aistudio-build',
    },
  },
});

// Bounded timeout helper for external API calls
function withTimeout<T>(promise: Promise<T>, ms: number = 5000): Promise<T> {
  return Promise.race([
    promise,
    new Promise<T>((_, reject) =>
      setTimeout(() => reject(new Error(`Operation timed out after ${ms}ms`)), ms)
    ),
  ]);
}

// -------------------------------------------------------------
// SWEET TALK! ICE CREAM SHOP ENDPOINT (Section 7 PRD)
// -------------------------------------------------------------

/**
 * Gemini Feedback Generator following Section 7 Rules
 * Generates max 2 short English sentences with concise Korean support in parentheses.
 * Prioritizes intelligibility and never changes deterministic keyword success!
 */
app.post('/api/sweettalk/feedback', async (req: Request, res: Response) => {
  let fallbackText = 'Nice try! (좋은 시도예요!) Keep going! (계속해 봐요!)';

  try {
    const {
      turnNumber,
      targetSentence,
      recognizedText,
      missingKeyword,
      attemptStage,
      isSuccess,
      hasSmallWordMissing,
    } = req.body;

    // Hard fallback definitions according to Section 7 table
    const tableFallbacks: Record<number, any> = {
      1: {
        success: 'Nice speaking! (잘 말했어요!) I understood your ice cream order. (아이스크림 주문을 알아들었어요.)',
        smallMissing: "Nice speaking! (잘 말했어요!) You can also say, 'An ice cream, please.' (이렇게도 말할 수 있어요: 'An ice cream, please.')",
        recast: "Nice try! (좋은 시도예요!) You can say, 'An ice cream, please.' (이렇게 말해 봐요: 'An ice cream, please.')",
        elicitation: missingKeyword === 'ice'
          ? "Keep going! (계속해 봐요!) It starts with i: 'An i___ cream, please.' (i로 시작해요: 'An i___ cream, please.')"
          : "Keep going! (계속해 봐요!) It starts with c: 'An ice c___, please.' (c로 시작해요: 'An ice c___, please.')",
        chunking: "Let's take it in small parts! (짧게 나눠서 해 봐요!) Say 'An ice cream' / 'please.' ('An ice cream' / 'please'로 나눠 말해 봐요.)",
      },
      2: {
        success: 'Nice speaking! (잘 말했어요!) I understood your chocolate order. (초콜릿 맛 주문을 알아들었어요.)',
        smallMissing: "Nice speaking! (잘 말했어요!) You can also say, 'Chocolate, please.' (이렇게도 말할 수 있어요: 'Chocolate, please.')",
        recast: "Nice try! (좋은 시도예요!) You can say, 'Chocolate, please.' (이렇게 말해 봐요: 'Chocolate, please.')",
        elicitation: "Keep going! (계속해 봐요!) The flavor starts with c: 'C___, please.' (맛 이름은 c로 시작해요: 'C___, please.')",
        chunking: "Let's take it in small parts! (짧게 나눠서 해 봐요!) Say 'Chocolate' / 'please.' ('Chocolate' / 'please'로 나눠 말해 봐요.)",
      },
      3: {
        success: 'Nice speaking! (잘 말했어요!) I understood your cone order. (콘 주문을 알아들었어요.)',
        smallMissing: "Nice speaking! (잘 말했어요!) You can also say, 'A cone, please.' (이렇게도 말할 수 있어요: 'A cone, please.')",
        recast: "Nice try! (좋은 시도예요!) You can say, 'A cone, please.' (이렇게 말해 봐요: 'A cone, please.')",
        elicitation: "Keep going! (계속해 봐요!) It starts with c: 'A c___, please.' (c로 시작해요: 'A c___, please.')",
        chunking: "Let's take it in small parts! (짧게 나눠서 해 봐요!) Say 'A cone' / 'please.' ('A cone' / 'please'로 나눠 말해 봐요.)",
      },
      4: {
        success: 'Nice speaking! (잘 말했어요!) I understood two scoops. (두 스쿱 주문을 알아들었어요.)',
        smallMissing: "Nice speaking! (잘 말했어요!) You can also say, 'Two scoops, please.' (이렇게도 말할 수 있어요: 'Two scoops, please.')",
        recast: "Nice try! (좋은 시도예요!) You can say, 'Two scoops, please.' (이렇게 말해 봐요: 'Two scoops, please.')",
        elicitation: missingKeyword === 'two'
          ? "Keep going! (계속해 봐요!) The number starts with t: 'T___ scoops, please.' (t로 시작해요: 'T___ scoops, please.')"
          : "Keep going! (계속해 봐요!) It ends with s: 'Two s___, please.' (s로 시작해요: 'Two s___, please.')",
        chunking: "Let's take it in small parts! (짧게 나눠서 해 봐요!) Say 'Two scoops' / 'please.' ('Two scoops' / 'please'로 나눠 말해 봐요.)",
      },
      5: {
        success: 'Nice speaking! (잘 말했어요!) Thank you for visiting! (방문해 주셔서 고마워요!)',
        smallMissing: "Nice speaking! (잘 말했어요!) You can also say, 'No, thank you.' (이렇게도 말할 수 있어요: 'No, thank you.')",
        recast: "Nice try! (좋은 시도예요!) You can say, 'No, thank you.' (이렇게 말해 봐요: 'No, thank you.')",
        elicitation: missingKeyword === 'no'
          ? "Keep going! (계속해 봐요!) It starts with n: 'N___, thank you.' (n으로 시작해요: 'N___, thank you.')"
          : "Keep going! (계속해 봐요!) It starts with t: 'No, t___ you.' (t로 시작해요: 'No, t___ you.')",
        chunking: "Let's take it in small parts! (짧게 나눠서 해 봐요!) Say 'No' / 'thank you.' ('No' / 'thank you'로 나눠 말해 봐요.)",
      },
    };

    const turnData = tableFallbacks[turnNumber] || tableFallbacks[1];

    fallbackText = turnData.recast;
    if (isSuccess) {
      fallbackText = hasSmallWordMissing ? turnData.smallMissing : turnData.success;
    } else if (attemptStage === 1) {
      fallbackText = turnData.recast;
    } else if (attemptStage === 2) {
      fallbackText = turnData.elicitation;
    } else if (attemptStage >= 3) {
      fallbackText = turnData.chunking;
    }

    if (!process.env.GEMINI_API_KEY) {
      res.json({ feedback: fallbackText, source: 'table' });
      return;
    }

    const systemPrompt = `You are Coco, a patient, warm, and friendly bear shop assistant at an ice cream shop for Korean elementary school English learners (grades 5-6, CEFR A1).
Rules from Section 7:
1. Praise first, then one useful step.
2. Keep feedback to at most TWO short English sentences, each followed immediately by a concise Korean equivalent in parentheses.
3. Target sentence: "${targetSentence}".
4. Learner said: "${recognizedText || '(nothing)'}".
5. Success state: ${isSuccess ? (hasSmallWordMissing ? 'SUCCESS with small word omitted' : 'COMPLETE SUCCESS') : 'UNSUCCESSFUL ATTEMPT'}.
6. Feedback stage: ${isSuccess ? 'Praise' : attemptStage === 1 ? 'Recast' : attemptStage === 2 ? 'First-letter elicitation' : 'Chunking'}.
7. NEVER say 'wrong', never show percentages or pronunciation scores.
8. If successful, celebrate the order!
Output ONLY the feedback string with English followed by Korean in parentheses. Example:
"Nice speaking! (잘 말했어요!) I understood your chocolate order. (초콜릿 맛 주문을 알아들었어요.)"`;

    const response = await withTimeout(
      ai.models.generateContent({
        model: 'gemini-3.8-flash',
        contents: `Generate Coco's feedback for this turn. Current missing item: ${missingKeyword || 'none'}.`,
        config: {
          systemInstruction: systemPrompt,
          temperature: 0.5,
        },
      }),
      4500
    );

    const output = (response.text || '').trim();
    if (output && output.includes('(') && output.includes(')')) {
      res.json({ feedback: output, source: 'gemini' });
    } else {
      res.json({ feedback: fallbackText, source: 'table' });
    }
  } catch (error) {
    console.warn('Gemini feedback failed or timed out, falling back to Section 7 table');
    res.json({
      feedback: fallbackText || 'Nice try! (좋은 시도예요!) Keep going! (계속해 봐요!)',
      source: 'fallback',
    });
  }
});

// -------------------------------------------------------------
// VITE DEV SERVER OR STATIC ASSETS
// -------------------------------------------------------------
async function startServer() {
  if (process.env.NODE_ENV !== 'production') {
    const vite = await createViteServer({
      server: { middlewareMode: true },
      appType: 'spa',
    });
    app.use(vite.middlewares);
  } else {
    app.use(express.static(path.resolve(__dirname, 'dist')));
    app.get('*', (_req, res) => {
      res.sendFile(path.resolve(__dirname, 'dist', 'index.html'));
    });
  }

  app.listen(PORT, '0.0.0.0', () => {
    console.log(`Server running at http://0.0.0.0:${PORT}`);
  });
}

startServer();
