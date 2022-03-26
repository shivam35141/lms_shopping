import React, { useEffect,useState } from 'react'
import { View, Button } from 'react-native'
import {
    Container,
    Header,
    Content,
    ListItem,
    Text,
    Radio,
    Right,
    Left,
    Picker,
    Icon,
    Body,
    Title
} from 'native-base';
import RNUpiPayment from 'react-native-upi-payment'
import Toast from "react-native-toast-message";
import { connect } from "react-redux";
import * as actions from "../../../Redux/Actions/cartActions";
import baseURL from "../../../assets/common/baseUrl";
import axios from "axios";
import AsyncStorage from "@react-native-community/async-storage"

const methods = [
    { name: 'Pay at Shop using Debit/Credit Card', value: 1 },
    // { name: 'Bank Transfer', value: 2 },
    // { name: 'Card Payment', value: 3},
    {name:'UPI - Phone Pay, Google Pay',value:4}
]
const upiIds= [
    {id:'lower7085900621@barodampay', payee:'Leimakhong Bistro'},
    {id:'REGFUNDACOC302ISUPP@SBI', payee:'Needs'},
    {id:'awwasakhishop@sbi', payee:'Sajni Leimakhong'},
    {id:'lower7085900621@barodampay', payee:'RSA Snacks'},
    {id:'lower7085900621@barodampay', payee:'RSA Bar'},
    {id:'lower7085900621@barodampay', payee:'RSA Bakery'},
    {id:'lower7085900621@barodampay', payee:'RSA Popcorn'}
]


const paymentCards = [
    { name: 'Wallet', value: 1 },
    { name: 'Visa', value: 2 },
    { name: 'MasterCard', value: 3},
    { name: 'Other', value: 4}
]
const updateOrder = (orderId) => {


    const order = {
      paymentStatus:true
    };
s
    axios
      .put(`${baseURL}orders/${orderId}`, order, config)
      .then((res) => {
        if (res.status == 200 || res.status == 201) {
          Toast.show({
            topOffset: 60,
            type: "success",
            text1: "Order Edited",
            text2: "",
          });
        }
      })
      .catch((error) => {
        Toast.show({
          topOffset: 60,
          type: "error",
          text1: "Something went wrong",
          text2: "Please try again",
        });
      });
  };

const Payment = (props) => {
    // const [productUpdate, setProductUpdate] = useState();

    const order = props.route.params;
    console.log(" in payment screen--->",order)
    const [token, setToken] = useState();
    const [selected, setSelected] = useState();
    const [card, setCard] = useState();
    AsyncStorage.getItem("jwt")
    .then((res) => {
        setToken(res);
    })
    .catch((error) => console.log(error));
    const config = {
      headers: {
        Authorization: `Bearer ${token}`,
      },
    };
    // useEffect(() => {
    //     console.log("getting order",order)
    //       if(order) {
    //         getProducts(order);
    //       }
    //     return () => {
    //       setProductUpdate();
    //     };
    //   }, [props]);

    return(
       <Container>
           <Header>
               <Body>
                   <Title>Choose your payment method</Title>
               </Body>
           </Header>
           <Content>
               {methods.map((item, index) => {
                   return (
                       <ListItem key={item.name} onPress={() => setSelected(item.value)}>
                           <Left>
                            <Text>{item.name}</Text>
                           </Left>
                           <Right>
                               <Radio selected={selected == item.value}/>
                           </Right>
                       </ListItem>
                   )
               })}
               {/* {selected == 4 ? (
               

               ) : null } */}
               {/* {selected == 3 ? (
                   <Picker
                    mode="dropdown"
                    iosIcon={<Icon name={"arrow-down"} />}
                    headerStyle={{ backgroundColor: 'orange' }}
                    headerBackButtonTextStyle={{ color: '#fff' }}
                    headerTitleStyle={{ color: '#fff' }}
                    selectedValue={card}
                    onValueChange={(x) => setCard(x)}
                   >
                       {paymentCards.map((c, index) => {
                           return <Picker.Item 
                           key={c.name} 
                           label={c.name} 
                           value={c.name} />
                       })}
                   </Picker>
               ) : null } */}
               <View style={{ marginTop: 60, alignSelf: 'center' }}>
                       <Button 
                       title={"Confirm"} 
                       onPress={() =>{ 

                        if(selected==1){
                         Toast.show({
                        topOffset: 60,
                        type: "success",
                        text1: "Order Completed",
                        text2: "",
                    });
                    setTimeout(() => {
                        props.clearCart();
                        props.navigation.navigate("Cart");
                    }, 500);
                    }
                    else if(selected==4){
                      RNUpiPayment.initializePayment({
                        // vpa: 'Q236459276@ybl', // or can be john@ybl or mobileNo@upi
                        vpa: upiIds[order.order.shopNo-1].id, // or can be john@ybl or mobileNo@upi
                        payeeName: upiIds[order.order.shopNo-1].payee,
                        amount: order.order.totalPrice.toString() || '1',
                        transactionRef: order.order.id
                      }, (success)=>{
                         console.log(success)
                      updateOrder(order.order._id)
                      console.log("success")
                      Toast.show({
                          topOffset: 60,
                          type: "success",
                          text1: "Order Completed",
                          text2: "",
                      });
                      setTimeout(() => {
                          props.clearCart();
                          props.navigation.navigate("Cart");
                      }, 500);
                },  (err) => {
                    console.log("error",err)
                    if(err.Status=='failed' || err.status=="FAILURE"){
                    Toast.show({
                        topOffset: 60,
                        type: "error",
                        text1: "Something went wrong",
                        text2: "Please try again",
                      });
                    } 
                    else if(err.Status=='Success' || err.status=='SUCCESS'){
                      Toast.show({
                        topOffset: 60,
                        type: "success",
                        text1: "Order Completed",
                        text2: "",
                    });
                    setTimeout(() => {
                        props.clearCart();
                        props.navigation.navigate("Cart");
                    }, 500);
                    }
                })
                    } }}/>
               </View>
           </Content>
       </Container>
    )
}

const mapDispatchToProps = (dispatch) => {
    return {
      clearCart: () => dispatch(actions.clearCart()),
    };
  };

  // Add this
  const getProducts = (x) => {
    const order = x.order.order;
    var products = [];
    if(order) {
        order.orderItems.forEach((cart) => {
            axios
              .get(`${baseURL}products/${cart.product}`)
              .then((data) => {
                products.push(data.data);
                console.log("my products",products)
                setProductUpdate(products);
              })
              .catch((e) => {
                console.log(e);
              });
          });
    }
    
  };

export default connect(null, mapDispatchToProps)(Payment);