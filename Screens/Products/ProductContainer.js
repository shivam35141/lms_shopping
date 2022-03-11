import React, { useState, useCallback,useContext } from "react";
import {
  View,
  StyleSheet,
  ActivityIndicator,
  FlatList,
  Image,
  ScrollView,
  Dimensions
} from "react-native";
import { Container, Header, Icon, Item, Input, Text } from "native-base";
import { useFocusEffect } from '@react-navigation/native'
import axios from 'axios';
import { connect } from 'react-redux';
import * as actions from '../../Redux/Actions/shopActions';
import ProductList from "./ProductList";
import SearchedProduct from "./SearchedProducts";
import Banner from "../../Shared/Banner";
import CategoryFilter from "./CategoryFilter";
import baseURL from "../../assets/common/baseUrl";
import AuthGlobal from "../../Context/store/AuthGlobal";
var { height } = Dimensions.get('window')

const ProductContainer = (props) => {
  const context = useContext(AuthGlobal);
  const admin=context.stateUser.isAuthenticated && context.stateUser.user.isAdmin==true;
  console.log("before error================================================================================================>",props.route)
  const [shopNo,setShop]= useState(admin?(context.stateUser.userProfile.shopNo):((props.route.params)?props.route.params.shopNo : ''));
  if(admin){
    props.setShopNumber(shopNo)
  }

  const [products, setProducts] = useState([]);
  const [productsFiltered, setProductsFiltered] = useState([]);
  const [focus, setFocus] = useState();
  const [categories, setCategories] = useState([]);
  const [productsCtg, setProductsCtg] = useState([]);
  const [active, setActive] = useState();
  const [initialState, setInitialState] = useState([]);
  const [loading, setLoading] = useState(true)

  useFocusEffect((
    
    useCallback(
      () => {
        setFocus(false);
        setActive(-1);
        
        // Products
        axios
          .get(`${baseURL}products?shopNo=${Number(shopNo)}`)
          .then((res) => {
            setProducts(res.data);
            setProductsFiltered(res.data);
            setProductsCtg(res.data);
            setInitialState(res.data);
            setLoading(false)
          })
          .catch((error) => {
            console.log('Api call error')
          })
    
        // Categories
        axios
          .get(`${baseURL}categories?shopNo=${Number(shopNo)}`)
          .then((res) => {

            setCategories(res.data)
          })
          .catch((error) => {
            console.log('Api call error')
          })
    
        return () => {
          setProducts([]);
          setProductsFiltered([]);
          setFocus();
          setCategories([]);
          setActive();
          setInitialState();
          setShop();
        };
      },
      [],
    )
  ))
    
   
  

  // Product Methods
  const searchProduct = (text) => {
    setProductsFiltered(
      products.filter((i) => i.name.toLowerCase().includes(text.toLowerCase()))
    );
  };

  const openList = () => {
    setFocus(true);
  };

  const onBlur = () => {
    setFocus(false);
  };

  // Categories
  const changeCtg = (ctg) => {
    {
      ctg === "all"
        ? [setProductsCtg(initialState), setActive(true)]
        : [
            setProductsCtg(
              products.filter((i) => i.category._id === ctg),
              setActive(true)
            ),
          ];
    }
  };
  return (
    <>
    {loading == false ? (
 <Container>
 <Header searchBar rounded>
   <Item style={{ padding: 1 , borderRadius: 20}}>
     <Icon name="ios-search" />
     <Input
       placeholder="Search Products"
       onFocus={openList}
       onChangeText={(text) => searchProduct(text)}
     />
     {focus == true ? <Icon onPress={onBlur} name="ios-close" /> : null}
   </Item>
 </Header>
 {focus == true ? (
   <SearchedProduct 
   navigation={props.navigation}
   productsFiltered={productsFiltered} />
 ) : (
   <ScrollView>
     <View>
       <View> 
         <Banner shopNo={admin?'1':props.route.params.shopNo} />
       </View>
       <View>
         <CategoryFilter
           categories={categories}
           categoryFilter={changeCtg}
           productsCtg={productsCtg}
           active={active}
           setActive={setActive}
         />
       </View>
       {productsCtg.length > 0 ? (
       <View style={styles.listContainer}>
           {productsCtg.map((item) => {
               return(
                   <ProductList
                       navigation={props.navigation}
                       key={item.name}
                       item={item}
                   />
               )
           })}
       </View>
       ) : 
      //  (
      //      <View style={[styles.center, { height: height / 2}]}>
      //          <Text>No products found</Text>
      //      </View>
      //  )
      (
        <Container style={styles.emptyContainer}>
          
      {/* <Image style={styles.image} source={{ uri: 'https://i.imgur.com/ofKViFD.png' }} /> */}
      
      <Image style={styles.image} source={{ uri: 'http://18.217.131.129:3000/public/uploads/coming_soon.png' }} />
          <Text style={{ color: 'grey',textAlign:"center" }}>Why Don't you try other Shops ?</Text>
          {/* <Text style={{ color: 'grey' }}>Add products to your cart to get started</Text> */}
        </Container>
      )}
       
       
      
     </View>
   </ScrollView>
 )}
</Container>
    ) : (
      // Loading
      <Container style={[styles.center, { backgroundColor: "#f2f2f2" }]}>
        <ActivityIndicator size="large" color="green" />
      </Container>
    )}
   </>
  );
};

const mapToDispatchToProps = (dispatch) => {
  return {
    setShopNumber: (shop) => { dispatch(actions.setShopNo(shop))},
  }
}

const styles = StyleSheet.create({
  container: {
    flexWrap: "wrap",
    backgroundColor: "gainsboro",
  },
  listContainer: {
    // height: height*5,
    flex: 1,
    flexDirection: "row",
    alignItems: "flex-start",
    flexWrap: "wrap",
    backgroundColor: "gainsboro",
  },
  image :{
    marginBottom: 10,
    marginTop:0,
    width: 400, height: 300
 
  },

  center: {
      justifyContent: 'center',
      alignItems: 'center'
  }
});

export default connect(null, mapToDispatchToProps)(ProductContainer);
