import { StyleSheet, Text, View, Switch, Button } from "react-native";
import { StatusBar } from "expo-status-bar";
import React, { useState } from "react";
import Header from "../Components/Header";
import SearchBar from "../Components/SearchBar";

export default function HomePage({ navigation }) {
  const [apiResponse, setApiResponse] = useState({
    name: "default text",
    instructions: "default instructions",
  });
  const deployedUrl =
    "https://virtualbartender-842672486.development.catalystserverless.com/server/zcqlSearchFunction/";
  const randomDrinkSorta = async () => {
    const drinkName = "Amaretto Sunrise";
    fetch(deployedUrl)
      .then((res) => res.json())
      .then((responseJSON) => {
        console.log(responseJSON);
        // setApiResponse({
        //   name: responseJSON.name,
        //   instructions: responseJSON.numberData,
        //   picSrc: responseJSON.picSrc
        // });
        navigation.navigate("DrinkDetails", {
          name: responseJSON.name,
          instructions: responseJSON.instructions,
          picSrc: responseJSON.picSrc,
        });
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
});
