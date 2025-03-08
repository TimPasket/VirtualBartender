import { NavigationContainer } from "@react-navigation/native";
import { createNativeStackNavigator } from "@react-navigation/native-stack";
import { createBottomTabNavigator } from "@react-navigation/bottom-tabs";
import HomePage from "./Screens/HomePage";
import Playtime from "./Screens/Playtime";
import DrinkDetails from "./Screens/DrinkDetails";
import AllDrinks from "./Screens/AllDrinks";
import SearchResults from "./Screens/SearchResults";
import Profile from "./Screens/Profile";

export default function App() {
  const Tab = createBottomTabNavigator();
  const Stack = createNativeStackNavigator();
  return (
    <NavigationContainer>
      {/* <Stack.Navigator initialRouteName="Home">
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
          name="SearchResults"
          component={SearchResults}
          options={({ route }) => ({
            title: `Searching for ${route.params.searchText}`,
            headerStyle: {
              backgroundColor: "yellow",
            },
            headerTitleAlign: "center",
          })}
        />
        <Stack.Screen
          name="DrinkDetails"
          component={DrinkDetails}
          options={({ route }) => ({
            title: route.params.drinkName,
            headerStyle: { backgroundColor: "yellow" },
          })}
        />
        <Stack.Screen
          name="AllDrinks"
          component={AllDrinks}
          options={({ route }) => ({
            title: "All Drinks",
            headerStyle: { backgroundColor: "yellow" },
          })}
        />
      </Stack.Navigator> */}
      <Tab.Navigator
        screenOptions={{
          headerTitleAlign: "center",
          headerStyle: { backgroundColor: "yellow" },
        }}
      >
        <Tab.Screen
          name="Home"
          component={HomePage}
          options={{ headerShown: false }}
        />
        <Tab.Screen
          name="AllDrinks"
          component={AllDrinks}
          options={{ title: "All Drinks", headerShown: false }}
        />
        {/* <Tab.Screen name="Profile" component={Profile} /> */}
      </Tab.Navigator>
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
