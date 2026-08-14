import { Question } from '@/types';

function generateMathQuestions(): Question[] {
  const questions: Question[] = [];
  let id = 0;

  // 10以内加减法（简单）
  const easyQuestions: [number, number, boolean][] = [
    [3, 2, true], [5, 1, true], [2, 4, true], [7, 2, true], [1, 6, true],
    [4, 3, true], [8, 1, true], [3, 5, true], [6, 2, true], [2, 7, true],
    [5, 0, true], [4, 4, true], [9, 1, true], [7, 3, true], [1, 8, true],
    [5, 3, false], [8, 2, false], [9, 4, false], [7, 5, false], [6, 3, false],
    [10, 4, false], [9, 6, false], [8, 5, false], [7, 2, false], [6, 1, false],
    [10, 7, false], [9, 3, false], [8, 6, false], [9, 2, false], [10, 5, false],
  ];

  easyQuestions.forEach(([a, b, isAdd]) => {
    id++;
    const answer = isAdd ? a + b : a - b;
    const operator = isAdd ? '+' : '-';
    const wrongOptions = generateWrongOptions(answer, 1);
    let options = shuffleArray([answer.toString(), ...wrongOptions]).slice(0, 4);
    // 确保是4个选项
    while (options.length < 4) {
      options.push((answer + options.length + 1).toString());
    }
    options = shuffleArray(options);
    questions.push({
      id: `mq_easy_${id}`,
      subject: 'math',
      type: 'choice',
      difficulty: 1,
      category: 'add_sub',
      question: { text: `${a} ${operator} ${b} = ?` },
      options,
      correctAnswer: options.indexOf(answer.toString()),
      explanation: `${a} ${operator} ${b} = ${answer}`,
    });
  });

  // 20以内加减法（中等）
  const midQuestions: [number, number, boolean][] = [
    [8, 5, true], [7, 6, true], [9, 4, true], [6, 8, true], [9, 7, true],
    [5, 9, true], [8, 7, true], [9, 6, true], [7, 8, true], [9, 9, true],
    [15, 6, false], [17, 8, false], [14, 9, false], [16, 7, false], [13, 5, false],
    [18, 9, false], [12, 4, false], [15, 8, false], [11, 3, false], [14, 6, false],
    [11, 9, true], [12, 8, true], [13, 7, true], [14, 6, true], [15, 5, true],
    [16, 4, true], [17, 3, true], [18, 2, true], [19, 1, true], [10, 10, true],
  ];

  midQuestions.forEach(([a, b, isAdd]) => {
    id++;
    const answer = isAdd ? a + b : a - b;
    const operator = isAdd ? '+' : '-';
    const wrongOptions = generateWrongOptions(answer, 2);
    let options = shuffleArray([answer.toString(), ...wrongOptions]).slice(0, 4);
    while (options.length < 4) {
      options.push((answer + options.length + 1).toString());
    }
    options = shuffleArray(options);
    questions.push({
      id: `mq_mid_${id}`,
      subject: 'math',
      type: 'choice',
      difficulty: 2,
      category: 'add_sub',
      question: { text: `${a} ${operator} ${b} = ?` },
      options,
      correctAnswer: options.indexOf(answer.toString()),
      explanation: `${a} ${operator} ${b} = ${answer}`,
    });
  });

  // 100以内加减法（较难）
  const hardQuestions: [number, number, boolean][] = [
    [25, 30, true], [40, 25, true], [35, 20, true], [55, 15, true], [60, 25, true],
    [45, 30, true], [50, 25, true], [70, 20, true], [35, 45, true], [65, 25, true],
    [42, 18, true], [58, 22, true], [34, 26, true], [67, 23, true], [48, 32, true],
    [80, 35, false], [90, 45, false], [75, 25, false], [65, 20, false], [85, 30, false],
    [100, 45, false], [95, 35, false], [70, 40, false], [90, 60, false], [88, 24, false],
    [76, 38, false], [92, 47, false], [84, 56, false], [73, 27, false], [68, 39, false],
  ];

  hardQuestions.forEach(([a, b, isAdd]) => {
    id++;
    const answer = isAdd ? a + b : a - b;
    const operator = isAdd ? '+' : '-';
    const wrongOptions = generateWrongOptions(answer, 3);
    let options = shuffleArray([answer.toString(), ...wrongOptions]).slice(0, 4);
    while (options.length < 4) {
      options.push((answer + options.length + 1).toString());
    }
    options = shuffleArray(options);
    questions.push({
      id: `mq_hard_${id}`,
      subject: 'math',
      type: 'choice',
      difficulty: 3,
      category: 'add_sub',
      question: { text: `${a} ${operator} ${b} = ?` },
      options,
      correctAnswer: options.indexOf(answer.toString()),
      explanation: `${a} ${operator} ${b} = ${answer}`,
    });
  });

  return questions;
}

function generateWrongOptions(correct: number, range: number): string[] {
  const wrongs = new Set<string>();
  const offsets = [-3, -2, -1, 1, 2, 3, -4, 4];
  for (const offset of shuffleArray(offsets)) {
    if (wrongs.size >= 3) break;
    const val = correct + offset * range;
    if (val !== correct && val >= 0 && val <= 200) {
      wrongs.add(val.toString());
    }
  }
  return Array.from(wrongs);
}

function shuffleArray<T>(arr: T[]): T[] {
  const shuffled = [...arr];
  for (let i = shuffled.length - 1; i > 0; i--) {
    const j = Math.floor(Math.random() * (i + 1));
    [shuffled[i], shuffled[j]] = [shuffled[j], shuffled[i]];
  }
  return shuffled;
}

export const mathQuestions = generateMathQuestions();