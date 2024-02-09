import { StyleSheet, Text, View, Switch, Button } from "react-native";
import { useState } from "react";

export default function Playtime({ navigation }) {
  const [isEnabled, setIsEnabled] = useState(false);
  const toggleSwitch = () => setIsEnabled((previousState) => !previousState);

  return (
    <View style={styles.playTime}>
      <Switch
        trackColor={{ false: "#767577", true: "#81b0ff" }}
        thumbColor={isEnabled ? "#f5dd4b" : "#f4f3f4"}
        ios_backgroundColor="#3e3e3e"
        onValueChange={toggleSwitch}
        value={isEnabled}
      />
      <Text>"api response?"</Text>
      <Text>Hello there</Text>
      <Text>{isEnabled ? "Yoda my boy" : "General Kenobi"}</Text>
      <Text>Ah yes, the negotiator</Text>
      <Text>
        And Anakin Skywalker, I was expecting with someone of your reputation to
        be a little... older *mechanical groan*
      </Text>
    </View>
  );
}
const styles = StyleSheet.create({
  playTime: {
    flex: 1,
    backgroundColor: "powderblue",
    color: "gray",
    flexDirection: "column",
    gap: 10,
    alignItems: "center",
    justifyContent: "space-around",
    height: "auto",
    width: "100%",
  },
});
