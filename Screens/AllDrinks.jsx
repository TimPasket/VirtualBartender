import {
  View,
  Text,
  StyleSheet,
  ActivityIndicator,
  Image,
  Button,
  FlatList,
} from "react-native";
import { Suspense, useEffect, useState } from "react";
export default function AllDrinks() {
  const [dataLoaded, setDataLoaded] = useState(false);
  const [drinkData, setDrinkData] = useState([]);

  const getAllDrinks = async () => {
    let res;
    res = await fetch(
      "https://virtualbartender-842672486.development.catalystserverless.com/server/getAllDrinks/"
    );
    res = await res.json();
    console.log(res.data);
    setDataLoaded(true);
    setDrinkData(res.data);
  };
  if (!dataLoaded) {
    getAllDrinks();
  }
  // const allDrinkData = async () => await getAllDrinks();
  // console.log(`this is the data ${allDrinkData}`);
  const DrinkItem = ({ picSrc }) => {
    return <Image style={styles.drinkImage} source={{ uri: picSrc }} />;
  };
  const DATA = [
    {
      innerdata: {
        id: "bd7acbea-c1b1-46c2-aed5-3ad53abb28ba",
        title: "First Item",
      },
    },
    {
      innerdata: {
        id: "3ac68afc-c605-48d3-a4f8-fbd91aa97f63",
        title: "Second Item",
      },
    },
    {
      innerdata: {
        id: "58694a0f-3da1-471f-bd96-145571e29d72",
        title: "Third Item",
      },
    },
  ];
  const sampleData = {
    data: [
      {
        drinks: {
          ROWID: "1922000000016166",
          picSrc:
            "https://www.thecocktaildb.com/images/media/drink/smb2oe1582479072.jpg",
        },
      },
      {
        drinks: {
          ROWID: "1922000000016187",
          picSrc:
            "https://www.thecocktaildb.com/images/media/drink/hdzwrh1487603131.jpg",
        },
      },
      {
        drinks: {
          ROWID: "1922000000016220",
          picSrc:
            "https://www.thecocktaildb.com/images/media/drink/apneom1504370294.jpg",
        },
      },
      {
        drinks: {
          ROWID: "1922000000016235",
          picSrc:
            "https://www.thecocktaildb.com/images/media/drink/vvop4w1493069934.jpg",
        },
      },
      {
        drinks: {
          ROWID: "1922000000016250",
          picSrc:
            "https://www.thecocktaildb.com/images/media/drink/91oule1513702624.jpg",
        },
      },
      {
        drinks: {
          ROWID: "1922000000016280",
          picSrc:
            "https://www.thecocktaildb.com/images/media/drink/twsuvr1441554424.jpg",
        },
      },
      {
        drinks: {
          ROWID: "1922000000016379",
          picSrc:
            "https://www.thecocktaildb.com/images/media/drink/xnzr2p1485619687.jpg",
        },
      },
      {
        drinks: {
          ROWID: "1922000000016396",
          picSrc:
            "https://www.thecocktaildb.com/images/media/drink/ht3hnk1619704289.jpg",
        },
      },
      {
        drinks: {
          ROWID: "1922000000016445",
          picSrc:
            "https://www.thecocktaildb.com/images/media/drink/pra8vt1487603054.jpg",
        },
      },
    ],
  };
  const Item = ({ title }) => (
    <View style={styles.item}>
      <Text style={styles.title}>{title}</Text>
    </View>
  );
  const imageVuid = sampleData.data[5].drinks.picSrc;
  return (
    <>
      <View>
        <Text>Beginning of Flatlist</Text>
        {drinkData.length ? (
          <FlatList
            data={drinkData}
            renderItem={({ item }) => <DrinkItem picSrc={item.drinks.picSrc} />}
            keyExtractor={(drink_item) => drink_item.drinks.ROWID}
            numColumns={3}
            initialNumToRender={36}
          />
        ) : (
          <Text>List pretyy empty</Text>
        )}
      </View>
    </>
  );
}

const styles = StyleSheet.create({
  drinkImage: {
    height: 115,
    width: 115,
    margin: 5,
  },
});
