import AsyncStorage from "@react-native-async-storage/async-storage";
import {
  StyleSheet,
  Text,
  View,
  Image,
  TouchableOpacity,
  RefreshControl,
  ScrollView,
} from "react-native";
import React, { useState, useEffect, useContext } from "react";
import usePortfolio from "../hooks/usePortfolio";
import { LinearGradient } from "expo-linear-gradient";
import { SafeAreaView } from "react-native-safe-area-context";
import { COLORS, FONTS } from "../constants/theme";
import { MaterialIcons } from "@expo/vector-icons";
import { StatusBar } from "expo-status-bar";
import { SceneMap, TabBar, TabView } from "react-native-tab-view";
import { useWindowDimensions } from "react-native";
import { AuthContext } from "../store/auth-context";
import { getUserProfile } from "../util/Auth";
import { useNavigation } from "@react-navigation/native";
import PortfolioList from "../components/PortfolioList";
import { getAllComments } from "../util/Comment";
import { useFocusEffect } from "@react-navigation/native";

const ProfileScreen = () => {
  const [fetchPortfolio, results] = usePortfolio();
  const navigation = useNavigation();
  const [selectedImage, setSelectedImage] = useState(null);
  const [profilImageUrl, setProfilImageUrl] = useState("");
  const layout = useWindowDimensions();
  const [index, setIndex] = useState(0);
  const [firstName, setFirstName] = useState("");
  const [lastName, setLastName] = useState("");
  const [email, setEmail] = useState("");
  const [country, setCountry] = useState("");
  const [comments, setComments] = useState([]);
  const [refreshing, setRefreshing] = useState(false);
  const [filmCount, setFilmCount] = useState(0);
  const [commentCount, setCommentCount] = useState(0);
  const [likesCount, setLikesCount] = useState(0); // Yeni state ekleyin

  const { token, username } = useContext(AuthContext);
  const authContext = useContext(AuthContext);
  const storedUsername = username;

  const onRefresh = async () => {
    setRefreshing(true);
    await new Promise((resolve) => setTimeout(resolve, 200));
    await fetchPortfolio();
    await fetchData();
    await new Promise((resolve) => setTimeout(resolve, 400));
    setRefreshing(false);
  };

  async function fetchUserProfile() {
    try {
      const storedToken = token;
      const storedUsername = username;
      const userProfile = await getUserProfile(storedUsername, storedToken);

      if (userProfile) {
        setFirstName(userProfile.firstName || "");
        setLastName(userProfile.lastName || "");
        setEmail(userProfile.email || "");
        setCountry(userProfile.country || "");
        setProfilImageUrl(userProfile.profilImageUrl || "");
      }
    } catch (error) {
      console.error("Error fetching user profile:", error);
    }
  }
  useEffect(() => {
    if (results.length > 0) {
      fetchData();
    }
  }, [results]); // results değiştiğinde fetchData'yı çağırır

  useFocusEffect(
    React.useCallback(() => {
      fetchUserProfile();
      fetchData();
    }, [token, username, results])
  );

  const CommentsRoute = () => (
    <ScrollView
      style={styles.routeContainer}
      refreshControl={
        <RefreshControl refreshing={refreshing} onRefresh={onRefresh} />
      }
    >
      {comments.length === 0 ? (
        <Text style={styles.noCommentsText}>You have not commented yet.</Text>
      ) : (
        comments.map((comment) => (
          <View key={comment.id} style={styles.commentContainer}>
            <Text style={styles.commentContent}>{comment.content}</Text>
            <Text style={styles.commentDate}>
              {new Date(comment.createdOn).toLocaleDateString()}
            </Text>
          </View>
        ))
      )}
    </ScrollView>
  );

  const MyListRoute = () => (
    <View style={styles.routeContainer}>
      {results.length === 0 ? (
         <ScrollView
         showsVerticalScrollIndicator={false}
         refreshControl={
           <RefreshControl refreshing={refreshing} onRefresh={onRefresh} />
         }
       >
        <Text style={styles.noItemsText}>
          You have not added any movies yet.
        </Text>
                </ScrollView>

      ) : (
        <ScrollView
          showsVerticalScrollIndicator={false}
          refreshControl={
            <RefreshControl refreshing={refreshing} onRefresh={onRefresh} />
          }
        >
          <PortfolioList results={results} />
        </ScrollView>
      )}
    </View>
  );

  const renderScene = SceneMap({
    first: MyListRoute,
    second: CommentsRoute,
  });

  const [routes] = useState([
    { key: "first", title: "My List" },
    { key: "second", title: "My Comments" },
  ]);

  const renderTabBar = (props) => (
    <TabBar
      {...props}
      indicatorStyle={styles.tabIndicator}
      style={styles.tabBar}
      renderLabel={({ focused, route }) => (
        <Text
          style={[
            styles.tabLabel,
            { color: focused ? "#173d39" : COLORS.black },
          ]}
        >
          {route.title}
        </Text>
      )}
    />
  );

  const handleEditProfile = () => {
    navigation.navigate("EditProfileScreen");
  };

  const fetchData = async () => {
    try {
      const fetchedComments = await getAllComments(authContext.token);
      const userComments = fetchedComments.filter(
        (comment) => comment.createdBy === storedUsername
      );
      const sortedComments = userComments.sort(
        (a, b) => new Date(b.createdOn) - new Date(a.createdOn)
      );


      setComments(sortedComments);
      setCommentCount(sortedComments.length);
      setFilmCount(results.length); // Film sayısını güncelle
         // Toplam beğeni sayısını hesapla
    const totalLikes = sortedComments.reduce((sum, comment) => sum + (comment.numberOfLikes || 0), 0);
      setLikesCount(totalLikes); // Toplam beğeni sayısını güncelle
    } catch (error) {
      console.error("Error fetching data:", error);
    }
  };

  return (
    <LinearGradient colors={["#173d39", "#000000"]} style={styles.gradient}>
      <SafeAreaView style={styles.safeArea}>
        <StatusBar backgroundColor={COLORS.gray} />
        <View style={styles.coverContainer}>
          <Image
            source={require("../assets/image/cover2.webp")}
            resizeMode="cover"
            style={styles.coverImage}
          />
          <LinearGradient
            colors={["transparent", "rgba(0,0,0,0.5)", "rgba(0,0,0,0.8)"]}
            style={styles.coverOverlay}
          />
        </View>

        <View style={styles.profileContainer}>
          <Image
            source={
              profilImageUrl
                ? { uri: profilImageUrl }
                : require("../assets/image/profileDefault.jpg")
            }
            resizeMode="cover"
            style={styles.profileImage}
          />
          <Text style={styles.profileName}>{username}</Text>

          <View style={styles.locationContainer}>
            <MaterialIcons name="location-on" size={24} color="white" />
            <Text style={styles.locationText}>{country}</Text>
          </View>

          <View style={styles.statsContainer}>
            <View style={styles.statsItem}>
              <Text style={styles.statsNumber}>{filmCount}</Text>
              <Text style={styles.statsLabel}>Movies</Text>
            </View>
            <View style={styles.statsItem}>
              <Text style={styles.statsNumber}>{commentCount}</Text>
              <Text style={styles.statsLabel}>Comments</Text>
            </View>
            <View style={styles.statsItem}>
              <Text style={styles.statsNumber}>{likesCount}</Text>
              <Text style={styles.statsLabel}>Likes</Text>
            </View>
          </View>

          <View style={styles.buttonContainer}>
            <TouchableOpacity style={styles.button} onPress={handleEditProfile}>
              <Text style={styles.buttonText}>Edit Profile</Text>
            </TouchableOpacity>
            {/* <TouchableOpacity
              style={styles.button}
            >
              <Text style={styles.buttonText}>Add Friend</Text>
            </TouchableOpacity> */}
          </View>
        </View>
        <View style={styles.tabViewContainer}>
          <TabView
            style={styles.tabView}
            navigationState={{ index, routes }}
            renderScene={renderScene}
            onIndexChange={setIndex}
            initialLayout={{ width: layout.width }}
            renderTabBar={renderTabBar}
          />
        </View>
      </SafeAreaView>
    </LinearGradient>
  );
};

