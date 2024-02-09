import { StyleSheet, Text, View, Button, Image } from "react-native";

export default function DrinkDetails({ navigation, route }) {
  const args = route.params;
  return (
    <View style={styles.detailsContainer}>
      <Image style={styles.drinkPic} source={{ uri: args.picSrc }}></Image>
      <Text>{args.instructions}</Text>
      <Button
        title="change it lol"
        onPress={() => {
          navigation.setOptions({ title: "better?" });
        }}
      />
    </View>
  );
}
const styles = StyleSheet.create({
  detailsContainer: { alignItems: "center" },
  drinkPic: {
    height: 250,
    width: 350,
  },
});
