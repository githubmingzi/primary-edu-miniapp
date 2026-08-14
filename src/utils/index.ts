import { Question } from '@/types';
import Taro from '@tarojs/taro';

// 复用的音频播放实例
let audioCtx: ReturnType<typeof Taro.createInnerAudioContext> | null = null;
// 当前单词的在线发音回退地址
let fallbackUrl = '';
// 是否已回退到在线发音（同一单词只回退一次）
let isFallback = false;

// 单词 → 本地音频文件路径（文件名规则与 scripts/generate-word-audio.js 保持一致）
function getLocalAudioSrc(word: string): string {
  const name = word.toLowerCase().replace(/[^a-z0-9]/g, '_');
  return `/assets/audio/${name}.mp3`;
}

function ensureAudioCtx(): ReturnType<typeof Taro.createInnerAudioContext> {
  if (audioCtx) return audioCtx;
  audioCtx = Taro.createInnerAudioContext();
  // 本地音频播放失败时，回退到有道词典在线发音；在线发音也失败则不再重试
  audioCtx.onError((err) => {
    console.error('单词发音播放失败:', err);
    if (!audioCtx) return;
    if (!isFallback && fallbackUrl) {
      isFallback = true;
      audioCtx.stop();
      audioCtx.src = fallbackUrl;
      audioCtx.play();
    }
  });
  return audioCtx;
}

// 播放英语单词发音（优先播放随小程序打包的本地音频，离线可用；失败时自动回退到在线发音）
export function playWordAudio(word: string): void {
  try {
    const ctx = ensureAudioCtx();
    fallbackUrl = `https://dict.youdao.com/dictvoice?type=0&audio=${encodeURIComponent(word)}`;
    isFallback = false;
    ctx.stop();
    ctx.src = getLocalAudioSrc(word);
    ctx.play();
  } catch (e) {
    console.error('播放单词发音失败:', e);
  }
}

// 洗牌算法
export function shuffleArray<T>(arr: T[]): T[] {
  const shuffled = [...arr];
  for (let i = shuffled.length - 1; i > 0; i--) {
    const j = Math.floor(Math.random() * (i + 1));
    [shuffled[i], shuffled[j]] = [shuffled[j], shuffled[i]];
  }
  return shuffled;
}

// 获取当前日期的题目的题目列表（按难度）
export function getQuestionsByDifficulty(questions: Question[], difficulty: number): Question[] {
  return questions.filter((q) => q.difficulty === difficulty);
}

// 获取一组题目（默认10题）
export function getQuestionSet(questions: Question[], count: number = 10): Question[] {
  return shuffleArray(questions).slice(0, count);
}

// 格式化时间
export function formatTime(seconds: number): string {
  const m = Math.floor(seconds / 60);
  const s = seconds % 60;
  return `${m.toString().padStart(2, '0')}:${s.toString().padStart(2, '0')}`;
}

// 鼓励语
export const encouragementPhrases = [
  '太棒了！🎉',
  '真聪明！🌟',
  '答对了！👍',
  '你真厉害！💪',
  '继续加油！⭐',
];

export const encouragementWrongPhrases = [
  '加油，再试一次！💪',
  '没关系，继续努力！😊',
  '下次一定行！🌟',
  '别灰心，你做得很好！👍',
];

export function getRandomEncouragement(isCorrect: boolean): string {
  const list = isCorrect ? encouragementPhrases : encouragementWrongPhrases;
  return list[Math.floor(Math.random() * list.length)];
}

// 生成星星动画数据
export function generateStarPositions(count: number): { x: number; y: number; delay: number }[] {
  const positions: { x: number; y: number; delay: number }[] = [];
  for (let i = 0; i < count; i++) {
    positions.push({
      x: Math.random() * 200 - 100,
      y: Math.random() * -200 - 50,
      delay: Math.random() * 0.3,
    });
  }
  return positions;
}