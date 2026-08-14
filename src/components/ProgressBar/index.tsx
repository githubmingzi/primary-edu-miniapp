import React from 'react';
import { View, Text } from '@tarojs/components';
import styles from './index.module.scss';

interface ProgressBarProps {
  current: number;
  total: number;
  showLabel?: boolean;
}

const ProgressBar: React.FC<ProgressBarProps> = ({ current, total, showLabel = true }) => {
  const percent = total > 0 ? Math.min((current / total) * 100, 100) : 0;

  return (
    <View className={styles.wrapper}>
      <View className={styles.track}>
        <View className={styles.bar} style={{ width: `${percent}%` }} />
      </View>
      {showLabel && (
        <Text className={styles.label}>
          {current}/{total}
        </Text>
      )}
    </View>
  );
};

export default ProgressBar;