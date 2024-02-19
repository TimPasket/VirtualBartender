import { StyleSheet, Text, View, Button, Image, FlatList } from "react-native";

export default function DrinkDetails({ navigation, route }) {
  const args = route.params;
  const ingredients = args.ingredientStuff.map((block) => (
    <Text style={styles.ingredientText}>
      {block.ingredientName} - {block.ingredientMeasure}
    </Text>
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
  detailsContainer: { alignItems: "center" },
  drinkPic: {
    height: 250,
    width: 350,
    aspectRatio: 7 / 8,
  },
  instructions: {
    padding: 20,
    borderBottomWidth: 1,
    fontSize: 15,
  },
  ingredients: {
    marginTop: 15,
    gap: 10,
  },
  ingredientText: {
    fontSize: 18,
  },
});
