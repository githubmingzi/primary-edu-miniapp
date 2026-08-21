import React, { useState } from 'react';
import { View, Text } from '@tarojs/components';
import { useStore } from '@/store/useStore';
import { poemList, Poem } from '@/data/poems';
import { shuffleArray, getRandomEncouragement } from '@/utils';
import styles from './index.module.scss';

type ModeType = 'learn' | 'practice';

interface PoemQuestion {
  text: string;
  options: string[];
  answer: string;
  poemTitle: string;
}

function buildPoemQuestions(): PoemQuestion[] {
  const questions: PoemQuestion[] = [];
  poemList.forEach((poem) => {
    // 作者题
    const otherAuthors = shuffleArray(poemList.filter((p) => p.author !== poem.author)).slice(0, 3).map((p) => `${p.dynasty}·${p.author}`);
    questions.push({
      text: `《${poem.title}》的作者是？`,
      options: shuffleArray([`${poem.dynasty}·${poem.author}`, ...otherAuthors]),
      answer: `${poem.dynasty}·${poem.author}`,
      poemTitle: poem.title,
    });
    // 补全题（每首诗取第一联）
    if (poem.content.length >= 2) {
      const up = poem.content[0];
      const down = poem.content[1];
      const otherLines = shuffleArray(poemList.flatMap((p) => p.content).filter((l) => l !== down && l !== up)).slice(0, 3);
      questions.push({
        text: `「${up}」的下一句是？`,
        options: shuffleArray([down, ...otherLines]),
        answer: down,
        poemTitle: poem.title,
      });
    }
  });
  return questions;
}

const poemQuestions = buildPoemQuestions();

