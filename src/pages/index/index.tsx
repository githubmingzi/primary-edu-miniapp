import React, { useEffect } from 'react';
import { View, Text } from '@tarojs/components';
import Taro from '@tarojs/taro';
import { useStore } from '@/store/useStore';
import { characterList } from '@/data/characters';
import { englishWordList } from '@/data/englishWords';
import { mathQuestions } from '@/data/mathQuestions';
import { scienceKnowledgeList } from '@/data/scienceKnowledge';
import SubjectCard from '@/components/SubjectCard';
import StarCounter from '@/components/StarCounter';
import ProgressBar from '@/components/ProgressBar';
import styles from './index.module.scss';

const IndexPage: React.FC = () => {
  const { userData, loadFromStorage } = useStore();
  const { stars, dailyProgress } = userData;

  useEffect(() => {
    loadFromStorage();
  }, []);

  // 计算各学科进度
  const chineseChars = characterList.length;
  const chineseDone = userData.subjectProgress.chinese.characterProgress.length;
  const chineseProgress = Math.round((chineseDone / Math.max(chineseChars, 1)) * 100);

  const mathTotal = mathQuestions.length;
  const mathDone = userData.subjectProgress.math.totalCorrect;
  const mathProgress = Math.round((mathDone / Math.max(mathTotal, 1)) * 100);

  const englishTotal = englishWordList.length;
  const englishDone = userData.subjectProgress.english.wordProgress.length;
  const englishProgress = Math.round((englishDone / Math.max(englishTotal, 1)) * 100);

  const scienceTotal = scienceKnowledgeList.length;
  const scienceDone = userData.subjectProgress.science.knowledgeProgress.length;
  const scienceProgress = Math.round((scienceDone / Math.max(scienceTotal, 1)) * 100);

  const handleNavigate = (url: string) => {
    Taro.navigateTo({ url });
  };

  const getGreeting = () => {
    const hour = new Date().getHours();
    if (hour < 12) return '早上好';
    if (hour < 18) return '下午好';
    return '晚上好';
  };

  return (
    <View className={styles.container}>
      <View className={styles.header}>
        <View className={styles.headerLeft}>
          <Text className={styles.greeting}>{getGreeting()}，二年级小朋友！</Text>
          <Text className={styles.title}>今天想学什么？</Text>
        </View>
        <View className={styles.headerRight}>
          <StarCounter count={stars} />
        </View>
      </View>

      <View className={styles.progressCard}>
        <View className={styles.progressHeader}>
          <Text className={styles.progressTitle}>今日学习进度</Text>
          <Text className={styles.progressStats}>
            已完成 {dailyProgress.chineseCompleted + dailyProgress.mathCompleted + dailyProgress.englishCompleted + dailyProgress.scienceCompleted} 题
          </Text>
        </View>
        <View className={styles.progressItems}>
          <View className={styles.progressItem}>
            <Text className={styles.progressSubjectIcon}>📖</Text>
            <View className={styles.progressSubjectInfo}>
              <Text className={styles.progressSubjectName}>汉语</Text>
              <ProgressBar current={dailyProgress.chineseCompleted} total={10} />
            </View>
          </View>
          <View className={styles.progressItem}>
            <Text className={styles.progressSubjectIcon}>🔢</Text>
            <View className={styles.progressSubjectInfo}>
              <Text className={styles.progressSubjectName}>数学</Text>
              <ProgressBar current={dailyProgress.mathCompleted} total={10} />
            </View>
          </View>
          <View className={styles.progressItem}>
            <Text className={styles.progressSubjectIcon}>🔤</Text>
            <View className={styles.progressSubjectInfo}>
              <Text className={styles.progressSubjectName}>英语</Text>
              <ProgressBar current={dailyProgress.englishCompleted} total={10} />
            </View>
          </View>
          <View className={styles.progressItem}>
            <Text className={styles.progressSubjectIcon}>🔬</Text>
            <View className={styles.progressSubjectInfo}>
              <Text className={styles.progressSubjectName}>科学</Text>
              <ProgressBar current={dailyProgress.scienceCompleted} total={10} />
            </View>
          </View>
        </View>
      </View>

      <Text className={styles.sectionTitle}>选择学科</Text>
      <View className={styles.subjectList}>
        <SubjectCard
          title="汉语学习"
          subtitle="课文生字 · 古诗 · 拼音"
          icon="📖"
          bgColor="linear-gradient(135deg, #F8BBD0, #F48FB1)"
          progress={chineseProgress}
          onClick={() => handleNavigate('/pages/chinese/index')}
        />
        <SubjectCard
          title="数学学习"
          subtitle="乘法口诀 · 加减法 · 时间"
          icon="🔢"
          bgColor="linear-gradient(135deg, #BBDEFB, #64B5F6)"
          progress={mathProgress}
          onClick={() => handleNavigate('/pages/math/index')}
        />
        <SubjectCard
          title="英语学习"
          subtitle="单词 · 看图学词"
          icon="🔤"
          bgColor="linear-gradient(135deg, #C8E6C9, #81C784)"
          progress={englishProgress}
          onClick={() => handleNavigate('/pages/english/index')}
        />
        <SubjectCard
          title="科学学习"
          subtitle="知识卡 · 小测验"
          icon="🔬"
          bgColor="linear-gradient(135deg, #B2DFDB, #4DB6AC)"
          progress={scienceProgress}
          onClick={() => handleNavigate('/pages/science/index')}
        />
      </View>

      <View className={styles.quickActions}>
        <View className={styles.quickAction} onClick={() => handleNavigate('/pages/pinyin/index')}>
          <Text className={styles.quickActionIcon}>🔤</Text>
          <Text className={styles.quickActionText}>拼音</Text>
        </View>
        <View className={styles.quickAction} onClick={() => handleNavigate('/pages/mathPractice/index')}>
          <Text className={styles.quickActionIcon}>🧮</Text>
          <Text className={styles.quickActionText}>口算</Text>
        </View>
        <View className={styles.quickAction} onClick={() => handleNavigate('/pages/science/index')}>
          <Text className={styles.quickActionIcon}>🔬</Text>
          <Text className={styles.quickActionText}>科学</Text>
        </View>
        <View className={styles.quickAction} onClick={() => handleNavigate('/pages/englishStudy/index')}>
          <Text className={styles.quickActionIcon}>📝</Text>
          <Text className={styles.quickActionText}>单词</Text>
        </View>
        <View className={styles.quickAction} onClick={() => handleNavigate('/pages/achievements/index')}>
          <Text className={styles.quickActionIcon}>🏆</Text>
          <Text className={styles.quickActionText}>成就</Text>
        </View>
      </View>
    </View>
  );
};

export default IndexPage;