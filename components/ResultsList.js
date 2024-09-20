import React, { useState, useCallback, useRef } from 'react';
import { View, Text, FlatList, StyleSheet, TouchableOpacity, Modal, Dimensions } from 'react-native';
import ResultDetail from './ResultDetail';
import FilmContent from './FilmContent';
import Fontisto from '@expo/vector-icons/Fontisto';
import { useNavigation } from '@react-navigation/native';

const { width, height } = Dimensions.get('window');

const ResultsList = React.memo(({ title, results }) => {
  const [modalVisible, setModalVisible] = useState(false);
  const [selectedId, setSelectedId] = useState(null);
  const navigation = useNavigation();

  const closeModal = useCallback(() => {
    setModalVisible(false);
    setSelectedId(null);
  }, []);

  const switchScreen = useCallback((id) => {
    setSelectedId(id);
    setModalVisible(true);
  }, []);

  const handlePress = useCallback(() => {
    navigation.navigate('FullFilmList', { results, title });
  }, [navigation, results, title]);

  const handleForMorePress = useCallback(() => {
    navigation.navigate('FullFilmList', { results, title });
  }, [navigation, results, title]);

  const renderFooter = () => (
    <View style={styles.footerContainer}>
      <TouchableOpacity onPress={handleForMorePress} style={styles.moreContainer}>
        <Text style={styles.moreText}>For more</Text>
        <Fontisto name="arrow-right" size={20} color="white" />
      </TouchableOpacity>
    </View>
  );

  return (
    <View style={styles.container}>
      <TouchableOpacity onPress={handlePress}>
        <Text style={styles.title}>{title}</Text>
      </TouchableOpacity>
      <FlatList
        horizontal
        showsHorizontalScrollIndicator={false}
        nestedScrollEnabled={true} 
        data={results.slice(0, 20)}
        keyExtractor={(result) => result.id}
        renderItem={({ item }) => (
          <TouchableOpacity onPress={() => switchScreen(item.id)}>
            <ResultDetail result={item} />
          </TouchableOpacity>
        )}
        initialNumToRender={10}
        maxToRenderPerBatch={10}
        windowSize={10}
        ListFooterComponent={renderFooter} // Adds the footer with the "For more..." button
      />

      <Modal
        transparent={true}
        animationType="slide"
        visible={modalVisible}
        onRequestClose={closeModal}
      >
        <View style={styles.modalOverlay}>
          <View style={styles.modalContainer}>
            <FilmContent id={selectedId} />
            <TouchableOpacity onPress={closeModal} style={styles.closeButton}>
              <Fontisto name="close" size={22} color="white" />
            </TouchableOpacity>
          </View>
        </View>
      </Modal>
    </View>
  );
});

const styles = StyleSheet.create({
  container: {
    marginBottom: 10,
    marginRight: 20,
  },
  title: {
    fontSize: 18,
    fontWeight: 'bold',
    marginLeft: 15,
    marginBottom: 5,
    color: "white",
  },
  footerContainer: {
    justifyContent: 'center',
    alignItems: 'center',
    paddingHorizontal: 15, // Ensure some padding from the sides
  },
  moreContainer: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  moreText: {
    fontSize: 16,
    color: 'white',
    marginRight: 5,
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
    marginTop: 20,
  },
  closeButton: {
    position: 'absolute',
    top: 7,
    right: 7,
    zIndex: 1,
  },
});

export default ResultsList;
