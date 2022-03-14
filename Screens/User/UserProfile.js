import React, { useContext, useState, useCallback } from 'react';
import { View, Text, ScrollView, Button, StyleSheet, Dimensions, Image } from 'react-native';
import { Container, Left, ListItem, Right } from "native-base"
import { useFocusEffect } from "@react-navigation/native"
import AsyncStorage from "@react-native-community/async-storage"
import OrderCard from "../../Shared/OrderCard"

import axios from "axios"
import baseURL from "../../assets/common/baseUrl"

import AuthGlobal from "../../Context/store/AuthGlobal"
import { logoutUser } from "../../Context/actions/Auth.actions"


var { width, height } = Dimensions.get("window");

const UserProfile = (props) => {
    const context = useContext(AuthGlobal)
    const [userProfile, setUserProfile] = useState()
    const [orders, setOrders] = useState()
    console.log("user--------------------------->", userProfile)

    useFocusEffect(
        useCallback(() => {
            if (
                context.stateUser.isAuthenticated === false ||
                context.stateUser.isAuthenticated === null
            ) {
                props.navigation.navigate("Login")
            }

            AsyncStorage.getItem("jwt")
                .then((res) => {
                    axios
                        .get(`${baseURL}users/${context.stateUser.user.userId}`, {
                            headers: { Authorization: `Bearer ${res}` },
                        })
                        .then((user) => setUserProfile(user.data))
                })
                .catch((error) => console.log(error))

            axios
                .get(`${baseURL}orders`)
                .then((x) => {
                    const data = x.data;
                    console.log("user profile orders=============>",data[0].orderItems)
                    const userOrders = data.filter(
                        (order) => order.user._id === context.stateUser.user.userId
                    );
                    setOrders(userOrders);
                })
                .catch((error) => console.log(error))

            return () => {
                setUserProfile();
                setOrders();
            }

        }, [context.stateUser.isAuthenticated]))

    return (





        <Container style={styles.container}>

            <View style={{flexDirection: "row"}}>
                <View style={{marginTop:40}}>
                    <Image style={styles.image} source={{ uri: 'http://18.217.131.129:3000/public/uploads/man_profile.png' }} />
                </View>



                <View style={{marginTop:25,marginBottom:20}}>
                    <Text style={{ fontSize: 30, marginBottom: 10 }}>
                        {userProfile ? userProfile.name : ""}
                    </Text>
                    <Text style={{ margin: 5 }}>
                        User ID :    {userProfile ? userProfile.email : ""}
                    </Text>
                    <Text style={{ margin: 5 }}>
                        Phone  :     {userProfile ? userProfile.phone : ""}
                    </Text>
                    <View style={{ marginTop: 10 }}>
                        <Button title={"Sign Out"} onPress={() => [
                            AsyncStorage.removeItem("jwt"),
                            logoutUser(context.dispatch)
                        ]} />
                    </View>
                <View style={{ marginTop: 10 }}>
                        <Button title={"Change Password"} 
                        // onPress={() => [
                        //     AsyncStorage.removeItem("jwt"),
                        //     logoutUser(context.dispatch)
                        // ]}
                        
                        onPress={() => props.navigation.navigate("Register")}
                        />
                    </View>
                </View>
            </View>
            <View
  style={{
    borderBottomColor: 'grey',
    borderBottomWidth: 1,
    marginTop:10,
    marginBottom:5,
    width:width*0.8,
    alignSelf:"center"
    
  }}/>

            <Text style={{ fontSize: 20,marginBottom:10,fontWeight:"bold" }}>My Orders</Text>




            <ScrollView contentContainerStyle={styles.subContainer}>
                <View style={styles.order}>
                    <View>
                        {orders ? (
                            orders.map((x) => {
                                return <OrderCard key={x.id} {...x} />;
                            })


                        ) : (
                            <View style={styles.order}>
                                <Text>You have no orders</Text>
                            </View>
                        )}
                    </View>

                   
                </View>
            </ScrollView>
        </Container>
    )
}

const styles = StyleSheet.create({
    container: {
        flex: 1,
        flexDirection: "column",
        alignItems: "center"
    },
    subContainer: {
        alignItems: "center",
        marginTop: 10
    },
    image: {
        marginBottom: 5,
        marginTop: 5,
        width: 150, height: 150,


    },
    listItem: {
        // flex:2,
        alignItems: "center",
        backgroundColor: "white",
        justifyContent: "center",
        // width: width,
        // height:height/3
    },
    order: {
        marginTop: 20,
        alignItems: "center",
        marginBottom: 60
    },
    box: {
        // width: 200,
    },
})

export default UserProfile;