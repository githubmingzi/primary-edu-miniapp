import React, { useState } from 'react';
import { View, Text } from '@tarojs/components';
import { useStore } from '@/store/useStore';
import { scienceKnowledgeList } from '@/data/scienceKnowledge';
import { scienceQuestions } from '@/data/scienceQuestions';
import { Question } from '@/types';
import { shuffleArray, getRandomEncouragement } from '@/utils';
import styles from './index.module.scss';

type ModeType = 'learn' | 'practice';

const SciencePage: React.FC = () => {
  const [mode, setMode] = useState<ModeType>('learn');
  const [currentIndex, setCurrentIndex] = useState(0);
  const { updateStars, addCorrect, addAttempt, markKnowledgeLearned } = useStore();

  // 练习模式
  const [practiceQs, setPracticeQs] = useState<Question[]>([]);
  const [practiceQIndex, setPracticeQIndex] = useState(0);
  const [practiceOptions, setPracticeOptions] = useState<string[]>([]);
  const [selectedAnswer, setSelectedAnswer] = useState<number | null>(null);
  const [showResult, setShowResult] = useState(false);
  const [correctCount, setCorrectCount] = useState(0);
  const [practiceDone, setPracticeDone] = useState(false);

  const currentKnowledge = scienceKnowledgeList[currentIndex];

  const goNextKnowledge = () => {
    const nextIdx = Math.min(scienceKnowledgeList.length - 1, currentIndex + 1);
    markKnowledgeLearned(scienceKnowledgeList[currentIndex].id);
    setCurrentIndex(nextIdx);
  };

  const startPractice = () => {
    const shuffled = shuffleArray(scienceQuestions).slice(0, 10);
    setPracticeQs(shuffled);
    setPracticeQIndex(0);
    setSelectedAnswer(null);
    setShowResult(false);
    setCorrectCount(0);
    setPracticeDone(false);
    generatePracticeOptions(shuffled[0]);
  };

  const generatePracticeOptions = (current: Question) => {
    setPracticeOptions(shuffleArray(current.options));
  };

  const handlePracticeAnswer = (index: number) => {
    if (showResult) return;
    setSelectedAnswer(index);
    setShowResult(true);

    const isCorrect = practiceOptions[index] === practiceQs[practiceQIndex].options[practiceQs[practiceQIndex].correctAnswer];
    if (isCorrect) {
      setCorrectCount((c) => c + 1);
      updateStars(1);
      addCorrect('science');
    }
    addAttempt('science');
  };

  const handleNextPractice = () => {
    if (practiceQIndex < practiceQs.length - 1) {
      const nextIdx = practiceQIndex + 1;
      setPracticeQIndex(nextIdx);
      setSelectedAnswer(null);
      setShowResult(false);
      generatePracticeOptions(practiceQs[nextIdx]);
    } else {
      setPracticeDone(true);
    }
  };

  const currentPracticeQ = practiceQs[practiceQIndex];
  const correctPracticeIndex = currentPracticeQ ? practiceOptions.indexOf(currentPracticeQ.options[currentPracticeQ.correctAnswer]) : -1;

  const renderLearnMode = () => (
    <>
      <View className={styles.learnCard}>
        <View className={styles.learnEmoji}>
          <Text>{currentKnowledge.emoji}</Text>
        </View>
        <Text className={styles.learnTitle}>{currentKnowledge.title}</Text>
        <Text className={styles.learnCategory}>{currentKnowledge.category}</Text>
        <Text className={styles.learnContent}>{currentKnowledge.content}</Text>

        <View className={styles.navButtons}>
          <View
            className={`${styles.navBtn} ${styles.navBtnSecondary}`}
            onClick={() => setCurrentIndex(Math.max(0, currentIndex - 1))}
          >
            <Text className={styles.navBtnText}>上一个</Text>
          </View>
          <View className={styles.navBtn} onClick={goNextKnowledge}>
            <Text className={styles.navBtnText}>下一个</Text>
          </View>
        </View>
      </View>
      <Text className={styles.progressHint}>
        第 {currentIndex + 1}/{scienceKnowledgeList.length} 张知识卡
      </Text>
    </>
  );

  const renderPracticeMode = () => {
    if (practiceDone) {
      const accuracy = Math.round((correctCount / practiceQs.length) * 100);
      return (
        <View className={styles.practiceArea}>
          <Text className={styles.practiceQuestion}>测验完成！</Text>
          <Text className={styles.resultHint}>
            答对 {correctCount}/{practiceQs.length} 题 · 正确率 {accuracy}%
          </Text>
          <View className={styles.navButtons}>
            <View className={styles.navBtn} onClick={startPractice}>
              <Text className={styles.navBtnText}>再来一次</Text>
            </View>
            <View className={`${styles.navBtn} ${styles.navBtnSecondary}`} onClick={() => setMode('learn')}>
              <Text className={styles.navBtnText}>返回知识卡</Text>
            </View>
          </View>
        </View>
      );
    }

    if (!currentPracticeQ) return null;

    return (
      <View className={styles.practiceArea}>
        <Text className={styles.practiceCategory}>{currentPracticeQ.category}</Text>
        <Text className={styles.practiceQuestion}>{currentPracticeQ.question.text}</Text>

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
            {selectedAnswer !== correctPracticeIndex && currentPracticeQ.explanation && (
              <Text className={styles.explanation}>💡 {currentPracticeQ.explanation}</Text>
            )}
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
        <Text className={styles.headerTitle}>🔬 科学学习</Text>
        <Text className={styles.headerDesc}>二年级科学 · 郑州小学同步</Text>
      </View>

      <View className={styles.modeSwitch}>
        <View
          className={`${styles.modeBtn} ${mode === 'learn' ? styles.modeBtnActive : ''}`}
          onClick={() => setMode('learn')}
        >
          <Text>知识卡</Text>
        </View>
        <View
          className={`${styles.modeBtn} ${mode === 'practice' ? styles.modeBtnActive : ''}`}
          onClick={() => { setMode('practice'); startPractice(); }}
        >
          <Text>小测验</Text>
        </View>
      </View>

      {mode === 'learn' ? renderLearnMode() : renderPracticeMode()}
    </View>
  );
};

export default SciencePage;
