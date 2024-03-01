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
import { createNativeStackNavigator } from "@react-navigation/native-stack";
import DrinkDetails from "./DrinkDetails";
import SearchResults from "./SearchResults";
import Header from "../Components/Header";
import SearchBar from "../Components/SearchBar";

export default function HomePage({ navigation, route }) {
  const [apiResponse, setApiResponse] = useState(false);
  const [searchToggle, setSearchToggle] = useState(false);
  const toggleSwitch = () => setSearchToggle((previousState) => !previousState);

  //begin backend call
  const randomDrink = () => {
    setApiResponse(true);
    fetch(
      "https://virtualbartender-842672486.development.catalystserverless.com/server/HomePage/random"
    )
      .then((res) => res.json())
      .then((responseJSON) => {
        console.log(responseJSON);
        navigation.navigate("Home", {
          screen: "DrinkDetails",
          params: {
            drinkName: responseJSON.drink.name,
            instructions: responseJSON.drink.instructions,
            picSrc: responseJSON.drink.picSrc,
            ingredientStuff: responseJSON.drink.ingredientStuff,
          },
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
    navigation.navigate("Home", {
      screen: "SearchResults",
      params: {
        searchQuery: input,
        toggleValue: toggleValue,
      },
    });
  };
  function InnerHome() {
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
        <View style={styles.search}>
          <Switch
            style={styles.switch}
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
        </View>
        <Button onPress={allDrinks} title="See All Drinks" color="#000" />
      </View>
    );
  }
  const Stack = createNativeStackNavigator();
  return (
    <Stack.Navigator
      screenOptions={{
        headerTitleAlign: "center",
        headerStyle: { backgroundColor: "yellow" },
      }}
      initialRouteName="InnerHome"
    >
      <Stack.Screen
        name={"InnerHome"}
        component={InnerHome}
        options={{ title: "🍻 Virtual Bartender 🍻" }}
      />
      <Stack.Screen
        name={"DrinkDetails"}
        component={DrinkDetails}
        options={({ route }) => ({
          title: route.params.drinkName,
          headerStyle: { backgroundColor: "yellow" },
        })}
      />
      <Stack.Screen
        name={"SearchResults"}
        component={SearchResults}
        options={({ route }) => ({
          title: `Searching for ${route.params.searchQuery}`,
          headerStyle: { backgroundColor: "yellow" },
        })}
      />
    </Stack.Navigator>
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
  search: {
    alignItems: "center",
    width: "100%",
    padding: 20,
  },
  switch: {
    position: "relative",
    right: "30%",
  },
  inputBox: {
    width: "80%",
    padding: 5,
    paddingStart: 10,
    borderWidth: 2,
    borderRadius: 25,
    borderColor: "gray",
    backgroundColor: "white",
    color: "black",
  },
});
