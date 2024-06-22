import { useState } from "react";
import { View, Text, TextInput, Button } from "react-native";
import * as Crypto from "expo-crypto";
export default function Profile() {
  const [email, setEmail] = useState("");
  const [pwd, setPwd] = useState("");

  const submitHandler = async (email, pwd) => {
    console.log("pressed");
    const digest = await Crypto.digestStringAsync(
      Crypto.CryptoDigestAlgorithm.SHA256,
      pwd
    );
    const usr = {
      email: email,
      hashPwd: digest,
      userID: 1253,
    };
    console.log(usr);
    fetch(
      "https://virtualbartender-842672486.development.catalystserverless.com/server/addUser?usr=" +
        JSON.stringify(usr)
    )
      .then((res) => res.json())
      .then((responseJSON) => {
        console.log(responseJSON);
      });
  };

  return (
    <View>
      <Text>Profile Page!</Text>
      <TextInput placeholder="email" onChangeText={setEmail} />
      <TextInput
        secureTextEntry
        placeholder="passwords"
        onChangeText={setPwd}
      />
      <Button title="Submit" onPress={() => submitHandler(email, pwd)} />

      {email ? <Text>{email}</Text> : <Text>No email yet</Text>}
      {pwd ? <Text>{pwd}</Text> : <Text>No pwd yet</Text>}
    </View>
  );
}
