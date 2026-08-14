import React from 'react';
import { View, Text } from '@tarojs/components';
import styles from './index.module.scss';

interface StarCounterProps {
  count: number;
  size?: 'small' | 'medium' | 'large';
}

const StarCounter: React.FC<StarCounterProps> = ({ count, size = 'medium' }) => {
  const sizeClass = styles[size];
  return (
    <View className={`${styles.counter} ${sizeClass}`}>
      <Text className={styles.starIcon}>⭐</Text>
      <Text className={styles.count}>{count}</Text>
    </View>
  );
};

export default StarCounter;