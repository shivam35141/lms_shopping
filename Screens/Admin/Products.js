import React, { useState, useCallback } from "react";
import {
  View,
  Text,
  FlatList,
  ActivityIndicator,
  StyleSheet,
  Dimensions,
  Button
} from "react-native";
import { Header, Item, Input } from "native-base"
import Icon from "react-native-vector-icons/FontAwesome"
import { useFocusEffect } from "@react-navigation/native"
import ListItem from "./ListItem"
var RNFS = require('react-native-fs');
import XLSX from 'xlsx'
import axios from "axios"
import baseURL from "../../assets/common/baseUrl"
import AsyncStorage from "@react-native-community/async-storage"
import EasyButton from "../../Shared/StyledComponents/EasyButton";
import store from "../../Redux/store";
import Toast from "react-native-toast-message";


var { height, width } = Dimensions.get("window")

const ListHeader = () => {
    return(
        <View
            elevation={1}
            style={styles.listHeader}
        >
            <View style={styles.headerItem}></View>
            {/* <View style={styles.headerItem}>
                <Text style={{ fontWeight: '600'}}>Brand</Text>
            </View> */}
            <View style={styles.headerItem}>
                <Text style={{ fontWeight: 'bold'}}>Name</Text>
            </View>
            <View style={styles.headerItem}>
                <Text style={{ fontWeight: 'bold'}}>Category</Text>
            </View>
            <View style={styles.headerItem}>
                <Text style={{ fontWeight: 'bold'}}>Price</Text>
            </View>
            <View style={styles.headerItem}>
                <Text style={{ fontWeight: 'bold'}}>Qty</Text>
            </View>
        </View>
    )
}

const Products = (props) => {

    const [productList, setProductList] = useState();
    const [productFilter, setProductFilter] = useState();
    const [loading, setLoading] = useState(true);
    const [token, setToken] = useState();
    const state = store.getState();
    console.log("stat=====>",(state.shopNo))

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
                    .get(`${baseURL}products?shopNo=${state.shopNo?Number(state.shopNo):0}`)
                    .then((res) => {
                        setProductList(res.data);
                        setProductFilter(res.data);
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

    const searchProduct = (text) => {
        if (text == "") {
            setProductFilter(productList)
        }
        setProductFilter(
            productList.filter((i) => 
                i.name.toLowerCase().includes(text.toLowerCase())
            )
        )
    }

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


    const exportDataToExcel = () => {

        // Created Sample data
        let sample_data_to_export = productFilter.map((ele,index)=>{
            return {
            SrNo:index+1,
            Item:ele.name,
            Brand:ele.brand,
            ItemDescription:ele.description,
            QtyAvailable:ele.countInStock,
            // SaleQty:ele.count,
            wholeSalePrice:ele.wholesalePrice,
            // wAmt:ele.wholeSalePrice*ele.count,
            SellingPrice:ele.price,
            // rAmt:ele.price*ele.count,
            // Profit:ele.profit,
            // CLedgerBal:ele.product_detail[0].countInStock,
        }
    
        })
    
        // let sample_data_to_export = productFilter
        let date = new Date()

        let wb = XLSX.utils.book_new();
        let ws = XLSX.utils.json_to_sheet(sample_data_to_export)    
        XLSX.utils.book_append_sheet(wb,ws,"Users")
        const wbout = XLSX.write(wb, {type:'binary', bookType:"xlsx"});
        // console.log(date)
    
        // Write generated excel to Storage
        RNFS.writeFile(RNFS.ExternalStorageDirectoryPath + '/AllProducts ' +date.toDateString()+ '.xlsx', wbout, 'ascii').then((r)=>{
         console.log('Success');
         Toast.show({
            topOffset: 60,
            type: "success",
            text1: "Downloaded Succusfully",
            text2: "",
        });
        }).catch((e)=>{
          console.log('Error', e);
          Toast.show({
            topOffset: 60,
            type: "error",
            text1: "Something went wrong",
            text2: "Please try again",
          });
        });
    
      }
     

  return (
    <View style={styles.container}>
          <Button
              onPress={() => props.navigation.navigate("ViewSummary")}
              title="View Summary"
              color="green"
          />
        <View style={styles.buttonContainer}>
            <EasyButton
                secondary
                medium
                onPress={() => props.navigation.navigate("Orders")}
            >
                <Icon name="shopping-bag" size={18} color="white" />
                <Text style={styles.buttonText}>Orders</Text>
            </EasyButton>
            <EasyButton
                secondary
                medium
                onPress={() => props.navigation.navigate("ProductForm")}
            >
                <Icon name="plus" size={18} color="white" />
                <Text style={styles.buttonText}>Products</Text>
            </EasyButton>
            <EasyButton
                secondary
                medium
                onPress={() => props.navigation.navigate("Categories")}
            >
                <Icon name="plus" size={18} color="white" />
                <Text style={styles.buttonText}>Categories</Text>
            </EasyButton>
        </View>
      <View>
          <Header searchBar rounded>
              <Item style={{ padding: 5 , borderRadius: 10}}>
                  <Icon name="search" />
                  <Input 
                    placeholder="Search Products"
                    onChangeText={(text) => searchProduct(text)}
                  />
              </Item>

              {/* <Button style={{ height:20 , borderRadius: 20}}
             
              title="Export Items"
              color="gainsboro"
          /> */}

<EasyButton
                // secondary
                primary
                // export
                medium
                onPress={() => exportDataToExcel()}
            >
                <Icon name="upload" size={18} color="gainsboro" />
                <Text style={styles.buttonText}> Excel</Text>
            </EasyButton>
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
                <ListItem 
                    {...item}
                    navigation={props.navigation}
                    index={index}
                    delete={deleteProduct}
                />
            )}
            keyExtractor={(item) => item.id}
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
    buttonContainer: {
        margin: 20,
        alignSelf: 'center',
        flexDirection: 'row'
    },
    buttonText: {
        marginLeft: 4,
        color: 'white'
    }
})

export default Products;
