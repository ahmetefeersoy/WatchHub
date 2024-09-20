import React, { useState, useEffect, useContext } from 'react';
import { StyleSheet, Text, View, ScrollView, TouchableOpacity, Image, Modal, Dimensions } from 'react-native';
import { LinearGradient } from 'expo-linear-gradient';
import { AuthContext } from '../store/auth-context'; 
import SearchBar from '../components/SearchBar';
import useResult from '../hooks/useResult';
import FilmContent from '../components/FilmContent';
import Fontisto from '@expo/vector-icons/Fontisto';
import { SafeAreaView } from 'react-native-safe-area-context';
import AsyncStorage from '@react-native-async-storage/async-storage';
import Loading from "../components/Loading";

const { width, height } = Dimensions.get('window');

export default function SearchScreen() {
  const [term, setTerm] = useState('');
  const [debouncedTerm, setDebouncedTerm] = useState('');
  const { isAuthenticated } = useContext(AuthContext); 
  const [searchApi, results, clearResults] = useResult();
  const [modalVisible, setModalVisible] = useState(false);
  const [selectedId, setSelectedId] = useState(null);
  const [timer, setTimer] = useState(null);
  const [recentSearches, setRecentSearches] = useState([]);
  const [showResults, setShowResults] = useState(false);
  const [isLoading, setIsLoading] = useState(false); // Yeni state
  const [noResults, setNoResults] = useState(false)
  useEffect(() => {
    if (timer) {
      clearTimeout(timer);
    }
    if(term==''){
      setShowResults(false);
    }

    
    const newTimer = setTimeout(() => {
      setDebouncedTerm(term);
    }, 1000);

    setTimer(newTimer);
  }, [term]);

  const handleClear = () => {
    setTerm("");
    setDebouncedTerm("");
  };

  useEffect(() => {
    if (debouncedTerm.length >= 3) {
      setIsLoading(true); // Arama başlarken yükleme başlıyor
      setNoResults(false);
      clearResults(); 
      const newTimer = setTimeout(() => {
        searchApi(debouncedTerm, 60)
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
      saveRecentSearch(debouncedTerm);
    }
  }, [debouncedTerm]);

  const saveRecentSearch = async (searchTerm) => {
    if (!searchTerm || searchTerm.trim() === '') return;
  
    try {
      const updatedSearches = [searchTerm, ...recentSearches.filter(term => term !== searchTerm)].slice(0, 10);
      setRecentSearches(updatedSearches);
      await AsyncStorage.setItem('recentSearches', JSON.stringify(updatedSearches));
    } catch (error) {
      console.error('Failed to save recent search', error);
    }
  };

  const clearRecentSearches = async () => {
    setRecentSearches([]);
    await AsyncStorage.removeItem('recentSearches');
  };

  const openModal = (id, title) => {
    setSelectedId(id);
    saveRecentSearch(title);
    setModalVisible(true);
  };

  const closeModal = () => {
    setModalVisible(false);
    setSelectedId(null);
  };

  const displayResults = showResults ? (
    <ScrollView showsVerticalScrollIndicator={true}>
      <View style={styles.resultsContainer}>
        {isLoading ? (
          <Loading message="Loading movies..." />
        ) : (
          results.length > 0 ? (
            results.map((result) => (
              <TouchableOpacity 
                key={result.id} 
                onPress={() => openModal(result.id, result.title)}
              >
                <Image 
                  source={{ uri: result.coverImageUrl }} 
                  style={styles.resultImage} 
                />
              </TouchableOpacity>
            ))
          ) : (
            noResults && (
              <Text style={styles.noResultsText}>No results found</Text>
            )
          )
        )}
      </View>
    </ScrollView>
  ) : (
    <View style={styles.browseByContainer}>
      <View style={styles.recentHeader}>
        <Text style={styles.browseByTitle}>Recent Searches</Text>
        <TouchableOpacity 
          style={styles.clearButton}
          onPress={clearRecentSearches}
        >
          <Fontisto name="trash" size={24} color="white" />
        </TouchableOpacity>
      </View>
      {recentSearches.length > 0 ? (
        recentSearches.map((search, index) => (
          <TouchableOpacity 
            key={index} 
            onPress={() => setTerm(search)} 
            style={styles.browseItem}
          >
            <Text style={styles.browseText}>{search}</Text>
          </TouchableOpacity>
        ))
      ) : (
        <Text style={styles.noResultsText}>No recent searches</Text>
      )}
    </View>
  );

  return (
    <LinearGradient
      colors={['#173d39', '#000000']}
      style={styles.gradient}
    >
      <View style={styles.container}>
        <SearchBar
          term={term}
          onTermChange={setTerm}
          onClear={handleClear}
          placeholder="Search for movies..."
          autoFocus={true}
        />
        {isAuthenticated ? displayResults : (
          <View style={styles.alertContainer}>
            <Text style={styles.alertText}>Please log in to view this content.</Text>
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
  image: {
    width: 150,
    height: 150, 
  },
  browseByContainer: {
    marginTop: 20,
    paddingHorizontal: 10,
  },
  browseByTitle: {
    fontSize: 24,
    fontWeight: 'bold',
    color: '#ffffff',
    marginBottom: 20,
  },
  browseItem: {
    paddingVertical: 15,
    borderBottomColor: '#175d39',
    borderBottomWidth: 1,
  },
  browseText: {
    fontSize: 18,
    color: '#ffffff',
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
    position: 'relative',
  },
  recentHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
  },
  clearButton: {
    paddingHorizontal: 10,
  },
  alertContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
  },
  alertText: {
    fontSize: 18,
    color: '#ffffff',
    textAlign: 'center',
  },
  resultsContainer: {
    flex: 1,
    flexDirection: 'row',
    flexWrap: 'wrap',
    justifyContent: 'center',
    paddingHorizontal: 10,
  },
  resultImage: {
    width: 100,
    height: 150,
    margin: 10,
    borderRadius: 10,
  },
  noResultsText: {
    fontSize: 18,
    color: '#ffffff',
    textAlign: 'center',
    marginTop: 20,
  },
  defaultContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
  },
  defaultText: {
    fontSize: 18,
    color: '#ffffff',
    textAlign: 'center',
  },
  modalOverlay: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: 'rgba(0, 0, 0, 0.5)',
  },
  modalContainer: {
    width: width * 0.9,
    height: height * 0.9,
    borderRadius: 20,
    overflow: 'hidden',
    justifyContent: 'center',
    alignItems: 'center',
    position: 'relative',
  },
  closeButton: {
    position: 'absolute',
    top: 10,
    right: 10,
    zIndex: 1,
    padding: 10,
    borderRadius: 10,
  },
});
