import React, { useState, useEffect } from "react";
import { Image, StyleSheet, Dimensions, View, ScrollView } from "react-native";
import Swiper from "react-native-swiper/src";

var { width } = Dimensions.get("window");

const Banner = (props) => {
  console.log("banner------->",props.shopNo)
  const [bannerData, setBannerData] = useState([]);
  const shopbanners = [
    [
      //Bistro
    "http://18.217.131.129:3000/public/uploads/banner1.jpeg",
    "http://18.217.131.129:3000/public/uploads/banner2.jpeg",
    // "http://18.217.131.129:3000/public/uploads/banner3.jpeg",
    "http://18.217.131.129:3000/public/uploads/movie.jpeg",
    "http://18.217.131.129:3000/public/uploads/event1.jpeg",
    
    
  ],
  [//Needs
  "http://18.217.131.129:3000/public/uploads/shop2/needs1.jpg",
  "http://18.217.131.129:3000/public/uploads/shop2/needs2.jpg",
  "http://18.217.131.129:3000/public/uploads/shop2/needs3.jpg",
    // "http://18.217.131.129:3000/public/uploads/banner3.jpeg",
    "http://18.217.131.129:3000/public/uploads/movie.jpeg",
    "http://18.217.131.129:3000/public/uploads/event1.jpeg",
    
    
  ],
  [//Sajni
    // "https://images.vexels.com/media/users/3/126443/preview2/ff9af1e1edfa2c4a46c43b0c2040ce52-macbook-pro-touch-bar-banner.jpg",
    "http://18.217.131.129:3000/public/uploads/shop3/sajni1.jpg",
    "http://18.217.131.129:3000/public/uploads/shop3/sajni2.jpg",
    "http://18.217.131.129:3000/public/uploads/shop3/sajni3.jpg",
    // "http://18.217.131.129:3000/public/uploads/banner2.jpeg",
    // "http://18.217.131.129:3000/public/uploads/banner3.jpeg",
    "http://18.217.131.129:3000/public/uploads/movie.jpeg",
    "http://18.217.131.129:3000/public/uploads/event1.jpeg",
    
  ],
[//RSA
    "http://18.217.131.129:3000/public/uploads/banner1.jpeg",
    "http://18.217.131.129:3000/public/uploads/banner2.jpeg",
    // "http://18.217.131.129:3000/public/uploads/banner3.jpeg",
    "http://18.217.131.129:3000/public/uploads/movie.jpeg",
    "http://18.217.131.129:3000/public/uploads/event1.jpeg",
   
    
  ],
  [//main
  "http://18.217.131.129:3000/public/uploads/banner1.jpeg",
  "http://18.217.131.129:3000/public/uploads/shop2/needs1.jpg",
  "http://18.217.131.129:3000/public/uploads/shop3/sajni1.jpg",

    // "http://18.217.131.129:3000/public/uploads/banner3.jpeg",
    "http://18.217.131.129:3000/public/uploads/movie.jpeg",
    "http://18.217.131.129:3000/public/uploads/event1.jpeg",
   
    
  ]
]

  useEffect(() => {
    console.log("before-baneer==================>",props.shopNo)
    setBannerData(shopbanners[props.shopNo? (props.shopNo-1) : (shopbanners.length-1)]);

    return () => {
      setBannerData([]);
    };
  }, []);

  return (
    <ScrollView>
      <View style={styles.container}>
        <View style={styles.swiper}>
          <Swiper
            style={{ height: width / 2 }}
            showButtons={false}
            autoplay={true}
            autoplayTimeout={4}
          >
            {bannerData.map((item) => {
              return (
                <Image
                  key={item}
                  style={styles.imageBanner}
                  resizeMode="contain"
                  source={{ uri: item }}
                />
              );
            })}
          </Swiper>
          <View style={{ height: 20 }}></View>
        </View>
      </View>
    </ScrollView>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    // backgroundColor: "gainsboro",
    backgroundColor: 'rgba(0,0,0,0.05)',
    
  },
  swiper: {
    width: width,
    alignItems: "center",
    marginTop: 10,
  },
  imageBanner: {
    height: width / 2,
    width: width - 40,
    borderRadius: 10,
    marginHorizontal: 20,
  },
});

export default Banner;
