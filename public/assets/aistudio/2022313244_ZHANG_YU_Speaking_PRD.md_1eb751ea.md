# Speaking App PRD — Sweet Talk! — Ice Cream Shop

- **Name:** ZHANG YU
- **Student ID:** 2022313244
- **Course:** 인공지능과 영어교육 · ENG3088-01 · 김연정 교수님
- **My situation (상황):** Ordering an ice cream at a friendly ice cream shop.
- **Document date:** October 29, 2026
- **Document status:** PRD and three Stitch screen designs completed; screenshots supplied as separate attachments. App implementation, functional testing, and peer review remain pending. Unchecked functional criteria below are planned acceptance tests, not claims of completed testing.

## 1. App Name (앱 이름)

**Sweet Talk! — Ice Cream Shop**

A short English speaking practice app in which a learner orders an ice cream from an original illustrated shop assistant, Coco. The title connects a familiar sweet treat with the goal of becoming more comfortable speaking English.

The app uses one coherent situation and five short exchanges. Learners know what they are trying to communicate at every step: the item, flavor, container, number of scoops, and whether they need anything else.

## 2. Why We Are Building It (왜 만드는가)

### Problem

Some beginning learners can recognize words such as chocolate and cone but hesitate when they need to answer a real question aloud. They may worry about making mistakes in front of classmates, try to make every sound perfect, or stop speaking when they cannot remember a complete expression. A vocabulary-only activity does not give them enough practice taking a speaking turn.

### Solution

Sweet Talk! provides a predictable, low-pressure cycle: **See the situation → Listen → Speak → Compare → Get feedback → Try again / Next**. A familiar shop setting makes the communicative purpose clear. Short model sentences, Korean meanings, normal/slow audio, and graduated hints help learners take a turn without being overwhelmed.

Learners can repeat a sentence without losing points or being compared with other learners. The assistant responds to what the learner managed to communicate and offers only one next step. Recognition results are used to check key information, not to claim a professional diagnosis of pronunciation.

### Learning goal

**Students can say five short ice-cream-ordering expressions intelligibly so that a shop assistant can understand their order.**

By the end of the activity, learners should be able to request an ice cream, choose chocolate, ask for a cone, request two scoops, and politely finish the exchange. Accurate repetition of the entire model is encouraged, but communicating the designated key words is sufficient for success.

### Connection to Week 7 theory

| Theory | Design decision | Intended learning benefit |
| --- | --- | --- |
| Swain's Output Hypothesis | Each of the five turns asks the learner to speak, with recognized text shown afterward. | Attempting an answer helps learners notice what they can and cannot yet express. |
| Interaction and corrective feedback | An unsuccessful attempt receives recast, then elicitation, then chunking. | Feedback supports another meaningful speaking attempt rather than ending the interaction. |
| Affective filter and speaking anxiety | Praise comes first; no accuracy scores, public ranking, punishment, or timer. | Learners can focus on communicating instead of avoiding mistakes. |
| Skill Acquisition Theory | A learner may replay models, retry a turn, and repeat the whole dialogue. | Repeated use of the same useful expressions can support more fluent retrieval. |
| Levelt's speaking model | A situation/question supports conceptualization; the target sentence and hints support formulation; model audio supports articulation. Recognized text supports limited self-checking. | The app gives help at the stage where the learner is stuck. |

These are design intentions; learning effectiveness has not yet been measured. Recognized text is not an exact record of pronunciation, and this app does not include audio replay of the learner's voice.

## 3. Target Users (대상 사용자)

- **Grade:** Korean elementary school, grades 5–6.
- **Level:** CEFR A1; learners who know some food vocabulary and can follow short, supported questions.
- **Emotional characteristic:** Shy about speaking English and concerned about being judged when making mistakes.
- **Common mistake:** Omitting a small word such as an or a, forgetting please, or saying two scoop instead of two scoops. Missing a small word should not override successful communication of the key information.
- **Use context:** Individual review or homework on a smartphone, about five minutes per dialogue, preferably in a quiet place. Desktop use is also supported.
- **Language support:** English questions and target sentences with concise Korean meanings and Korean feedback support.
- **Prior knowledge:** Basic numbers, chocolate, and the concept of ordering food. A small cup/cone illustration helps explain less familiar vocabulary.
- **Learning environment:** No account, real name, student ID, school, or email is requested by the app. The author details in this document are submission metadata, not information collected from children.

