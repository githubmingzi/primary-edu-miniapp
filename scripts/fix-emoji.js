/**
 * 修复 emoji 字段位置 - 将 emoji 放在对象内部
 */
const fs = require('fs');
const path = require('path');

const filePath = path.join(__dirname, '..', 'src', 'data', 'characters.ts');
let content = fs.readFileSync(filePath, 'utf-8');

// 修复：将对象外的 emoji 行移到对象内部
// 当前:  { ... imageUrl: '...' },
//        emoji: '...',
// 目标:  { ... imageUrl: '...',
//          emoji: '...' },
content = content.replace(
  /(imageUrl: 'data:image[^']*' \},\n\s{2}emoji: '([^']+)',)/g,
  `$1,\n  emoji: '$2'\n  },`
);

fs.writeFileSync(filePath, content, 'utf-8');
console.log('✅ characters.ts fixed');

// 同样修复 englishWords.ts
const enPath = path.join(__dirname, '..', 'src', 'data', 'englishWords.ts');
let enContent = fs.readFileSync(enPath, 'utf-8');

enContent = enContent.replace(
  /(imageUrl: 'data:image[^']*' \),\n  emoji: '([^']+)',)/g,
  `$1',\n  emoji: '$2'\n  },`
);

fs.writeFileSync(enPath, enContent, 'utf-8');
console.log('✅ englishWords.ts fixed');