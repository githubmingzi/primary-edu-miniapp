import React, { useState } from 'react';
import { View, Text, ScrollView } from '@tarojs/components';
import Taro from '@tarojs/taro';
import { englishWordList } from '@/data/englishWords';
import { playWordAudio } from '@/utils';
import styles from './index.module.scss';

const EnglishPage: React.FC = () => {
  const [selectedCategory, setSelectedCategory] = useState<string>('全部');
  const categories = ['全部', '颜色', '动物', '水果', '身体', '数字', '家庭', '学校', '食物', '天气', '动作', '时间', '服饰', '文具', '星期', '月份', '自然', '职业'];

  const getCategoryIcon = (cat: string): string => {
    const icons: Record<string, string> = {
      '全部': '📚', '颜色': '🎨', '动物': '🐾', '水果': '🍎', '身体': '🧍', '数字': '🔢', '家庭': '👪', '学校': '🏫',
      '食物': '🍔', '天气': '🌤️', '动作': '🏃', '时间': '⏰', '服饰': '👕', '文具': '✏️', '星期': '📅', '月份': '📆',
      '自然': '🌳', '职业': '👨‍⚕️',
    };
    return icons[cat] || '📚';
  };

  const filteredWords = selectedCategory === '全部'
    ? englishWordList
    : englishWordList.filter((w) => w.category === selectedCategory);

  return (
    <View className={styles.container}>
      <View className={styles.header}>
        <Text className={styles.headerTitle}>🔤 英语学习</Text>
        <Text className={styles.headerDesc}>二年级英语启蒙 · 按主题分类学单词</Text>
      </View>

      <ScrollView scrollX className={styles.categoryScroll} enableFlex>
        <View className={styles.categoryGrid}>
          {categories.map((cat) => (
            <View
              key={cat}
              className={`${styles.categoryCard} ${selectedCategory === cat ? styles.categoryCardActive : ''}`}
              onClick={() => setSelectedCategory(cat)}
            >
              <Text className={styles.categoryIcon}>{getCategoryIcon(cat)}</Text>
              <Text className={styles.categoryName}>{cat}</Text>
              <Text className={styles.categoryCount}>
                {cat === '全部' ? englishWordList.length : englishWordList.filter((w) => w.category === cat).length} 词
              </Text>
            </View>
          ))}
        </View>
      </ScrollView>

      <ScrollView scrollY className={styles.scrollArea}>
        <View className={styles.wordList}>
          {filteredWords.map((word) => (
            <View
              key={word.id}
              className={styles.wordCard}
              onClick={() => {
                playWordAudio(word.word);
                Taro.showToast({ title: `${word.word}: ${word.meaning}`, icon: 'none' });
              }}
            >
              <View className={styles.wordEmoji}>
                <Text>{word.emoji || word.word}</Text>
              </View>
              <View className={styles.wordInfo}>
                <Text className={styles.wordText}>🔊 {word.word}</Text>
                <Text className={styles.wordMeaning}>{word.meaning}</Text>
                <Text className={styles.wordCategory}>分类：{word.category}</Text>
              </View>
            </View>
          ))}
        </View>
      </ScrollView>

      <View
        className={styles.practiceBtn}
        onClick={() => Taro.navigateTo({ url: '/pages/englishStudy/index' })}
      >
        <Text className={styles.practiceBtnText}>开始练习</Text>
      </View>
    </View>
  );
};

export default EnglishPage;