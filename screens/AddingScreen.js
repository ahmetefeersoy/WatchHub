import React, { useState, useEffect, useContext } from "react";
import {
  StyleSheet,
  Text,
  View,
  ScrollView,
  TouchableOpacity,
  Image,
  Modal,
  Dimensions,
} from "react-native";
import { LinearGradient } from "expo-linear-gradient";
import { AuthContext } from "../store/auth-context";
import SearchBar from "../components/SearchBar";
import useResult from "../hooks/useResult";
import CommentContent from "../components/CommentContent";
import Fontisto from "@expo/vector-icons/Fontisto";
import Loading from "../components/Loading";

const { width, height } = Dimensions.get("window");

export default function AddingScreen() {
  const [term, setTerm] = useState("");
  const [debouncedTerm, setDebouncedTerm] = useState("");
  const { isAuthenticated } = useContext(AuthContext);
  const [searchApi, results, clearResults] = useResult();
  const [modalVisible, setModalVisible] = useState(false);
  const [selectedId, setSelectedId] = useState(null);
  const [timer, setTimer] = useState(null);
  const [showResults, setShowResults] = useState(false);
  const [isLoading, setIsLoading] = useState(false); // Yeni state
  const [noResults, setNoResults] = useState(false);

  useEffect(() => {
    if (timer) {
      clearTimeout(timer);
    }
    if (term === "") {
      setShowResults(false);
      setIsLoading(false); // Arama terimi boşsa loading iptal
    }

    const newTimer = setTimeout(() => {
      setDebouncedTerm(term);
    }, 500);

    setTimer(newTimer);
  }, [term]);

  useEffect(() => {
    if (debouncedTerm.length >= 3) {
      setIsLoading(true); // Arama başlarken yükleme başlıyor
      setNoResults(false);
      clearResults();
      const newTimer = setTimeout(() => {
        searchApi(debouncedTerm, 50)
          .then((response) => {
            // Sonuçlar başarıyla geldiğinde kontrol ediyoruz
            if (results.length === 0) {
              setNoResults(true); // Eğer sonuç yoksa noResults true yapılıyor
            } else {
              setNoResults(false); // Eğer sonuç varsa noResults false yapılıyor
            }
          })
          .catch((error) => {
            console.error("Arama hatası:", error);
          })
          .finally(() => {
            setIsLoading(false); // Sonuçlar geldikten sonra yükleme tamamlanıyor
          });
      }, 200);

      setShowResults(true);
    }
  }, [debouncedTerm]);

  const openModal = (id, title) => {
    setSelectedId(id);
    setModalVisible(true);
  };

  const handleClear = () => {
    setTerm("");
    setDebouncedTerm("");
  };

  useEffect(() => {
    if (!modalVisible) {
      closeModal();
    }
  }, [modalVisible]);

  const closeModal = () => {
    setSelectedId(null);
    setTimeout(() => setModalVisible(false), 0);
  };

  const displayResults = showResults ? (
    <ScrollView>
      <View style={styles.resultsContainer}>
        {isLoading ? (
          <Loading message="Loading movies..." />
        ) : results.length > 0 ? (
          results.map((result) => (
            <TouchableOpacity
              key={result.id}
              onPress={() => openModal(result.id, result.title)}
              style={styles.resultItem}
            >
              <Image
                source={{ uri: result.coverImageUrl }}
                style={styles.resultImage}
              />
              <Text style={styles.resultTitle}>{result.name}</Text>
            </TouchableOpacity>
          ))
        ) : (
          noResults && (
            <Text style={styles.noResultsText}>No results found</Text>
          )
        )}
      </View>
    </ScrollView>
  ) : (
    <View style={styles.browseByContainer}>
      <Image
        source={require("../assets/image/commentscreenPNG.png")}
        style={styles.backgroundImage}
      />
    </View>
  );

  return (
    <LinearGradient colors={["#173d39", "#000000"]} style={styles.gradient}>
      <View style={styles.container}>
        <SearchBar
          term={term}
          onTermChange={setTerm}
          onClear={handleClear}
          placeholder="Choose a film"
          autoFocus={true}
        />
        {isAuthenticated ? (
          displayResults
        ) : (
          <View style={styles.alertContainer}>
            <Text style={styles.alertText}>
              Please log in to view this content.
            </Text>
          </View>
        )}
      </View>

      {/* Modal for Comment Content */}
      <Modal
        transparent={true}
        animationType="slide"
        visible={!!selectedId}
        onRequestClose={closeModal}
      >
        <View style={styles.modalOverlay}>
          <View style={styles.modalContainer}>
            {selectedId && (
              <CommentContent
                id={selectedId}
                setModalVisible={setModalVisible}
              />
            )}
            <View style={styles.alertBanner}>
              <Text style={styles.alertText2}>
              Attention! The comments you make can be seen by everyone, so please be careful about the content of your comments.
              </Text>
            </View>
          </View>
        </View>
      </Modal>
    </LinearGradient>
  );
}

const styles = StyleSheet.create({
  image: {
    width: 150,
    height: 150,
  },
  browseByContainer: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
    backgroundColor: "rgba(0, 0, 0, 0)", // Transparent background
  },
  browseByTitle: {
    fontSize: 24,
    fontWeight: "bold",
    color: "#ffffff",
    marginBottom: 20,
  },
  browseItem: {
    paddingVertical: 15,
    borderBottomColor: "#175d39",
    borderBottomWidth: 1,
  },
  browseText: {
    fontSize: 18,
    color: "#ffffff",
  },
  imageview: {
    alignItems: "center",
    justifyContent: "center",
    marginTop: 15,
    marginBottom: -10,
    flex: 1,
  },
  gradient: {
    flex: 1,
  },
  container: {
    flex: 1,
    padding: 5,
    paddingBottom: 0,
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
  resultsContainer: {
    flex: 1,
    paddingHorizontal: 10,
  },
  resultItem: {
    flexDirection: "row",
    alignItems: "center",
    marginBottom: 10,
    borderBottomWidth: 1,
    borderBottomColor: "#175d39",
    paddingVertical: 5,
  },
  backgroundImage: {
    width: "40%", // Size adjustments to match the desired look
    height: "25%", // Size adjustments to match the desired look
    opacity: 0.7,
  },
  resultImage: {
    width: 40, // Size adjustments to match the desired look
    height: 60, // Size adjustments to match the desired look
    marginRight: 10,
    borderRadius: 10,
  },
  resultTitle: {
    fontSize: 18, // Adjust font size as needed
    color: "#ffffff",
    flex: 1,
    fontWeight: "bold",
  },
  noResultsText: {
    fontSize: 18,
    color: "#ffffff",
    textAlign: "center",
    marginTop: 20,
  },
  defaultContainer: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
  },
  defaultText: {
    fontSize: 18,
    color: "#ffffff",
    textAlign: "center",
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
    backgroundColor: "#00000080", // Semi-transparent background for close button
  },
  alertBanner: {
    position: "absolute",
    bottom: 10,
    left: 10,
    right: 10,
    padding: 10,
    backgroundColor: "#00000080", // Semi-transparent background for alert banner
    borderRadius: 10,
  },
  alertText2: {
    fontSize: 18,
    fontWeight: "bold",
    color: "red",
    textAlign: "center",
  },
});
