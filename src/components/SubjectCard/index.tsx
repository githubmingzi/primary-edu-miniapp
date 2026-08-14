import React from 'react';
import { View, Text } from '@tarojs/components';
import styles from './index.module.scss';

interface SubjectCardProps {
  title: string;
  subtitle: string;
  icon: string;
  bgColor: string;
  progress: number;
  onClick: () => void;
}

const SubjectCard: React.FC<SubjectCardProps> = ({
  title,
  subtitle,
  icon,
  bgColor,
  progress,
  onClick,
}) => {
  return (
    <View className={styles.card} style={{ background: bgColor }} onClick={onClick}>
      <View className={styles.iconWrap}>
        <Text className={styles.icon}>{icon}</Text>
      </View>
      <View className={styles.info}>
        <Text className={styles.title}>{title}</Text>
        <Text className={styles.subtitle}>{subtitle}</Text>
        <View className={styles.progressWrap}>
          <View className={styles.progressTrack}>
            <View className={styles.progressBar} style={{ width: `${progress}%` }} />
          </View>
          <Text className={styles.progressText}>{progress}%</Text>
        </View>
      </View>
    </View>
  );
};

export default SubjectCard;