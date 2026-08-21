import React, { useEffect } from 'react';
import { View, Text } from '@tarojs/components';
import Taro from '@tarojs/taro';
import { useStore } from '@/store/useStore';
import StarCounter from '@/components/StarCounter';
import styles from './index.module.scss';

const MinePage: React.FC = () => {
  const { userData, loadFromStorage } = useStore();

  useEffect(() => {
    loadFromStorage();
  }, []);

  const handleNavigate = (url: string) => {
    Taro.navigateTo({ url });
  };

  const menuItems = [
    {
      icon: '📊',
      title: '学习报告',
      subtitle: '查看学习统计和详细数据',
      onClick: () => Taro.showToast({ title: '功能开发中', icon: 'none' }),
    },
    {
      icon: '👨‍👩‍👧',
      title: '家长中心',
      subtitle: '学习时长设置、难度调整',
      onClick: () => handleNavigate('/pages/parent/index'),
    },
    {
      icon: '⭐',
      title: '星星积分',
      subtitle: `当前拥有 ${userData.stars} 颗星星`,
      onClick: () => Taro.showToast({ title: `${userData.stars} ⭐`, icon: 'none' }),
    },
    {
      icon: '🏅',
      title: '我的勋章',
      subtitle: `已获得 ${userData.medals.length} 枚勋章`,
      onClick: () => handleNavigate('/pages/achievements/index'),
    },
    {
      icon: '📅',
      title: '学习提醒',
      subtitle: '设置每日学习提醒',
      onClick: () => Taro.showToast({ title: '功能开发中', icon: 'none' }),
    },
  ];

  return (
    <View className={styles.container}>
      <View className={styles.profileCard}>
        <View className={styles.avatar}>🧒</View>
        <View className={styles.profileInfo}>
          <Text className={styles.profileName}>小学霸</Text>
          <Text className={styles.profileDesc}>二年级，今天也要加油哦！</Text>
        </View>
        <StarCounter count={userData.stars} />
      </View>

      <View className={styles.menuList}>
        {menuItems.map((item, index) => (
          <View key={index} className={styles.menuItem} onClick={item.onClick}>
            <Text className={styles.menuIcon}>{item.icon}</Text>
            <View className={styles.menuContent}>
              <Text className={styles.menuTitle}>{item.title}</Text>
              <Text className={styles.menuSubtitle}>{item.subtitle}</Text>
            </View>
            <Text className={styles.menuArrow}>›</Text>
          </View>
        ))}
      </View>
    </View>
  );
};

export default MinePage;