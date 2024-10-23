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
      email: "Nope@gmail.com",
      hashPwd: "a98ec5c5044800c88e862f007b98d89815fc40ca155d6ce790",
    };
    console.log(usr);
    console.log("-----------------");
    jsonRes = await fetch(
      "https://virtualbartender-842672486.development.catalystserverless.com/server/addUser/login?usr=" +
        JSON.stringify(usr)
    );
    res = await jsonRes.json();
    response = await res;
    console.log(response);
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
