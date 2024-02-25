import { StyleSheet, Text, View, Button, Image } from "react-native";

export default function SearchResults({ navigation, route }) {
  return (
    <View>
      <Text>{route.params.searchInput}</Text>
    </View>
  );
}