## 4. Screen Layout (화면 구성)

### Shared visual direction

Use an original warm storybook illustration style with Coco, a friendly bear shop assistant, a soft cream background, cocoa-colored text, and restrained strawberry-pink and mint accents. Keep each screen spacious and use large, easy-to-read text. The educational content takes priority over decorative images. No photographs of real people or famous characters are used.

Primary controls should have a touch area of at least 48 × 48 CSS pixels. Text and icons must accompany color changes. Avoid continuous animation, countdowns, and background music. The target sentence is the largest text on the practice screen, with a planned size of about 30–36 px on a phone, responsive to screen width.

The three Stitch screens have been created and visually reviewed against this PRD. The attached files are `01_Start.png`, `02_Practice.png`, and `03_Result.png`. They demonstrate interface design, not working speech recognition. Dynamic behavior below remains an implementation requirement.

### Screen 1: Start Screen

- **Top:** “LEVEL 1 ROLEPLAY” label, title “Sweet Talk!”, subtitle “Ice Cream Shop (아이스크림 가게),” and a prominent original illustration of Coco at an ice cream counter.
- **Middle:** A short introduction: “Order an ice cream in 5 easy steps!” with Korean support. Show three concise instructions: Listen, Speak, Repeat. Include “Take your time. You can try again!” with Korean support to encourage repeated attempts.
- **Bottom:** Large [Start Practice / 연습 시작하기] button; the required notice: “Your voice is processed to turn it into text and not recorded or saved.”
- **Privacy clarification:** Add a concise explanation that the app does not store or upload recordings itself, but the browser's recognition service may process audio remotely depending on the browser. Do not promise that recognition is always local. Korean guidance: “앱은 음성 녹음을 저장하거나 별도로 업로드하지 않아요. 브라우저의 음성 인식 서비스가 음성을 처리할 수 있어요.”
- **Error guidance area:** If recognition is unavailable or an in-app browser is detected, explain how to open the app in Chrome. The normal lesson interface must remain readable.

### Screen 2: Practice Screen

- **Top:** “Step 1 of 5” style progress label; Coco's question in a speech bubble with its Korean meaning. A step indicator represents progress, not an accuracy score.
- **Middle:** Student target sentence in the largest text; Korean meaning below it; [Listen / 듣기] and [Slow / 천천히] buttons. Show designated key words with text emphasis, without presenting them as a numerical score.
- **Bottom:** Large [Mic / 말하기] button, status label, recognized-text panel labeled “I heard / 이렇게 들었어요,” short feedback box, and [Try Again / 다시 말하기], [Next / 다음], and [Skip / 건너뛰기] controls.
- **Mic button states:** **Ready → Listening → Done**. Ready shows a microphone and “Tap to speak”; Listening shows an active indicator and “Listening… / 듣고 있어요”; Done shows “Finished / 완료” with the recognized text and feedback. Error states provide a clear recovery instruction.
- **Interaction details:** A learner explicitly starts listening. Do not activate the microphone automatically on entering a turn. Disable it while model audio is playing. Cancel recognition and speech playback when leaving a turn or screen so old results cannot affect the next turn.
- **Progress behavior:** A learner may retry, move on, or skip without penalty. No automatic advance immediately after feedback: leave time to read it.

### Screen 3: Result Screen

- **Top:** “You finished your visit! / 주문 연습을 마쳤어요!” with Coco's encouraging message.
- **Middle:** The supplied example shows three participation stars and “You spoke in every turn and practiced again!” with Korean support. A Korean note explains that stars celebrate speaking courage and participation rather than scores. “Today’s Sweet Words” lists all five full expressions, replay icons, Korean meanings, and “Practiced / 연습 완료” badges. During implementation, statuses must reflect actual participation, including skipped turns; never hard-code all turns as practiced. The screenshot’s “5 / 5 Flavors” label represents the sample review count, not an accuracy grade; use the clearer “5 / 5 expressions reviewed” label in the functional app.
- **Bottom:** “Ready to order again?” with Korean support, followed by [Practice Again / 다시 연습하기] and [Back to Start / 처음으로] buttons. Practice Again clears the previous session's state and starts at turn 1.
- **Persistence:** Results and attempt counts exist in memory for the current session only. Refreshing or closing the page clears them; no learner profile or long-term performance record is created.

