import React, { useEffect } from 'react';
import { View, Text } from '@tarojs/components';
import { useStore } from '@/store/useStore';
import MedalCard from '@/components/MedalCard';
import styles from './index.module.scss';

const AchievementsPage: React.FC = () => {
  const { userData, medals, loadFromStorage } = useStore();
  const { stars, dailyProgress, subjectProgress, consecutiveDays } = userData;

  useEffect(() => {
    loadFromStorage();
  }, []);

  // 生成最近7天的打卡数据
  const getWeekDays = () => {
    const days: { day: number; active: boolean; isToday: boolean }[] = [];
    const now = new Date();
    for (let i = 6; i >= 0; i--) {
      const d = new Date(now);
      d.setDate(d.getDate() - i);
      days.push({
        day: d.getDate(),
        active: i === 0 ? dailyProgress.totalCorrect > 0 : false,
        isToday: i === 0,
      });
    }
    return days;
  };

  const totalCorrect = subjectProgress.chinese.totalCorrect + subjectProgress.math.totalCorrect + subjectProgress.english.totalCorrect;
  const totalAttempts = subjectProgress.chinese.totalAttempts + subjectProgress.math.totalAttempts + subjectProgress.english.totalAttempts;
  const accuracy = totalAttempts > 0 ? Math.round((totalCorrect / totalAttempts) * 100) : 0;

  return (
    <View className={styles.container}>
      <View className={styles.statsCard}>
        <View className={styles.statsRow}>
          <View className={styles.statItem}>
            <Text className={styles.statValue}>{stars}</Text>
            <Text className={styles.statLabel}>⭐ 星星</Text>
          </View>
          <View className={styles.statItem}>
            <Text className={styles.statValue}>{totalCorrect}</Text>
            <Text className={styles.statLabel}>✅ 答对</Text>
          </View>
          <View className={styles.statItem}>
            <Text className={styles.statValue}>{accuracy}%</Text>
            <Text className={styles.statLabel}>📊 正确率</Text>
          </View>
          <View className={styles.statItem}>
            <Text className={styles.statValue}>{consecutiveDays}</Text>
            <Text className={styles.statLabel}>📅 连续天数</Text>
          </View>
        </View>

        <View className={styles.calendarSection}>
          <Text className={styles.calendarTitle}>本周打卡</Text>
          <View className={styles.calendarGrid}>
            {['一', '二', '三', '四', '五', '六', '日'].map((dayName) => (
              <View key={dayName} className={styles.calendarDay} style={{ fontSize: '20rpx', color: '#B0BEC5' }}>
                {dayName}
              </View>
            ))}
            {getWeekDays().map((d, i) => (
              <View
                key={i}
                className={`${styles.calendarDay} ${d.active ? styles.calendarDayActive : ''} ${d.isToday && !d.active ? styles.calendarDayToday : ''}`}
              >
                <Text>{d.day}</Text>
              </View>
            ))}
          </View>
        </View>
      </View>

      <View className={styles.medalsSection}>
        <Text className={styles.sectionTitle}>🏅 勋章馆</Text>
        <View className={styles.medalsGrid}>
          {medals.map((medal) => (
            <MedalCard
              key={medal.id}
              name={medal.name}
              description={medal.description}
              icon={medal.icon}
              unlocked={medal.unlocked}
            />
          ))}
        </View>
      </View>
    </View>
  );
};

export default AchievementsPage;