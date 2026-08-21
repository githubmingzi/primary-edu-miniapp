import { Question } from '@/types';

function shuffleArray<T>(arr: T[]): T[] {
  const shuffled = [...arr];
  for (let i = shuffled.length - 1; i > 0; i--) {
    const j = Math.floor(Math.random() * (i + 1));
    [shuffled[i], shuffled[j]] = [shuffled[j], shuffled[i]];
  }
  return shuffled;
}

interface ScienceQDef {
  text: string;
  answer: string;
  wrongs: string[];
  difficulty: 1 | 2 | 3;
  category: string;
  explanation?: string;
}

const scienceQDefs: ScienceQDef[] = [
  // ===== 简单（难度1）=====
  { text: '太阳每天从哪个方向升起？', answer: '东方', wrongs: ['西方', '南方', '北方'], difficulty: 1, category: '地球家园', explanation: '太阳每天从东方升起，从西方落下。' },
  { text: '磁铁能吸引下面哪种东西？', answer: '回形针', wrongs: ['橡皮', '铅笔', '纸杯'], difficulty: 1, category: '磁铁', explanation: '磁铁能吸引铁做的物品，回形针是铁做的。' },
  { text: '一年有几个季节？', answer: '四个', wrongs: ['两个', '三个', '五个'], difficulty: 1, category: '天气', explanation: '一年有春、夏、秋、冬四个季节。' },
  { text: '下雪一般出现在哪个季节？', answer: '冬天', wrongs: ['春天', '夏天', '秋天'], difficulty: 1, category: '天气', explanation: '冬天天气寒冷，才会有下雪的现象。' },
  { text: '种子发芽需要下面哪种条件？', answer: '水', wrongs: ['音乐', '黑暗', '玩具'], difficulty: 1, category: '植物', explanation: '种子发芽需要水、空气和适宜的温度。' },
  { text: '木头放在水里会怎样？', answer: '浮在水面', wrongs: ['沉入水底', '立刻消失', '变成水'], difficulty: 1, category: '材料', explanation: '木头比较轻，能浮在水面上。' },
  { text: '金鱼生活在哪里？', answer: '水里', wrongs: ['树上', '土里', '天上'], difficulty: 1, category: '动物', explanation: '金鱼是鱼类，生活在水里。' },
  { text: '晴天的时候天空是什么样？', answer: '晴朗有太阳', wrongs: ['乌云密布', '雪花飘飘', '一片漆黑'], difficulty: 1, category: '天气', explanation: '晴天太阳高照，天空晴朗。' },
  { text: '晚上我们在天空中常常看到什么？', answer: '月亮', wrongs: ['太阳', '彩虹', '闪电'], difficulty: 1, category: '地球家园', explanation: '晚上月亮和星星会出现在夜空中。' },
  { text: '向日葵会跟着什么转动？', answer: '太阳', wrongs: ['月亮', '风', '星星'], difficulty: 1, category: '植物', explanation: '向日葵的花盘会跟着太阳转动。' },

  // ===== 中等（难度2）=====
  { text: '磁铁的南极用哪个字母表示？', answer: 'S', wrongs: ['N', 'E', 'W'], difficulty: 2, category: '磁铁', explanation: '磁铁的南极叫 S 极，北极叫 N 极。' },
  { text: '植物用哪个部位吸收水分？', answer: '根', wrongs: ['叶子', '花朵', '果实'], difficulty: 2, category: '植物', explanation: '植物的根从土壤里吸收水分和养分。' },
  { text: '金鱼用什么部位呼吸？', answer: '鳃', wrongs: ['鼻子', '嘴', '皮肤'], difficulty: 2, category: '动物', explanation: '鱼用鳃呼吸水里的空气。' },
  { text: '白天和黑夜是因为地球在做什么？', answer: '自己转动', wrongs: ['停止不动', '围绕太阳转', '上下跳动'], difficulty: 2, category: '地球家园', explanation: '地球自己转动（自转）产生了白天和黑夜。' },
  { text: '指南针的北极指向哪个方向？', answer: '北方', wrongs: ['南方', '东方', '西方'], difficulty: 2, category: '磁铁', explanation: '指南针的指针是一块小磁铁，北极指向北方。' },
  { text: '蜜蜂的家叫什么？', answer: '蜂巢', wrongs: ['鸟窝', '洞穴', '蚁穴'], difficulty: 2, category: '动物', explanation: '蜜蜂住在蜂巢里。' },
  { text: '月亮形状每天变化的现象叫什么？', answer: '月相变化', wrongs: ['日食', '月食', '彩虹'], difficulty: 2, category: '地球家园', explanation: '月亮的形状每天慢慢变化，叫月相变化。' },
  { text: '下面哪种材料遇水会变软？', answer: '纸', wrongs: ['金属', '塑料', '玻璃'], difficulty: 2, category: '材料', explanation: '纸遇到水会变软，所以要爱护书本。' },
  { text: '蚂蚁的家在哪里？', answer: '地下的洞穴', wrongs: ['树上的鸟窝', '水里的荷叶', '天上的云朵'], difficulty: 2, category: '动物', explanation: '蚂蚁住在地下的洞穴里，分工合作。' },
  { text: '塑料垃圾很难在自然中分解，我们应该怎么做？', answer: '少用并回收', wrongs: ['随手扔掉', '多买多扔', '烧掉就好'], difficulty: 2, category: '材料', explanation: '塑料难分解，我们要少用、不乱扔、多回收。' },

  // ===== 较难（难度3）=====
  { text: '两块磁铁相同的极靠近时会发生什么？', answer: '互相推开', wrongs: ['互相吸住', '没有反应', '粘在一起'], difficulty: 3, category: '磁铁', explanation: '磁铁同极相斥，异极相吸。' },
  { text: '地球表面大部分是什么？', answer: '水', wrongs: ['沙漠', '森林', '冰雪'], difficulty: 3, category: '地球家园', explanation: '地球表面约七成是海洋，所以我们叫它“蓝色星球”。' },
  { text: '植物的叶子主要是做什么用的？', answer: '制造营养', wrongs: ['吸收水分', '固定身体', '传播种子'], difficulty: 3, category: '植物', explanation: '叶子通过光合作用制造营养，是植物的“加工厂”。' },
  { text: '树桩上的年轮能告诉我们什么？', answer: '树的年龄', wrongs: ['树的颜色', '树的品种', '树的高度'], difficulty: 3, category: '植物', explanation: '大树每年长一圈年轮，数一数年轮就知道树的年龄。' },
  { text: '指南针里的指针是用什么做的？', answer: '磁铁', wrongs: ['木头', '塑料', '纸'], difficulty: 3, category: '磁铁', explanation: '只有磁铁才会指向南北方向，所以指针是小磁铁。' },
  { text: '磁铁隔着纸能吸住回形针吗？', answer: '能', wrongs: ['不能', '有时能不能', '会把纸吸破'], difficulty: 3, category: '磁铁', explanation: '磁力能穿过纸等物体，隔着纸也能吸住铁。' },
  { text: '雨滴是从哪里落下来的？', answer: '云里', wrongs: ['树叶上', '泥土里', '月亮上'], difficulty: 3, category: '天气', explanation: '云里的水汽聚集多了，就会变成雨滴落下来。' },
  { text: '为什么塑料水杯比玻璃水杯更受小朋友欢迎？', answer: '轻且不易碎', wrongs: ['更漂亮', '更坚硬', '更环保'], difficulty: 3, category: '材料', explanation: '塑料又轻又不易碎，适合小朋友使用，但要注意环保。' },
  { text: '秋天树叶变黄，主要是因为什么？', answer: '天气变凉', wrongs: ['树叶老了', '被雨淋了', '太阳太晒'], difficulty: 3, category: '植物', explanation: '秋天天气变凉，叶子里的叶绿素减少，叶子就变黄了。' },
  { text: '蜗牛遇到危险时会怎样保护自己？', answer: '缩进壳里', wrongs: ['飞快逃跑', '跳进水里', '装死不动'], difficulty: 3, category: '动物', explanation: '蜗牛会把身体缩进螺旋形的壳里保护自己。' },
];

function generateScienceQuestions(): Question[] {
  const questions: Question[] = [];
  scienceQDefs.forEach((def, index) => {
    const options = shuffleArray([def.answer, ...def.wrongs]);
    questions.push({
      id: `sq_${String(index + 1).padStart(2, '0')}`,
      subject: 'science',
      type: 'choice',
      difficulty: def.difficulty,
      category: def.category,
      question: { text: def.text },
      options,
      correctAnswer: options.indexOf(def.answer),
      explanation: def.explanation,
    });
  });
  return questions;
}

export const scienceQuestions = generateScienceQuestions();