## 5. Key Features (주요 기능)

### Six-step flow for each sentence

1. **See the situation:** Show the partner's question and Korean meaning. Read the question aloud once when audio playback is permitted; if autoplay is blocked, allow the learner to start it with a clearly labeled control. Do not start listening automatically.
2. **Listen:** [Listen] plays the student target sentence at the required normal rate; [Slow] plays the same sentence slowly. The learner can listen repeatedly. The exact dialogue in Section 6 must be used.
3. **Speak:** The learner taps [Mic]. Request microphone permission when needed, show Listening visibly, and display the final recognized text. Aim to stop after about 1.5 seconds of silence where the browser permits; also provide [Stop / 말하기 끝내기] because automatic endpointing varies by browser. Add a reasonable listening timeout with a retry message, not a penalty.
4. **Compare:** Normalize capitalization, punctuation, and extra spaces; compare recognized word tokens with the target and its designated key words. Match whole words, not substrings. Use the Section 6 keywords consistently. All designated keywords present means success; word order or a small missing word does not turn that success into failure. Do not treat recognition confidence as a pronunciation score.
5. **Feedback:** Give an encouraging response that follows Section 7. A successful answer with a small omission can receive a gentle optional model. An answer missing key information receives one specific hint. Feedback should be tied to recognized text, not invented phonetic or mouth-position diagnoses.
6. **Try again / Next:** Learners choose to retry, continue, or skip. Preserve the current turn's attempt history until they leave it. After turn 5 is completed or skipped, display the Result Screen.

### Recognition and feedback decisions

- The success decision comes from the designated key words, not an unpredictable AI judgment.
- Distinguish **no speech / recognition error** from a spoken attempt missing key words. Silence, denied permission, and network failures do not increase the correction stage.
- For a spoken answer missing key information, increment the unsuccessful-attempt count for that turn. Attempt 1 uses recast, attempt 2 uses a first-letter hint, and attempt 3 or later uses chunking. There is no lockout.
- A retry is optional; the learner can always select Next or Skip.
- Only the current target sentence, recognized text, missing keyword, and feedback stage may be provided to Gemini for text feedback. Do not send raw audio or personal information to Gemini.
- If Gemini is unavailable, delayed, or returns feedback outside the rules, show the matching predefined feedback immediately. Do not block the lesson. Use a bounded request timeout and ignore stale responses after the learner changes turns.
- The completion reward uses speaking participation and retries. Keyword success does not determine the number of stars.

## 6. Practice Dialogue (연습 대화)

- **Partner character:** Coco, a patient and friendly ice cream shop assistant represented by an original illustration.
- **Situation:** The learner orders one chocolate ice cream in a cone with two scoops, then ends the order politely.
- **Content rule:** Use these five turns exactly as written. Do not generate extra turns or replace the sentences with more advanced expressions.

| No. | Partner | Student target sentence | Korean meaning of student sentence | Key words |
| --- | --- | --- | --- | --- |
| 1 | Hi! What would you like? | An ice cream, please. | 아이스크림 하나 주세요. | ice, cream |
| 2 | What flavor would you like? | Chocolate, please. | 초콜릿 맛으로 주세요. | chocolate |
| 3 | A cup or a cone? | A cone, please. | 콘으로 주세요. | cone |
| 4 | One scoop or two? | Two scoops, please. | 두 스쿱 주세요. | two, scoops |
| 5 | Anything else? | No, thank you. | 아니요, 괜찮아요. 감사합니다. | no, thank |

### Korean meanings of partner questions

