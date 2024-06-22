import {
  StyleSheet,
  Text,
  View,
  Image,
  ScrollView,
  Pressable,
} from "react-native";
import { FontAwesome } from "@expo/vector-icons";
import { useState } from "react";
export default function DrinkDetails({ navigation, route }) {
  const [drinkFavorited, setDrinkFavorited] = useState(false);
  const [instructionsExpanded, setInstructionsExpanded] = useState(false);
  const toggleInstructions = () =>
    setInstructionsExpanded((previousState) => !previousState);
  const args = route.params;
  // navigation.setOptions({ title: args.drinkName });
  // navigation.getParent("AllDrinks").setOptions({ headerShown: false });
  // navigation.getParent() === "AllDrinksReport"
  //   ? navigation.get("AllDrinksReport").setOptions({ headerShown: false })
  //   : console.log("On home parent");
  const ingredients = args.ingredientStuff.map((block) => (
    <View style={styles.ingredientContainer}>
      <Text style={styles.ingredientText}>{block.ingredientName} -</Text>
      <Text style={styles.ingredientText}>
        {" "}
        {block.ingredientMeasure ? block.ingredientMeasure : "See Instructions"}
      </Text>
    </View>
  ));
  // const measures = args.ingredientStuff.measures.map((block) => (
  //   <Text>{block}</Text>
  // ));
  return (
    <View style={styles.detailsContainer}>
      <Image style={styles.drinkPic} source={{ uri: args.picSrc }}></Image>
      <View style={styles.icons}>
        <FontAwesome
          name={drinkFavorited ? "heart" : "heart-o"}
          color={drinkFavorited ? "red" : "white"}
          size={25}
        />
        <Pressable onPress={() => toggleInstructions()}>
          <FontAwesome
            name={instructionsExpanded ? "angle-down" : "angle-left"}
            color={"white"}
            size={30}
          />
        </Pressable>
      </View>
      <ScrollView style={styles.scrollView}>
        <Text
          style={
            instructionsExpanded
              ? styles.instructionsExpanded
              : styles.instructionsCollapsed
          }
        >
          {args.instructions}
        </Text>
        <View style={styles.ingredients}>{ingredients}</View>
      </ScrollView>
    </View>
  );
}
const styles = StyleSheet.create({
  detailsContainer: {
    alignItems: "center",
    height: "100%",
    backgroundColor: "#333333",
  },
  drinkPic: {
    height: "30%",
    aspectRatio: 1 / 1,
  },
  icons: {
    width: "85%",
    display: "flex",
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    paddingTop: 20,
  },
  instructionsCollapsed: {
    maxHeight: "40%",
    padding: 20,
    paddingTop: 10,
    fontSize: 15,
    color: "#fff",
    fontWeight: "500",
  },
  instructionsExpanded: {
    padding: 20,
    paddingTop: 10,
    fontSize: 15,
    color: "#fff",
    fontWeight: "500",
  },
  ingredientContainer: {
    flexDirection: "row",
  },
  ingredients: {
    alignItems: "center",
    marginTop: 50,
    gap: 10,
  },
  ingredientText: {
    fontSize: 18,
    color: "#fff",
  },
});
