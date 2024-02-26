import { StyleSheet, Text, View, Button, Image } from "react-native";

export default function DrinkDetails({ navigation, route }) {
  const args = route.params;
  const ingredients = args.ingredientStuff.map((block) => (
    <View style={styles.ingredientContainer}>
      <Text style={styles.ingredientText}>{block.ingredientName} -</Text>
      <Text style={styles.ingredientText}> {block.ingredientMeasure}</Text>
    </View>
  ));
  // const measures = args.ingredientStuff.measures.map((block) => (
  //   <Text>{block}</Text>
  // ));
  return (
    <View style={styles.detailsContainer}>
      <Image style={styles.drinkPic} source={{ uri: args.picSrc }}></Image>
      <Text style={styles.instructions}>{args.instructions}</Text>
      <View style={styles.ingredients}>{ingredients}</View>
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
    height: 250,
    width: 350,
    aspectRatio: 7 / 8,
  },
  instructions: {
    padding: 20,
    paddingTop: 40,
    fontSize: 15,
    color: "#fff",
    fontWeight: "500",
  },
  ingredientContainer: {
    flexDirection: "row",
  },
  ingredients: {
    width: "80%",
    alignItems: "center",
    marginTop: 50,
    gap: 10,
  },
  ingredientText: {
    fontSize: 18,
    color: "#fff",
  },
});