1. “안녕하세요! 무엇을 드릴까요?”
2. “어떤 맛으로 드릴까요?”
3. “컵으로 드릴까요, 콘으로 드릴까요?”
4. “한 스쿱으로 드릴까요, 두 스쿱으로 드릴까요?”
5. “더 필요한 것이 있나요?”

### Keyword policy and examples

- “Ice cream” passes turn 1 because both key words are present, although the app may gently model the fuller polite sentence.
- “Chocolate” passes turn 2. Missing please is not a failure.
- “A cup, please” does not meet turn 3's cone practice target. Feedback should say that the current practice is for a cone, without suggesting that ordering a cup is inherently incorrect English.
- “Two scoop, please” does not yet contain the designated keyword scoops in turn 4. Offer one gentle plural-form model; do not also criticize missing articles or accent. If the recognizer produces the digit “2,” normalize it to “two” before checking.
- “No, thanks” is an intelligible alternative for turn 5. For the keyword check, treat “thanks” as the conversational equivalent of “thank.” Still display and model “No, thank you.” as the fixed target. Keep this equivalence explicit rather than allowing arbitrary AI decisions.
- A different valid order can be acknowledged gently: “Nice speaking! In this practice, let's order chocolate. (잘 말했어요! 이번에는 초콜릿 맛을 주문해 봐요.)” Do not label it wrong English.

### Star rules: reward completion, not accuracy

- **★:** Reached the Result Screen after moving through the whole dialogue, including any skipped turns. Label: “You completed the visit.”
- **★★:** Reached the Result Screen and made at least one non-empty speaking attempt on all five turns, regardless of keyword success. Label: “You spoke in every turn.”
- **★★★:** Met the two-star condition and voluntarily made an additional non-empty speaking attempt on at least one turn. Label: “You practiced again.” A retry after success also counts.

Award the highest applicable tier, without subtracting stars for errors or number of attempts. Explain the criteria on the Result Screen so learners do not mistake stars for pronunciation grades.

## 7. Feedback Rules (피드백 규칙)

### Character personality / speaking style

Coco sounds warm, calm, and respectful. Coco is a supportive conversation partner rather than a strict examiner. Use simple English, followed by Korean support in parentheses. Avoid babyish language and excessive praise. A child should be able to identify what to try next without reading a long explanation.

### My rules

1. **Praise first, then one useful step.** Keep feedback to no more than two short English sentences, each with a concise Korean equivalent. Correct only one item at a time, prioritizing missing meaning-bearing information.
2. **Use intelligibility as the goal.** If all designated key words are recognized, count the answer as successful. Missing an article or please may receive an optional model, but must not remove success or reduce the reward.
3. **Adapt support to the attempt.** First unsuccessful spoken attempt: recast the target. Second: prompt one missing keyword using its first letter. Third and later: divide the target into short spoken chunks. Reset the stage when moving to a new turn.
4. **Protect speaking confidence.** Do not say “wrong,” show numerical/percentage accuracy scores, compare learners, or describe tongue/lip/mouth positions. Do not tell a learner to eliminate their accent or sound like a native speaker.
5. **Make uncertainty recoverable.** If nothing is recognized, or recognition fails, give a neutral retry message. Never invent what the learner said or diagnose pronunciation from an empty or uncertain transcript. Use predefined feedback when Gemini cannot provide a suitable response.

### Feedback table (English + Korean)

The examples below use turn 2. Apply the same support pattern to the other turns using their exact target sentence and missing keyword.

| Situation | Feedback (English + Korean) |
| --- | --- |
| Success | “Nice speaking! (잘 말했어요!) I understood your chocolate order. (초콜릿 맛 주문을 알아들었어요.)” |
| Success + small word missing | “Nice speaking! (잘 말했어요!) You can also say, ‘Chocolate, please.’ (이렇게도 말할 수 있어요: ‘Chocolate, please.’)” |
| 1st failure: recast | “Nice try! (좋은 시도예요!) You can say, ‘Chocolate, please.’ (이렇게 말해 봐요: ‘Chocolate, please.’)” |
| 2nd failure: elicitation | “Keep going! (계속해 봐요!) The flavor starts with c: ‘C___, please.’ (맛 이름은 c로 시작해요: ‘C___, please.’)” |
| 3rd failure: chunking | “Let's take it in small parts! (짧게 나눠서 해 봐요!) Say ‘Chocolate’ / ‘please.’ (‘Chocolate’ / ‘please’로 나눠 말해 봐요.)” |
| No speech recognized | “Let's try again! (다시 해 봐요!) Tap the mic and speak when you see ‘Listening.’ (‘듣고 있어요’가 보이면 말해 주세요.)” |

