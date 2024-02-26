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
} from "react-native";
export default function SearchResults({ navigation, route }) {
  const [dataLoaded, setDataLoaded] = useState(false);
  const [data, setData] = useState([]);

  const searchByDrink = async () => {
    let res;
    res = await fetch(
      "https://virtualbartender-842672486.development.catalystserverless.com/server/cocktailDBResponse/searchDrink?searchQuery=" +
        route.params.searchText
    );
    res = await res.json();
    console.log(res);
    setDataLoaded(true);
    setData(res.drinks);
  };

  if (!route.params.toggleValue && !dataLoaded) {
    searchByDrink();
  } else if (route.params.toggleValue && !dataLoaded) {
    const searchByIngredientUrl =
      "https://www.thecocktaildb.com/api/json/v1/1/filter.php?i=Gin";
  }
  const DrinkItem = ({ ROWID, picSrc }) => {
    return (
      <Pressable onPress={() => drinkPress(ROWID)}>
        <Image style={styles.drinkImage} source={{ uri: picSrc }} />
      </Pressable>
    );
  };

  return (
    <View style={styles.container}>
      {dataLoaded ? (
        <FlatList
          data={data}
          renderItem={({ item }) => <DrinkItem picSrc={item.picSrc} />}
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
