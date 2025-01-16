import { useState } from "react";
import {
  StyleSheet,
  Text,
  View,
  Button,
  Image,
  FlatList,
  ActivityIndicator,
  Pressable,
  Alert,
} from "react-native";
export default function SearchResults({ navigation, route }) {
  const [dataLoaded, setDataLoaded] = useState(false);
  const [data, setData] = useState([]);
  const [drinkLoading, setDrinkLoading] = useState(false);
  // Function definitions for the search bar
  const searchByDrink = async () => {
    let res;
    res = await fetch(
      "https://virtualbartenderapi-10072083063.development.catalystappsail.com/drinks/search?searchQuery=" +
        route.params.searchQuery +
        "&toggleValue=false"
    );
    res = await res.json();
    console.log(res);
    setDataLoaded(true);
    setData(res.drinks);
  };
  const searchByIngredient = async () => {
    let res;
    res = await fetch(
      "https://virtualbartenderapi-10072083063.development.catalystappsail.com/drinks/search?searchQuery=" +
        route.params.searchQuery +
        "&toggleValue=true"
    );
    res = await res.json();
    console.log(res);
    setDataLoaded(true);
    setData(res.drinks);
  };
  // Function calls for the search bar
  if (!route.params.toggleValue && !dataLoaded) {
    searchByDrink();
  } else if (route.params.toggleValue && !dataLoaded) {
    searchByIngredient();
  }
  const drinkPress = async (ROWID) => {
    setDrinkLoading(true);
    console.log(`Drink Pressed\nrowid: ${ROWID}`);
    let response;
    try {
      response = await fetch(
        `https://virtualbartenderapi-10072083063.development.catalystappsail.com/drinks/${ROWID}`
      );
      const res = await response.json();
      console.log(res);
      setDrinkLoading(false);
      // navigation.setOptions({ headerShown: false });
      navigation.navigate("Home", {
        screen: "DrinkDetails",
        params: {
          drinkName: res.data.drinkName,
          picSrc: res.data.picSrc,
          instructions: res.data.instructions,
          ingredientStuff: res.data.ingredientStuff,
        },
      });
    } catch (error) {
      console.log(error);
    }
  };
  const DrinkItem = ({ drinkName, instructions, ROWID, picSrc }) => {
    return (
      <Pressable
        onLongPress={() =>
          Alert.alert(drinkName, instructions, [{ text: "okie" }], {
            cancelable: true,
          })
        }
        onPress={() => drinkPress(ROWID)}
      >
        <Image style={styles.drinkImage} source={{ uri: picSrc }} />
      </Pressable>
    );
  };

  return (
    <View style={styles.container}>
      {dataLoaded ? (
        <FlatList
          data={data}
          renderItem={({ item }) => (
            <DrinkItem
              picSrc={item.picSrc}
              ROWID={item.ROWID}
              drinkName={item.name}
              instructions={item.instructions}
            />
          )}
          keyExtractor={(drink_item) => drink_item.drinkID}
          numColumns={3}
        />
      ) : (
        <ActivityIndicator
          style={{ position: "absolute", zIndex: 1, top: "50%", left: "50%" }}
          animating={dataLoaded ? false : true}
          size={"large"}
        />
      )}
    </View>
  );
}
const styles = StyleSheet.create({
  container: {
    paddingLeft: 7,
    backgroundColor: "#333333",
    height: "100%",
  },
  drinkImage: {
    height: 115,
    width: 115,
    // margin: 5,
    borderColor: "#5E5E5E",
    borderWidth: 2,
    borderRadius: 25,
  },
});
