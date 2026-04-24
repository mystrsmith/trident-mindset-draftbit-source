import React, { useState, useEffect } from 'react';
import { View, StyleSheet } from 'react-native';
import * as CoinReveal from './CoinReveal';
import * as GlobalVariables from '../config/GlobalVariableContext';
import calculateTacticProgress from '../global-functions/calculateTacticProgress';

const Index = () => {
  const allTactics = GlobalVariables.useValues().all_tactics;
  const [previousPercentages, setPreviousPercentages] = useState({});
  const [refreshKey, setRefreshKey] = useState(0);

  useEffect(() => {
    const initialPercentages = {};
    allTactics.forEach(tactic => {
      initialPercentages[tactic.id] = calculateTacticProgress(tactic);
    });
    setPreviousPercentages(initialPercentages);
  }, [allTactics]);

  useEffect(() => {
    setRefreshKey(prevKey => prevKey + 1);
  }, [allTactics]);

  const renderPyramid = () => {
    const levels = [1, 3, 4, 5];
    let items = [];
    let itemIndex = 0;
    for (let i = 0; i < levels.length && itemIndex < allTactics.length; i++) {
      const itemsInLevel = Math.min(levels[i], allTactics.length - itemIndex);
      items.push(
        <View key={i} style={[styles.level, { marginBottom: 10 + i * 5 }]}>
          {[...Array(itemsInLevel)].map((_, index) => {
            const item = allTactics[itemIndex + index];
            const photoUrl = item.photo.url;
            let percentage = calculateTacticProgress(item);
            if (percentage === 0) {
              percentage = 0.01;
            }
            return (
              <View
                key={index}
                style={[{ marginHorizontal: 5 + (levels.length - i) * 2 }]}
              >
                <CoinReveal.Index
                  initialPercentage={previousPercentages[item.id] || 0.01}
                  percentage={percentage}
                  size={55}
                  imageUrl={photoUrl}
                />
              </View>
            );
          })}
        </View>
      );
      itemIndex += itemsInLevel;
    }

    return items;
  };

  return (
    <View style={styles.pyramid} key={refreshKey}>
      {renderPyramid()}
    </View>
  );
};

const styles = StyleSheet.create({
  pyramid: {
    alignItems: 'center',
    paddingTop: 20,
  },
  level: {
    flexDirection: 'row',
    justifyContent: 'center',
  },
});

export { Index };
