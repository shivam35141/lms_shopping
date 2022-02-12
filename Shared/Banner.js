import React, { useState, useEffect } from "react";
import { Image, StyleSheet, Dimensions, View, ScrollView } from "react-native";
import Swiper from "react-native-swiper/src";

var { width } = Dimensions.get("window");

const Banner = () => {
  const [bannerData, setBannerData] = useState([]);

  useEffect(() => {
    setBannerData([
      "https://images.vexels.com/media/users/3/126443/preview2/ff9af1e1edfa2c4a46c43b0c2040ce52-macbook-pro-touch-bar-banner.jpg",
      "https://pbs.twimg.com/media/D7P_yLdX4AAvJWO.jpg",
      "https://asset20.ckassets.com/blog/wp-content/uploads/sites/5/2018/02/Black-Widow.jpg",
      "https://images.news18.com/ibnlive/uploads/2021/01/1611818353_pushpa-1.jpg?impolicy=website&width=510&height=356",
      "https://photos.google.com/share/AF1QipPuAIDv1rb2l0O4SvWFCjFFXC4zpRm3_hspqRzGaolodYUnPBTkpWUiW3i53yU2ug/photo/AF1QipN1Lik5D3VtLvz401Lw5bZYqQDP3zrzCTUTUv13?key=M1FPQlpWVXJzc2p4TUY3blRtX2Fmb2tmVWtpM2RR"
      //"https://drive.google.com/file/d/1ogZsY0UIBj8Eo3cALcpvLNfIZaJ80Ja4/view?usp=sharing/movie.png"
      // "/movie.jpg",
      
    ]);

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
    backgroundColor: "gainsboro",
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
