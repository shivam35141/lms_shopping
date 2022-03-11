import React, { useEffect, useContext, useState } from "react";
import { View, Text, StyleSheet, Button,Image } from "react-native";
import FormContainer from "../../Shared/Form/FormContainer";
import Input from "../../Shared/Form/Input";
import Error from "../../Shared/Error";
import EasyButton from "../../Shared/StyledComponents/EasyButton";

// Context
import AuthGlobal from "../../Context/store/AuthGlobal";
import { loginUser } from "../../Context/actions/Auth.actions";

const Login = (props) => {
  const context = useContext(AuthGlobal);
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState("");

  useEffect(() => {
    if (context.stateUser.isAuthenticated === true) {
      props.navigation.navigate("User Profile");
    }
  }, [context.stateUser.isAuthenticated]);

  const handleSubmit = () => {
    const user = {
      email,
      password
    };

    if (email === "" || password === "") {
      setError("Please fill in your credentials");
    } else {
      loginUser(user, context.dispatch);
    }
  };

  return (
    <FormContainer style={styles.container} title={""}>
      {/* <Image source={require('.assets/profile_logo.png')} /> */}
      <Image style={styles.image} source={{ uri: 'http://18.217.131.129:3000/public/uploads/man_profile.png' }} />
      {/* <Image style={styles.image} source={'https://i.imgur.com/wDrRMsv.jpg'} /> */}
      <Input
        placeholder={"Enter Email"}
        name={"email"}
        id={"email"}
        value={email}
        onChangeText={(text) => setEmail(text)}
      />
      <Input
        placeholder={"Enter Password"}
        name={"password"}
        id={"password"}
        secureTextEntry={true}
        value={password}
        onChangeText={(text) => setPassword(text)}
      />
      <View style={styles.buttonGroup}>
        {error ? <Error message={error} /> : null}
        <EasyButton style={styles.loginBtn} large primary onPress={() => handleSubmit()}>
          <Text style={{ color: "white" }}>LOGIN</Text>
        </EasyButton>
      </View>
      <View style={[{ marginTop: 20 }, styles.buttonGroup]}>
        {/* <Text style={styles.middleText}>Don't have an account yet?</Text> */}
        <Text style={styles.middleText}>Contact App Admin for New Account</Text>
        
        {/* <EasyButton style={styles.RegisterBtn}
        large
        secondary 
        onPress={() => props.navigation.navigate("Register")}>
          <Text style={{ color: "white" }}>Register</Text>
        </EasyButton>
      */}
      </View>
    </FormContainer>
  );
};

const styles = StyleSheet.create({
  buttonGroup: {
    width: "80%",
    marginTop:30,
    alignItems: "center",
  },
  middleText: {
    marginBottom: 20,
    alignSelf: "center",
  },
  image :{
    marginBottom: 40,
    marginTop:20,
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
    width: "80%",
    borderRadius: 25,
    height: 50,
    alignItems: "center",
    justifyContent: "center",
    // marginTop: 40,
    backgroundColor: "#87ceeb",
  },
  RegisterBtn: {
    width: "60%",
    borderRadius: 25,
    height: 50,
    alignItems: "center",
    justifyContent: "center",
    
    backgroundColor: "#98fb98",
  },
});

export default Login;
