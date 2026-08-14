import React, { useState } from 'react';
import { View, Text } from '@tarojs/components';
import Taro from '@tarojs/taro';
import { useStore } from '@/store/useStore';
import styles from './index.module.scss';

const MathPage: React.FC = () => {
  const [selectedLevel, setSelectedLevel] = useState<number>(1);
  const { userData } = useStore();

  const handleStartPractice = () => {
    Taro.navigateTo({
      url: `/pages/mathPractice/index?level=${selectedLevel}`,
    });
  };

  const handleMentalMath = () => {
    Taro.navigateTo({ url: '/pages/mentalMath/index' });
  };

  const levelInfo = [
    { level: 1, label: '⭐ 简单', desc: '10以内加减法' },
    { level: 2, label: '⭐⭐ 中等', desc: '20以内加减法' },
    { level: 3, label: '⭐⭐⭐ 较难', desc: '100以内加减法' },
  ];

  const totalCorrect = userData.subjectProgress.math.totalCorrect;
  const totalAttempts = userData.subjectProgress.math.totalAttempts;
  const accuracy = totalAttempts > 0 ? Math.round((totalCorrect / totalAttempts) * 100) : 0;

  return (
    <View className={styles.container}>
      <View className={styles.header}>
        <Text className={styles.headerTitle}>🔢 数学学习</Text>
        <Text className={styles.headerDesc}>加减法练习，培养计算能力</Text>
      </View>

      <View className={styles.cardGrid}>
        <View className={styles.card}>
          <Text className={styles.cardIcon}>🧮</Text>
          <Text className={styles.cardTitle}>加减法练习</Text>
          <Text className={styles.cardDesc}>选择难度，开始练习</Text>
          <Text className={styles.cardStats}>
            已答 {totalAttempts} 题 · 正确率 {accuracy}%
          </Text>
        </View>
      </View>

      <Text style={{ fontSize: '28rpx', fontWeight: '500', marginBottom: '16rpx', display: 'block' }}>选择难度</Text>
      <View className={styles.levelSelector}>
        {levelInfo.map((info) => (
          <View
            key={info.level}
            className={`${styles.levelBtn} ${selectedLevel === info.level ? styles.levelBtnActive : ''}`}
            onClick={() => setSelectedLevel(info.level)}
          >
            <Text>{info.label}</Text>
          </View>
        ))}
      </View>

      <View className={styles.startBtn} onClick={handleStartPractice}>
        <Text className={styles.startBtnText}>开始练习</Text>
      </View>

      <View className={styles.cardGrid} style={{ marginTop: '32rpx' }}>
        <View className={styles.card} onClick={handleMentalMath}>
          <Text className={styles.cardIcon}>⚡</Text>
          <Text className={styles.cardTitle}>心算挑战</Text>
          <Text className={styles.cardDesc}>限时1分钟，挑战你的计算速度</Text>
          {userData.subjectProgress.math.bestRecord > 0 && (
            <Text className={styles.cardStats}>最高纪录：{userData.subjectProgress.math.bestRecord} 题</Text>
          )}
        </View>
      </View>
    </View>
  );
};

export default MathPage;