### Turn-specific graduated support

| Turn | First unsuccessful attempt: model | Second: first-letter prompt for one missing keyword | Third and later: chunks |
| --- | --- | --- | --- |
| 1 | An ice cream, please. | Use i___ for missing ice or c___ for missing cream. Prompt only one missing word. | An ice cream / please. |
| 2 | Chocolate, please. | C___, please. | Chocolate / please. |
| 3 | A cone, please. | A c___, please. | A cone / please. |
| 4 | Two scoops, please. | Use t___ for missing two or s___ for missing scoops. Prompt only one missing word. | Two scoops / please. |
| 5 | No, thank you. | Use n___ for missing no or t___ for missing thank. Prompt only one missing word. | No / thank you. |

For every row, add an encouraging opening and Korean support following the feedback table. If several key words are absent, choose the first missing key word in the defined order and focus on it. Never issue a list of errors.

### Example learning sequence

For turn 3, a learner says “A cup, please.” Coco acknowledges the attempt and models “A cone, please.” On another unsuccessful spoken attempt, Coco gives “A c___, please.” On the third, Coco offers “A cone / please.” Once cone is recognized, the turn counts as successful. The learner can still practice again. This sequence gives increasing support while keeping the communicative goal understandable.

## 8. Do Not (하지 말 것)

### Privacy and Safety (required — keep these)

- Do not save or send audio recordings.
- Do not collect personal information (name, student ID, school, email). No login or sign-up.
- No ads, external links, or payment features.
- No photos of real people or famous characters.

### Learning Design

- Do not show numerical or percentage accuracy scores, speed rankings, leaderboards, or competitive comparisons.
- Do not treat a minor article/politeness omission as failure when all key words are recognized.
- Do not claim that speech-to-text alone measures individual phonemes, stress, accent quality, or professional pronunciation accuracy.
- Do not require native-like pronunciation, describe mouth positions, or present accent as a defect.
- Do not change the five target sentences, increase the CEFR level, add unsolicited dialogue turns, or replace the fixed scenario with open-ended chat.
- Do not punish retries or skips, impose a countdown, or automatically advance before the learner can read feedback.
- Do not evaluate silence or a microphone error as a learner's language mistake.
- Do not let AI-generated feedback contradict the deterministic keyword success decision.

### Other

- Do not add a recording player, audio download, or MediaRecorder feature.
- Do not activate the microphone automatically or allow recognition and model playback to run together.
- Do not keep transcripts in localStorage, analytics, a database, or application logs. Clear in-memory session data on reset or page close. Text sent to Gemini is subject to that provider's processing; do not claim zero third-party processing.
- Do not expose an API key in downloadable client code. Any optional Gemini connection must use a protected deployment configuration; predefined feedback keeps the exercise usable if no key is configured.
- Do not invent completed peer review, usability-test findings, or screenshots. Attach evidence only after the corresponding work is performed.

## 9. Completion Checklist (완성 체크리스트)

All items below are observable acceptance tests. They remain unchecked until tested in the implemented app.

### Screen flow and readability

- [ ] Start Practice opens turn 1; the app has exactly five turns.
- [ ] The three implemented screens match the Top / Middle / Bottom layout described in Section 4 and the actual Stitch screenshots.
- [ ] On a phone-width viewport, the target sentence is the largest text and primary buttons are usable without horizontal scrolling.
- [ ] English target sentences and Korean meanings match Section 6 exactly.
- [ ] Next and Skip move forward correctly; leaving turn 5 opens the Result Screen.
- [ ] Practice Again clears previous transcripts, feedback, stars, and per-turn attempt stages.

### Audio and recognition

