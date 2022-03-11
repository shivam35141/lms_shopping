import React, { useState, useCallback} from "react"
import { View, FlatList, Text} from "react-native"
import axios from "axios"
import baseURL from "../../assets/common/baseUrl"
import { useFocusEffect } from "@react-navigation/native"

import OrderCard from "../../Shared/OrderCard"
import store from "../../Redux/store";


const Orders = (props) => {

    const [orderList, setOrderList] = useState();
    const state = store.getState();

    useFocusEffect(
        useCallback(
            () => {
                getOrders();
            return () => {
                setOrderList();
            }
            },
            [],
        )
    )


    const getOrders = () => {
        axios
        .get(`${baseURL}orders?shopNo=${state.shopNo}`)
        .then((x) => {
            setOrderList(x.data);
        })
        .catch((error) => console.log(error))
    }

    return (
        <View>
            <FlatList 
                data={orderList}
                renderItem={({ item }) => (
                    <OrderCard navigation={props.navigation} {...item} editMode={true}/>
                )}
                keyExtractor={(item) => item.id}
            />
        </View>
    )
}

export default Orders;