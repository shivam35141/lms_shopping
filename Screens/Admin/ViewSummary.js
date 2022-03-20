import React, { useState, useCallback } from "react";
import {
  View,
  Text,
  FlatList,
  ActivityIndicator,
  StyleSheet,
  Dimensions,
  Image
} from "react-native";
import { Header, Item, Input } from "native-base"
import Icon from "react-native-vector-icons/FontAwesome"
import { useFocusEffect } from "@react-navigation/native"
import ListItem from "./ListItem"

import axios from "axios"
import baseURL from "../../assets/common/baseUrl"
import AsyncStorage from "@react-native-community/async-storage"
import store from "../../Redux/store";

var { height, width } = Dimensions.get("window")

const ListHeader = () => {
    return(
        <View
            elevation={1}
            style={styles.listHeader}
        >
            {/* <View style={styles.headerItem}></View> */}
            {/* <View style={styles.headerItem}>
                <Text style={{ fontWeight: '600'}}>Brand</Text>
            </View> */}
            <View style={styles.headerItem}>
                <Text style={{ fontWeight: 'bold'}}>Name</Text>
            </View>
            {/* <View style={styles.headerItem}>
                <Text style={{ fontWeight: 'bold'}}>Category</Text>
            </View> */}
            <View style={styles.headerItem}>
                <Text style={{ fontWeight: 'bold'}}>Wholesale Price</Text>
            </View>
            <View style={styles.headerItem}>
                <Text style={{ fontWeight: 'bold'}}>Selling Price</Text>
            </View>
            <View style={styles.headerItem}>
                <Text style={{ fontWeight: 'bold'}}>Profit</Text>
            </View>
            <View style={styles.headerItem}>
                <Text style={{ fontWeight: 'bold'}}>Qty</Text>
            </View>
        </View>
    )
}

const ViewSummary = (props) => {

    const [productList, setProductList] = useState();
    const [productFilter, setProductFilter] = useState();
    const [loading, setLoading] = useState(true);
    const [token, setToken] = useState();
    const state = store.getState();
    console.log("stat=====>",state, state.shopNo)

    useFocusEffect(
        useCallback(
            () => {
                // Get Token
                AsyncStorage.getItem("jwt")
                    .then((res) => {
                        setToken(res)
                    })
                    .catch((error) => console.log(error))

                axios
                    .post(`${baseURL}orders/summary`,{shopNo:state.shopNo?Number(state.shopNo):0})
                    .then((res) => {
                        // console.log(res.data, undefined, 2)
                        let data= res.data.totalsales.map((item)=>{
                            return {profit:((item.product_detail[0].price-(item.product_detail[0].wholesalePrice || 0))*item.count).toFixed(2),name:item.product_detail[0].name,price:item.product_detail[0].price,wholeSalePrice:item.product_detail[0].wholesalePrice,image:item.product_detail[0].image,...item}
                        })
                        // console.log("data",data)
                        setProductList(data);
                        setProductFilter(data);
                        setLoading(false);
                    })

                return () => {
                    setProductList();
                    setProductFilter();
                    setLoading(true);
                }
            },
            [],
        )
    )

    const deleteProduct = (id) => {
        axios
            .delete(`${baseURL}products/${id}`, {
                headers: { Authorization: `Bearer ${token}` },
            })
            .then((res) => {
                const products = productFilter.filter((item) => item.id !== id)
                setProductFilter(products)
            })
            .catch((error) => console.log(error));
    }

  return (
    <View style={styles.container}>
      <View>
          <Header searchBar rounded>
                  <Text style={styles.titleText}>Daily Summary</Text>
          </Header>
      </View>

      {loading ? (
          <View style={styles.spinner}> 
              <ActivityIndicator size="large" color="green" />
          </View>
      ) : (
          <FlatList 
            data={productFilter}
            ListHeaderComponent={ListHeader}
            renderItem={({ item, index }) => (
               <View  style={[styles.viewContainer, {
                backgroundColor: index % 2 == 0 ? "white" : "gainsboro"
            }]}>
                   {/* <Image 
                    source={{
                        uri: item.image
                        ? props.image
                        : 'https://cdn.pixabay.com/photo/2012/04/01/17/29/box-23649_960_720.png'
                    }}
                    resizeMode="contain"
                    style={styles.image}
                /> */}
                {/* <Text style={styles.item}>{props.brand}</Text> */}
                <Text style={styles.item} numberOfLines={1} ellipsizeMode="tail">{item.name}</Text>
                <Text style={styles.item}  ellipsizeMode="tail">₹ {item.wholeSalePrice || 0}</Text>
                <Text style={styles.item}>₹ {item.price}</Text>
                <Text style={styles.item}>₹ {item.profit}</Text>
                <Text style={styles.item}> {item.count}</Text>
               </View>
            )}
            keyExtractor={(item) => item._id}
          />
      )}
    </View>
  );
};

const styles = StyleSheet.create({
    listHeader: {
        flexDirection: 'row',
        padding: 5,
        backgroundColor: 'gainsboro'
    },
    headerItem: {
        margin: 2,
        width: width / 4.8
    },
    spinner: {
        height: height / 2,
        alignItems: 'center',
        justifyContent: 'center'
    },
    container: {
        marginBottom: 160,
        backgroundColor: 'white'
    },
    viewContainer:{
        flexDirection: 'row',
        padding: 5,
        width: width
    },
    buttonContainer: {
        margin: 20,
        alignSelf: 'center',
        flexDirection: 'row'
    },
    buttonText: {
        marginLeft: 4,
        color: 'white'
    },
    titleText: {
        fontSize: 20,
        fontWeight: "bold",
        padding:12
      },
      image: {
        borderRadius: 50,
        width: width / 6,
        height: 20,
        margin: 2
    },
    item: {
        flexWrap: "wrap",
        margin: 4,
    
        width: width / 4.8
    },
})

export default ViewSummary;
