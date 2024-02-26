import {
  View,
  Text,
  StyleSheet,
  ActivityIndicator,
  Image,
  Button,
  FlatList,
  Pressable,
} from "react-native";
import { Suspense, useEffect, useState } from "react";
export default function AllDrinks({ navigation }) {
  const [dataLoaded, setDataLoaded] = useState(false);
  const [drinkData, setDrinkData] = useState([]);
  const [drinkLoading, setDrinkLoading] = useState(false);

  const getAllDrinks = async () => {
    let res;
    res = await fetch(
      "https://virtualbartender-842672486.development.catalystserverless.com/server/getAllDrinks/"
    );
    res = await res.json();
    setDataLoaded(true);
    setDrinkData(res.data);
  };
  if (!dataLoaded) {
    getAllDrinks();
  }
  const drinkPress = async (ROWID) => {
    setDrinkLoading(true);
    let response;
    response = await fetch(
      `https://virtualbartender-842672486.development.catalystserverless.com/server/getSingleDrink?ID=${ROWID}`
    );
    const res = await response.json();
    console.log(res);
    setDrinkLoading(false);
    navigation.navigate("DrinkDetails", {
      drinkName: res.data.drinkName,
      picSrc: res.data.picSrc,
      instructions: res.data.instructions,
      ingredientStuff: res.data.ingredientStuff,
    });
  };
  // const allDrinkData = async () => await getAllDrinks();
  // console.log(`this is the data ${allDrinkData}`);
  const DrinkItem = ({ ROWID, picSrc }) => {
    return (
      <Pressable onPress={() => drinkPress(ROWID)}>
        <Image style={styles.drinkImage} source={{ uri: picSrc }} />
      </Pressable>
    );
  };

  return (
    <>
      <View style={styles.container}>
        <ActivityIndicator
          style={{ position: "absolute", zIndex: 1, top: "50%", left: "50%" }}
          animating={drinkLoading ? true : false}
          size={"large"}
        />
        {drinkData.length ? (
          <FlatList
            data={drinkData}
            renderItem={({ item }) => (
              <DrinkItem
                ROWID={item.drinks.ROWID}
                picSrc={item.drinks.picSrc}
              />
            )}
            keyExtractor={(drink_item) => drink_item.drinks.ROWID}
            numColumns={3}
            initialNumToRender={30}
          />
        ) : (
          <Text>List pretyy empty</Text>
        )}
      </View>
    </>
  );
}

const styles = StyleSheet.create({
  container: {
    paddingLeft: 10,
    backgroundColor: "#333333",
  },
  drinkImage: {
    height: 125,
    width: 125,
    // margin: 5,
    borderColor: "#5E5E5E",
    borderWidth: 2,
    borderRadius: 25,
  },
});