- [ ] Listen and Slow play the correct target sentence; the slow version is audibly slower.
- [ ] The microphone cannot be activated while model audio is playing.
- [ ] Tapping Mic visibly changes the state from Ready to Listening; completion changes it to Done.
- [ ] The recognized words appear as text in the “I heard” panel.
- [ ] Silence displays an encouraging retry message and does not increase the unsuccessful-attempt stage.
- [ ] Denied permission produces a readable recovery instruction without an endless loading indicator.
- [ ] Unsupported recognition displays “Please open in Chrome.” In-app browsers receive appropriate guidance.
- [ ] Leaving a turn cancels its audio/recognition session; a delayed result does not change the next turn.
- [ ] The deployed app is accessed through HTTPS and microphone behavior is checked there.

### Keyword and feedback behavior

- [ ] “ICE CREAM!” succeeds in turn 1, just as “An ice cream, please.” does; capitalization and punctuation do not cause failure.
- [ ] “Chocolate” succeeds in turn 2 and may receive a gentle fuller-sentence model.
- [ ] “A cup, please” in turn 3 receives support toward cone without being described as wrong English.
- [ ] “Two scoop, please” in turn 4 receives one gentle model for scoops; “2 scoops, please” succeeds after number normalization.
- [ ] “No, thanks” succeeds in turn 5 through the explicitly defined thanks/thank equivalence.
- [ ] Three consecutive spoken attempts missing key information produce recast → first-letter elicitation → chunking, in that order.
- [ ] Each feedback message begins supportively, focuses on one item, and includes Korean support.
- [ ] An answer is not reclassified as unsuccessful by Gemini after the keyword check has marked it successful.
- [ ] Disconnecting Gemini or leaving it unconfigured still allows all five turns, feedback, and the Result Screen to work through predefined messages.

### Rewards, privacy, and evidence

- [ ] Completing the dialogue with skipped turns gives one participation star; speaking in every turn gives two; an extra speaking attempt gives three.
- [ ] Keyword accuracy does not change the completion-star tier.
- [ ] No accuracy number, percentage, leaderboard, login form, ad, payment, or external navigation appears.
- [ ] No audio-recording object or upload function is created by the app; no MediaRecorder is used.
- [ ] The Start Screen contains the required notice and the browser-processing clarification.
- [ ] Refreshing/resetting clears learner session information; no transcript is persisted by the app.
- [ ] Test as a learner who succeeds, a learner who misses key words, and a learner who says nothing. Record actual outcomes after testing.

### Planned test cases

| Test learner / condition | Action | Expected observable result |
| --- | --- | --- |
| Learner with a complete answer | Say “An ice cream, please.” | Transcript appears, supportive success feedback appears, and Next is usable. |
| Learner with a short but understandable answer | Say “Chocolate.” | Success is retained; a fuller polite expression may be modeled. |
| Learner needing support | Omit the turn's key information across three spoken attempts. | Feedback moves through recast, first-letter hint, and chunking; retry remains available. |
| Silent learner | Start listening but say nothing. | Neutral retry guidance appears; correction stage stays unchanged. |
| Browser permission denied | Reject the microphone request. | Clear permission guidance appears, with the lesson screen still usable. |
| AI service unavailable | Disable the optional feedback service. | Predefined feedback appears and the dialogue can be completed. |

## Technical Requirements (do not edit — 수정하지 말고 그대로 두세요)

- **Speech recognition:** Browser built-in Web Speech API (SpeechRecognition), language `en-US`
- **Read-aloud:** Browser built-in SpeechSynthesis, language `en-US`, normal rate 0.9 / slow rate 0.7
- **Feedback sentences:** Gemini, following Section 7. If Gemini does not respond, show the matching example sentence from the Section 7 table. The app must work to the end without AI.
- **Do not** run SpeechRecognition and MediaRecorder at the same time. Use speech recognition only.
- Disable the mic button while the model audio is playing.
- Show a guidance message when: the browser does not support speech recognition ("Please open in Chrome."), microphone permission is denied, or the app is opened in an in-app browser such as KakaoTalk or Instagram.
- Show a small notice on the Start Screen: "Your voice is processed to turn it into text and not recorded or saved."
- The deployed address must use **https** for the microphone to work.

