import {
  StyleSheet,
  Text,
  View,
  Switch,
  Button,
  TextInput,
  ActivityIndicator,
} from "react-native";
import { StatusBar } from "expo-status-bar";
import React, { useState } from "react";
import Header from "../Components/Header";
import SearchBar from "../Components/SearchBar";

export default function HomePage({ navigation }) {
  const [apiResponse, setApiResponse] = useState(false);
  const [searchToggle, setSearchToggle] = useState(false);
  const toggleSwitch = () => setSearchToggle((previousState) => !previousState);

  const randomRes =
    "https://virtualbartender-842672486.development.catalystserverless.com/server/cocktailDBResponse/random";
  //

  //begin backend call
  const randomDrink = () => {
    setApiResponse(true);
    fetch(randomRes)
      .then((res) => res.json())
      .then((responseJSON) => {
        console.log(responseJSON);
        navigation.navigate("DrinkDetails", {
          drinkName: responseJSON.drink.name,
          instructions: responseJSON.drink.instructions,
          picSrc: responseJSON.drink.picSrc,
          ingredientStuff: responseJSON.drink.ingredientStuff,
        });
        setApiResponse(false);
        console.log("end line");
      })
      .catch((err) => {
        console.log(err.message);
      });
    // return setApiResponse(drinkName);
  };
  const allDrinks = () => {
    navigation.navigate("AllDrinks");
  };
  const submitHandler = (input, toggleValue) => {
    console.log(input);
    navigation.navigate("SearchResults", {
      searchText: input,
      toggleValue: toggleValue,
    });
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
        onPress={randomDrink}
        title="Random Drink"
        color="green"
      />
      <Switch
        trackColor={{ false: "#767577", true: "#81b0ff" }}
        thumbColor={searchToggle ? "#f5dd4b" : "#f4f3f4"}
        ios_backgroundColor="#3e3e3e"
        onValueChange={toggleSwitch}
        value={searchToggle}
      />
      <TextInput
        style={styles.inputBox}
        placeholder={
          searchToggle
            ? "Searching Drinks by Ingredient Name"
            : "Searching by Drink Name"
        }
        enterKeyHint="search"
        returnKeyType="search"
        onSubmitEditing={(input) =>
          submitHandler(input.nativeEvent.text, searchToggle)
        }
      />
      <Button onPress={allDrinks} title="See All Drinks" color="#FAFFD8" />
    </View>
  );
}
const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: "#333333",
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
  inputBox: {
    width: "75%",
    padding: 5,
    paddingStart: 10,
    borderWidth: 2,
    borderRadius: 25,
    borderColor: "gray",
    backgroundColor: "white",
    color: "black",
  },
});
