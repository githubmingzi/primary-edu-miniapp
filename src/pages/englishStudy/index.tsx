import React, { useState } from 'react';
import { View, Text } from '@tarojs/components';
import { useStore } from '@/store/useStore';
import { englishWordList } from '@/data/englishWords';
import { EnglishWord } from '@/types';
import { shuffleArray, getRandomEncouragement, playWordAudio } from '@/utils';
import styles from './index.module.scss';

type ModeType = 'learn' | 'practice';

const EnglishStudyPage: React.FC = () => {
  const [mode, setMode] = useState<ModeType>('learn');
  const [currentIndex, setCurrentIndex] = useState(0);
  const { updateStars, addCorrect, addAttempt } = useStore();

  // 练习模式
  const [practiceWords, setPracticeWords] = useState<EnglishWord[]>([]);
  const [practiceQIndex, setPracticeQIndex] = useState(0);
  const [practiceOptions, setPracticeOptions] = useState<string[]>([]);
  const [selectedAnswer, setSelectedAnswer] = useState<number | null>(null);
  const [showResult, setShowResult] = useState(false);
  const [correctCount, setCorrectCount] = useState(0);
  const [practiceDone, setPracticeDone] = useState(false);

  const currentWord = englishWordList[currentIndex];

  const startPractice = () => {
    const shuffled = shuffleArray(englishWordList).slice(0, 10);
    setPracticeWords(shuffled);
    setPracticeQIndex(0);
    setSelectedAnswer(null);
    setShowResult(false);
    setCorrectCount(0);
    setPracticeDone(false);
    generatePracticeOptions(shuffled[0]);
  };

  const generatePracticeOptions = (current: EnglishWord) => {
    const others = englishWordList.filter((w) => w.id !== current.id);
    const wrong = shuffleArray(others).slice(0, 3).map((w) => w.meaning);
    const opts = shuffleArray([current.meaning, ...wrong]);
    setPracticeOptions(opts);
  };

  const handlePracticeAnswer = (index: number) => {
    if (showResult) return;
    setSelectedAnswer(index);
    setShowResult(true);

    const isCorrect = practiceOptions[index] === practiceWords[practiceQIndex].meaning;
    if (isCorrect) {
      setCorrectCount((c) => c + 1);
      updateStars(1);
      addCorrect('english');
    }
    addAttempt('english');
  };

  const handleNextPractice = () => {
    if (practiceQIndex < practiceWords.length - 1) {
      const nextIdx = practiceQIndex + 1;
      setPracticeQIndex(nextIdx);
      setSelectedAnswer(null);
      setShowResult(false);
      generatePracticeOptions(practiceWords[nextIdx]);
    } else {
      setPracticeDone(true);
    }
  };

  const currentPracticeWord = practiceWords[practiceQIndex];
  const correctPracticeIndex = currentPracticeWord ? practiceOptions.indexOf(currentPracticeWord.meaning) : -1;

  const renderLearnMode = () => (
    <>
      <View className={styles.learnCard}>
        <View className={styles.learnPlayArea} onClick={() => playWordAudio(currentWord.word)}>
          <View className={styles.learnEmoji}>
            <Text>{currentWord.emoji || currentWord.word}</Text>
          </View>
          <Text className={styles.learnWord}>🔊 {currentWord.word}</Text>
          <Text className={styles.learnHint}>点击上面卡片，听听单词怎么读</Text>
        </View>
        <Text className={styles.learnMeaning}>{currentWord.meaning}</Text>
        <Text className={styles.learnCategory}>{currentWord.category}</Text>

        <View className={styles.navButtons}>
          <View
            className={`${styles.navBtn} ${styles.navBtnSecondary}`}
            onClick={() => setCurrentIndex(Math.max(0, currentIndex - 1))}
          >
            <Text className={styles.navBtnText}>上一个</Text>
          </View>
          <View
            className={styles.navBtn}
            onClick={() => setCurrentIndex(Math.min(englishWordList.length - 1, currentIndex + 1))}
          >
            <Text className={styles.navBtnText}>下一个</Text>
          </View>
        </View>
      </View>
      <Text style={{ textAlign: 'center', fontSize: '22rpx', color: '#90A4AE', marginBottom: '32rpx', display: 'block' }}>
        第 {currentIndex + 1}/{englishWordList.length} 个单词
      </Text>
    </>
  );

  const renderPracticeMode = () => {
    if (practiceDone) {
      const accuracy = Math.round((correctCount / practiceWords.length) * 100);
      return (
        <View className={styles.practiceArea}>
          <Text className={styles.practiceQuestion}>练习完成！</Text>
          <Text style={{ textAlign: 'center', fontSize: '28rpx', color: '#607D8B', marginTop: '16rpx', display: 'block' }}>
            答对 {correctCount}/{practiceWords.length} 题 · 正确率 {accuracy}%
          </Text>
          <View className={styles.navButtons} style={{ marginTop: '32rpx' }}>
            <View className={styles.navBtn} onClick={startPractice}>
              <Text className={styles.navBtnText}>再来一次</Text>
            </View>
            <View className={`${styles.navBtn} ${styles.navBtnSecondary}`} onClick={() => setMode('learn')}>
              <Text className={styles.navBtnText}>返回学习</Text>
            </View>
          </View>
        </View>
      );
    }

    if (!currentPracticeWord) return null;

    return (
      <View className={styles.practiceArea}>
        <View className={styles.practiceEmoji} onClick={() => playWordAudio(currentPracticeWord.word)}>
          <Text>{currentPracticeWord.emoji || currentPracticeWord.word}</Text>
        </View>
        <Text className={styles.practiceQuestion} onClick={() => playWordAudio(currentPracticeWord.word)}>
          请选出「{currentPracticeWord.word}」的中文意思 🔊
        </Text>

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
                  {practiceQIndex < practiceWords.length - 1 ? '下一题' : '查看结果'}
                </Text>
              </View>
            </View>
          </>
        )}
        <Text className={styles.scoreText}>
          第 {practiceQIndex + 1}/{practiceWords.length} 题 · 正确 {correctCount} 题
        </Text>
      </View>
    );
  };

  return (
    <View className={styles.container}>
      <View className={styles.modeSwitch}>
        <View
          className={`${styles.modeBtn} ${mode === 'learn' ? styles.modeBtnActive : ''}`}
          onClick={() => setMode('learn')}
        >
          <Text>学习模式</Text>
        </View>
        <View
          className={`${styles.modeBtn} ${mode === 'practice' ? styles.modeBtnActive : ''}`}
          onClick={() => { setMode('practice'); startPractice(); }}
        >
          <Text>练习模式</Text>
        </View>
      </View>

      {mode === 'learn' ? renderLearnMode() : renderPracticeMode()}
    </View>
  );
};

export default EnglishStudyPage;