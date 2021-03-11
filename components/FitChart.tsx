import React from "react";
import { View, Dimensions, Text } from "react-native";
import { BarChart } from "react-native-chart-kit";

interface FitDataSets {
  data: number[];
}

interface FitChartData {
  labels: string[];
  datasets: FitDataSets[];
}

interface FitChartProps {
  data: FitChartData;
  title: string;
  description?: string;
  propsForBackgroundLines: number;
}

const FitChart = (props: FitChartProps) => {
  const { data, title, description, propsForBackgroundLines } = props;
  
  return (
    <View style={{ flex: 1}}>
      <View style={{ paddingLeft: 20 }}>
        <Text
          style={{
            color: "#000000",
            fontSize: 20,
            fontWeight: "500",
            marginBottom: 5,
          }}
        >
          {title}
        </Text>
        {description && (
          <Text style={{ color: "#000000", fontSize: 15, marginBottom: 20 }}>
            {description}
          </Text>
        )}
      </View>
      <View>
        <BarChart
          style={{
            marginVertical: 8,
            borderRadius: 16,
          }}
          yAxisSuffix=""
          data={data}
          width={Dimensions.get("window").width}
          height={220}
          yAxisLabel=""
          chartConfig={{
            backgroundColor: "#ffffff",
            backgroundGradientFrom: "#ffffff",
            backgroundGradientTo: "#ffffff",
            fillShadowGradient: "#7262f8",
            fillShadowGradientOpacity: 1,
            color: (opacity = 1) => `rgba(${70}, ${71}, ${74}, ${opacity})`,
            labelColor: (opacity = 1) =>
              `rgba(${70}, ${71}, ${74}, ${opacity})`,
            style: {
              borderRadius: 16,
              right: 0,
              paddingRight: 64,
            },
            barPercentage: 0.5,
            decimalPlaces: 0,
            propsForBackgroundLines: {
              propsForBackgroundLines : 10000
              
            }
          }}
          showValuesOnTopOfBars = {true}
          showBarTops={false}
          fromZero
        />
      </View>
    </View>
  );
};

export default FitChart;