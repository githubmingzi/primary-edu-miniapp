import { Question } from '@/types';

function shuffleArray<T>(arr: T[]): T[] {
  const shuffled = [...arr];
  for (let i = shuffled.length - 1; i > 0; i--) {
    const j = Math.floor(Math.random() * (i + 1));
    [shuffled[i], shuffled[j]] = [shuffled[j], shuffled[i]];
  }
  return shuffled;
}

interface MathQDef {
  text: string;
  answer: string;
  wrongs: string[];
  difficulty: 1 | 2 | 3;
  category: string;
  explanation?: string;
}

const mulPairs: [number, number][] = [
  [2, 3], [2, 4], [2, 5], [2, 7], [2, 8], [2, 9],
  [3, 3], [3, 5], [3, 6], [3, 7], [3, 8], [3, 9],
  [4, 4], [4, 5], [4, 6], [4, 7], [4, 9],
  [5, 5], [5, 6], [5, 7], [5, 8], [5, 9],
  [6, 6], [6, 7], [6, 8], [6, 9],
  [7, 7], [7, 8], [7, 9],
  [8, 8], [8, 9], [9, 9],
];

const divPairs: [number, number][] = [
  [6, 2], [8, 2], [12, 2], [14, 2], [16, 2], [18, 2],
  [9, 3], [15, 3], [18, 3], [21, 3], [24, 3], [27, 3],
  [12, 4], [16, 4], [20, 4], [24, 4], [28, 4], [36, 4],
  [15, 5], [25, 5], [35, 5], [40, 5], [45, 5],
  [24, 6], [30, 6], [36, 6], [42, 6], [48, 6], [54, 6],
  [28, 7], [35, 7], [49, 7], [56, 7], [63, 7],
  [32, 8], [40, 8], [48, 8], [56, 8], [64, 8], [72, 8],
  [36, 9], [45, 9], [54, 9], [63, 9], [72, 9], [81, 9],
];

const twoDigitPairs: [number, number, boolean][] = [
  [26, 35, true], [47, 28, true], [35, 26, true], [58, 27, true], [34, 48, true],
  [66, 25, true], [43, 39, true], [52, 29, true], [37, 45, true], [68, 27, true],
  [25, 47, true], [56, 38, true], [74, 18, true], [46, 36, true], [65, 29, true],
  [85, 47, true], [93, 28, true], [76, 46, true], [58, 39, true], [64, 58, true],
  [62, 28, false], [75, 39, false], [81, 46, false], [93, 57, false], [70, 24, false],
  [84, 59, false], [65, 37, false], [72, 45, false], [56, 28, false], [91, 63, false],
  [100, 45, false], [90, 62, false], [85, 48, false], [78, 39, false], [66, 29, false],
];

const timeDefs: { text: string; answer: string; wrongs: string[] }[] = [
  { text: '分针指向12，时针指向8，现在是（ ）', answer: '8时整', wrongs: ['12时8分', '8时半', '12时整'] },
  { text: '分针指向6，时针在6和7之间，现在是（ ）', answer: '6时30分', wrongs: ['7时30分', '6时6分', '7时6分'] },
  { text: '分针指向3，时针在4和5之间，现在是（ ）', answer: '4时15分', wrongs: ['3时15分', '4时3分', '5时15分'] },
  { text: '现在是8时整，再过1小时是（ ）', answer: '9时整', wrongs: ['7时整', '8时半', '10时整'] },
  { text: '现在是10时30分，再过30分钟是（ ）', answer: '11时整', wrongs: ['10时整', '11时30分', '10时60分'] },
  { text: '下午放学时间是4时30分，用24时记时法表示是（ ）', answer: '16时30分', wrongs: ['4时30分', '14时30分', '17时30分'] },
  { text: '分针走一大格是（ ）', answer: '5分钟', wrongs: ['1分钟', '10分钟', '1小时'] },
  { text: '分针指向9，时针在5和6之间，现在是（ ）', answer: '5时45分', wrongs: ['9时5分', '5时9分', '6时45分'] },
  { text: '上午第一节课8时开始，一节课40分钟，下课时间是（ ）', answer: '8时40分', wrongs: ['8时半', '9时整', '9时40分'] },
  { text: '时针走一大格是（ ）', answer: '1小时', wrongs: ['5分钟', '10分钟', '1分钟'] },
  { text: '现在是2时30分，再过15分钟是（ ）', answer: '2时45分', wrongs: ['3时整', '2时15分', '3时45分'] },
  { text: '晚上9时睡觉，小明睡了9个小时，第二天早上（ ）起床', answer: '6时', wrongs: ['7时', '8时', '5时'] },
];