const styles = StyleSheet.create({
  gradient: {
    flex: 1,
  },
  safeArea: {
    flex: 1,
  },
  coverContainer: {
    position: "relative",
    height: 220,
    width: "100%",
  },
  coverImage: {
    height: "100%",
    width: "100%",
    borderWidth: 1,
    borderColor: COLORS.white,
  },
  coverOverlay: {
    position: "absolute",
    top: 0,
    left: 0,
    right: 0,
    bottom: 0,
  },
  profileContainer: {
    flex: 1,
    alignItems: "center",
  },
  profileImage: {
    height: 155,
    width: 155,
    borderRadius: 999,
    borderColor: COLORS.white,
    borderWidth: 1,
    marginTop: -90,
  },
  profileName: {
    ...FONTS.h3,
    color: "white",
    marginVertical: 8,
  },
  locationContainer: {
    flexDirection: "row",
    marginVertical: 6,
    alignItems: "center",
  },
  locationText: {
    ...FONTS.body4,
    color: "white",
    marginLeft: 4,
  },
  statsContainer: {
    paddingVertical: 8,
    flexDirection: "row",
  },
  statsItem: {
    flexDirection: "column",
    alignItems: "center",
    marginHorizontal: 10,
  },
  statsNumber: {
    ...FONTS.h2,
    color: COLORS.white,
  },
  statsLabel: {
    ...FONTS.body4,
    color: COLORS.white,
  },
  buttonContainer: {
    flexDirection: "row",
  },
  button: {
    width: 100,
    height: 36,
    alignItems: "center",
    justifyContent: "center",
    backgroundColor: COLORS.white,
    borderRadius: 10,
    marginHorizontal: 20,
  },
  buttonText: {
    ...FONTS.body4,
    color: COLORS.black,
  },
  tabViewContainer: {
    flex: 1,
    marginHorizontal: 22,
    marginTop: 40,
  },
  tabView: {
    borderRadius: 20,
  },
  tabBar: {
    backgroundColor: COLORS.white,
    height: 44,
  },
  tabIndicator: {
    backgroundColor: COLORS.primary,
  },
  tabLabel: {
    ...FONTS.body4,
  },
  routeContainer: {
    flex: 1,
    backgroundColor: "#173d39",
  },
  noCommentsText: {
    color: "white",
    textAlign: "center",
    marginTop: 20,
  },
  noItemsText: {
    color: "white",
    textAlign: "center",
    marginTop: 20,
  },
  commentContainer: {
    backgroundColor: "#2b4c4b",
    padding: 10,
    marginVertical: 5,
    borderRadius: 10,
  },
  commentContent: {
    color: "white",
    fontSize: 16,
  },
  commentDate: {
    color: "gray",
    fontSize: 12,
    textAlign: "right",
  },
});

export default ProfileScreen;
