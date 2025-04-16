// screens/MoodScreen.js
import React, { useEffect, useState } from "react";
import {
  View,
  Text,
  FlatList,
  Image,
  StyleSheet,
  TouchableOpacity,
  Linking,
  ActivityIndicator,
  ImageBackground,
  ScrollView,
} from "react-native";
import axios from "axios";
import { LinearGradient } from "expo-linear-gradient";
import { Ionicons } from "@expo/vector-icons";

const MoodScreen = ({ route, navigation }) => {
  const { mood } = route.params;
  const [tracks, setTracks] = useState([]);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState(null);

  // Mood color mapping
  const moodColors = {
    happy: ["#FFD700", "#FFA500"],
    sad: ["#6495ED", "#4169E1"],
    energetic: ["#FF4500", "#FF8C00"],
    calm: ["#98FB98", "#20B2AA"],
    angry: ["#FF6347", "#DC143C"],
    default: ["#6e45e2", "#88d3ce"],
  };

  const gradientColors = moodColors[mood.toLowerCase()] || moodColors.default;

  useEffect(() => {
    const fetchTracks = async () => {
      try {
        setIsLoading(true);
        const response = await axios.post(
          "http://<YOUR_BACKEND_URL>/api/mood/recommend",
          { mood }
        );
        setTracks(response.data.tracks);
        setError(null);
      } catch (error) {
        console.error("Error fetching tracks:", error.message);
        setError("Failed to load recommendations. Please try again.");
      } finally {
        setIsLoading(false);
      }
    };

    fetchTracks();
  }, [mood]);

  const openLink = (url) => {
    Linking.openURL(url);
  };

  const renderTrackItem = ({ item }) => (
    <View style={styles.card}>
      <Image
        source={{ uri: item.album_cover }}
        style={styles.image}
        resizeMode="cover"
      />
      <View style={styles.infoContainer}>
        <View style={styles.textContainer}>
          <Text style={styles.track} numberOfLines={1}>
            {item.name}
          </Text>
          <Text style={styles.artist} numberOfLines={1}>
            {item.artist}
          </Text>
        </View>
        <TouchableOpacity
          style={styles.playButton}
          onPress={() => openLink(item.url)}
        >
          <Ionicons name="play" size={24} color="white" />
        </TouchableOpacity>
      </View>
    </View>
  );

  return (
    <LinearGradient
      colors={gradientColors}
      style={styles.container}
      start={{ x: 0, y: 0 }}
      end={{ x: 1, y: 1 }}
    >
      <ScrollView contentContainerStyle={styles.scrollContainer}>
        <View style={styles.header}>
          <TouchableOpacity
            style={styles.backButton}
            onPress={() => navigation.goBack()}
          >
            <Ionicons name="arrow-back" size={24} color="white" />
          </TouchableOpacity>
          <Text style={styles.moodText}>Your Mood</Text>
          <Text style={styles.moodValue}>{mood}</Text>
        </View>

        <Text style={styles.recommendationsTitle}>Recommended Tracks</Text>

        {isLoading ? (
          <View style={styles.loadingContainer}>
            <ActivityIndicator size="large" color="white" />
            <Text style={styles.loadingText}>
              Finding perfect tracks for you...
            </Text>
          </View>
        ) : error ? (
          <View style={styles.errorContainer}>
            <Ionicons name="sad-outline" size={48} color="white" />
            <Text style={styles.errorText}>{error}</Text>
            <TouchableOpacity
              style={styles.retryButton}
              onPress={() => navigation.replace("Home")}
            >
              <Text style={styles.retryButtonText}>Try Again</Text>
            </TouchableOpacity>
          </View>
        ) : (
          <FlatList
            data={tracks}
            keyExtractor={(item) => item.url}
            renderItem={renderTrackItem}
            contentContainerStyle={styles.listContainer}
            scrollEnabled={false} // Since we're using ScrollView as parent
            ListEmptyComponent={
              <Text style={styles.emptyText}>
                No tracks found for this mood
              </Text>
            }
          />
        )}
      </ScrollView>
    </LinearGradient>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
  scrollContainer: {
    paddingBottom: 30,
  },
  header: {
    paddingTop: 50,
    paddingHorizontal: 20,
    marginBottom: 30,
  },
  backButton: {
    position: "absolute",
    top: 50,
    left: 20,
    zIndex: 1,
    padding: 10,
  },
  moodText: {
    fontSize: 18,
    color: "rgba(255,255,255,0.8)",
    textAlign: "center",
    marginBottom: 5,
  },
  moodValue: {
    fontSize: 36,
    fontWeight: "bold",
    color: "white",
    textAlign: "center",
    textTransform: "capitalize",
  },
  recommendationsTitle: {
    fontSize: 22,
    fontWeight: "600",
    color: "white",
    marginHorizontal: 20,
    marginBottom: 20,
  },
  card: {
    backgroundColor: "rgba(255,255,255,0.2)",
    borderRadius: 15,
    padding: 15,
    marginHorizontal: 20,
    marginBottom: 15,
    flexDirection: "row",
    alignItems: "center",
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.2,
    shadowRadius: 4,
    elevation: 3,
  },
  image: {
    width: 60,
    height: 60,
    borderRadius: 10,
    marginRight: 15,
  },
  infoContainer: {
    flex: 1,
    flexDirection: "row",
    alignItems: "center",
  },
  textContainer: {
    flex: 1,
  },
  track: {
    fontSize: 16,
    fontWeight: "600",
    color: "white",
    marginBottom: 4,
  },
  artist: {
    fontSize: 14,
    color: "rgba(255,255,255,0.7)",
  },
  playButton: {
    backgroundColor: "rgba(255,255,255,0.3)",
    width: 50,
    height: 50,
    borderRadius: 25,
    justifyContent: "center",
    alignItems: "center",
  },
  loadingContainer: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
    padding: 40,
  },
  loadingText: {
    color: "white",
    marginTop: 20,
    fontSize: 16,
  },
  errorContainer: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
    padding: 40,
  },
  errorText: {
    color: "white",
    marginVertical: 20,
    fontSize: 16,
    textAlign: "center",
  },
  retryButton: {
    backgroundColor: "white",
    paddingHorizontal: 30,
    paddingVertical: 12,
    borderRadius: 25,
  },
  retryButtonText: {
    color: "#6e45e2",
    fontWeight: "600",
  },
  emptyText: {
    color: "white",
    textAlign: "center",
    marginTop: 20,
    fontSize: 16,
  },
  listContainer: {
    paddingBottom: 20,
  },
});

export default MoodScreen;
