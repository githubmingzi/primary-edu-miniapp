import React, { useState, useEffect, useRef, useCallback } from 'react';
import { View, Text } from '@tarojs/components';
import Taro from '@tarojs/taro';
import { useStore } from '@/store/useStore';
import { mathQuestions } from '@/data/mathQuestions';
import { Question } from '@/types';
import { getQuestionSet, getRandomEncouragement } from '@/utils';
import QuestionCard from '@/components/QuestionCard';
import styles from './index.module.scss';

const MathPracticePage: React.FC = () => {
  const params = Taro.getCurrentInstance().router?.params;
  const level = params?.level ? parseInt(params.level) : 1;

  const [questions, setQuestions] = useState<Question[]>([]);
  const [currentIndex, setCurrentIndex] = useState(0);
  const [selectedIndex, setSelectedIndex] = useState<number | undefined>();
  const [correctIndex, setCorrectIndex] = useState<number | undefined>();
  const [showResult, setShowResult] = useState(false);
  const [correctCount, setCorrectCount] = useState(0);
  const [practiceDone, setPracticeDone] = useState(false);
  const [timeLeft, setTimeLeft] = useState(30);
  const timerRef = useRef<ReturnType<typeof setInterval>>();

  // 使用 ref 保存最新状态，避免闭包陷阱
  const showResultRef = useRef(false);
  const practiceDoneRef = useRef(false);
  const currentIndexRef = useRef(0);

  const { updateStars, addCorrect, addAttempt } = useStore();

  useEffect(() => {
    const filtered = mathQuestions.filter((q) => q.difficulty === level);
    const qs = getQuestionSet(filtered, 10);
    setQuestions(qs);
    startTimer();
    return () => {
      if (timerRef.current) clearInterval(timerRef.current);
    };
  }, []);

  // 同步 ref
  useEffect(() => {
    showResultRef.current = showResult;
  }, [showResult]);

  useEffect(() => {
    practiceDoneRef.current = practiceDone;
  }, [practiceDone]);

  useEffect(() => {
    currentIndexRef.current = currentIndex;
  }, [currentIndex]);

  const startTimer = useCallback(() => {
    setTimeLeft(30);
    if (timerRef.current) clearInterval(timerRef.current);
    timerRef.current = setInterval(() => {
      setTimeLeft((prev) => {
        if (prev <= 1) {
          if (timerRef.current) clearInterval(timerRef.current);
          // 使用 ref 获取最新值
          if (!showResultRef.current && !practiceDoneRef.current) {
            setCorrectIndex(questions[currentIndexRef.current]?.correctAnswer);
            setShowResult(true);
            addAttempt('math');
          }
          return 0;
        }
        return prev - 1;
      });
    }, 1000);
  }, [questions, addAttempt]);

  const handleSelect = (index: number) => {
    if (showResult) return;
    setSelectedIndex(index);
    setShowResult(true);
    if (timerRef.current) clearInterval(timerRef.current);

    const isCorrect = index === questions[currentIndex].correctAnswer;
    setCorrectIndex(questions[currentIndex].correctAnswer);
    if (isCorrect) {
      setCorrectCount((c) => c + 1);
      updateStars(1);
      addCorrect('math');
    }
    addAttempt('math');
  };

  const handleNext = () => {
    if (currentIndex < questions.length - 1) {
      const nextIdx = currentIndex + 1;
      setCurrentIndex(nextIdx);
      setSelectedIndex(undefined);
      setCorrectIndex(undefined);
      setShowResult(false);
      startTimer();
    } else {
      setPracticeDone(true);
    }
  };

  const currentQ = questions[currentIndex];

  if (practiceDone) {
    const accuracy = Math.round((correctCount / questions.length) * 100);
    const starCount = correctCount >= 9 ? 3 : correctCount >= 7 ? 2 : correctCount >= 5 ? 1 : 0;
    return (
      <View className={styles.container}>
        <View className={styles.resultArea}>
          <Text className={styles.resultIcon}>
            {accuracy >= 80 ? '🎉' : accuracy >= 60 ? '😊' : '💪'}
          </Text>
          <Text className={styles.resultTitle}>练习完成！</Text>
          <View className={styles.resultStats}>
            <View className={styles.resultStat}>
              <Text className={styles.resultStatValue}>{correctCount}</Text>
              <Text className={styles.resultStatLabel}>答对</Text>
            </View>
            <View className={styles.resultStat}>
              <Text className={styles.resultStatValue}>{accuracy}%</Text>
              <Text className={styles.resultStatLabel}>正确率</Text>
            </View>
            <View className={styles.resultStat}>
              <Text className={styles.resultStatValue}>
                {'⭐'.repeat(starCount)}{'☆'.repeat(3 - starCount)}
              </Text>
              <Text className={styles.resultStatLabel}>评价</Text>
            </View>
          </View>
          <View className={styles.resultBtns}>
            <View className={styles.nextBtn} onClick={() => Taro.navigateBack()}>
              <Text className={styles.nextBtnText}>返回</Text>
            </View>
          </View>
        </View>
      </View>
    );
  }

  if (!currentQ) return null;

  return (
    <View className={styles.container}>
      <View className={styles.header}>
        <View className={styles.headerInfo}>
          <Text className={styles.headerTitle}>第 {currentIndex + 1}/{questions.length} 题</Text>
          <Text className={styles.headerProgress}>答对 {correctCount} 题</Text>
        </View>
        <Text className={styles.headerScore}>⏱ {timeLeft}s</Text>
      </View>

      <View className={styles.questionArea}>
        <QuestionCard
          questionText={currentQ.question.text}
          options={currentQ.options}
          onSelect={handleSelect}
          selectedIndex={selectedIndex}
          correctIndex={correctIndex}
          disabled={showResult}
        />
      </View>

      {showResult && (
        <>
          <View className={`${styles.feedback} ${selectedIndex === correctIndex ? styles.feedbackCorrect : styles.feedbackWrong}`}>
            <Text>{getRandomEncouragement(selectedIndex === correctIndex)}</Text>
          </View>
          <View className={styles.nextBtn} onClick={handleNext}>
            <Text className={styles.nextBtnText}>
              {currentIndex < questions.length - 1 ? '下一题' : '查看结果'}
            </Text>
          </View>
        </>
      )}
    </View>
  );
};

export default MathPracticePage;