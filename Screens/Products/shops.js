import React from 'react';
import { TouchableOpacity, View, Dimensions, Text, Button, StyleSheet, Image, } from 'react-native';
// import React, { useState } from 'react';
// import { View, ScrollView, StyleSheet } from 'react-native';
// import { Button, ButtonGroup, withTheme, Text } from 'react-native-elements';
import Banner from "../../Shared/Banner";
import { connect } from 'react-redux';
import * as actions from '../../Redux/Actions/shopActions';
import * as cartactions from '../../Redux/Actions/cartActions';
import baseURL from "../../assets/common/baseUrl";
import store from "../../Redux/store";
var { width } = Dimensions.get("window");
var currentstore;
const unsubscribe = store.subscribe(() =>{
currentstore=store.getState()
console.log(currentstore);
}
);

const Shops = (props) => {
    const { item } = props;
    return (

        //     <TouchableOpacity>
        //    <View>
        //      <Banner />
        //    </View>
        //     <View style={styles.listContainer}>
        //         <TouchableOpacity style={styles.container} navigation={props.navigation} onPress={() =>props.navigation.navigate("Home",{shopNo:1})}>
        //             <Image
        //                 style={styles.image}
        //                 resizeMode="contain"
        //                 source={{ uri: 'https://cdn.pixabay.com/photo/2012/04/01/17/29/box-23649_960_720.png' }}
        //             />
        //             <View style={styles.card} />
        //             <Text style={styles.title}>
        //                 Bistro

        //             </Text>

        //         </TouchableOpacity>
        //         <TouchableOpacity style={styles.container} navigation={props.navigation} onPress={() =>props.navigation.navigate("Home",{shopNo:2})}>
        //             <Image
        //                 style={styles.image}
        //                 resizeMode="contain"
        //                 source={{ uri: 'https://cdn.pixabay.com/photo/2012/04/01/17/29/box-23649_960_720.png' }}
        //             />
        //             <View style={styles.card} />
        //             <Text style={styles.title}>
        //                 Needs

        //             </Text>

        //         </TouchableOpacity >
        //         <TouchableOpacity style={styles.container} >
        //             <Image
        //                 style={styles.image}
        //                 resizeMode="contain"
        //                 source={{ uri: 'https://cdn.pixabay.com/photo/2012/04/01/17/29/box-23649_960_720.png' }}
        //             />
        //             <View style={styles.card} />
        //             <Text style={styles.title}>
        //                 Sajni

        //             </Text>

        //         </TouchableOpacity>
        //         <TouchableOpacity style={styles.container} navigation={props.navigation} onPress={() =>props.navigation.navigate("Home",{shopNo:4})}>
        //             <Image
        //                 style={styles.image}
        //                 resizeMode="contain"
        //                 source={{ uri: 'https://cdn.pixabay.com/photo/2012/04/01/17/29/box-23649_960_720.png' }}
        //             />
        //             <View style={styles.card} />
        //             <Text style={styles.title}>
        //                 RSA

        //             </Text>

        //         </TouchableOpacity>
        //     </View>
        //     </TouchableOpacity>


        <View
            style={styles.container}
        >

            <View >
                <Banner />
            </View>

            <View style={[styles.layout]}>
                <TouchableOpacity navigation={props.navigation} style={styles.box} onPress={() =>{ 
                    props.setShopNo('1');
                    console.log("now state is==>",currentstore)
                    props.clearCart();
                    props.navigation.navigate("Home", { shopNo: '1' })}}>
                    <Image
                        style={styles.image}
                        resizeMode="contain"
                        source={{ uri: 'http://18.217.131.129:3000/public/uploads/bistro.png' }}
                    />
                    <Text style={styles.title}>Bistro</Text></TouchableOpacity>
                <TouchableOpacity navigation={props.navigation} style={styles.box} onPress={() =>{
                     props.setShopNo('2');
                     console.log("now state is==>",currentstore)
                     props.clearCart();
                     props.navigation.navigate("Home", { shopNo: '2' })
                }}>
                    <Image
                        style={styles.image}
                        resizeMode="contain"
                        source={{ uri: 'http://18.217.131.129:3000/public/uploads/needs1.png' }}
                    />

                    <Text style={styles.title}>Needs</Text></TouchableOpacity>
                <TouchableOpacity navigation={props.navigation} style={styles.box} onPress={() =>{
                     props.setShopNo('3');
                     console.log("now state is==>",currentstore)
                     props.clearCart();
                     props.navigation.navigate("Home", { shopNo: '3' })
                }}>
                    <Image
                        style={styles.image}
                        resizeMode="contain"
                        source={{ uri: 'http://18.217.131.129:3000/public/uploads/sajni.png' }}
                    />

                    <Text style={styles.title}>Sajni</Text></TouchableOpacity>
                <TouchableOpacity navigation={props.navigation} style={styles.box} onPress={() =>{
                     props.setShopNo('4');
                     props.clearCart();
                     props.navigation.navigate("Home", { shopNo: '4' })
                }}>
                    <Image
                        style={styles.image}
                        resizeMode="contain"
                        source={{ uri: 'http://18.217.131.129:3000/public/uploads/rsa.png' }}
                    />

                    <Text style={styles.title}>RSA</Text></TouchableOpacity>
            </View>
        </View>


    )
}

