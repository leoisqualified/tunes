// screens/HomeScreen.js
import React, { useState } from "react";
import { View, Text, TextInput, Button, StyleSheet } from "react-native";
import axios from "axios";
import { useNavigation } from "@react-navigation/native";

const HomeScreen = () => {
  const [text, setText] = useState("");
  const navigation = useNavigation();

  const handleAnalyzeMood = async () => {
    try {
      const response = await axios.post(
        "http://<YOUR_BACKEND_URL>/api/mood/analyze-text",
        {
          text,
        }
      );

      const mood = response.data.mood;
      navigation.navigate("Mood", { mood });
    } catch (error) {
      console.error("Error analyzing mood:", error.message);
    }
  };

  return (
    <View style={styles.container}>
      <Text style={styles.title}>Tunes 🎵</Text>
      <TextInput
        placeholder="How are you feeling today?"
        value={text}
        onChangeText={setText}
        style={styles.input}
      />
      <Button title="Analyze Mood" onPress={handleAnalyzeMood} />
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
    padding: 20,
  },
  title: {
    fontSize: 28,
    fontWeight: "bold",
    marginBottom: 30,
  },
  input: {
    borderWidth: 1,
    borderColor: "#ccc",
    width: "100%",
    padding: 10,
    marginBottom: 20,
    borderRadius: 10,
  },
});

export default HomeScreen;
