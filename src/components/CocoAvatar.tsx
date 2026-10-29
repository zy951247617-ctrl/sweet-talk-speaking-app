import React from 'react';

interface CocoAvatarProps {
  size?: 'sm' | 'md' | 'lg' | 'hero';
  className?: string;
}

export default function CocoAvatar({ size = 'md', className = '' }: CocoAvatarProps) {
  if (size === 'hero') {
    // Large storybook ice cream shop scene with Coco the bear at the counter
    return (
      <div className={`w-full aspect-[4/3] rounded-3xl overflow-hidden bg-gradient-to-b from-[#FFF5EB] via-[#FFE8D6] to-[#F5DBC4] relative flex items-center justify-center border-4 border-white shadow-md ${className}`}>
        <svg
          viewBox="0 0 400 300"
          className="w-full h-full"
          fill="none"
          xmlns="http://www.w3.org/2000/svg"
        >
          {/* Shop Background Wall & Shelves */}
          <rect width="400" height="300" fill="#FFF2E5" />
          
          {/* Warm background bunting / garland */}
          <path d="M20 25 Q 70 50, 120 25 Q 170 50, 220 25 Q 270 50, 320 25 Q 370 50, 420 25" stroke="#E6C2A5" strokeWidth="2" strokeDasharray="4 4" fill="none" />
          <polygon points="50,38 70,38 60,60" fill="#FF8DA1" />
          <polygon points="100,35 120,35 110,57" fill="#7FE5D9" />
          <polygon points="150,38 170,38 160,60" fill="#FFD166" />
          <polygon points="200,35 220,35 210,57" fill="#FF8DA1" />
          <polygon points="250,38 270,38 260,60" fill="#7FE5D9" />
          <polygon points="300,35 320,35 310,57" fill="#FFD166" />
          <polygon points="350,38 370,38 360,60" fill="#FF8DA1" />

          {/* Wooden Shelves with Topping Jars */}
          <rect x="20" y="70" width="110" height="8" rx="3" fill="#D7A87E" />
          {/* Topping jars */}
          <rect x="30" y="48" width="18" height="22" rx="3" fill="#FFF" stroke="#D7A87E" strokeWidth="1.5" />
          <rect x="33" y="55" width="12" height="13" fill="#FF6B8B" rx="1" />
          <rect x="58" y="45" width="20" height="25" rx="3" fill="#FFF" stroke="#D7A87E" strokeWidth="1.5" />
          <rect x="61" y="53" width="14" height="15" fill="#58311E" rx="1" />
          <rect x="88" y="50" width="18" height="20" rx="3" fill="#FFF" stroke="#D7A87E" strokeWidth="1.5" />
          <rect x="91" y="56" width="12" height="12" fill="#FFB703" rx="1" />

          {/* Right shelf with Sundae glass */}
          <rect x="270" y="70" width="110" height="8" rx="3" fill="#D7A87E" />
          <rect x="280" y="48" width="18" height="22" rx="3" fill="#FFF" stroke="#D7A87E" strokeWidth="1.5" />
          <rect x="283" y="54" width="12" height="14" fill="#48CAE4" rx="1" />
          <rect x="310" y="44" width="22" height="26" rx="4" fill="#FFF" stroke="#D7A87E" strokeWidth="1.5" />
          <circle cx="321" cy="54" r="5" fill="#FF8DA1" />
          <circle cx="321" cy="62" r="4" fill="#7FE5D9" />

          {/* Chalkboard Menu */}
          <rect x="145" y="40" width="110" height="55" rx="6" fill="#3D3A37" stroke="#C29B75" strokeWidth="3" />
          <path d="M160 52 Q 170 48, 185 52" stroke="#FFF" strokeWidth="1.5" strokeLinecap="round" opacity="0.6" />
          <line x1="160" y1="62" x2="235" y2="62" stroke="#FFF" strokeWidth="1.5" strokeDasharray="3 3" opacity="0.4" />
          <line x1="160" y1="72" x2="220" y2="72" stroke="#FFF" strokeWidth="1.5" strokeDasharray="3 3" opacity="0.4" />
          <line x1="160" y1="82" x2="210" y2="82" stroke="#FFF" strokeWidth="1.5" strokeDasharray="3 3" opacity="0.4" />

          {/* Coco Bear - Body & Arms */}
          <ellipse cx="200" cy="220" rx="75" ry="70" fill="#9C6644" />
          {/* Pastel striped shop apron */}
          <path d="M145 200 L160 170 L240 170 L255 200 L250 280 L150 280 Z" fill="#FFFFFF" />
          {/* Pink & Mint vertical stripes */}
          <path d="M165 170 L165 280 M180 170 L180 280 M210 170 L210 280 M225 170 L225 280" stroke="#FF8DA1" strokeWidth="6" />
          <path d="M195 170 L195 280" stroke="#7FE5D9" strokeWidth="6" />
          {/* Apron straps */}
          <line x1="162" y1="170" x2="150" y2="150" stroke="#FF8DA1" strokeWidth="4" strokeLinecap="round" />
          <line x1="238" y1="170" x2="250" y2="150" stroke="#FF8DA1" strokeWidth="4" strokeLinecap="round" />

          {/* Coco Bear - Head */}
          <circle cx="200" cy="140" r="54" fill="#9C6644" />
          
          {/* Bear Ears */}
          <circle cx="156" cy="98" r="18" fill="#9C6644" />
          <circle cx="156" cy="98" r="10" fill="#E8A598" />
          <circle cx="244" cy="98" r="18" fill="#9C6644" />
          <circle cx="244" cy="98" r="10" fill="#E8A598" />

          {/* Coco's Visor / Cap */}
          <path d="M148 120 C 155 100, 245 100, 252 120 Z" fill="#64DFDF" />
          <path d="M142 120 C 145 128, 255 128, 258 120 C 255 116, 145 116, 142 120 Z" fill="#FF8DA1" />
          <circle cx="200" cy="112" r="5" fill="#FFF" />
          {/* Tiny ice cream on cap */}
          <polygon points="198,114 202,114 200,119" fill="#D7A87E" />
          <circle cx="200" cy="112" r="3" fill="#FF8DA1" />

          {/* Snout & Muzzle */}
          <ellipse cx="200" cy="150" rx="22" ry="17" fill="#DDB892" />
          {/* Heart/button Nose */}
          <path d="M195 142 C 195 139, 205 139, 205 142 C 205 146, 200 149, 200 149 C 200 149, 195 146, 195 142 Z" fill="#4A2810" />
          {/* Smiling Mouth */}
          <path d="M194 153 Q 200 159, 206 153" stroke="#4A2810" strokeWidth="2.5" strokeLinecap="round" fill="none" />

          {/* Warm Rosy Cheeks */}
          <ellipse cx="168" cy="148" rx="8" ry="5" fill="#FF8DA1" opacity="0.6" />
          <ellipse cx="232" cy="148" rx="8" ry="5" fill="#FF8DA1" opacity="0.6" />

          {/* Twinkling Button Eyes */}
          <circle cx="178" cy="132" r="5.5" fill="#3E2723" />
          <circle cx="176" cy="130" r="2" fill="#FFFFFF" />
          <circle cx="222" cy="132" r="5.5" fill="#3E2723" />
          <circle cx="220" cy="130" r="2" fill="#FFFFFF" />

          {/* Left Waving Paw */}
          <circle cx="120" cy="190" r="16" fill="#9C6644" />
          <ellipse cx="120" cy="190" rx="9" ry="7" fill="#DDB892" />
          <circle cx="114" cy="182" r="3" fill="#DDB892" />
          <circle cx="120" cy="180" r="3" fill="#DDB892" />
          <circle cx="126" cy="182" r="3" fill="#DDB892" />

          {/* Right Paw holding ice cream scoop */}
          <circle cx="280" cy="200" r="16" fill="#9C6644" />
          <path d="M280 205 L295 240 L285 243 L270 208 Z" fill="#D0D0D0" />
          <circle cx="295" cy="242" r="7" fill="#E65100" />

          {/* Front Glass Counter with Ice Cream Tubs */}
          <rect x="0" y="240" width="400" height="60" fill="#E6CCB2" />
          <rect x="0" y="235" width="400" height="8" fill="#B08968" />
          
          {/* Glass sneeze guard reflection */}
          <path d="M10 245 L 390 245 L 380 285 L 20 285 Z" fill="#E0F7FA" fillOpacity="0.4" stroke="#80DEEA" strokeWidth="1" />
          
          {/* Ice Cream Tubs in counter */}
          {/* Chocolate */}
          <ellipse cx="90" cy="265" rx="30" ry="12" fill="#58311E" />
          <ellipse cx="90" cy="262" rx="20" ry="8" fill="#72442B" />
          {/* Strawberry */}
          <ellipse cx="165" cy="265" rx="30" ry="12" fill="#FF8DA1" />
          <ellipse cx="165" cy="262" rx="20" ry="8" fill="#FFA5B5" />
          {/* Mint */}
          <ellipse cx="240" cy="265" rx="30" ry="12" fill="#7FE5D9" />
          <ellipse cx="240" cy="262" rx="20" ry="8" fill="#9CF0E6" />
          {/* Vanilla */}
          <ellipse cx="315" cy="265" rx="30" ry="12" fill="#FFF2B2" />
          <ellipse cx="315" cy="262" rx="20" ry="8" fill="#FFF9DB" />

          {/* Stack of Waffle Cones on Counter */}
          <polygon points="30,225 45,225 37,245" fill="#DDA15E" stroke="#BC6C25" strokeWidth="1" />
          <polygon points="32,217 47,217 39,235" fill="#DDA15E" stroke="#BC6C25" strokeWidth="1" />
          <polygon points="34,209 49,209 41,227" fill="#DDA15E" stroke="#BC6C25" strokeWidth="1" />
        </svg>
      </div>
    );
  }

  // Portrait Avatar (sm: 32px, md: 48px, lg: 96px)
  const pixelSize = size === 'sm' ? 32 : size === 'lg' ? 96 : 48;

  return (
    <div
      className={`relative inline-flex items-center justify-center rounded-full bg-gradient-to-b from-[#FFF5EB] to-[#FFE0C4] border-2 border-white shadow-sm overflow-hidden select-none shrink-0 ${className}`}
      style={{ width: pixelSize, height: pixelSize }}
    >
      <svg
        viewBox="0 0 100 100"
        className="w-full h-full"
        fill="none"
        xmlns="http://www.w3.org/2000/svg"
      >
        {/* Soft circle background */}
        <circle cx="50" cy="50" r="50" fill="#FFF0E0" />

        {/* Coco's Bear Ears */}
        <circle cx="26" cy="30" r="13" fill="#9C6644" />
        <circle cx="26" cy="30" r="7" fill="#E8A598" />
        <circle cx="74" cy="30" r="13" fill="#9C6644" />
        <circle cx="74" cy="30" r="7" fill="#E8A598" />

        {/* Bear Head */}
        <circle cx="50" cy="56" r="36" fill="#9C6644" />

        {/* Visor / Ice Cream Cap */}
        <path d="M22 46 C 26 30, 74 30, 78 46 Z" fill="#64DFDF" />
        <path d="M18 46 C 22 52, 78 52, 82 46 C 78 43, 22 43, 18 46 Z" fill="#FF8DA1" />
        <circle cx="50" cy="38" r="3.5" fill="#FFF" />
        <circle cx="50" cy="38" r="2" fill="#FF8DA1" />

        {/* Snout */}
        <ellipse cx="50" cy="64" r="15" ry="12" fill="#DDB892" />
        {/* Heart-shaped Nose */}
        <path d="M47 58 C 47 56, 53 56, 53 58 C 53 61, 50 63, 50 63 C 50 63, 47 61, 47 58 Z" fill="#4A2810" />
        {/* Friendly Smile */}
        <path d="M46 66 Q 50 70, 54 66" stroke="#4A2810" strokeWidth="2" strokeLinecap="round" fill="none" />

        {/* Rosy Cheeks */}
        <ellipse cx="32" cy="62" rx="5" ry="3.5" fill="#FF8DA1" opacity="0.6" />
        <ellipse cx="68" cy="62" rx="5" ry="3.5" fill="#FF8DA1" opacity="0.6" />

        {/* Bright Eyes with Reflection */}
        <circle cx="37" cy="52" r="4.5" fill="#3E2723" />
        <circle cx="35.5" cy="50.5" r="1.5" fill="#FFFFFF" />
        <circle cx="63" cy="52" r="4.5" fill="#3E2723" />
        <circle cx="61.5" cy="50.5" r="1.5" fill="#FFFFFF" />

        {/* Apron Collar visible at bottom */}
        <path d="M30 88 L50 82 L70 88 L65 100 L35 100 Z" fill="#FFFFFF" />
        <line x1="42" y1="84" x2="42" y2="100" stroke="#FF8DA1" strokeWidth="3" />
        <line x1="58" y1="84" x2="58" y2="100" stroke="#7FE5D9" strokeWidth="3" />
      </svg>
    </div>
  );
}
