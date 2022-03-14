import React, { useContext, useState } from "react";
import { View, Text, StyleSheet, Image } from "react-native";
import FormContainer from "../../Shared/Form/FormContainer";
import Input from "../../Shared/Form/Input";
import Error from "../../Shared/Error";
import AsyncStorage from "@react-native-community/async-storage"
import Toast from "react-native-toast-message";
// import { KeyboardAwareScrollView } from "react-native-keyboard-aware-scroll-view";
import AuthGlobal from "../../Context/store/AuthGlobal"
import EasyButton from "../../Shared/StyledComponents/EasyButton";

import axios from "axios";
import baseURL from "../../assets/common/baseUrl";

const Register = (props) => {
  const [confirmPassword, setConfirmPassword] = useState("");
  const [newPassword, setPassword] = useState("");
  const context = useContext(AuthGlobal)
  const [error, setError] = useState("");


  const changePassword = () => {
    if (confirmPassword === "" || newPassword === "") {
      setError("Please fill in the form correctly");
      

    } else if (confirmPassword !== newPassword) {
      setError("Password Don't Match");
    } else {

      let user = {
        password: newPassword
      };
      console.log("api ata===>", user, context.stateUser.user.userId);
      AsyncStorage.getItem("jwt")
        .then((res) => {
          axios
            .put(`${baseURL}users/${context.stateUser.user.userId}`, user, { headers: { Authorization: `Bearer ${res}` } })
            .then((res) => {
              if (res.status == 200) {
                Toast.show({
                  topOffset: 60,
                  type: "success",
                  text1: "Password Changed Succesfully",
                  text2: "",
                });
                setTimeout(() => {
                  props.navigation.navigate("User Profile");
                }, 500);
              }
            })
            .catch(() => {
              Toast.show({
                topOffset: 60,
                type: "error",
                text1: "Something went wrong",
                text2: "Please try again",
              });
            });
        })
    }
  }

  // const register = () => {
  //   if (email === "" || name === "" || phone === "" || password === "") {
  //     setError("Please fill in the form correctly");
  //   }

  //   let user = {
  //     name: name,
  //     email: email,
  //     password: password,
  //     phone: phone,
  //     isAdmin: false,
  //   };
  //   axios
  //     .post(`${baseURL}users/register`, user)
  //     .then((res) => {
  //       if (res.status == 200) {
  //         Toast.show({
  //           topOffset: 60,
  //           type: "success",
  //           text1: "Registration Succeeded",
  //           text2: "Please Login into your account",
  //         });
  //         setTimeout(() => {
  //           props.navigation.navigate("Login");
  //         }, 500);
  //       }
  //     })
  //     .catch((error) => {
  //       Toast.show({
  //         topOffset: 60,
  //         type: "error",
  //         text1: "Something went wrong",
  //         text2: "Please try again",
  //       });
  //     });
  // };

  return (
    // <KeyboardAwareScrollView
    //   viewIsInsideTabBar={true}
    //   extraHeight={200}
    //   enableOnAndroid={true}
    // >
    <FormContainer style={styles.container} title={""}>
      {/* <Image style={styles.image} source={{ uri: 'https://i.imgur.com/s9syolg.png' }} /> */}


      <Image style={styles.image} source={{ uri: 'http://18.217.131.129:3000/public/uploads/man_profile.png' }} />
      {/* <Input 
          placeholder={"Email"}
          name={"email"}
          id={"email"}
          onChangeText={(text) => setEmail(text.toLowerCase())}
        />
        <Input
          placeholder={"Name"}
          name={"name"}
          id={"name"}
          onChangeText={(text) => setName(text)}
        /> */}
      {/* <Input
          placeholder={"Phone Number"}
          name={"phone"}
          id={"phone"}
          keyboardType={"numeric"}
          onChangeText={(text) => setPhone(text)}
        /> */}
      <Input style={{ marginBottom: 10 }}
        placeholder={"New Password"}
        name={"newPassword"}
        id={"newPassword"}
        // secureTextEntry={true}
        onChangeText={(text) => setPassword(text)}
      />
      <Input style={{ marginBottom: 10 }}
        placeholder={"Confirm Password"}
        name={"confirmpassword"}
        id={"confirmpassword"}
        secureTextEntry={true}
        onChangeText={(text) => setConfirmPassword(text)}
      />
      <View style={styles.buttonGroup}>
        {error ? <Error message={error} /> : null}
        {/* <EasyButton style={styles.RegisterBtn} large primary onPress={() => register()}>
            <Text style={{ color: "white" }}>REGISTER</Text>
          </EasyButton> */}
        <EasyButton style={styles.RegisterBtn} large primary onPress={() => changePassword()}>
          <Text style={{ color: "white" }}>Change Password</Text>
        </EasyButton>
        {/* </View > */}
        {/* <View  style={styles.buttonGroup}> */}
        <EasyButton style={styles.loginBtn}
          large
          secondary
          onPress={() => props.navigation.navigate("User Profile")}
        >
          <Text style={{ color: "white" }}>My Profile</Text>
        </EasyButton>
      </View>
    </FormContainer>
    // </KeyboardAwareScrollView>
  );
};

const styles = StyleSheet.create({
  buttonGroup: {
    width: "80%",
    // margin: 5,
    marginTop: 15,
    alignItems: "center",
  },

  image: {
    marginBottom: 10,
    marginTop: 0,
    width: 200, height: 200

  },
  inputView: {
    backgroundColor: "#FFC0CB",
    borderRadius: 30,
    width: "70%",
    height: 45,
    marginBottom: 20,
    alignItems: "center",
  },

  TextInput: {
    height: 50,
    flex: 1,
    padding: 10,
    marginLeft: 20,
  },
  container: {
    flex: 1,
    backgroundColor: '#fff',
    alignItems: 'center',
    justifyContent: 'center',
  },

  loginBtn: {
    width: "50%",
    borderRadius: 25,
    height: 50,
    alignItems: "center",
    justifyContent: "center",
    marginTop: 20,
    backgroundColor: "#87ceeb",
  },

  RegisterBtn: {
    width: "70%",
    borderRadius: 25,
    height: 50,
    alignItems: "center",
    justifyContent: "center",

    backgroundColor: "#98fb98",
  },
});

export default Register;
