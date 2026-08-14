/**
 * 完全重写 emoji 字段 - 先清理错误格式，再正确添加
 */
const fs = require('fs');
const path = require('path');

// 汉字 emoji 映射
const chineseEmoji = {
  '一': '1️⃣', '二': '2️⃣', '三': '3️⃣', '四': '4️⃣', '五': '5️⃣',
  '六': '6️⃣', '七': '7️⃣', '八': '8️⃣', '九': '9️⃣', '十': '🔟',
  '日': '☀️', '月': '🌙', '水': '💧', '火': '🔥', '山': '⛰️',
  '石': '🪨', '木': '🪵', '叶': '🍃', '云': '☁️', '风': '🌬️',
  '雨': '🌧️', '雪': '❄️', '天': '🌤️', '地': '🌍', '星': '⭐',
  '虫': '🐛', '鱼': '🐟', '马': '🐴', '牛': '🐮', '鸟': '🐦',
  '羊': '🐑', '狗': '🐕', '猫': '🐱', '兔': '🐇', '鸡': '🐔',
  '鸭': '🦆', '鹅': '🦢', '虎': '🐯', '龙': '🐲', '象': '🐘',
  '猴': '🐵', '猪': '🐷', '蛇': '🐍', '鼠': '🐭', '熊': '🐻',
  '花': '🌸', '草': '🌿', '禾': '🌾', '米': '🍚', '果': '🍎',
  '瓜': '🍉', '竹': '🎋', '豆': '🫘', '菜': '🥬', '苗': '🌱',
  '林': '🌲', '森': '🌳', '田': '🌾', '土': '🪹', '莲': '🪷',
  '人': '🧑', '口': '👄', '手': '✋', '目': '👁️', '耳': '👂',
  '足': '🦶', '牙': '🦷', '头': '🧑', '心': '❤️', '力': '💪',
  '大': '📏', '小': '📐', '父': '👨', '母': '👩', '子': '👶',
  '女': '👧', '男': '👦', '爷': '👴', '奶': '👵', '哥': '🧑',
  '上': '⬆️', '下': '⬇️', '开': '🔓', '关': '🔒', '来': '🚶',
  '去': '🏃', '走': '🚶', '跑': '🏃', '跳': '🤸', '坐': '🧘',
  '站': '🧍', '看': '👀', '听': '👂', '说': '💬', '吃': '🍽️',
  '喝': '🥤', '写': '✏️', '画': '🎨', '读': '📖', '唱': '🎤',
  '飞': '✈️', '游': '🏊', '洗': '🧼', '笑': '😊', '哭': '😢',
  '学': '📚', '校': '🏫', '书': '📖', '笔': '✏️', '纸': '📄',
  '刀': '🔪', '门': '🚪', '窗': '🪟', '房': '🏠', '家': '🏡',
  '衣': '👕', '床': '🛏️', '灯': '💡', '桌': '🪑', '椅': '🪑',
  '饭': '🍚', '肉': '🥩', '蛋': '🥚', '面': '🍜', '茶': '🍵',
  '红': '🔴', '黄': '🟡', '蓝': '🔵', '绿': '🟢', '白': '⬜',
  '黑': '⬛', '东': '➡️', '西': '⬅️', '南': '⬇️', '北': '⬆️',
  '前': '🔝', '后': '🔙', '左': '⬅️', '右': '➡️', '中': '🎯',
  '车': '🚗', '船': '🚢', '气': '💨', '机': '⚙️', '光': '✨',
  '金': '🥇', '玉': '💚', '宝': '💎', '沙': '🏖️', '海': '🌊',
};

function cleanAndFix(filePath, emojiMap, fieldName) {
  let content = fs.readFileSync(filePath, 'utf-8');
  
  // 1. 移除所有 emoji 行（包括错误格式的）
  content = content.replace(/^(\s*)emoji: '[^']*',?,?\s*$/gm, '');
  // 移除空行
  content = content.replace(/\n{2,}/g, '\n');
  
  // 2. 重新添加 emoji 字段
  for (const [key, emoji] of Object.entries(emojiMap)) {
    // 匹配: { ... imageUrl: '...' },
    // 替换为: { ... imageUrl: '...',\n    emoji: '...'\n  },
    const regex = new RegExp(`(${fieldName}: '${key}'.*?imageUrl: 'data:image[^']*)' \\},`);
    const replacement = `$1',\n    emoji: '${emoji}'\n  },`;
    content = content.replace(regex, replacement);
  }
  
  fs.writeFileSync(filePath, content, 'utf-8');
  console.log(`✅ ${path.basename(filePath)} fixed`);
}

console.log('=== Cleaning and fixing emoji fields ===\n');

cleanAndFix(
  path.join(__dirname, '..', 'src', 'data', 'characters.ts'),
  chineseEmoji,
  'character'
);

// English emoji
const englishEmoji = {
  'red': '🔴', 'blue': '🔵', 'green': '🟢', 'yellow': '🟡', 'white': '⬜', 'black': '⬛',
  'one': '1️⃣', 'two': '2️⃣', 'three': '3️⃣', 'four': '4️⃣', 'five': '5️⃣',
  'dog': '🐕', 'cat': '🐱', 'bird': '🐦', 'fish': '🐟', 'duck': '🦆', 'rabbit': '🐇', 'pig': '🐷',
  'apple': '🍎', 'banana': '🍌', 'orange': '🍊', 'grape': '🍇', 'bread': '🍞', 'egg': '🥚',
  'cake': '🎂', 'rice': '🍚', 'milk': '🥛', 'water': '💧', 'tea': '🍵', 'meat': '🥩',
  'sun': '☀️', 'moon': '🌙', 'star': '⭐',
  'head': '🧑', 'hand': '✋', 'eye': '👁️', 'nose': '👃', 'mouth': '👄', 'ear': '👂',
  'cup': '🥤', 'bag': '👜', 'hat': '🧢', 'book': '📖',
};

cleanAndFix(
  path.join(__dirname, '..', 'src', 'data', 'englishWords.ts'),
  englishEmoji,
  'word'
);

console.log('\n=== Done! ===');