// const styles = StyleSheet.create({
//     container: {
//         width: width / 2 - 20,
//         height: width / 2.5,
//         padding: 10,
//         borderRadius: 10,
//         marginTop: 55,
//         marginBottom: 5,
//         marginLeft: 10,
//         alignItems: 'center',
//         elevation: 8,
//         backgroundColor: 'white'
//     },
//     image: {
//         width: width / 2 - 20 - 10,
//         height: width / 2 - 20 - 30,
//         backgroundColor: 'transparent',
//         position: 'absolute',
//         top: -45
//     },

//     listContainer: {
//         // height: height*5,
//         flex: 1,
//         flexDirection: "row",
//         alignItems: "flex-start",
//         flexWrap: "wrap",
//         backgroundColor: "gainsboro",
//       },

//     card: {
//         marginBottom: 10,
//         height: width / 2 - 20 - 90,
//         backgroundColor: 'transparent',
//         width: width / 2 - 20 - 10
//     },
//     title: {
//         fontWeight: "bold",
//         fontSize: 14,
//         textAlign: 'center'
//     },
//     price: {
//         fontSize: 20,
//         color: 'orange',
//         marginTop: 10
//     }
// })
const mapStateToProps = (state) => {
    const { shopNum } = state;
    console.log("cart items in shop.js======>",shopNum)
    return {
      // cartItems: cartItems.filter(item=>{return item.shopNo==state.shopNo})
      shopNo:shopNum
    };
  };
const mapToDispatchToProps = (dispatch) => {
    return {
        setShopNo: (shop) => { dispatch(actions.setShopNo(shop))},
        clearCart: () => {dispatch(cartactions.clearCart())}
    }
}



const styles = StyleSheet.create({
    container: {
        marginTop: 50,
        // justifyContent:'center',
        // position:'absolute',
        flex: 1,
    },
    layout: {
        flex: 1,
        flexDirection: "row",
        alignItems: "flex-start",
        flexWrap: "wrap",
        backgroundColor: "gainsboro",
        marginTop:15
    },

    image: {
        width: width / 2 - 20 - 10,
        height: width / 2 - 20 - 30,
        backgroundColor: 'transparent',
        position: 'absolute',
        top: -45
    },

    title: {
        fontWeight: "bold",
        fontSize: 20,
        textAlign: 'center',
        color: "white",
        // marginTop:20
        position:"absolute",
        bottom:20

    },

    box: {
        width: width / 2 - 20,
        height: width / 2.5,
        padding: 10,
        borderRadius: 10,
        marginTop: 55,
        marginBottom: 5,
        marginLeft: 10,
        alignItems: 'center',
        elevation: 8,
        backgroundColor: 'white'
    },
    // icon:{
    //     name: 'home',
    //     type: 'font-awesome',
    //     size: 15,
    //     color: 'white',
    //   },
})

// export default Shops;
export default connect(mapStateToProps, mapToDispatchToProps)(Shops);