## Before You Submit (제출 전 자기 점검)

- [x] Section 3 includes a CEFR level, and the sentences in Section 6 match it.
- [x] Section 4 uses Top / Middle / Bottom and describes my three attached Stitch screen designs; implementation refinements are identified separately.
- [x] Section 6 has 5 turns with key words.
- [x] Section 7 has recast → elicitation → chunking and no % scores.
- [x] Section 9 has sentences I can check by testing.
- [ ] My partner checked this PRD, and I revised it. (Pending; no completed peer review is claimed.)
- [x] I recorded the AI tools and main prompts in my AI Use Log (.md). (Included below in this Markdown file.)

## AI Use Log (AI 사용 기록)

### Actual use for this PRD

- **Tool:** ChatGPT.
- **Purpose:** Interpret the teacher's template, organize the agreed ice cream shop concept, draft the nine PRD sections, develop five A1-level exchanges and Korean support, specify staged feedback, and formulate observable acceptance tests.
- **Main prompt / request, paraphrased:** “Help me complete the speaking-app PRD step by step. Use the agreed ice cream shop topic, make it detailed and thoughtful, and provide a file I can submit for the PRD assignment.” The teacher's Speaking App PRD template and Week 7 theory slides were provided as references.
- **AI contribution:** Suggested the initial Sweet Talk! concept; drafted and organized the written specification, dialogue, feedback examples, theory-to-feature mapping, and test cases.
- **Student contribution documented in the conversation:** Supplied the course materials and assignment information, clarified that there are separate PRD and app submissions, agreed to the ice cream shop theme, and requested a detailed PRD for the first submission.
- **Verification status:** The written design has been checked against the supplied template. The student should review the wording before submission. No implemented-app testing or peer review is claimed.

### Actual Stitch use and design revision

- **Tool:** Stitch.
- **Purpose:** Generate three consistent mobile interface designs and capture the Start, Practice, and Result Screens.
- **Initial prompt, summarized:** Design exactly three screens for Sweet Talk! — Ice Cream Shop for Korean grades 5–6, CEFR A1, using a cream/cocoa/pink/mint palette, an original Coco character, large text, English learning content with Korean support, model-audio controls, a microphone area, supportive feedback, and participation rewards. Do not add scores, rankings, login, payment, or advertisements.
- **Revision prompt, summarized:** Keep the existing three screens, illustrations, colors, and layout; insert the exact required privacy notice and Korean browser-processing clarification; display all five review expressions without truncation; explain the three-star example as speaking in every turn and practicing again; use wrapping for readable text.
- **Observed revisions:** The submitted Start screenshot contains the required English notice and Korean clarification. The Result screenshot shows the five expressions in full and the participation-based three-star message. The Practice screenshot shows the first target sentence as the largest text, Listen/Slow controls, Ready–Listening–Done labels, transcript placeholder, feedback panel, and retry/next/skip controls.
- **Student activity:** Entered the design and revision prompts in Stitch and supplied the three separate screenshots for the PRD submission.
- **Evidence:** `01_Start.png`, `02_Practice.png`, `03_Result.png`. These are static design screenshots; microphone operation, playback, state changes, and feedback logic have not yet been verified.

### Production status

| Tool / activity | Intended purpose | Current status |
| --- | --- | --- |
| Stitch | Produce three mobile screen designs and capture screenshots. | Completed; three screenshots supplied and design/revision prompts recorded above. |
| AI Studio | Implement the reviewed PRD, retaining the teacher's Technical Requirements. | Pending; add actual prompts and changes after use. |
| Browser / deployment testing | Check microphone access, speech playback, feedback stages, and completion flow. | Pending; record actual results after implementation. |
| Peer review | Have a partner read the PRD and revise based on actual comments. | Pending; record actual comments only after review. |

**Submission attachment manifest:** Upload this Markdown PRD (including the AI use log) together with the three separate Stitch screenshots: `01_Start.png`, `02_Practice.png`, and `03_Result.png`. The screenshots are not embedded in this file. Peer review remains outstanding; app implementation and functional testing belong to the next production stage.
