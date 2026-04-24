// custom-files/AdvanceProgramChart.js
import React from 'react';
import { View, StyleSheet, Dimensions } from 'react-native';
import {
  VictoryChart,
  VictoryAxis,
  VictoryContainer,
  VictoryBar,
  VictoryLabel,
} from 'victory-native';

const screenWidth = Dimensions.get('window').width;

const chartStyles = {
  axis: {
    axis: { stroke: 'white' },
    tickLabels: {
      fill: 'white',
      fontSize: 12,
      fontFamily: 'Poppins_500Medium',
    },
    grid: { stroke: 'transparent' },
  },
  bar: {
    data: {
      fill: 'rgb(1, 119, 217)',
      width: 25,
    },
  },
};

const formatDateRange = fromTimestamp => {
  const fromDate = new Date(fromTimestamp);
  const month = fromDate.toLocaleString('en-US', { month: 'short' });
  const weekNumber = Math.ceil(fromDate.getDate() / 7);
  return `${month}\nW${weekNumber}`;
};

const Chart = React.memo(({ data }) => {
  if (!data?.length) {
    return (
      <VictoryContainer height={240} width={300}>
        <VictoryLabel
          x={150}
          y={130}
          textAnchor="middle"
          style={{ fill: 'white' }}
          text="No data available"
        />
      </VictoryContainer>
    );
  }

  return (
    <VictoryChart
      containerComponent={<VictoryContainer />}
      width={screenWidth * 0.88}
      height={240}
      domainPadding={{ x: 40 }}
      padding={{ left: 50, bottom: 50, right: 20, top: 40 }}
    >
      <VictoryAxis
        dependentAxis
        style={chartStyles.axis}
        tickFormat={t => `${t}`}
      />

      <VictoryAxis
        style={chartStyles.axis}
        labelComponent={
          <VictoryLabel
            angle={0}
            textAnchor="middle"
            style={{
              fontSize: 20,
              fill: 'white',
              fontFamily: 'Rasa_500Medium',
            }}
          />
        }
      />

      <VictoryBar
        data={data}
        style={chartStyles.bar}
        alignment="middle"
        barWidth={25}
        labels={({ datum }) => datum.y + ' points'}
        labelComponent={
          <VictoryLabel
            dy={-10}
            style={{
              fontSize: 11,
              fill: 'white',
              fontWeight: 'bold',
              fontFamily: 'Poppins_500Medium',
            }}
          />
        }
      />
    </VictoryChart>
  );
});

const processData = inputData => {
  try {
    // Handle null/undefined input
    if (!inputData || !Array.isArray(inputData)) {
      return [];
    }

    // Filter out invalid items first
    const validData = inputData.filter(
      item =>
        item &&
        item.from &&
        !isNaN(new Date(item.from)) &&
        typeof item.week_points === 'number'
    );

    return [...validData]
      .sort((a, b) => new Date(b.from) - new Date(a.from)) // Sort descending
      .slice(0, 5) // Take last 5 weeks
      .sort((a, b) => new Date(a.from) - new Date(b.from)) // Sort ascending for display
      .map(item => ({
        x: formatDateRange(item.from),
        y: item.week_points || 0,
        weekName: item.name || '',
      }));
  } catch (error) {
    console.warn('Error processing chart data:', error);
    return [];
  }
};

const Index = ({ inputData = [] }) => {
  const data = React.useMemo(() => processData(inputData), [inputData]);

  return (
    <View style={styles.container}>
      <Chart data={data} />
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    justifyContent: 'center',
    alignItems: 'center',
    paddingBottom: 10,
  },
});

export { Index };
