import React, { useState, useEffect } from 'react';
import { View, Text, StyleSheet, TouchableOpacity, Modal, Dimensions } from 'react-native';
import Fontisto from '@expo/vector-icons/Fontisto';
import { LinearGradient } from 'expo-linear-gradient';
import FullList from '../components/FullList';
import { Animated } from 'react-native';

const { width, height } = Dimensions.get('window');

const FullFilmList = ({ route }) => {
  const { results, title } = route.params;

  const [modalVisible, setModalVisible] = useState(false);
  const [sortOption, setSortOption] = useState(null);
  const [sortedResults, setSortedResults] = useState(results);
  const [refreshing, setRefreshing] = useState(false);

  const [refreshAnimation] = useState(new Animated.Value(0));

  useEffect(() => {
    if (sortOption !== null) {
      setRefreshing(true);

      // Start the refresh animation and hide other elements for 1 second
      Animated.sequence([
        Animated.timing(refreshAnimation, {
          toValue: 1,
          duration: 500,
          useNativeDriver: true,
        }),
        Animated.timing(refreshAnimation, {
          toValue: 0,
          duration: 500,
          useNativeDriver: true,
        }),
      ]).start();

      setTimeout(() => {
        const newSortedResults = sortOption
          ? [...results].sort((a, b) => {
              if (sortOption === 'IMDbRating') {
                return b.imDbRating - a.imDbRating;
              } else if (sortOption === 'ReleaseYear') {
                return b.releaseYear - a.releaseYear;
              }
              return 0;
            })
          : results;
        setSortedResults(newSortedResults);
        setRefreshing(false);
      }, 1000);
    } else {
      setSortedResults(results);
    }
  }, [results, sortOption]);

  function closeModal() {
    setModalVisible(false);
  }

  function handleSortOption(option) {
    setSortOption(option);
    setModalVisible(false);
  }

  function resetSorting() {
    setSortOption(null);
    setModalVisible(false);
  }

  // Refresh animation interpolation
  const refreshInterpolation = refreshAnimation.interpolate({
    inputRange: [0, 1],
    outputRange: ['0deg', '360deg'],
  });

  return (
    <LinearGradient colors={['#173d39', '#000000']} style={styles.gradient}>
      <View style={styles.container}>
        {refreshing ? (
          <View style={styles.refreshingContainer}>
            <Animated.View style={{ transform: [{ rotate: refreshInterpolation }] }}>
              <Fontisto name="spinner-refresh" size={44} color="white" />
            </Animated.View>
          </View>
        ) : (
          <>
            <View style={styles.header}>
              <Text style={styles.title}>{title} Movie List</Text>
              <TouchableOpacity onPress={() => setModalVisible(true)} style={styles.filterButton}>
                <Fontisto name="filter" size={22} color="white" />
              </TouchableOpacity>
            </View>

            {/* FullList bileşeni */}
            <FullList results={sortedResults} />

          </>
        )}

        {/* Filter Modal */}
        <Modal
          transparent={true}
          animationType="slide"
          visible={modalVisible}
          onRequestClose={closeModal}
        >
          <View style={styles.modalOverlay}>
            <View style={styles.filterModalContainer}>
              <TouchableOpacity
                onPress={() => handleSortOption('IMDbRating')}
                style={styles.filterOption}
              >
                <Text style={styles.filterText}>Sort by Rating</Text>
              </TouchableOpacity>
              <TouchableOpacity
                onPress={() => handleSortOption('ReleaseYear')}
                style={styles.filterOption}
              >
                <Text style={styles.filterText}>Sort by Release Year</Text>
              </TouchableOpacity>
              <TouchableOpacity onPress={resetSorting} style={styles.filterOption}>
                <Text style={styles.filterText1}>Reset Sorting</Text>
              </TouchableOpacity>
              <TouchableOpacity onPress={closeModal} style={styles.closeButton}>
                <Fontisto name="close" size={22} color="white" />
              </TouchableOpacity>
            </View>
          </View>
        </Modal>
      </View>
    </LinearGradient>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    marginBottom: 10,
    marginRight: 20,
  },
  gradient: {
    flex: 1,
  },
  header: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 10,
  },
  title: {
    fontSize: 18,
    fontWeight: 'bold',
    marginLeft: 15,
    color: 'white',
  },
  filterButton: {
    marginRight: 15,
  },
  refreshingContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
  },
  filterModalContainer: {
    width: width * 0.8,
    height: height * 0.3,
    backgroundColor: '#222',
    borderRadius: 20,
    justifyContent: 'center',
    alignItems: 'center',
    position: 'absolute',
    top: height * 0.3,
    left: width * 0.1,
  },
  filterOption: {
    marginBottom: 20,
  },
  filterText: {
    fontSize: 18,
    color: 'white',
  },
  filterText1: {
    fontSize: 18,
    color: 'red',
  },
  closeButton: {
    position: 'absolute',
    top: 10,
    right: 10,
  },
  modalOverlay: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: 'rgba(0, 0, 0, 0.5)',
  },
});

export default FullFilmList;
