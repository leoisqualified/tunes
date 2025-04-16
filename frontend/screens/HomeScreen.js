// screens/HomeScreen.js
import React, { useState } from "react";
import {
  View,
  Text,
  TextInput,
  TouchableOpacity,
  StyleSheet,
  KeyboardAvoidingView,
  Platform,
  ImageBackground,
} from "react-native";
import axios from "axios";
import { useNavigation } from "@react-navigation/native";
import { LinearGradient } from "expo-linear-gradient";

const HomeScreen = () => {
  const [text, setText] = useState("");
  const [isLoading, setIsLoading] = useState(false);
  const navigation = useNavigation();

  const handleAnalyzeMood = async () => {
    if (!text.trim()) return;

    setIsLoading(true);
    try {
      const response = await axios.post(
        "http://<YOUR_BACKEND_URL>/api/mood/analyze-text",
        { text }
      );

      const mood = response.data.mood;
      navigation.navigate("Mood", { mood });
    } catch (error) {
      console.error("Error analyzing mood:", error.message);
      alert("Failed to analyze mood. Please try again.");
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <ImageBackground
      source={require("../assets/music-background.png")}
      style={styles.background}
      blurRadius={2}
    >
      <LinearGradient
        colors={["rgba(0,0,0,0.7)", "rgba(0,0,0,0.5)"]}
        style={styles.gradient}
      >
        <KeyboardAvoidingView
          behavior={Platform.OS === "ios" ? "padding" : "height"}
          style={styles.container}
        >
          <View style={styles.content}>
            <Text style={styles.title}>Tunes 🎵</Text>
            <Text style={styles.subtitle}>Discover music for your mood</Text>

            <TextInput
              placeholder="How are you feeling today?"
              placeholderTextColor="#aaa"
              value={text}
              onChangeText={setText}
              style={styles.input}
              multiline
              numberOfLines={4}
              textAlignVertical="top"
            />

            <TouchableOpacity
              style={[
                styles.button,
                (!text.trim() || isLoading) && styles.buttonDisabled,
              ]}
              onPress={handleAnalyzeMood}
              disabled={!text.trim() || isLoading}
            >
              <Text style={styles.buttonText}>
                {isLoading ? "Analyzing..." : "Find My Music"}
              </Text>
            </TouchableOpacity>

            <Text style={styles.tipText}>
              Tip: Describe your feelings in detail for better recommendations
            </Text>
          </View>
        </KeyboardAvoidingView>
      </LinearGradient>
    </ImageBackground>
  );
};

const styles = StyleSheet.create({
  background: {
    flex: 1,
    resizeMode: "cover",
  },
  gradient: {
    flex: 1,
  },
  container: {
    flex: 1,
    justifyContent: "center",
  },
  content: {
    padding: 25,
    width: "100%",
  },
  title: {
    fontSize: 42,
    fontWeight: "bold",
    color: "#fff",
    marginBottom: 8,
    textAlign: "center",
  },
  subtitle: {
    fontSize: 18,
    color: "#ddd",
    marginBottom: 40,
    textAlign: "center",
  },
  input: {
    backgroundColor: "rgba(255,255,255,0.9)",
    width: "100%",
    padding: 15,
    marginBottom: 25,
    borderRadius: 15,
    fontSize: 16,
    minHeight: 120,
    textAlign: "center",
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.2,
    shadowRadius: 4,
    elevation: 3,
  },
  button: {
    backgroundColor: "#6e45e2",
    padding: 16,
    borderRadius: 15,
    alignItems: "center",
    shadowColor: "#6e45e2",
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.3,
    shadowRadius: 6,
    elevation: 5,
  },
  buttonDisabled: {
    backgroundColor: "#aaa",
    shadowColor: "#999",
  },
  buttonText: {
    color: "white",
    fontSize: 18,
    fontWeight: "600",
  },
  tipText: {
    color: "#bbb",
    fontSize: 14,
    textAlign: "center",
    marginTop: 20,
    fontStyle: "italic",
  },
});

export default HomeScreen;
