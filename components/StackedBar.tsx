import React from "react";
import { View, Dimensions, Text } from "react-native";
import { StackedBarChart } from "react-native-chart-kit";


interface StackedBarData {
  labels: string[];
  legend: string[];
  data: number[][];
  barColors: string[];
}

interface StackedBarChartProps {
  data: StackedBarData;
  title: string;
  description?: string;
  
}

const StackedBar = (props: StackedBarChartProps) => {
  const { data, title, description } = props;
  
  return (
    <View style={{ flex: 1, marginBottom: 30 }}>
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
        <StackedBarChart
          style={{
            marginVertical: 8,
            borderRadius: 16,
          }}
          // yAxisSuffix=""
          data = {data}
          width={Dimensions.get("window").width}
          height={250}
          hideLegend={false}
          //xLabelsOffset = {100}
          yLabelsOffset = {-30}
          
          // yAxisLabel=""
          chartConfig={{
            backgroundColor: "#ffffff",
            backgroundGradientFrom: "#ffffff",
            backgroundGradientTo: "#ffffff",
            fillShadowGradient: "#7262f8",
            fillShadowGradientOpacity: 1,
            color: (opacity = 1) => `rgba(${154}, ${155}, ${161}, ${opacity})`,
            labelColor: (opacity = 1) =>
              `rgba(${70}, ${71}, ${74}, ${opacity})`,
            style: {
              borderRadius: 16,
              right: 0,
              paddingRight: 64,
            },
            barPercentage: 0.5,
            decimalPlaces: 2,
          }}
          
        />
      </View>
    </View>
  );
};

export default StackedBar;