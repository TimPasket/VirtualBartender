import {
  View,
  Text,
  StyleSheet,
  ActivityIndicator,
  Image,
  Button,
  FlatList,
  Pressable,
  Alert,
} from "react-native";
import { Suspense, useEffect, useState } from "react";
import { createNativeStackNavigator } from "@react-navigation/native-stack";
import DrinkDetails from "./DrinkDetails";
import { useIsFocused } from "@react-navigation/native";
export default function AllDrinks({ navigation }) {
  const [dataLoaded, setDataLoaded] = useState(false);
  const [drinkData, setDrinkData] = useState([]);
  const [drinkLoading, setDrinkLoading] = useState(false);
  const Stack = createNativeStackNavigator();
  // useIsFocused() ? console.log("focused") : console.log("unfocused");
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
    console.log(`Drink Pressed\nrowid: ${ROWID}`);
    let response;
    try {
      response = await fetch(
        `https://virtualbartender-842672486.development.catalystserverless.com/server/getSingleDrink?ID=${ROWID}`
      );
      const res = await response.json();
      console.log(res);
      setDrinkLoading(false);
      // navigation.setOptions({ headerShown: false });
      navigation.navigate("AllDrinks", {
        screen: "DrinkDetailsReport",
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

  function AllDrinksReport() {
    return (
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
                drinkName={item.drinks.name}
                instructions={item.drinks.instructions}
                ROWID={item.drinks.ROWID}
                picSrc={item.drinks.picSrc}
              />
            )}
            keyExtractor={(drink_item) => drink_item.drinks.ROWID}
            numColumns={3}
            initialNumToRender={30}
          />
        ) : (
          <ActivityIndicator
            style={{
              position: "absolute",
              zIndex: 1,
              left: "50%",
            }}
            animating={true}
            size={"large"}
          />
        )}
      </View>
    );
  }
  return (
    <Stack.Navigator
      screenOptions={{
        headerStyle: { backgroundColor: "yellow" },
      }}
    >
      <Stack.Screen
        name="AllDrinksReport"
        component={AllDrinksReport}
        options={{ title: "All Drinks", headerTitleAlign: "center" }}
      />
      <Stack.Screen
        name="DrinkDetailsReport"
        component={DrinkDetails}
        options={({ route }) => ({
          title: route.params.drinkName,
        })}
      />
    </Stack.Navigator>
  );
}

const styles = StyleSheet.create({
  container: {
    backgroundColor: "#333333",
    alignItems: "center",
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
