import React, { useState, useCallback } from "react";
import {
  View,
  Text,
  FlatList,
  ActivityIndicator,
  StyleSheet,
  Dimensions,
  Button,
  TouchableOpacity,
  PermissionsAndroid
} from "react-native";
import { Header } from "native-base"
import { useFocusEffect } from "@react-navigation/native"
import DatePicker from 'react-native-date-picker'
import Toast from "react-native-toast-message";
import axios from "axios"
import baseURL from "../../assets/common/baseUrl"
import AsyncStorage from "@react-native-community/async-storage"
import store from "../../Redux/store";
var RNFS = require('react-native-fs');
import XLSX from 'xlsx'

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
    const [date, setDate] = useState(new Date())
    const [open, setOpen] = useState(false)
    console.log("stat=====>",state, state.shopNo)

    const getSummary = (date) => {
        console.log("date getSummary=======>", date)
    
        axios
            .post(`${baseURL}orders/summary`, { shopNo: state.shopNo ? Number(state.shopNo) : 0, date: date })
            .then((res) => {
                console.log("summary data----->",res.data.totalsales[0].product_detail)
                let data = res.data.totalsales.map((item) => {
                    return { profit: ((item.product_detail[0].price - (item.product_detail[0].wholesalePrice || 0)) * item.count).toFixed(2), name: item.product_detail[0].name, price: item.product_detail[0].price, wholeSalePrice: item.product_detail[0].wholesalePrice, image: item.product_detail[0].image, ...item }
                })
                setProductList(data);
                setProductFilter(data);
                setLoading(false);
            })
    
        return () => {
            setProductList();
            setProductFilter();
            setLoading(true);
        }
    }

 // function to handle exporting
 const exportDataToExcel = () => {

    // Created Sample data
    let sample_data_to_export = productList.map((ele,index)=>{
        return {
        SrNo:index+1,
        Item:ele.name,
        OLedgerBal:ele.product_detail[0].countInStock+ele.count,
        SaleQty:ele.count,
        wRate:ele.wholeSalePrice,
        wAmt:ele.wholeSalePrice*ele.count,
        NeedsRate:ele.price,
        rAmt:ele.price*ele.count,
        Profit:ele.profit,
        CLedgerBal:ele.product_detail[0].countInStock,
    }

    })

    let wb = XLSX.utils.book_new();
    let ws = XLSX.utils.json_to_sheet(sample_data_to_export)    
    XLSX.utils.book_append_sheet(wb,ws,"Users")
    const wbout = XLSX.write(wb, {type:'binary', bookType:"xlsx"});
    console.log(date)

    // Write generated excel to Storage
    RNFS.writeFile(RNFS.ExternalStorageDirectoryPath + '/summary' +date.toDateString()+ '.xlsx', wbout, 'ascii').then((r)=>{
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
  const handleClick = async () => {

    try{
      // Check for Permission (check if permission is already given or not)
      let isPermitedExternalStorage = await PermissionsAndroid.check(PermissionsAndroid.PERMISSIONS.WRITE_EXTERNAL_STORAGE);

      if(!isPermitedExternalStorage){

        // Ask for permission
        const granted = await PermissionsAndroid.request(
          PermissionsAndroid.PERMISSIONS.WRITE_EXTERNAL_STORAGE,
          {
            title: "Storage permission needed",
            buttonNeutral: "Ask Me Later",
            buttonNegative: "Cancel",
            buttonPositive: "OK"
          }
        );

        
        if (granted === PermissionsAndroid.RESULTS.GRANTED) {
          // Permission Granted (calling our exportDataToExcel function)
          exportDataToExcel();
          console.log("Permission granted");
        } else {
          // Permission denied
          console.log("Permission denied");
        }
      }else{
         // Already have Permission (calling our exportDataToExcel function)
         exportDataToExcel();
      }
    }catch(e){
      console.log('Error while checking permission');
      console.log(e);
      return
    }
    
  };


    useFocusEffect(
        useCallback(
            () => {
                console.log("date now======<")
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
                        console.log("summary data----->",res.data.totalsales)
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

  return (
    <View style={styles.container}>
      <View>
          <Header searchBar rounded>
                  <Text style={styles.titleText}>Daily Summary</Text>
          </Header>
      </View>
      {/* <View
      style={{
        display: 'flex',
        justifyContent: 'center',
        alignItems: 'center',
        flex: 1,
      }}>
      <TouchableOpacity
        onPress={() => handleClick()}
        style={{
          width: '50%',
          paddingVertical: 10,
          paddingHorizontal: 15,
          backgroundColor: 'blue',
          marginVertical: 20,
        }}>
        <Text style={{textAlign: 'center', color: 'white'}}>
          Export to Excel
        </Text>
      </TouchableOpacity>
    </View> */}

      <View style={styles.fixToText}>
      <Button title="Select Date"  color='#737373' onPress={() => setOpen(true)} />
      <Button title="Export To Excel" color="#841584" onPress={() => handleClick(true)} />
      </View>
      <DatePicker
        modal
        open={open}
        mode="date"
        date={date}
        onConfirm={(date) => {
          setOpen(false)
          setDate(date)
          getSummary(date)
        }}
        onCancel={() => {
          setOpen(false)
        }}
      />

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
    fixToText: {
        flexDirection: 'row',
        justifyContent: 'space-between',
        margin:20
      },
})

export default ViewSummary;