const measureDefs: { text: string; answer: string; wrongs: string[]; explanation: string }[] = [
  { text: '1米 = （ ）厘米', answer: '100', wrongs: ['10', '1000', '50'], explanation: '1米 = 100厘米' },
  { text: '小明身高约（ ）', answer: '1米30厘米', wrongs: ['30厘米', '3米', '130米'], explanation: '二年级小朋友的身高一般在1米2到1米4左右' },
  { text: '一根铅笔长约（ ）', answer: '18厘米', wrongs: ['18米', '18厘米×100', '1米80厘米'], explanation: '铅笔大约18厘米长' },
  { text: '黑板长约（ ）', answer: '4米', wrongs: ['4厘米', '40厘米', '400米'], explanation: '教室里的黑板大约4米长' },
  { text: '课桌高约（ ）', answer: '70厘米', wrongs: ['70米', '7厘米', '7米'], explanation: '课桌大约70厘米高' },
  { text: '2米 = （ ）厘米', answer: '200', wrongs: ['20', '2000', '150'], explanation: '1米=100厘米，2米=200厘米' },
  { text: '量教室的长度用（ ）做单位更合适', answer: '米', wrongs: ['厘米', '毫米', '分米'], explanation: '比较长的物体用米作单位' },
  { text: '量一支笔的长度用（ ）做单位更合适', answer: '厘米', wrongs: ['米', '千米', '分米'], explanation: '比较短的物体用厘米作单位' },
  { text: '爸爸身高约（ ）', answer: '1米75厘米', wrongs: ['175米', '75厘米', '17米5厘米'], explanation: '成年人的身高一般不到2米' },
  { text: '数学书长约（ ）', answer: '26厘米', wrongs: ['26米', '2米6厘米', '260米'], explanation: '数学书大约26厘米长' },
];

const observeDefs: { text: string; answer: string; wrongs: string[]; explanation: string }[] = [
  { text: '从上面看一个球，看到的是什么形状？', answer: '圆形', wrongs: ['正方形', '三角形', '长方形'], explanation: '球从任何方向看都是圆形' },
  { text: '从正面看一个圆柱，看到的是什么形状？', answer: '长方形', wrongs: ['圆形', '三角形', '五角星'], explanation: '圆柱从正面看是长方形' },
  { text: '一个角有（ ）个顶点', answer: '1个', wrongs: ['2个', '3个', '0个'], explanation: '一个角有1个顶点和2条边' },
  { text: '一个三角尺上有（ ）个直角', answer: '1个', wrongs: ['2个', '3个', '0个'], explanation: '三角尺上有1个直角和2个锐角' },
  { text: '长方形有（ ）个角', answer: '4个', wrongs: ['3个', '5个', '2个'], explanation: '长方形有4个直角' },
  { text: '比直角小的角叫（ ）', answer: '锐角', wrongs: ['钝角', '平角', '圆角'], explanation: '比直角小的角是锐角' },
  { text: '比直角大的角叫（ ）', answer: '钝角', wrongs: ['锐角', '直角', '平角'], explanation: '比直角大的角是钝角' },
  { text: '正方形的角都是（ ）', answer: '直角', wrongs: ['锐角', '钝角', '平角'], explanation: '正方形有4个直角' },
];

const appDefs: { text: string; answer: string; wrongs: string[]; explanation: string }[] = [
  { text: '小明每天练8个毛笔字，练了5天，一共练了（ ）个字', answer: '40', wrongs: ['13', '35', '45'], explanation: '8×5=40' },
  { text: '妈妈买来24个苹果，平均分给6个小朋友，每人分（ ）个', answer: '4', wrongs: ['6', '5', '3'], explanation: '24÷6=4' },
  { text: '一盒彩笔有12支，3盒一共有（ ）支', answer: '36', wrongs: ['15', '30', '24'], explanation: '12×3=36' },
  { text: '每本练习本2元，买8本需要（ ）元', answer: '16', wrongs: ['10', '18', '14'], explanation: '2×8=16' },
  { text: '36个同学做操，每行站9人，可以站（ ）行', answer: '4', wrongs: ['5', '3', '6'], explanation: '36÷9=4' },
  { text: '一根绳子长1米，用去30厘米，还剩（ ）厘米', answer: '70', wrongs: ['130', '30', '60'], explanation: '1米=100厘米，100-30=70' },
  { text: '图书馆有45本故事书，借出18本，还剩（ ）本', answer: '27', wrongs: ['33', '25', '30'], explanation: '45-18=27' },
  { text: '教室里每排坐8人，坐满5排，一共有（ ）人', answer: '40', wrongs: ['35', '45', '38'], explanation: '8×5=40' },
  { text: '小明有35颗糖，送给小朋友12颗，还剩（ ）颗', answer: '23', wrongs: ['25', '21', '27'], explanation: '35-12=23' },
  { text: '一串香蕉有6根，妈妈买来7串，一共有（ ）根', answer: '42', wrongs: ['36', '40', '48'], explanation: '6×7=42' },
];

