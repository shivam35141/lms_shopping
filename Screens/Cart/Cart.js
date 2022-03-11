import React, { useContext, useEffect, useState } from "react";
// import { View, Text, StyleSheet, Button,Image } from "react-native";
import {
  View,
  Dimensions,
  StyleSheet,
  Image,
  TouchableOpacity,
} from "react-native";
import {
  Container,
  Text,
  Left,
  Right,
  H1
} from "native-base";
import { SwipeListView } from 'react-native-swipe-list-view'
import CartItem from './CartItem'

import Icon from "react-native-vector-icons/FontAwesome";
import EasyButton from "../../Shared/StyledComponents/EasyButton"

import { connect } from "react-redux";
import * as actions from "../../Redux/Actions/cartActions";
import AuthGlobal from "../../Context/store/AuthGlobal"
import axios from "axios";
import baseURL from "../../assets/common/baseUrl";
import store from "../../Redux/store";
var currentstore = store.getState();
var { height, width } = Dimensions.get("window");


const Cart = (props) => {

  const context = useContext(AuthGlobal);
  // console.log("navi----",props.navigation)
  // Add this
  const [productUpdate, setProductUpdate] = useState()
  const [totalPrice, setTotalPrice] = useState()
  useEffect(() => {
    getProducts()
    return () => {
      setProductUpdate()
      setTotalPrice()
    }
  }, [props])
  
    const getProducts = () => {
      var products = [];
      props.cartItems.forEach(cart => {
        axios.get(`${baseURL}products/${cart.product}`).then(data => {
          products.push({...data.data,quantity:cart.quantity})
          // console.log("each product",products)
          setProductUpdate(products)
          var total = 0;
          products.forEach(product => {
            const price = (total += product.price*product.quantity)
              setTotalPrice(price)
          });
        })
        .catch(e => {
          console.log(e)
        })
      })
    }

  return (
    <>
      {productUpdate ? (
        <Container>
          <H1 style={{ alignSelf: "center",marginTop:40,fontWeight:"bold",color:"dodgerblue" }}>Your Cart</H1>
          <View
  style={{
    borderBottomColor: 'grey',
    borderBottomWidth: 1,
    marginTop:10,
    marginBottom:20,
    width:140,
    alignSelf:"center"
    
  }}
/>
          <SwipeListView
            data={productUpdate}
            renderItem={(data) => (
             <CartItem item={data} />
            )}
            renderHiddenItem={(data) => (
              <View style={styles.hiddenContainer}>
                <TouchableOpacity 
                style={styles.hiddenButton}
                onPress={() => {props.removeFromCart(data.item)}}
                >
                  <Icon name="trash" color={"white"} size={30} />
                </TouchableOpacity>
              </View>
            )}
            disableRightSwipe={true}
            previewOpenDelay={3000}
            friction={1000}
            tension={40}
            leftOpenValue={75}
            stopLeftSwipe={75}
            rightOpenValue={-75}
          />
          <View style={styles.bottomContainer}>
            <Left>
                <Text style={styles.price}>₹ {totalPrice}</Text>
            </Left>
            <Right>
                <EasyButton
                  danger
                  medium
                  onPress={() => props.clearCart()}
                >
                  <Text style={{ color: 'white' }}>Clear</Text>
                </EasyButton>
            </Right>
            <Right>
              {context.stateUser.isAuthenticated ? (
                <EasyButton
                  primary
                  medium
                  onPress={() => props.navigation.navigate('Checkout')}
                >
                <Text style={{ color: 'white' }}>Checkout</Text>
                </EasyButton>
              ) : (
                <EasyButton
                  secondary
                  medium
                  onPress={() => props.navigation.navigate("User")}
                >
                <Text style={{ color: 'white' }}>Login</Text>
                </EasyButton>
              )}
                
            </Right>
          </View>
        </Container>
      ) : (
        <Container style={styles.emptyContainer}>
          
      {/* <Image style={styles.image} source={{ uri: 'https://i.imgur.com/ofKViFD.png' }} /> */}
      
      <Image style={styles.image} source={{ uri: 'http://18.217.131.129:3000/public/uploads/empty_cart.png' }} />
          <Text style={{ color: 'grey' }}>Sry, Looks like your cart is empty o_O</Text>
          {/* <Text style={{ color: 'grey' }}>Add products to your cart to get started</Text> */}
        </Container>
      )}
    </>
  );
};


//Pending ShopNo
const mapStateToProps = (state) => {
  const { cartItems } = state;
  console.log("cart items======>",cartItems)
  return {
    // cartItems: cartItems.filter(item=>{return item.shopNo==state.shopNo})
    cartItems:cartItems
  };
};

const mapDispatchToProps = (dispatch) => {
  return {
    clearCart: () => dispatch(actions.clearCart()),
    removeFromCart: (item) => dispatch(actions.removeFromCart(item))
    }
}

const styles = StyleSheet.create({
  emptyContainer: {
    height: height,
    alignItems: "center",
    justifyContent: "center",
  },
  image :{
    marginBottom: 40,
    marginTop:0,
    width: 400, height: 300
 
  },
  bottomContainer: {
      flexDirection: 'row',
      position: 'absolute',
      bottom: 0,
      left: 0,
      backgroundColor: 'white',
      elevation: 20
  },
  price: {
      fontSize: 18,
      margin: 20,
      color: 'orange'
  },
  hiddenContainer: {
    flex: 1,
    justifyContent: 'flex-end',
    flexDirection: 'row'
  },
  hiddenButton: {
    backgroundColor: 'red',
    justifyContent: 'center',
    alignItems: 'flex-end',
    paddingRight: 25,
    height: 70,
    width: width / 1.2
  }
});

export default connect(mapStateToProps, mapDispatchToProps)(Cart);
