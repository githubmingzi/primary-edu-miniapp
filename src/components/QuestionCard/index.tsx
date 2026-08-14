import React from 'react';
import { View, Text, Image } from '@tarojs/components';
import styles from './index.module.scss';

interface QuestionCardProps {
  questionText: string;
  imageUrl?: string;
  options: string[];
  onSelect: (index: number) => void;
  selectedIndex?: number;
  correctIndex?: number;
  disabled?: boolean;
}

const QuestionCard: React.FC<QuestionCardProps> = ({
  questionText,
  imageUrl,
  options,
  onSelect,
  selectedIndex,
  correctIndex,
  disabled = false,
}) => {
  const getOptionClass = (index: number) => {
    const classes = [styles.option];
    if (selectedIndex === index) {
      if (correctIndex !== undefined) {
        classes.push(index === correctIndex ? styles.correct : styles.wrong);
      } else {
        classes.push(styles.selected);
      }
    } else if (correctIndex !== undefined && index === correctIndex && selectedIndex !== undefined) {
      classes.push(styles.correct);
    }
    return classes.join(' ');
  };

  return (
    <View className={styles.card}>
      <View className={styles.questionArea}>
        {imageUrl && (
          <Image className={styles.questionImage} src={imageUrl} mode="aspectFill" />
        )}
        <Text className={styles.questionText}>{questionText}</Text>
      </View>
      <View className={styles.optionsArea}>
        {options.map((option, index) => (
          <View
            key={index}
            className={getOptionClass(index)}
            onClick={() => !disabled && onSelect(index)}
          >
            <View className={styles.optionMarker}>
              <Text className={styles.markerText}>{String.fromCharCode(65 + index)}</Text>
            </View>
            <Text className={styles.optionText}>{option}</Text>
          </View>
        ))}
      </View>
    </View>
  );
};

export default QuestionCard;