function buildDefs(): MathQDef[] {
  const defs: MathQDef[] = [];

  // 表内乘法（口诀）
  mulPairs.forEach(([a, b]) => {
    const answer = a * b;
    const wrongsSet = new Set<string>();
    for (const delta of [-a, -b, b, a, -1, 1]) {
      const v = answer + delta;
      if (v > 0 && v !== answer) wrongsSet.add(String(v));
      if (wrongsSet.size >= 3) break;
    }
    while (wrongsSet.size < 3) wrongsSet.add(String(answer + wrongsSet.size + 2));
    defs.push({
      text: `${a} × ${b} = ?`,
      answer: String(answer),
      wrongs: Array.from(wrongsSet).slice(0, 3),
      difficulty: 1,
      category: 'mul_div',
      explanation: `${a}×${b}=${answer}，乘法口诀要背熟哦`,
    });
  });

  // 表内除法
  divPairs.forEach(([a, b]) => {
    const answer = a / b;
    const wrongs = [answer - 1, answer + 1, answer + b].filter((v) => v > 0 && v !== answer).map(String);
    while (wrongs.length < 3) {
      wrongs.push(String(answer + wrongs.length + 2));
    }
    defs.push({
      text: `${a} ÷ ${b} = ?`,
      answer: String(answer),
      wrongs: wrongs.slice(0, 3),
      difficulty: 1,
      category: 'mul_div',
      explanation: `${a}÷${b}=${answer}，想口诀“${b}×${answer}=${a}”`,
    });
  });

  // 两位数加减法
  twoDigitPairs.forEach(([a, b, isAdd]) => {
    const answer = isAdd ? a + b : a - b;
    const operator = isAdd ? '+' : '-';
    const offsets = [-2, -1, 1, 2, 3];
    const wrongs = new Set<string>();
    for (const off of shuffleArray(offsets)) {
      if (wrongs.size >= 3) break;
      const val = answer + off;
      if (val >= 0 && val !== answer) wrongs.add(String(val));
    }
    while (wrongs.size < 3) wrongs.add(String(answer + wrongs.size + 2));
    defs.push({
      text: `${a} ${operator} ${b} = ?`,
      answer: String(answer),
      wrongs: Array.from(wrongs),
      difficulty: 2,
      category: 'add_sub',
      explanation: `${a} ${operator} ${b} = ${answer}，注意进位和退位`,
    });
  });

  // 认识时间
  timeDefs.forEach((t) => {
    defs.push({
      text: t.text,
      answer: t.answer,
      wrongs: t.wrongs,
      difficulty: 2,
      category: 'time',
      explanation: '读时间：分针指向几，就用几×5算分钟；时针指到几就是几时',
    });
  });

  // 长度单位
  measureDefs.forEach((m) => {
    defs.push({
      text: m.text,
      answer: m.answer,
      wrongs: m.wrongs,
      difficulty: 3,
      category: 'measure',
      explanation: m.explanation,
    });
  });

  // 角的初步认识 & 观察物体
  observeDefs.forEach((o) => {
    defs.push({
      text: o.text,
      answer: o.answer,
      wrongs: o.wrongs,
      difficulty: 3,
      category: 'angle',
      explanation: o.explanation,
    });
  });

  // 应用题
  appDefs.forEach((a) => {
    defs.push({
      text: a.text,
      answer: a.answer,
      wrongs: a.wrongs,
      difficulty: 3,
      category: 'observe',
      explanation: a.explanation,
    });
  });

  return defs;
}

function generateMathQuestions(): Question[] {
  const questions: Question[] = [];
  buildDefs().forEach((def, index) => {
    const options = shuffleArray([def.answer, ...def.wrongs]);
    questions.push({
      id: `mq_${String(index + 1).padStart(3, '0')}`,
      subject: 'math',
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

export const mathQuestions = generateMathQuestions();
