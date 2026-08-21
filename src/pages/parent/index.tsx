import React, { useEffect } from 'react';
import { View, Text } from '@tarojs/components';
import Taro from '@tarojs/taro';
import { useStore } from '@/store/useStore';
import styles from './index.module.scss';

const ParentPage: React.FC = () => {
  const { settings, userData, updateSettings, loadFromStorage, saveToStorage } = useStore();

  useEffect(() => {
    loadFromStorage();
  }, []);

  const handleTimeLimitChange = (delta: number) => {
    const newVal = Math.max(15, Math.min(60, settings.dailyTimeLimit + delta));
    updateSettings({ dailyTimeLimit: newVal });
    saveToStorage();
  };

  const handleMathTimeChange = (delta: number) => {
    const newVal = Math.max(10, Math.min(60, settings.mathTimeLimit + delta));
    updateSettings({ mathTimeLimit: newVal });
    saveToStorage();
  };

  const toggleSound = () => {
    updateSettings({ soundEnabled: !settings.soundEnabled });
    saveToStorage();
  };

  const handleResetData = () => {
    Taro.showModal({
      title: '确认重置',
      content: '确定要重置所有学习数据吗？此操作不可恢复。',
      success: (res) => {
        if (res.confirm) {
          Taro.clearStorageSync();
          Taro.showToast({ title: '已重置', icon: 'success' });
          setTimeout(() => {
            Taro.reLaunch({ url: '/pages/index/index' });
          }, 1000);
        }
      },
    });
  };

  const totalCorrect = userData.subjectProgress.chinese.totalCorrect +
    userData.subjectProgress.math.totalCorrect +
    userData.subjectProgress.english.totalCorrect +
    userData.subjectProgress.science.totalCorrect;
  const totalAttempts = userData.subjectProgress.chinese.totalAttempts +
    userData.subjectProgress.math.totalAttempts +
    userData.subjectProgress.english.totalAttempts +
    userData.subjectProgress.science.totalAttempts;
  const accuracy = totalAttempts > 0 ? Math.round((totalCorrect / totalAttempts) * 100) : 0;

  return (
    <View className={styles.container}>
      <View className={styles.header}>
        <Text className={styles.headerTitle}>👨‍👩‍👧 家长中心</Text>
        <Text className={styles.headerDesc}>管理学习设置，查看学习报告</Text>
      </View>

      <View className={styles.configCard}>
        <Text className={styles.configTitle}>⏱ 学习时长限制</Text>
        <View className={styles.configItem}>
          <Text className={styles.configLabel}>每日最大学习时长</Text>
          <View className={styles.configValue}>
            <View className={styles.configBtn} onClick={() => handleTimeLimitChange(-5)}>
              <Text>-</Text>
            </View>
            <Text className={styles.configValueText}>{settings.dailyTimeLimit}</Text>
            <Text style={{ fontSize: '22rpx', color: '#90A4AE' }}>分钟</Text>
            <View className={styles.configBtn} onClick={() => handleTimeLimitChange(5)}>
              <Text>+</Text>
            </View>
          </View>
        </View>
        <View className={styles.configItem}>
          <Text className={styles.configLabel}>每题限时</Text>
          <View className={styles.configValue}>
            <View className={styles.configBtn} onClick={() => handleMathTimeChange(-5)}>
              <Text>-</Text>
            </View>
            <Text className={styles.configValueText}>{settings.mathTimeLimit}</Text>
            <Text style={{ fontSize: '22rpx', color: '#90A4AE' }}>秒</Text>
            <View className={styles.configBtn} onClick={() => handleMathTimeChange(5)}>
              <Text>+</Text>
            </View>
          </View>
        </View>
        <View className={styles.configItem}>
          <Text className={styles.configLabel}>声音反馈</Text>
          <View
            className={`${styles.toggle} ${settings.soundEnabled ? styles.toggleActive : ''}`}
            onClick={toggleSound}
          >
            <View className={styles.toggleDot} />
          </View>
        </View>
      </View>

      <View className={styles.infoCard}>
        <Text className={styles.infoTitle}>📊 学习概况</Text>
        <Text className={styles.infoText}>
          累计答题：{totalAttempts} 题{'\n'}
          答对：{totalCorrect} 题{'\n'}
          正确率：{accuracy}%{'\n'}
          获得星星：{userData.stars} ⭐{'\n'}
          已解锁勋章：{userData.medals.length} 枚
        </Text>
      </View>

      <View className={styles.dangerBtn} onClick={handleResetData}>
        <Text className={styles.dangerBtnText}>重置所有学习数据</Text>
      </View>
    </View>
  );
};

export default ParentPage;