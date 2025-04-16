// screens/MoodScreen.js
import React, { useEffect, useState } from "react";
import {
  View,
  Text,
  FlatList,
  Image,
  StyleSheet,
  Button,
  Linking,
} from "react-native";
import axios from "axios";

const MoodScreen = ({ route }) => {
  const { mood } = route.params;
  const [tracks, setTracks] = useState([]);

  useEffect(() => {
    const fetchTracks = async () => {
      try {
        const response = await axios.post(
          "http://<YOUR_BACKEND_URL>/api/mood/recommend",
          {
            mood,
          }
        );
        setTracks(response.data.tracks);
      } catch (error) {
        console.error("Error fetching tracks:", error.message);
      }
    };

    fetchTracks();
  }, [mood]);

  const openLink = (url) => {
    Linking.openURL(url);
  };

  return (
    <View style={styles.container}>
      <Text style={styles.title}>Mood: {mood}</Text>
      <FlatList
        data={tracks}
        keyExtractor={(item) => item.url}
        renderItem={({ item }) => (
          <View style={styles.card}>
            <Image source={{ uri: item.album_cover }} style={styles.image} />
            <View style={styles.info}>
              <Text style={styles.track}>{item.name}</Text>
              <Text style={styles.artist}>{item.artist}</Text>
              <Button title="Listen" onPress={() => openLink(item.url)} />
            </View>
          </View>
        )}
      />
    </View>
  );
};

const styles = StyleSheet.create({
  container: { flex: 1, padding: 20 },
  title: { fontSize: 24, fontWeight: "bold", marginBottom: 20 },
  card: {
    flexDirection: "row",
    marginBottom: 16,
    borderWidth: 1,
    borderColor: "#ccc",
    borderRadius: 10,
    padding: 10,
  },
  image: { width: 60, height: 60, marginRight: 10, borderRadius: 5 },
  info: { flex: 1 },
  track: { fontSize: 16, fontWeight: "bold" },
  artist: { color: "gray" },
});

export default MoodScreen;
