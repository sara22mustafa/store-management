
import React from "react";
import { Alert, StyleSheet, Text, TextInput, View, FlatList, ActivityIndicator, TouchableOpacity, Keyboard } from "react-native";
import { Formik } from "formik";
import * as Yup from "yup";
import { SafeAreaView } from "react-native-safe-area-context";
import { useOrders } from "../context/OrderContext";

interface OrderValues {
  productName: string;
  quantity: number;
  price: number;
}

const HomeScreen = () => {
  const { orders, loading, addOrder } = useOrders();

  const initialValues: OrderValues = {
    productName: "",
    quantity: 0,
    price: 0,
  };

  const validationSchema = Yup.object().shape({
    productName: Yup.string().required("Product Name is required"),
    quantity: Yup.number()
      .required("Quantity is required")
      .min(1, "Quantity must be at least 1"),
    price: Yup.number()
      .required("Price is required")
      .min(0, "Price must be a positive number"),
  });

  const handleSubmit = async (values: OrderValues, { resetForm }: { resetForm: () => void }) => {
    try {
      await addOrder(values);
      Alert.alert("Success", "Order added successfully!");
      resetForm();
      Keyboard.dismiss();
    } catch (error) {
      Alert.alert("Error", "Failed to add order. Please try again.");
    }
  };

  return (
    <SafeAreaView style={{ flex: 1 }}>
      <FlatList
        style={styles.flatlistContainer}
        showsVerticalScrollIndicator={false}
        data={[{ id: "form" }]}
        renderItem={() => (
          <>
            <Text style={styles.title}>Add Order</Text>
            <Formik
              initialValues={initialValues}
              validationSchema={validationSchema}
              onSubmit={handleSubmit}
            >
              {({
                handleChange,
                handleBlur,
                handleSubmit,
                values,
                errors,
                touched,
              }) => (
                <View>
                  <View style={styles.inputContainer}>
                    <Text style={styles.label}>Product Name</Text>
                    <TextInput
                      style={styles.input}
                      placeholder="Enter product name"
                      onChangeText={handleChange("productName")}
                      onBlur={handleBlur("productName")}
                      value={values.productName}
                    />
                    {touched.productName && errors.productName && (
                      <Text style={styles.error}>{errors.productName}</Text>
                    )}
                  </View>
                  <View style={styles.inputContainer}>
                    <Text style={styles.label}>Quantity</Text>
                    <TextInput
                      style={styles.input}
                      placeholder="Enter quantity"
                      onChangeText={handleChange("quantity")}
                      onBlur={handleBlur("quantity")}
                      value={String(values.quantity)}
                      keyboardType="numeric"
                    />
                    {touched.quantity && errors.quantity && (
                      <Text style={styles.error}>{errors.quantity}</Text>
                    )}
                  </View>
                  <View style={styles.inputContainer}>
                    <Text style={styles.label}>Price</Text>
                    <TextInput
                      style={styles.input}
                      placeholder="Enter price"
                      onChangeText={handleChange("price")}
                      onBlur={handleBlur("price")}
                      value={String(values.price)}
                      keyboardType="numeric"
                    />
                    {touched.price && errors.price && (
                      <Text style={styles.error}>{errors.price}</Text>
                    )}
                  </View>
                  <View style={styles.buttonContainer}>
                    <TouchableOpacity onPress={() => handleSubmit()} style={styles.addButton}>
                      <Text style={styles.addButtonText}>Add Order</Text>
                    </TouchableOpacity>
                  </View>
                </View>
              )}
            </Formik>
            <Text style={[styles.title, { marginTop: 20 }]}>Orders List</Text>
            {loading ? (
              <ActivityIndicator size="large" color="'#f1af4a'," />
            ) : (
              <FlatList
                data={orders}
                keyExtractor={(item, index) => index.toString()}
                renderItem={({ item }) => (
                  <View style={styles.orderItem}>
                    <Text>{item.productName}</Text>
                    <Text>Quantity: {item.quantity}</Text>
                    <Text>Price: ${item.price}</Text>
                  </View>
                )}
              />
            )}
          </>
        )}
        keyExtractor={() => "form"}
      />
    </SafeAreaView>
  );
};

const styles = StyleSheet.create({
  flatlistContainer: {
    flex: 1,
    padding: 20,
  },
  title: {
    fontSize: 24,
    fontWeight: "bold",
    marginBottom: 20,
    textAlign: "center",
    color: '#f1af4a',
  },
  inputContainer: {
    marginBottom: 15,
  },
  label: {
    fontSize: 16,
    fontWeight: "bold",
    marginBottom: 5,
  },
  input: {
    borderWidth: 1,
    borderColor: "#ccc",
    borderRadius: 5,
    padding: 10,
    fontSize: 16,
  },
  error: {
    color: "red",
    fontSize: 12,
    marginTop: 5,
  },
  buttonContainer: {
    marginTop: 20,
    marginBottom: 20,
  },
  addButton: {
    backgroundColor: '#f1af4a',
    height: 45,
    borderRadius: 15,
    justifyContent: "center",
    alignItems: "center",
  },
  addButtonText: {
    color: "#fff",
    fontSize: 18,
    fontWeight: "bold",
    marginTop: 5,
  },
  orderItem: {
    padding: 10,
    borderBottomWidth: 1,
    borderBottomColor: "#ccc",
  },
});

export default HomeScreen;