import React, { useState } from "react";
import {
  Alert,
  Image,
  Text,
  TextInput,
  TouchableOpacity,
  View,
  StyleSheet,
} from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";
import MaterialCommunityIcons from "@expo/vector-icons/MaterialCommunityIcons";
import { useNavigation } from "@react-navigation/native";
import { StatusBar } from "expo-status-bar";
import { StackNavigationProp } from "@react-navigation/stack";
import { RootStackParamList } from "../../App";
import { signInWithEmailAndPassword } from "firebase/auth";
import { authentication } from "../../firebaseConfig";

const SigninScreen = () => {
  const nav = useNavigation<StackNavigationProp<RootStackParamList>>();
  const [isVisable, setIsvisable] = useState(true);
  const [loginCradentials, setLogincradentials] = useState({
    email: "",
    password: "",
  });
  const { email, password } = loginCradentials;

  const loginUser = () => {
    signInWithEmailAndPassword(authentication, email, password)
      .then(() => {
        nav.navigate("MainApp");
      })
      .catch((err) => {
        Alert.alert(err.message);
      });
  };

  return (
    <SafeAreaView style={{ flex: 1, backgroundColor: "#fff" }}>
      <StatusBar style="light" />
      <View style={{ flex: 1, paddingHorizontal: 20 }}>
        <Image
          source={require("../assets/user.png")}
          style={{ alignSelf: "center", width: 130, height: 130, marginTop: 50 }}
        />

        <View style={{ marginTop: 20 }}>
          <Text style={styles.label}>Email</Text>
          <TextInput
            onChangeText={(val) =>
              setLogincradentials({ ...loginCradentials, email: val })
            }
            value={email}
            keyboardType="email-address"
            style={styles.input}
          />

          <Text style={[styles.label, { marginTop: 30 }]}>Password</Text>
          <View style={styles.passwordContainer}>
            <TextInput
              value={password}
              onChangeText={(val) =>
                setLogincradentials({ ...loginCradentials, password: val })
              }
              maxLength={6}
              keyboardType="ascii-capable"
              secureTextEntry={isVisable}
              style={styles.passwordInput}
            />
            <MaterialCommunityIcons
              onPress={() => setIsvisable(!isVisable)}
              name={isVisable ? "eye-off" : "eye"}
              size={24}
              color="black"
            />
          </View>
        </View>

        <View style={{ flex: 1, justifyContent: "flex-end", marginBottom: 30 }}>
          <TouchableOpacity
            onPress={loginUser}
            style={styles.signUpButton}
          >
            <Text style={styles.signUpButtonText}>Sign In</Text>
          </TouchableOpacity>

          <View style={styles.footerText}>
            <Text style={{ fontSize: 16 }}>Don't have an account?</Text>
            <TouchableOpacity
              onPress={() => nav.navigate("SignupScreen")}
            >
              <Text style={styles.signInLink}>Sign Up</Text>
            </TouchableOpacity>
          </View>
        </View>
      </View>
    </SafeAreaView>
  );
};

const styles = StyleSheet.create({
  label: {
    color: "grey",
    fontSize: 16,
    fontWeight: "500",
  },
  input: {
    borderColor: "#E3E3E3",
    borderBottomWidth: 2,
    fontSize: 16,
    marginTop: 10,
    padding: 10,
  },
  passwordContainer: {
    borderColor: "#E3E3E3",
    borderBottomWidth: 2,
    flexDirection: "row",
    alignItems: "center",
    marginTop: 10,
  },
  passwordInput: {
    flex: 1,
    fontSize: 16,
    padding: 10,
  },
  forgotPassword: {
    fontSize: 14,
    fontWeight: "400",
    marginTop: 15,
    textAlign: "right",
  },
  signUpButton: {
    backgroundColor: '#f1af4a',
    height: 45,
    borderRadius: 15,
    justifyContent: "center",
    alignItems: "center",
  },
  signUpButtonText: {
    color: "#fff",
    fontSize: 18,
    fontWeight: "bold",
  },
  footerText: {
    flexDirection: "row",
    justifyContent: "center",
    marginTop: 20,
  },
  signInLink: {
    fontSize: 16,
    fontWeight: "600",
    marginLeft: 5,
    color: '#f1af4a',
  },
});

export default SigninScreen;
