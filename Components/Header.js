import { StyleSheet, Text, View, Image } from "react-native";

export default function Header() {
  return (
    <View>
      {/* <Text style={styles.topBar}>🍻 Virtual Bartender 🍻</Text> */}
      <Image
        style={styles.barImage}
        source={require("../assets/barBanner.jpg")}
      ></Image>
    </View>
  );
}

const styles = StyleSheet.create({
  barImage: {
    height: 150,
    width: 350,
  },
});
