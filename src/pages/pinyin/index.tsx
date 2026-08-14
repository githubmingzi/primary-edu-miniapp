import React, { useState, useEffect } from 'react';
import { View, Text, ScrollView } from '@tarojs/components';
import { useStore } from '@/store/useStore';
import { shengmuList, yunmuList, zhengtiList } from '@/data/pinyin';
import { PinyinItem } from '@/types';
import { shuffleArray, getRandomEncouragement } from '@/utils';
import styles from './index.module.scss';

type TabType = 'shengmu' | 'yunmu' | 'zhengti';
type ModeType = 'learn' | 'practice';

const PinyinPage: React.FC = () => {
  const [activeTab, setActiveTab] = useState<TabType>('shengmu');
  const [mode, setMode] = useState<ModeType>('learn');
  const { updateStars, addCorrect, addAttempt, loadFromStorage } = useStore();

  // 练习模式状态
  const [practicePinyin, setPracticePinyin] = useState<PinyinItem[]>([]);
  const [currentQIndex, setCurrentQIndex] = useState(0);
  const [practiceOptions, setPracticeOptions] = useState<string[]>([]);
  const [selectedAnswer, setSelectedAnswer] = useState<number | null>(null);
  const [showResult, setShowResult] = useState(false);
  const [correctCount, setCorrectCount] = useState(0);
  const [practiceDone, setPracticeDone] = useState(false);

  useEffect(() => {
    loadFromStorage();
  }, []);

  const getListByTab = (): PinyinItem[] => {
    switch (activeTab) {
      case 'shengmu': return shengmuList;
      case 'yunmu': return yunmuList;
      case 'zhengti': return zhengtiList;
    }
  };

  const startPractice = () => {
    const list = getListByTab();
    const shuffled = shuffleArray(list).slice(0, 10);
    setPracticePinyin(shuffled);
    setCurrentQIndex(0);
    setSelectedAnswer(null);
    setShowResult(false);
    setCorrectCount(0);
    setPracticeDone(false);
    generateOptions(shuffled[0]);
  };

  const generateOptions = (current: PinyinItem) => {
    const list = getListByTab();
    const others = list.filter((p) => p.id !== current.id);
    const wrong = shuffleArray(others).slice(0, 3);
    const opts = shuffleArray([current, ...wrong]).map((p) => p.pinyin);
    setPracticeOptions(opts);
  };

  const handleAnswer = (index: number) => {
    if (showResult) return;
    setSelectedAnswer(index);
    setShowResult(true);

    const isCorrect = practiceOptions[index] === practicePinyin[currentQIndex].pinyin;
    if (isCorrect) {
      setCorrectCount((c) => c + 1);
      updateStars(1);
      addCorrect('chinese');
    }
    addAttempt('chinese');
  };

  const handleNext = () => {
    if (currentQIndex < practicePinyin.length - 1) {
      const nextIndex = currentQIndex + 1;
      setCurrentQIndex(nextIndex);
      setSelectedAnswer(null);
      setShowResult(false);
      generateOptions(practicePinyin[nextIndex]);
    } else {
      setPracticeDone(true);
    }
  };

  const currentPinyin = practicePinyin[currentQIndex];
  const correctIndex = currentPinyin ? practiceOptions.indexOf(currentPinyin.pinyin) : -1;

  // 学习模式渲染
  const renderLearnMode = () => (
    <ScrollView scrollY style={{ maxHeight: 'calc(100vh - 400rpx)' }}>
      <View className={styles.cardGrid}>
        {getListByTab().map((item) => (
          <View key={item.id} className={styles.pinyinCard}>
            <Text className={styles.pinyinText}>{item.pinyin}</Text>
            <Text className={styles.pinyinExample}>{item.example}</Text>
          </View>
        ))}
      </View>
    </ScrollView>
  );

  // 练习模式渲染
  const renderPracticeMode = () => {
    if (practiceDone) {
      const accuracy = Math.round((correctCount / practicePinyin.length) * 100);
      return (
        <View className={styles.practiceArea}>
          <Text className={styles.practiceTitle}>练习完成！</Text>
          <Text className={styles.practiceTitle} style={{ fontSize: '28rpx', color: '#607D8B', marginBottom: '16rpx' }}>
            答对 {correctCount}/{practicePinyin.length} 题
          </Text>
          <Text className={styles.practiceTitle} style={{ fontSize: '28rpx', color: '#607D8B' }}>
            正确率 {accuracy}%
          </Text>
          <View className={styles.nextBtn} onClick={startPractice}>
            <Text className={styles.nextBtnText}>再来一次</Text>
          </View>
          <View className={styles.nextBtn} style={{ background: '#E0E0E0', marginTop: '16rpx' }} onClick={() => setMode('learn')}>
            <Text className={styles.nextBtnText} style={{ color: '#607D8B' }}>返回学习</Text>
          </View>
        </View>
      );
    }

    if (!currentPinyin) return null;

    return (
      <View className={styles.practiceArea}>
        <Text className={styles.practiceTitle}>
          请选出拼音：{currentPinyin.pinyin}
        </Text>
        <View className={styles.practiceOptions}>
          {practiceOptions.map((opt, index) => {
            let optionClass = styles.practiceOption;
            if (showResult) {
              if (index === correctIndex) optionClass += ` ${styles.optionCorrect}`;
              else if (index === selectedAnswer && index !== correctIndex) optionClass += ` ${styles.optionWrong}`;
            } else if (selectedAnswer === index) {
              optionClass += ` ${styles.optionSelected}`;
            }
            return (
              <View
                key={index}
                className={optionClass}
                onClick={() => handleAnswer(index)}
              >
                <Text>{opt}</Text>
              </View>
            );
          })}
        </View>
        {showResult && (
          <>
            <View className={`${styles.feedback} ${selectedAnswer === correctIndex ? styles.feedbackCorrect : styles.feedbackWrong}`}>
              <Text>{getRandomEncouragement(selectedAnswer === correctIndex)}</Text>
            </View>
            <View className={styles.nextBtn} onClick={handleNext}>
              <Text className={styles.nextBtnText}>
                {currentQIndex < practicePinyin.length - 1 ? '下一题' : '查看结果'}
              </Text>
            </View>
          </>
        )}
        <Text style={{ textAlign: 'center', display: 'block', marginTop: '16rpx', fontSize: '22rpx', color: '#90A4AE' }}>
          第 {currentQIndex + 1}/{practicePinyin.length} 题
        </Text>
      </View>
    );
  };

  return (
    <View className={styles.container}>
      <View className={styles.tabBar}>
        {[
          { key: 'shengmu', label: `声母(${shengmuList.length})` },
          { key: 'yunmu', label: `韵母(${yunmuList.length})` },
          { key: 'zhengti', label: `整体认读(${zhengtiList.length})` },
        ].map((tab) => (
          <View
            key={tab.key}
            className={`${styles.tab} ${activeTab === tab.key ? styles.tabActive : ''}`}
            onClick={() => { setActiveTab(tab.key as TabType); setPracticeDone(false); }}
          >
            <Text>{tab.label}</Text>
          </View>
        ))}
      </View>

      <View className={styles.modeSwitch}>
        <View
          className={`${styles.modeBtn} ${mode === 'learn' ? styles.modeBtnActive : ''}`}
          onClick={() => { setMode('learn'); setPracticeDone(false); }}
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

export default PinyinPage;