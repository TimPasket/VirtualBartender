import { View, StyleSheet, TextInput } from "react-native";
import { Feather } from "@expo/vector-icons";
export default function SearchBar({ navigate }) {
  const submitHandler = (searchText) => {
    navigate.navigate("SearchResults", { searchQuery: searchText });
  };

  return (
    <View style={styles.container}>
      <Feather
        name="search"
        size={20}
        color="white"
        style={{ position: "absolute", zIndex: 1, top: "15%", left: "75%" }}
      />
    </View>
  );
}
const styles = StyleSheet.create({
  container: {
    width: "100%",
    alignItems: "center",
  },
  inputBox: {
    width: "75%",
    padding: 5,
    paddingStart: 10,
    borderWidth: 2,
    borderRadius: 25,
    borderColor: "gray",
    backgroundColor: "gray",
    color: "white",
  },
});
