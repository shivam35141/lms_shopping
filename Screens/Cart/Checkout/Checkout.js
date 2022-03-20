import React, { useEffect, useState, useContext} from 'react'
import { Text, View, Button } from 'react-native'
import { Item, Picker, Toast } from 'native-base'
// import Icon from 'react-native-vector-icons/FontAwesome'
import FormContainer from '../../../Shared/Form/FormContainer'
import Input from '../../../Shared/Form/Input'
import { KeyboardAwareScrollView } from 'react-native-keyboard-aware-scroll-view'
import AuthGlobal from "../../../Context/store/AuthGlobal"
import axios from "axios";
import { connect } from 'react-redux'
import baseURL from '../../../assets/common/baseUrl'
import AsyncStorage from '@react-native-community/async-storage'

// const countries = require("../../../assets/countries.json");

const Checkout = (props) => {
    const context = useContext(AuthGlobal)
    const [ orderItems, setOrderItems ] = useState();
    const [ name, setName ] = useState();
    const [ address, setAddress ] = useState();
    const [ address2, setAddress2 ] = useState();
    const [ city, setCity ] = useState();
    const [ zip, setZip ] = useState();
    const [ country, setCountry ] = useState();
    const [ phone, setPhone ] = useState();
    const [ user, setUser ] = useState();
    const [totalPrice, setTotalPrice] = useState();
    useEffect(() => {
        AsyncStorage.getItem("jwt")
        .then((res) => {
            axios
                .get(`${baseURL}users/${context.stateUser.user.userId}`, {
                    headers: { Authorization: `Bearer ${res}` },
                })
                .then((user) => {
                   let name=capitalize(user.data.name);
                   setName(name);
                   setPhone(user.data.phone)
                })
        })
        .catch((error) => console.log(error))
        setOrderItems(props.cartItems)
        getProducts();
        if(context.stateUser.isAuthenticated) {
            setUser(context.stateUser.user.userId)
        } else {
            props.navigation.navigate("Cart");
            Toast.show({
                topOffset: 60,
                type: "error",
                text1: "Please Login to Checkout",
                text2: ""
            });
        }
    

        return () => {
            setOrderItems();
        }
    }, [])
    const getProducts = () => {
        var products = [];
        console.log(props)
        props.cartItems.forEach(cart => {
          axios.get(`${baseURL}products/${cart.product}`).then(data => {
            products.push(data.data)
            var total = 0;
            products.forEach(product => {
              const price = (total += product.price)
                setTotalPrice(price)
            });
          })
          .catch(e => {
            console.log(e)
          })
        })
      }
    const checkOut = () => {
        console.log("orderItems", orderItems)
        let order = {
            city,
            country,
            name,
            dateOrdered: Date.now(),
            orderItems,
            phone,
            shippingAddress1: address,
            shippingAddress2: address2,
            status: "3",
            user,
            zip,
            totalPrice,
            shopNo:props.shopNo
        }
        console.log("order-->",order)

        props.navigation.navigate("Confirm", {order:{order: order }})
    }

    const capitalize=(str)=>{
        return str.charAt(0).toUpperCase() + str.slice(1);
        }

    return (
        <KeyboardAwareScrollView
            viewIsInsideTabBar={true}
            extraHeight={200}
            enableOnAndroid={true}
        >
            <FormContainer title={"Customer Details"}>
            <Input
                    placeholder={"Enter Name"}
                    name={"name"}
                    value={name}
                    onChangeText={(text) => setName(text)}
                />
                <Input
                    placeholder={"Contact No"}
                    name={"phone"}
                    value={phone}
                    keyboardType={"numeric"}
                    onChangeText={(text) => setPhone(text)}
                />
                   <Input
                    placeholder={"Order Description"}
                    name={"ShippingAddress1"}
                    value={address}
                    onChangeText={(text) => setAddress(text)}
                />
                   {/* <Input
                    placeholder={"Shipping Address 2"}
                    name={"ShippingAddress2"}
                    value={address2}
                    onChangeText={(text) => setAddress2(text)}
                />
                   <Input
                    placeholder={"City"}
                    name={"city"}
                    value={city}
                    onChangeText={(text) => setCity(text)}
                />
                   <Input
                    placeholder={"Zip Code"}
                    name={"zip"}
                    value={zip}
                    keyboardType={"numeric"}
                    onChangeText={(text) => setZip(text)}
                /> */}
                {/* <Item picker>
                    <Picker
                        mode="dropdown"
                        iosIcon={<Icon name="arrow-down" color={"#007aff"} />}
                        style={{ width: undefined }}
                        selectedValue={country}
                        placeholder="Select your country"
                        placeholderStyle={{ color: '#007aff' }}
                        placeholderIconColor="#007aff"
                        onValueChange={(e) => setCountry(e)}
                    >
                        {countries.map((c) => {
                            return <Picker.Item 
                                    key={c.code} 
                                    label={c.name}
                                    value={c.name}
                                    />
                        })}
                    </Picker>
                </Item> */}
                <View 
                // style={{ width: '80%', alignItems: "center",backgroundColor: 'rgba(90, 154, 230, 1)',
                // borderColor: 'transparent',
                // borderWidth: 0,
                // borderRadius: 50,padding:10 }}
                >
                    <Button title="Confirm" onPress={() => checkOut()}/>
                </View>
            </FormContainer>
        </KeyboardAwareScrollView>
    )
}

// box: {
//     padding: 25,
//   //   backgroundColor: '#3B6CD4',
//   //   margin: 5,
  
// //     backgroundColor: 'rgba(90, 154, 230, 1)',
// //                 borderColor: 'transparent',
// //                 borderWidth: 0,
// //                 borderRadius: 50,
// //   },
  

const mapStateToProps = (state) => {
    console.log("state",state)
    return {
        cartItems: state.cartItems,
        shopNo: state.shopNo
    }
}

export default connect(mapStateToProps)(Checkout)