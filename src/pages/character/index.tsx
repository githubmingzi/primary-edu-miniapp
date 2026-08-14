import React, { useState } from 'react';
import { View, Text } from '@tarojs/components';
import { useStore } from '@/store/useStore';
import { characterList } from '@/data/characters';
import { CharacterItem } from '@/types';
import { shuffleArray, getRandomEncouragement } from '@/utils';
import styles from './index.module.scss';

type ModeType = 'learn' | 'practice';

const CharacterPage: React.FC = () => {
  const [mode, setMode] = useState<ModeType>('learn');
  const [currentIndex, setCurrentIndex] = useState(0);
  const { updateStars, addCorrect, addAttempt } = useStore();

  // 练习模式
  const [practiceChars, setPracticeChars] = useState<CharacterItem[]>([]);
  const [practiceQIndex, setPracticeQIndex] = useState(0);
  const [practiceOptions, setPracticeOptions] = useState<string[]>([]);
  const [selectedAnswer, setSelectedAnswer] = useState<number | null>(null);
  const [showResult, setShowResult] = useState(false);
  const [correctCount, setCorrectCount] = useState(0);
  const [practiceDone, setPracticeDone] = useState(false);

  const currentChar = characterList[currentIndex];

  const startPractice = () => {
    const shuffled = shuffleArray(characterList).slice(0, 10);
    setPracticeChars(shuffled);
    setPracticeQIndex(0);
    setSelectedAnswer(null);
    setShowResult(false);
    setCorrectCount(0);
    setPracticeDone(false);
    generatePracticeOptions(shuffled[0]);
  };

  const generatePracticeOptions = (current: CharacterItem) => {
    const others = characterList.filter((c) => c.id !== current.id);
    const wrong = shuffleArray(others).slice(0, 3).map((c) => c.character);
    const opts = shuffleArray([current.character, ...wrong]);
    setPracticeOptions(opts);
  };

  const handlePracticeAnswer = (index: number) => {
    if (showResult) return;
    setSelectedAnswer(index);
    setShowResult(true);

    const isCorrect = practiceOptions[index] === practiceChars[practiceQIndex].character;
    if (isCorrect) {
      setCorrectCount((c) => c + 1);
      updateStars(1);
      addCorrect('chinese');
    }
    addAttempt('chinese');
  };

  const handleNextPractice = () => {
    if (practiceQIndex < practiceChars.length - 1) {
      const nextIdx = practiceQIndex + 1;
      setPracticeQIndex(nextIdx);
      setSelectedAnswer(null);
      setShowResult(false);
      generatePracticeOptions(practiceChars[nextIdx]);
    } else {
      setPracticeDone(true);
    }
  };

  const currentPracticeChar = practiceChars[practiceQIndex];
  const correctPracticeIndex = currentPracticeChar ? practiceOptions.indexOf(currentPracticeChar.character) : -1;

  const renderLearnMode = () => (
    <>
      <View className={styles.learnCard}>
        <View className={styles.characterEmoji}>
          <Text>{currentChar.emoji || currentChar.character}</Text>
        </View>
        <Text className={styles.characterDisplay}>{currentChar.character}</Text>
        <Text className={styles.characterPinyin}>{currentChar.pinyin}</Text>
        <Text className={styles.characterMeaning}>{currentChar.meaning}</Text>
        <Text className={styles.characterGroup}>组词：{currentChar.groupWord}</Text>

        <View className={styles.navButtons}>
          <View
            className={`${styles.navBtn} ${styles.navBtnSecondary}`}
            onClick={() => setCurrentIndex(Math.max(0, currentIndex - 1))}
          >
            <Text className={styles.navBtnText}>上一个</Text>
          </View>
          <View
            className={styles.navBtn}
            onClick={() => setCurrentIndex(Math.min(characterList.length - 1, currentIndex + 1))}
          >
            <Text className={styles.navBtnText}>下一个</Text>
          </View>
        </View>
      </View>
      <Text style={{ textAlign: 'center', fontSize: '22rpx', color: '#90A4AE', marginBottom: '32rpx', display: 'block' }}>
        第 {currentIndex + 1}/{characterList.length} 个汉字
      </Text>
    </>
  );

  const renderPracticeMode = () => {
    if (practiceDone) {
      return (
        <View className={styles.practiceArea}>
          <View className={styles.practiceQuestion}>
            <Text className={styles.practiceText}>练习完成！</Text>
            <Text style={{ fontSize: '28rpx', color: '#607D8B', marginTop: '16rpx', display: 'block' }}>
              答对 {correctCount}/{practiceChars.length} 题
            </Text>
          </View>
          <View className={styles.navButtons}>
            <View className={styles.navBtn} onClick={startPractice}>
              <Text className={styles.navBtnText}>再来一次</Text>
            </View>
            <View
              className={`${styles.navBtn} ${styles.navBtnSecondary}`}
              onClick={() => setMode('learn')}
            >
              <Text className={styles.navBtnText}>返回学习</Text>
            </View>
          </View>
        </View>
      );
    }

    if (!currentPracticeChar) return null;

    return (
      <View className={styles.practiceArea}>
        <View className={styles.practiceQuestion}>
          <View className={styles.practiceEmoji}>
            <Text>{currentPracticeChar.emoji || currentPracticeChar.character}</Text>
          </View>
          <Text className={styles.practiceHint}>请选出正确的汉字</Text>
        </View>

        <View className={styles.practiceOptions}>
          {practiceOptions.map((opt, index) => {
            let optionClass = styles.practiceOption;
            if (showResult) {
              if (index === correctPracticeIndex) optionClass += ` ${styles.optionCorrect}`;
              else if (index === selectedAnswer && index !== correctPracticeIndex) optionClass += ` ${styles.optionWrong}`;
            }
            return (
              <View
                key={index}
                className={optionClass}
                onClick={() => handlePracticeAnswer(index)}
              >
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
                  {practiceQIndex < practiceChars.length - 1 ? '下一题' : '查看结果'}
                </Text>
              </View>
            </View>
          </>
        )}
        <Text className={styles.scoreText}>
          第 {practiceQIndex + 1}/{practiceChars.length} 题 · 正确 {correctCount} 题
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

export default CharacterPage;