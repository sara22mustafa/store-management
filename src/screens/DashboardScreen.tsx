import React, { useEffect, useState } from "react";
import {
  StyleSheet,
  Text,
  View,
  ActivityIndicator,
  FlatList,
  Dimensions,
  SafeAreaView,
} from "react-native";
import { LineChart, BarChart } from "react-native-chart-kit";
import { useOrders, Order } from "../context/OrderContext";

interface Analytics {
  totalRevenue: number;
  topSellingProducts: { name: string; quantity: number }[];
  recentOrders: number;
  highRevenueProducts: { name: string; revenue: number }[];
  underperformingProducts: { name: string; quantity: number }[];
}

const DashboardScreen: React.FC = () => {
  const { orders, loading } = useOrders();
  const [analytics, setAnalytics] = useState<Analytics>({
    totalRevenue: 0,
    topSellingProducts: [],
    recentOrders: 0,
    highRevenueProducts: [],
    underperformingProducts: [],
  });

  useEffect(() => {
    if (orders && orders.length > 0) {
      processAnalytics(orders);
    }
  }, [orders]);

  const processAnalytics = (orders: Order[]) => {
    let totalRevenue = 0;
    const productCounts: Record<string, number> = {};
    const revenueCounts: Record<string, number> = {};
    const underperforming: Record<string, number> = {};
    const now = new Date();
    const oneHourAgo = new Date(now.getTime() - 60 * 60 * 1000);
    const oneWeekAgo = new Date(now.getTime() - 7 * 24 * 60 * 60 * 1000);

    let recentOrders = 0;

    orders.forEach((order) => {
      // تحقق من صحة البيانات
      if (
        typeof order.price !== "number" ||
        typeof order.quantity !== "number" ||
        !order.timestamp
      ) {
        console.error("Invalid order data:", order);
        return;
      }

      totalRevenue += order.price * order.quantity;

      productCounts[order.productName] =
        (productCounts[order.productName] || 0) + order.quantity;

      revenueCounts[order.productName] =
        (revenueCounts[order.productName] || 0) + order.price * order.quantity;

      const orderDate = order.timestamp;

      if (orderDate.getTime() > oneHourAgo.getTime()) {
        recentOrders++;
      }

      if (
        orderDate.getTime() > oneWeekAgo.getTime() &&
        order.quantity < 5
      ) {
        underperforming[order.productName] =
          (underperforming[order.productName] || 0) + order.quantity;
      }
    });

    const topSellingProducts = Object.entries(productCounts)
      .map(([name, quantity]) => ({ name, quantity }))
      .sort((a, b) => b.quantity - a.quantity)
      .slice(0, 5);

    const highRevenueProducts = Object.entries(revenueCounts)
      .map(([name, revenue]) => ({ name, revenue }))
      .sort((a, b) => b.revenue - a.revenue)
      .slice(0, 3);

    const underperformingProducts = Object.entries(underperforming)
      .map(([name, quantity]) => ({ name, quantity }))
      .filter((item) => item.quantity < 5);

    setAnalytics({
      totalRevenue,
      topSellingProducts,
      recentOrders,
      highRevenueProducts,
      underperformingProducts,
    });
  };

  const screenWidth = Dimensions.get("window").width;

  return (
    <SafeAreaView style={styles.container}>
      <FlatList
        contentContainerStyle={{ paddingHorizontal: 16 }}
        showsVerticalScrollIndicator={false}
        data={[1]}
        keyExtractor={() => "1"}
        refreshing={loading}
        onRefresh={() => {}}
        ListHeaderComponent={
          <>
            {loading ? (
              <ActivityIndicator size="large" color="#ff9900" />
            ) : (
              <>
                <Text style={styles.header}>📊 Real Time Analytics</Text>
                <Text>Total Revenue: ${analytics.totalRevenue.toFixed(2)}</Text>
                <Text>
                  Orders Placed in the Last Hour: {analytics.recentOrders}
                </Text>

                <Text style={styles.header}>🔥 Top-Selling Products</Text>
                {analytics.topSellingProducts.map((item) => (
                  <Text key={item.name}>
                    {item.name} - {item.quantity} sales
                  </Text>
                ))}

                <Text style={styles.header}>💰 High-Revenue Products</Text>
                {analytics.highRevenueProducts.map((item) => (
                  <Text key={item.name}>
                    {item.name} - ${item.revenue.toFixed(2)}
                  </Text>
                ))}

                <Text style={styles.header}>⚠️ Underperforming Products</Text>
                {analytics.underperformingProducts.map((item) => (
                  <Text key={item.name}>
                    {item.name} - {item.quantity} sales
                  </Text>
                ))}

                <Text style={styles.header}>📈 Sales Trends</Text>
                <LineChart
                  data={{
                    labels: analytics.topSellingProducts.map(
                      (item) => item.name
                    ),
                    datasets: [
                      {
                        data: analytics.topSellingProducts.map(
                          (item) => item.quantity
                        ),
                      },
                    ],
                  }}
                  width={screenWidth - 40}
                  height={220}
                  chartConfig={{
                    backgroundGradientFrom: "#fff",
                    backgroundGradientTo: "#fff",
                    color: (opacity = 1) => `rgba(255, 153, 0, ${opacity})`,
                    labelColor: (opacity = 1) => `rgba(0, 0, 0, ${opacity})`,
                  }}
                  bezier
                />

                <Text style={styles.header}>💵 High Revenue Products</Text>
                <BarChart
                  data={{
                    labels: analytics.highRevenueProducts.map((item) => item.name),
                    datasets: [
                      {
                        data: analytics.highRevenueProducts.map((item) => item.revenue),
                      },
                    ],
                  }}
                  width={screenWidth - 40}
                  height={220}
                  yAxisLabel="$"
                  yAxisSuffix=""
                  chartConfig={{
                    backgroundGradientFrom: "#fff",
                    backgroundGradientTo: "#fff",
                    color: (opacity = 1) => `rgba(255, 99, 71, ${opacity})`,
                    labelColor: (opacity = 1) => `rgba(0, 0, 0, ${opacity})`,
                  }}
                />
              </>
            )}
          </>
        }
        renderItem={() => null}
      />
    </SafeAreaView>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    padding: 16,
    backgroundColor: "#ffffff",
  },
  header: {
    fontSize: 18,
    fontWeight: "bold",
    color: "#f1af4a",
    marginTop: 20,
    marginBottom: 10,
  },
});

export default DashboardScreen;