const PoemPage: React.FC = () => {
  const [mode, setMode] = useState<ModeType>('learn');
  const [currentIndex, setCurrentIndex] = useState(0);
  const { updateStars, addCorrect, addAttempt } = useStore();

  // 练习模式
  const [practiceQs, setPracticeQs] = useState<PoemQuestion[]>([]);
  const [practiceQIndex, setPracticeQIndex] = useState(0);
  const [practiceOptions, setPracticeOptions] = useState<string[]>([]);
  const [selectedAnswer, setSelectedAnswer] = useState<number | null>(null);
  const [showResult, setShowResult] = useState(false);
  const [correctCount, setCorrectCount] = useState(0);
  const [practiceDone, setPracticeDone] = useState(false);

  const currentPoem = poemList[currentIndex];

  const startPractice = () => {
    const shuffled = shuffleArray(poemQuestions).slice(0, 10);
    setPracticeQs(shuffled);
    setPracticeQIndex(0);
    setSelectedAnswer(null);
    setShowResult(false);
    setCorrectCount(0);
    setPracticeDone(false);
    setPracticeOptions(shuffled[0].options);
  };

  const handlePracticeAnswer = (index: number) => {
    if (showResult) return;
    setSelectedAnswer(index);
    setShowResult(true);

    const isCorrect = practiceOptions[index] === practiceQs[practiceQIndex].answer;
    if (isCorrect) {
      setCorrectCount((c) => c + 1);
      updateStars(1);
      addCorrect('chinese');
    }
    addAttempt('chinese');
  };

  const handleNextPractice = () => {
    if (practiceQIndex < practiceQs.length - 1) {
      const nextIdx = practiceQIndex + 1;
      setPracticeQIndex(nextIdx);
      setSelectedAnswer(null);
      setShowResult(false);
      setPracticeOptions(practiceQs[nextIdx].options);
    } else {
      setPracticeDone(true);
    }
  };

  const currentPracticeQ = practiceQs[practiceQIndex];
  const correctPracticeIndex = currentPracticeQ ? practiceOptions.indexOf(currentPracticeQ.answer) : -1;

  const renderLearnMode = () => (
    <>
      <View className={styles.learnCard}>
        <View className={styles.learnEmoji}>
          <Text>{currentPoem.emoji}</Text>
        </View>
        <Text className={styles.learnTitle}>{currentPoem.title}</Text>
        <Text className={styles.learnAuthor}>{currentPoem.dynasty} · {currentPoem.author}</Text>
        <View className={styles.learnContent}>
          {currentPoem.content.map((line, i) => (
            <Text key={i} className={styles.learnLine}>{line}</Text>
          ))}
        </View>

        <View className={styles.navButtons}>
          <View
            className={`${styles.navBtn} ${styles.navBtnSecondary}`}
            onClick={() => setCurrentIndex(Math.max(0, currentIndex - 1))}
          >
            <Text className={styles.navBtnText}>上一首</Text>
          </View>
          <View
            className={styles.navBtn}
            onClick={() => setCurrentIndex(Math.min(poemList.length - 1, currentIndex + 1))}
          >
            <Text className={styles.navBtnText}>下一首</Text>
          </View>
        </View>
      </View>
      <Text className={styles.progressHint}>
        第 {currentIndex + 1}/{poemList.length} 首古诗
      </Text>
    </>
  );

  const renderPracticeMode = () => {
    if (practiceDone) {
      const accuracy = Math.round((correctCount / practiceQs.length) * 100);
      return (
        <View className={styles.practiceArea}>
          <Text className={styles.practiceQuestion}>背诵测验完成！</Text>
          <Text className={styles.resultHint}>
            答对 {correctCount}/{practiceQs.length} 题 · 正确率 {accuracy}%
          </Text>
          <View className={styles.navButtons}>
            <View className={styles.navBtn} onClick={startPractice}>
              <Text className={styles.navBtnText}>再来一次</Text>
            </View>
            <View className={`${styles.navBtn} ${styles.navBtnSecondary}`} onClick={() => setMode('learn')}>
              <Text className={styles.navBtnText}>返回背诵</Text>
            </View>
          </View>
        </View>
      );
    }

    if (!currentPracticeQ) return null;

    return (
      <View className={styles.practiceArea}>
        <Text className={styles.practiceQuestion}>{currentPracticeQ.text}</Text>

        <View className={styles.practiceOptions}>
          {practiceOptions.map((opt, index) => {
            let optionClass = styles.practiceOption;
            if (showResult) {
              if (index === correctPracticeIndex) optionClass += ` ${styles.optionCorrect}`;
              else if (index === selectedAnswer && index !== correctPracticeIndex) optionClass += ` ${styles.optionWrong}`;
            }
            return (
              <View key={index} className={optionClass} onClick={() => handlePracticeAnswer(index)}>
                <Text>{opt}</Text>
              </View>
            );
          })}
        </View>

        {showResult && (
          <>
            <View className={`${styles.feedback} ${selectedAnswer === correctPracticeIndex ? styles.feedbackCorrect : styles.feedbackWrong}`}>
              <Text>{getRandomEncouragement(selectedAnswer === correctPracticeIndex)}</Text>
            </View>
            <View className={styles.navButtons}>
              <View className={styles.navBtn} onClick={handleNextPractice}>
                <Text className={styles.navBtnText}>
                  {practiceQIndex < practiceQs.length - 1 ? '下一题' : '查看结果'}
                </Text>
              </View>
            </View>
          </>
        )}
        <Text className={styles.scoreText}>
          第 {practiceQIndex + 1}/{practiceQs.length} 题 · 正确 {correctCount} 题
        </Text>
      </View>
    );
  };

  return (
    <View className={styles.container}>
      <View className={styles.header}>
        <Text className={styles.headerTitle}>📜 古诗背诵</Text>
        <Text className={styles.headerDesc}>二年级必背古诗</Text>
      </View>

      <View className={styles.modeSwitch}>
        <View
          className={`${styles.modeBtn} ${mode === 'learn' ? styles.modeBtnActive : ''}`}
          onClick={() => setMode('learn')}
        >
          <Text>背诵</Text>
        </View>
        <View
          className={`${styles.modeBtn} ${mode === 'practice' ? styles.modeBtnActive : ''}`}
          onClick={() => { setMode('practice'); startPractice(); }}
        >
          <Text>测验</Text>
        </View>
      </View>

      {mode === 'learn' ? renderLearnMode() : renderPracticeMode()}
    </View>
  );
};

export default PoemPage;
