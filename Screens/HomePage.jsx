import {
  StyleSheet,
  Text,
  View,
  Switch,
  Button,
  ActivityIndicator,
} from "react-native";
import { StatusBar } from "expo-status-bar";
import React, { useState } from "react";
import Header from "../Components/Header";
import SearchBar from "../Components/SearchBar";

export default function HomePage({ navigation }) {
  const [apiResponse, setApiResponse] = useState(false);
  const deployedUrl =
    "https://virtualbartender-842672486.development.catalystserverless.com/server/zcqlSearchFunction/random";
  //
  const simpleRes =
    "https://virtualbartender-842672486.development.catalystserverless.com/server/cocktailDBResponse/";
  //

  //begin backend call
  const randomDrinkSorta = async () => {
    setApiResponse(true);
    fetch(simpleRes)
      .then((res) => res.json())
      .then((responseJSON) => {
        console.log(responseJSON);
        navigation.navigate("DrinkDetails", {
          name: responseJSON.drink.name,
          instructions: responseJSON.drink.instructions,
          picSrc: responseJSON.drink.picSrc,
        });
        setApiResponse(false);
        console.log("end line");
      })
      .catch((err) => {
        console.log(err.message);
      });
    // return setApiResponse(drinkName);
  };
  return (
    <View style={styles.container}>
      <Header />
      <ActivityIndicator
        style={styles.activity}
        animating={apiResponse ? true : false}
        size={"large"}
      />
      <Button
        style={styles.button}
        onPress={randomDrinkSorta}
        title="Random Drink"
        color="green"
      />
      <SearchBar />
    </View>
  );
}
const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: "black",
    alignItems: "center",
    justifyContent: "start",
  },
  button: {
    padding: 10,
  },
  activity: {
    position: "absolute",
    zIndex: 1,
    top: "50%",
  },
});
