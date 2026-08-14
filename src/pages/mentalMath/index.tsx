import React, { useState, useEffect, useRef, useCallback } from 'react';
import { View, Text } from '@tarojs/components';
import Taro from '@tarojs/taro';
import { useStore } from '@/store/useStore';
import { mathQuestions } from '@/data/mathQuestions';
import { Question } from '@/types';
import { shuffleArray, getRandomEncouragement } from '@/utils';
import QuestionCard from '@/components/QuestionCard';
import styles from './index.module.scss';

const MentalMathPage: React.FC = () => {
  const [gameState, setGameState] = useState<'start' | 'playing' | 'end'>('start');
  const [questions, setQuestions] = useState<Question[]>([]);
  const [currentIndex, setCurrentIndex] = useState(0);
  const [selectedIndex, setSelectedIndex] = useState<number | undefined>();
  const [correctIndex, setCorrectIndex] = useState<number | undefined>();
  const [showResult, setShowResult] = useState(false);
  const [score, setScore] = useState(0);
  const [timeLeft, setTimeLeft] = useState(60);
  const timerRef = useRef<ReturnType<typeof setInterval>>();
  const timeoutRef = useRef<ReturnType<typeof setTimeout>>();

  const { updateStars, addCorrect, addAttempt, updateMathBestRecord } = useStore();

  // 使用 ref 保存最新状态，避免闭包陷阱
  const currentIndexRef = useRef(0);
  const questionsRef = useRef<Question[]>([]);
  const gameStateRef = useRef<'start' | 'playing' | 'end'>('start');

  useEffect(() => {
    return () => {
      if (timerRef.current) clearInterval(timerRef.current);
      if (timeoutRef.current) clearTimeout(timeoutRef.current);
    };
  }, []);

  useEffect(() => {
    currentIndexRef.current = currentIndex;
  }, [currentIndex]);

  useEffect(() => {
    questionsRef.current = questions;
  }, [questions]);

  useEffect(() => {
    gameStateRef.current = gameState;
  }, [gameState]);

  const startGame = useCallback(() => {
    const easy = shuffleArray(mathQuestions.filter((q) => q.difficulty <= 2));
    const allQ = easy.slice(0, 50);
    setQuestions(allQ);
    questionsRef.current = allQ;
    setCurrentIndex(0);
    setScore(0);
    setTimeLeft(60);
    setGameState('playing');
    startTimer();
  }, []);

  const startTimer = useCallback(() => {
    if (timerRef.current) clearInterval(timerRef.current);
    timerRef.current = setInterval(() => {
      setTimeLeft((prev) => {
        if (prev <= 1) {
          if (timerRef.current) clearInterval(timerRef.current);
          setGameState('end');
          updateMathBestRecord(score);
          return 0;
        }
        return prev - 1;
      });
    }, 1000);
  }, [score, updateMathBestRecord]);

  const handleSelect = (index: number) => {
    if (showResult || gameState !== 'playing') return;
    setSelectedIndex(index);
    setShowResult(true);

    const idx = currentIndexRef.current;
    const qs = questionsRef.current;
    const isCorrect = index === qs[idx]?.correctAnswer;
    setCorrectIndex(qs[idx]?.correctAnswer);
    if (isCorrect) {
      setScore((s) => s + 1);
      updateStars(1);
      addCorrect('math');
    }
    addAttempt('math');

    timeoutRef.current = setTimeout(() => {
      if (idx < questionsRef.current.length - 1) {
        setCurrentIndex((i) => i + 1);
        setSelectedIndex(undefined);
        setCorrectIndex(undefined);
        setShowResult(false);
      } else {
        setGameState('end');
        updateMathBestRecord(isCorrect ? score + 1 : score);
      }
    }, 800);
  };

  const currentQ = questions[currentIndex];

  if (gameState === 'start') {
    return (
      <View className={styles.container}>
        <View className={styles.startScreen}>
          <Text className={styles.startIcon}>⚡</Text>
          <Text className={styles.startTitle}>心算挑战</Text>
          <Text className={styles.startDesc}>
            限时1分钟，尽可能多答对题目！{'\n'}难度会逐步提升
          </Text>
          <View className={styles.nextBtn} style={{ width: '60%' }} onClick={startGame}>
            <Text className={styles.nextBtnText}>开始挑战</Text>
          </View>
        </View>
      </View>
    );
  }

  if (gameState === 'end') {
    return (
      <View className={styles.container}>
        <View className={styles.resultArea}>
          <Text className={styles.resultIcon}>
            {score >= 15 ? '🎉' : score >= 8 ? '😊' : '💪'}
          </Text>
          <Text className={styles.resultTitle}>挑战结束！</Text>
          <Text className={styles.resultValue}>{score}</Text>
          <Text className={styles.resultLabel}>答对题数</Text>
          <View className={styles.resultBtns}>
            <View className={styles.nextBtn} onClick={startGame}>
              <Text className={styles.nextBtnText}>再来一次</Text>
            </View>
            <View className={styles.nextBtn} style={{ background: '#E0E0E0' }} onClick={() => Taro.navigateBack()}>
              <Text className={styles.nextBtnText} style={{ color: '#607D8B' }}>返回</Text>
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
        <Text className={styles.timer}>{timeLeft}s</Text>
        <Text className={styles.score}>答对 {score} 题</Text>
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
        <View className={`${styles.feedback} ${selectedIndex === correctIndex ? styles.feedbackCorrect : styles.feedbackWrong}`}>
          <Text>{getRandomEncouragement(selectedIndex === correctIndex)}</Text>
        </View>
      )}
    </View>
  );
};

export default MentalMathPage;