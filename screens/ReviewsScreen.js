import React, { useState, useEffect, useContext } from "react";
import {
  View,
  Text,
  StyleSheet,
  ScrollView,
  Image,
  Dimensions,
  TouchableOpacity,
  RefreshControl,
  Modal,
} from "react-native";
import AsyncStorage from "@react-native-async-storage/async-storage";
import { LinearGradient } from "expo-linear-gradient";
import {
  getAllComments,
  likeUserComment,
  dislikeUserComment,
  getUserLikedComments,
} from "../util/Comment";
import { AntDesign, Fontisto } from "@expo/vector-icons";
import { AuthContext } from "../store/auth-context";
import useApi from "../util/api";
import FilmContent from "../components/FilmContent";
import moment from "moment"; // Tarih formatlama için
import { getUserProfile } from "../util/Auth";
import { useFocusEffect } from "@react-navigation/native"; // import ekle

const { width, height } = Dimensions.get("window");

export default function ReviewsScreen() {
  const { isAuthenticated, token, username } = useContext(AuthContext);
  const [comments, setComments] = useState([]);
  const [films, setFilms] = useState({}); // Film bilgilerini depolamak için
  const [profileImage, setProfileImage] = useState("");
  const authContext = useContext(AuthContext);
  const api = useApi();
  const [refreshing, setRefreshing] = useState(false);
  const [modalVisible, setModalVisible] = useState(false);
  const [selectedId, setSelectedId] = useState(null);
  const [likedComments, setLikedComments] = useState([]); // Beğenilen yorumları takip etmek için
  const [showAlert, setShowAlert] = useState(false); // Uyarı mesajını kontrol eden state

  useEffect(() => {
    if (isAuthenticated) {
      fetchData();
      checkFirstVisit();
    }
  }, [isAuthenticated]);

  const checkFirstVisit = async () => {
    try {
      const hasVisited = await AsyncStorage.getItem("hasVisitedReviewsScreen");
      if (!hasVisited) {
        setShowAlert(true);
        await AsyncStorage.setItem("hasVisitedReviewsScreen", "true");
      }
    } catch (error) {
      console.error("Error checking first visit:", error);
    }
  };

  async function fetchUserProfile() {
    try {
      const storedToken = token;
      const storedUsername = username;
      const userProfile = await getUserProfile(storedUsername, storedToken);

      if (userProfile) {
        setProfileImage(userProfile.profilImageUrl || "");
      }
    } catch (error) {
      console.error("Error fetching user profile:", error);
    }
  }

  useFocusEffect(
    React.useCallback(() => {
      fetchUserProfile();
      fetchData();
    }, [token, username])
  );

  const fetchData = async () => {
    try {
      // Yorumları çekme ve sıralama
      const fetchedComments = await getAllComments(authContext.token);
      const sortedComments = fetchedComments.sort(
        (a, b) => new Date(b.createdOn) - new Date(a.createdOn)
      );
  
      // Beğenilen yorumları güncelle
      const liked = await getUserLikedComments(authContext.token);
      const likedCommentIds = liked.map((comment) => comment.id);
  
      // Yorumları ve beğenileri güncelle
      const updatedComments = sortedComments.map((comment) => ({
        ...comment,
        isLiked: likedCommentIds.includes(comment.id), // Yorumun beğenilip beğenilmediğini kontrol et
      }));
  
      setComments(updatedComments);
      fetchFilms(updatedComments);
      setLikedComments(likedCommentIds);
    } catch (error) {
      console.error("Error fetching data:", error);
    }
  };

  const fetchFilms = async (comments) => {
    const filmsData = {};
    for (const comment of comments) {
      if (!filmsData[comment.filmId]) {
        const film = await getResult(comment.filmId);
        filmsData[comment.filmId] = film;
      }
    }
    setFilms(filmsData);
  };

  const getResult = async (id) => {
    try {
      const response = await api.get(`/api/films/${id}`);
      return response.data;
    } catch (error) {
      console.error("Failed to fetch film data", error);
      return null;
    }
  };

  const handleLike = async (commentId) => {
    try {
      if (likedComments.includes(commentId)) {
        // Beğeniyi geri al
        await dislikeUserComment(commentId, authContext.token);
        setLikedComments((prevState) =>
          prevState.filter((id) => id !== commentId)
        );
      } else {
        // Beğen
        await likeUserComment(commentId, authContext.token);
        setLikedComments((prevState) => [...prevState, commentId]);
      }
  
      // Yorumların isLiked durumunu güncelle
      setComments((prevComments) =>
        prevComments.map((comment) =>
          comment.id === commentId
            ? { ...comment, isLiked: !comment.isLiked, numberOfLikes: comment.isLiked ? comment.numberOfLikes - 1 : comment.numberOfLikes + 1 }
            : comment
        )
      );
    } catch (error) {
      console.error("Error handling like/dislike:", error);
    }
  };
  const renderStars = (rating) => {
    return (
      <View style={styles.ratingContainer}>
        {[...Array(5)].map((_, index) => (
          <AntDesign
            key={index}
            name={index < rating ? "star" : "staro"}
            size={20}
            color="#FFD700"
            style={styles.starIcon}
          />
        ))}
      </View>
    );
  };

  const onRefresh = async () => {
    setRefreshing(true);
    await new Promise((resolve) => setTimeout(resolve, 700));
    await fetchData();
    await new Promise((resolve) => setTimeout(resolve, 500));
    setRefreshing(false);
  };

  const openModal = (id) => {
    setSelectedId(id);
    setModalVisible(true);
  };

  const closeModal = () => {
    setModalVisible(false);
    setSelectedId(null);
  };

  return (
    <LinearGradient colors={["#173d39", "#000000"]} style={styles.gradient}>
      <View style={styles.container}>
        {isAuthenticated ? (
          <>
            <View style={styles.header}>
              <Text style={styles.title}>User Reviews</Text>
              <TouchableOpacity onPress={onRefresh}>
                <AntDesign name="reload1" size={24} color="yellow" />
              </TouchableOpacity>
            </View>
            <ScrollView
              refreshControl={
                <RefreshControl refreshing={refreshing} onRefresh={onRefresh} />
              }
            >
              {comments.map((comment, index) => {
                const film = films[comment.filmId];
                return (
                  <View key={index} style={styles.commentContainer}>
                    {film && (
                      <View style={styles.titleContainer}>
                        <TouchableOpacity
                          onPress={() => openModal(comment.filmId)}
                          style={styles.titleContent}
                        >
                          <Image
                            source={{ uri: film.coverImageUrl }}
                            style={styles.resultImage}
                          />
                          <Text
                            style={styles.resultTitle}
                            numberOfLines={2}
                            ellipsizeMode="tail"
                          >
                            {film.name}
                          </Text>
                        </TouchableOpacity>
                        <Text style={styles.commentDate}>
                          {moment(comment.createdOn).format("DD MMM YYYY")}
                        </Text>
                      </View>
                    )}
                    <View style={styles.commentContent}>
                      <Text style={styles.commentText}>{comment.content}</Text>
                      {renderStars(comment.starRating)}
                      <View style={styles.likeContainer}>
                        <TouchableOpacity
                          onPress={() => handleLike(comment.id)}
                        >
                          <AntDesign
                            name={comment.isLiked ? "heart" : "hearto"}
                            size={24}
                            color={comment.isLiked ? "red" : "white"}
                          />
                        </TouchableOpacity>
                        <Text style={styles.likeCount}>
                          {comment.numberOfLikes || 0}
                        </Text>
                      </View>
                    </View>
                    <View style={styles.commentFooter}>
                      <Text style={styles.commentAuthor}>
                        - {comment.createdBy}
                      </Text>
                    </View>
                  </View>
                );
              })}
            </ScrollView>
          </>
        ) : (
          <View style={styles.alertContainer}>
            <Text style={styles.alertText}>
              Please log in to view this content.
            </Text>
          </View>
        )}
      </View>

      {/* Modal for Film Content */}
      <Modal
        transparent={true}
        animationType="slide"
        visible={!!selectedId}
        onRequestClose={closeModal}
      >
        <View style={styles.modalOverlay}>
          <View style={styles.modalContainer}>
            {selectedId && <FilmContent id={selectedId} />}
            <TouchableOpacity onPress={closeModal} style={styles.closeButton}>
              <Fontisto name="close" size={22} color="white" />
            </TouchableOpacity>
          </View>
        </View>
      </Modal>
    </LinearGradient>
  );
}
const styles = StyleSheet.create({
  gradient: {
    flex: 1,
  },
  container: {
    flex: 1,
    padding: 16,
  },
  header: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    marginBottom: 16,
  },
  title: {
    fontSize: 24,
    fontWeight: "bold",
    color: "white",
  },
  commentContainer: {
    marginBottom: 16,
    padding: 16,
    backgroundColor: "#222",
    borderRadius: 8,
  },
  commentContent: {
    marginBottom: 8,
  },
  commentText: {
    fontSize: 16,
    color: "white",
  },
  ratingContainer: {
    flexDirection: "row",
    marginTop: 8,
  },
  starIcon: {
    marginRight: 4,
  },
  likeContainer: {
    flexDirection: "row",
    alignItems: "center",
    marginTop: 8,
  },
  likeCount: {
    fontSize: 16,
    color: "white",
    marginLeft: 8,
  },
  titleContainer: {
    flexDirection: "row",
    alignItems: "center",
    marginBottom: 10,
    paddingVertical: 5,
    justifyContent: "space-between",
  },
  titleContent: {
    flexDirection: "row",
    alignItems: "center",
    flex: 1,
  },
  resultImage: {
    width: 40,
    height: 60,
    marginRight: 10,
    borderRadius: 10,
  },
  resultTitle: {
    fontSize: 16,
    color: "#ffffff",
    fontWeight: "bold",
    flexShrink: 1,
  },
  commentDate: {
    fontSize: 14,
    color: "lightgrey",
  },
  commentFooter: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "flex-end",
    marginTop: 8,
  },
  commentAuthor: {
    fontSize: 18,
    color: "grey",
    marginRight: 8,
  },
  profileImage: {
    width: 35,
    height: 35,
    borderRadius: 50,
    borderColor: "white",
    borderWidth: 1,
  },
  modalOverlay: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
    backgroundColor: "rgba(0, 0, 0, 0.5)",
  },
  modalContainer: {
    width: width * 0.9,
    height: height * 0.9,
    borderRadius: 20,
    overflow: "hidden",
    justifyContent: "center",
    alignItems: "center",
    position: "relative",
  },
  closeButton: {
    position: "absolute",
    top: 10,
    right: 10,
    zIndex: 1,
    padding: 10,
    borderRadius: 10,
  },
  alertContainer: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
  },
  alertText: {
    fontSize: 18,
    color: "#ffffff",
    textAlign: "center",
  },
});
