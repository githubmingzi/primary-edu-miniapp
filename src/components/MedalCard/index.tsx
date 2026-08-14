import React from 'react';
import { View, Text } from '@tarojs/components';
import classnames from 'classnames';
import styles from './index.module.scss';

interface MedalCardProps {
  name: string;
  description: string;
  icon: string;
  unlocked: boolean;
}

const MedalCard: React.FC<MedalCardProps> = ({ name, description, icon, unlocked }) => {
  return (
    <View className={classnames(styles.card, unlocked ? styles.unlocked : styles.locked)}>
      <View className={styles.iconWrap}>
        <Text className={styles.icon}>{icon}</Text>
      </View>
      <Text className={styles.name}>{name}</Text>
      <Text className={styles.desc}>{description}</Text>
      {!unlocked && <Text className={styles.lockIcon}>🔒</Text>}
    </View>
  );
};

export default MedalCard;