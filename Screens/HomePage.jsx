import { StyleSheet, Text, View, Switch, Button } from "react-native";
import { StatusBar } from "expo-status-bar";
import React, { useState } from "react";
import Header from "../Components/Header";
import SearchBar from "../Components/SearchBar";

export default function HomePage({ navigation }) {
  const [apiResponse, setApiResponse] = useState("default text");
  const executeSampleRow = async () => {
    const pyRes = await fetch(
      "https://virtualbartender-842672486.development.catalystserverless.com/server/zcqlSearchFunction/"
    );
    const drinkName = "martini";
    console.log(drinkName);
    return setApiResponse(drinkName);
  };
  return (
    <View style={styles.container}>
      <Header />
      <Button
        style={styles.button}
        onPress={() => navigation.navigate("Playtime")}
        title="Other page"
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
  playTime: {
    flex: 1,
    backgroundColor: "powderblue",
    color: "gray",
    flexDirection: "column",
    gap: 10,
    justifyContent: "space-around",
    height: "auto",
    width: "90%",
  },
  button: {
    padding: 10,
  },
});
