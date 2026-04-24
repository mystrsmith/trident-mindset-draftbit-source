import React, { useState, useMemo, useCallback } from 'react';
import {
  View,
  StyleSheet,
  TouchableOpacity,
  Text,
  Dimensions,
} from 'react-native';
import {
  VictoryChart,
  VictoryAxis,
  VictoryContainer,
  VictoryLabel,
  VictoryArea,
} from 'victory-native';

const screenWidth = Dimensions.get('window').width;

// Move chart styles outside component to prevent recreating on each render
const chartStyles = {
  axis: {
    axis: { stroke: 'white' },
    tickLabels: { fill: 'white' },
  },
  area: {
    data: {
      fill: 'rgb(1, 119, 217)',
      fillOpacity: 0.25,
      stroke: 'rgb(1, 119, 217)',
      strokeWidth: 2,
    },
  },
};

// Memoized Button component
const IntervalButton = React.memo(({ interval, isSelected, onPress }) => (
  <TouchableOpacity
    style={[
      styles.button,
      { backgroundColor: isSelected ? 'rgb(1, 119, 217)' : 'transparent' },
    ]}
    onPress={() => onPress(interval)}
  >
    <Text style={styles.buttonText}>{interval}</Text>
  </TouchableOpacity>
));

// Memoized Chart component
const Chart = React.memo(({ data, selectedInterval }) => {
  const { series, chartDomain, xAxisProps } = useMemo(() => {
    const aggregated = aggregateDataByDay(data, selectedInterval);
    return expandSinglePointSeriesForArea(aggregated);
  }, [data, selectedInterval]);

  if (data.length === 0) {
    return (
      <VictoryContainer height={240} width={300}>
        <VictoryLabel
          x={150}
          y={130}
          textAnchor="middle"
          style={{ fill: 'white' }}
          text="No data available for selected interval"
        />
      </VictoryContainer>
    );
  }

  const domain =
    chartDomain != null ? { x: chartDomain, y: [0, 100] } : { y: [0, 100] };

  // Horizontal domainPadding insets the series (blank strips left/right of the
  // first/last points). Only pad vertically so line/area uses the plot width.
  return (
    <VictoryChart
      containerComponent={<VictoryContainer />}
      width={screenWidth * 0.88}
      height={240}
      domain={domain}
      domainPadding={{ y: 8 }}
      scale={{ x: 'linear' }}
    >
      <VictoryAxis style={chartStyles.axis} {...xAxisProps} />
      <VictoryAxis dependentAxis style={chartStyles.axis} />
      <VictoryArea data={series} style={chartStyles.area} />
    </VictoryChart>
  );
});

const Index = ({ inputData = [] }) => {
  const [selectedInterval, setSelectedInterval] = useState('All-Time');

  // Memoize data generation
  const data = useMemo(
    () => generateDataForInterval(selectedInterval, inputData),
    [selectedInterval, inputData]
  );

  // Memoize callback
  const handleButtonClick = useCallback(interval => {
    setSelectedInterval(interval);
  }, []);

  return (
    <View style={styles.container}>
      <Chart data={data} selectedInterval={selectedInterval} />
      <View style={styles.buttonWrapper}>
        {['All-Time', 'Year', 'Month', 'Week'].map(interval => (
          <IntervalButton
            key={interval}
            interval={interval}
            isSelected={interval === selectedInterval}
            onPress={handleButtonClick}
          />
        ))}
      </View>
    </View>
  );
};

// Move helper functions outside component
const generateDataForInterval = (interval, inputData) => {
  const now = new Date();
  let filteredData = [];

  switch (interval) {
    case 'Week': {
      const oneWeekAgo = new Date(now.getTime() - 7 * 24 * 60 * 60 * 1000);
      filteredData = inputData.filter(item => {
        const itemDate = new Date(item.created_at);
        return itemDate >= oneWeekAgo && itemDate <= now;
      });
      break;
    }
    case 'Month': {
      const oneMonthAgo = new Date(
        now.getFullYear(),
        now.getMonth() - 1,
        now.getDate()
      );
      filteredData = inputData.filter(item => {
        const itemDate = new Date(item.created_at);
        return itemDate >= oneMonthAgo && itemDate <= now;
      });
      break;
    }
    case 'Year': {
      const oneYearAgo = new Date(
        now.getFullYear() - 1,
        now.getMonth(),
        now.getDate()
      );
      filteredData = inputData.filter(item => {
        const itemDate = new Date(item.created_at);
        return itemDate >= oneYearAgo && itemDate <= now;
      });
      break;
    }
    case 'All-Time':
    default:
      filteredData = inputData;
      break;
  }

  return filteredData
    .map(item => ({
      x: new Date(item.created_at),
      y: item.rating,
    }))
    .sort((a, b) => a.x - b.x);
};

const aggregateDataByDay = (data, interval) => {
  const aggregatedData = data.reduce((acc, { x, y }) => {
    let label;

    switch (interval) {
      case 'Week':
        label = x.toLocaleString('en-US', { weekday: 'short' });
        break;
      case 'Month':
        label = x.getDate().toString();
        break;
      case 'Year':
        label = x.toLocaleString('en-US', { month: 'short' });
        break;
      case 'All-Time':
        label = x.getFullYear().toString();
        break;
      default:
        label = x.toLocaleString('en-US', { month: 'short', day: 'numeric' });
        break;
    }

    if (!acc[label]) {
      acc[label] = { x: label, y: Math.abs(y), count: 1 };
    } else {
      acc[label].y += Math.abs(y);
      acc[label].count += 1;
    }

    return acc;
  }, {});

  return Object.values(aggregatedData).map(({ x, y, count }) => ({
    x,
    y: y / count, // Calculate the average value
  }));
};

/**
 * Victory's default single-point x domain uses ~1e-10 padding, so the area
 * collapses to invisible width. Use two points and/or an explicit domain so
 * one sample still renders.
 */
const expandSinglePointSeriesForArea = aggregated => {
  if (aggregated.length !== 1) {
    return {
      series: aggregated,
      chartDomain: undefined,
      xAxisProps: {},
    };
  }

  const point = aggregated[0];
  const y = point.y;
  const rawX = point.x;
  const xNum = typeof rawX === 'number' ? rawX : Number(rawX);

  if (Number.isFinite(xNum)) {
    const pad = Math.max(Math.abs(xNum) * 0.15, 1);
    return {
      series: [
        { x: xNum - pad, y },
        { x: xNum + pad, y },
      ],
      chartDomain: undefined,
      xAxisProps: {
        tickValues: [xNum],
        tickFormat: [String(rawX)],
      },
    };
  }

  // Map label to [0, 1] so the segment spans the full x domain (not ~2/3 when
  // domain was [-0.25, 1.25] vs data 0..1).
  return {
    series: [
      { x: 0, y },
      { x: 1, y },
    ],
    chartDomain: [0, 1],
    xAxisProps: {
      tickValues: [0.5],
      tickFormat: [String(rawX)],
    },
  };
};

const styles = StyleSheet.create({
  container: {
    justifyContent: 'center',
    alignItems: 'center',
  },
  buttonWrapper: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
  },
  button: {
    paddingHorizontal: 10,
    paddingVertical: 5,
    justifyContent: 'center',
    alignItems: 'center',
    borderRadius: 5,
    marginHorizontal: 5,
  },
  buttonText: {
    color: 'white',
    fontSize: 11,
  },
});

export { Index };
