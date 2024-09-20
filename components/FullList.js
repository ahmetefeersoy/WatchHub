import React, { useState, useRef } from 'react';
import { View, TouchableOpacity, FlatList, Modal, StyleSheet, Dimensions, Animated } from 'react-native';
import Fontisto from '@expo/vector-icons/Fontisto';
import ResultDetail2 from './ResultDetail2';
import FilmContent from './FilmContent';
import { useNavigation } from '@react-navigation/native';

const { width, height } = Dimensions.get('window');

const FullList = ({ title, results }) => {
  const [modalVisible, setModalVisible] = useState(false);
  const [selectedId, setSelectedId] = useState(null);
  const [showScrollToTop, setShowScrollToTop] = useState(false); // Scroll to top button visibility
  const scrollViewRef = useRef(null); // Reference to the FlatList
  const navigation = useNavigation();

  const handleScroll = (event) => {
    const currentOffset = event.nativeEvent.contentOffset.y;
    setShowScrollToTop(currentOffset > 200); // Show button when scrolled down 200px
  };

  const scrollToTop = () => {
    if (scrollViewRef.current) {
      scrollViewRef.current.scrollToOffset({ offset: 0, animated: true });
    }
  };

  function closeModal() {
    setModalVisible(false);
    setSelectedId(null);
  }

  function switchScreen(id) {
    setSelectedId(id);
    setModalVisible(true);
  }

  return (
    <View style={styles.container}>
      <FlatList
        ref={scrollViewRef}
        data={results}
        keyExtractor={(result) => result.id}
        numColumns={3}
        nestedScrollEnabled={true}
        initialNumToRender={30}
        maxToRenderPerBatch={40}
        windowSize={20}
        indicatorStyle='white'
        onScroll={handleScroll} // Attach scroll handler
        scrollEventThrottle={16}
        renderItem={({ item }) => (
          <TouchableOpacity onPress={() => switchScreen(item.id)}>
            <ResultDetail2 result={item} />
          </TouchableOpacity>
        )}
      />

      {showScrollToTop && (
        <TouchableOpacity onPress={scrollToTop} style={styles.scrollToTopButton}>
          <Fontisto name="arrow-up" size={24} color="white" />
        </TouchableOpacity>
      )}

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
};

const styles = StyleSheet.create({
  container: {
    marginBottom: 10,
    marginRight: 20,
  },
  scrollToTopButton: {
    position: 'absolute',
    bottom: 30,
    right: 20,
    backgroundColor: 'green',
    padding: 10,
    borderRadius: 50,
    justifyContent: 'center',
    alignItems: 'center',
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

export default FullList;
