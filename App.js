import { NavigationContainer } from "@react-navigation/native";
import { createNativeStackNavigator } from "@react-navigation/native-stack";
import HomePage from "./Screens/HomePage";
import Playtime from "./Screens/Playtime";
import DrinkDetails from "./Screens/DrinkDetails";

export default function App() {
  const Stack = createNativeStackNavigator();
  return (
    <NavigationContainer>
      <Stack.Navigator initialRouteName="Home">
        <Stack.Screen
          name="Home"
          component={HomePage}
          options={{
            title: "🍻 Virtual Bartender 🍻",
            headerStyle: {
              backgroundColor: "yellow",
            },
            headerTintColor: "#000",
            headerTitleStyle: {
              fontWeight: "bold",
            },
            headerTitleAlign: "center",
          }}
        />
        <Stack.Screen
          name="Playtime"
          component={Playtime}
          options={{
            title: "Playtime",
            headerStyle: {
              backgroundColor: "yellow",
            },
            headerTintColor: "#000",
            headerTitleStyle: {
              fontWeight: "bold",
            },
            headerTitleAlign: "center",
          }}
        />
        <Stack.Screen
          name="DrinkDetails"
          component={DrinkDetails}
          options={({ route }) => ({
            title: route.params.name,
            headerStyle: { backgroundColor: "yellow" },
          })}
        />
      </Stack.Navigator>
    </NavigationContainer>
  );
}
const headerStyles = {
  headerStyle: { backgroundColor: "yellow" },
  headerTintColor: "#000",
  headerTitleStyle: "bold",
  headerTitleAlign: "center",
};
/*{{
            headerTitle: "${Drink Title}",
            headerStyle: { backgroundColor: "yellow" },
            headerTintColor: "#000",
            headerTitleStyle: "bold",
            headerTitleAlign: "center",
          }} */
