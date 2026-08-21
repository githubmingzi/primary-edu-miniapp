import React, { useEffect } from 'react';
import { View, Text } from '@tarojs/components';
import Taro from '@tarojs/taro';
import { useStore } from '@/store/useStore';
import { shengmuList, yunmuList, zhengtiList } from '@/data/pinyin';
import { characterList } from '@/data/characters';
import ProgressBar from '@/components/ProgressBar';
import styles from './index.module.scss';

const ChinesePage: React.FC = () => {
  const { userData, loadFromStorage } = useStore();

  useEffect(() => {
    loadFromStorage();
  }, []);

  const totalPinyin = shengmuList.length + yunmuList.length + zhengtiList.length;
  const donePinyin = userData.subjectProgress.chinese.pinyinProgress.length;

  const totalChars = characterList.length;
  const doneChars = userData.subjectProgress.chinese.characterProgress.length;

  return (
    <View className={styles.container}>
      <View className={styles.header}>
        <Text className={styles.headerTitle}>📖 语文学习</Text>
        <Text className={styles.headerDesc}>二年级语文 · 郑州小学同步</Text>
      </View>

      <View className={styles.cardGrid}>
        <View className={styles.card} onClick={() => Taro.navigateTo({ url: '/pages/character/index' })}>
          <Text className={styles.cardIcon}>🀄</Text>
          <Text className={styles.cardTitle}>课文生字</Text>
          <Text className={styles.cardDesc}>二年级课文生字 · 组词 · 看图识字</Text>
          <View className={styles.cardProgress}>
            <ProgressBar current={doneChars} total={totalChars} />
          </View>
        </View>

        <View className={styles.card} onClick={() => Taro.navigateTo({ url: '/pages/poem/index' })}>
          <Text className={styles.cardIcon}>📜</Text>
          <Text className={styles.cardTitle}>古诗背诵</Text>
          <Text className={styles.cardDesc}>二年级必背古诗 · 背诵 + 测验</Text>
        </View>

        <View className={styles.card} onClick={() => Taro.navigateTo({ url: '/pages/pinyin/index' })}>
          <Text className={styles.cardIcon}>🔤</Text>
          <Text className={styles.cardTitle}>拼音复习</Text>
          <Text className={styles.cardDesc}>声母 · 韵母 · 整体认读音节</Text>
          <View className={styles.cardProgress}>
            <ProgressBar current={donePinyin} total={totalPinyin} />
          </View>
        </View>
      </View>
    </View>
  );
};

export default ChinesePage;
