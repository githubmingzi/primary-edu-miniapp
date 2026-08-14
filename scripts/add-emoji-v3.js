/**
 * 基于行处理的 emoji 添加 - 简单可靠
 */
const fs = require('fs');
const path = require('path');

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

function addEmoji(filePath, emojiMap, fieldName) {
  const content = fs.readFileSync(filePath, 'utf-8');
  const lines = content.split('\n');
  const result = [];
  let updated = 0;

  for (const line of lines) {
    let modified = false;
    
    // 对每个 emoji 映射条目，检查当前行是否包含该字段
    for (const [key, emoji] of Object.entries(emojiMap)) {
      const fieldPattern = `${fieldName}: '${key}'`;
      if (line.includes(fieldPattern) && line.includes('imageUrl:')) {
        // 该行包含目标字段和 imageUrl
        // 替换行尾的 ' }, 为 ',\n    emoji: '${emoji}'\n  },
        const newLine = line.replace(/' \},$/, `',\n    emoji: '${emoji}'\n  },`);
        if (newLine !== line) {
          result.push(newLine);
          modified = true;
          updated++;
          break;
        }
      }
    }
    
    if (!modified) {
      result.push(line);
    }
  }

  fs.writeFileSync(filePath, result.join('\n'), 'utf-8');
  console.log(`✅ ${path.basename(filePath)}: ${updated} emoji fields added`);
}

console.log('=== Adding emoji fields (line-based) ===\n');
addEmoji(path.join(__dirname, '..', 'src', 'data', 'characters.ts'), chineseEmoji, 'character');
addEmoji(path.join(__dirname, '..', 'src', 'data', 'englishWords.ts'), englishEmoji, 'word');
console.log('\n=== Done! ===');