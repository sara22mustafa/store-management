import React, { useState } from "react";
import {
  Alert,
  Text,
  TextInput,
  TouchableOpacity,
  View,
  StyleSheet,
  StatusBar,
  Image,
} from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";
import MaterialCommunityIcons from "@expo/vector-icons/MaterialCommunityIcons";
import { useNavigation } from "@react-navigation/native";
import { createUserWithEmailAndPassword } from "firebase/auth";
import { authentication, database } from "../../firebaseConfig";
import { setDoc, doc } from "firebase/firestore";
import { StackNavigationProp } from "@react-navigation/stack";
import { RootStackParamList } from "../../App";

const SignupScreen = () => {
  const nav = useNavigation<StackNavigationProp<RootStackParamList>>();
  const [isVisable, setIsvisable] = useState(true);
  const [userCradentials, setUsercradentials] = useState({
    name: "",
    email: "",
    password: "",
  });
  const { email, password, name } = userCradentials;

  const userAccount = () => {
    createUserWithEmailAndPassword(authentication, email, password)
      .then((userCredential) => {
        const userId = userCredential.user.uid;
        return setDoc(doc(database, "users", userId), {
          username: name,
          email: email,
        });
      })
      .catch((error) => {
        if (error.code === "auth/email-already-in-use") {
          Alert.alert("That email address is already in use!");
        }

        if (error.code === "auth/invalid-email") {
          Alert.alert("That email address is invalid!");
        }

        console.error(error);
      });
  };

  return (
    <SafeAreaView style={{ flex: 1, backgroundColor: "#fff" }}>
      <View style={{ flex: 1, paddingHorizontal: 20, marginTop: 50 }}>
        <Image
          source={require("../assets/user.png")}
          style={{ alignSelf: "center", width: 130, height: 130 }}
        />
        <Text style={styles.label}>Username</Text>
        <TextInput
          maxLength={10}
          value={name}
          onChangeText={(val) =>
            setUsercradentials({ ...userCradentials, name: val })
          }
          keyboardType="default"
          style={styles.input}
        />

        <Text style={[styles.label, { marginTop: 30 }]}>Email</Text>
        <TextInput
          onChangeText={(val) =>
            setUsercradentials({ ...userCradentials, email: val })
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
              setUsercradentials({ ...userCradentials, password: val })
            }
            secureTextEntry={isVisable}
            maxLength={6}
            keyboardType="ascii-capable"
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

      <View style={styles.footer}>
        <TouchableOpacity onPress={userAccount} style={styles.signUpButton}>
          <Text style={styles.signUpButtonText}>Sign Up</Text>
        </TouchableOpacity>

        <View style={styles.footerText}>
          <Text style={{ fontSize: 16 }}>Already have an account?</Text>
          <TouchableOpacity onPress={() => nav.navigate("SigninScreen")}>
            <Text style={styles.signInLink}>Sign In</Text>
          </TouchableOpacity>
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
  signUpButton: {
    backgroundColor: "#f1af4a",
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
  footer: {
    paddingHorizontal: 20,
    justifyContent: "flex-end",
    paddingBottom: 30,
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
    color: "#f1af4a",
  },
});

export default SignupScreen;
