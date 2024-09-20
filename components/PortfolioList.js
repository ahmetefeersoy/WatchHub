import React, { useState } from 'react';
import { View, Text, FlatList, StyleSheet, TouchableOpacity, Modal, Dimensions } from 'react-native';
import MyListDetail from './MyListDetail';
import FilmContent from './FilmContent';
import Ionicons from '@expo/vector-icons/Ionicons';
import Fontisto from '@expo/vector-icons/Fontisto';


const { width, height } = Dimensions.get('window');

const PortfolioList = ({ results }) => {
  const [modalVisible, setModalVisible] = useState(false);
  const [selectedId, setSelectedId] = useState(null);

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
        horizontal
        showsHorizontalScrollIndicator={false}
        data={results}
        keyExtractor={(result) => result.id}
        renderItem={({ item }) => (
          <TouchableOpacity onPress={() => switchScreen(item.id)}>
            <MyListDetail result={item} />
          </TouchableOpacity>
        )}
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
};

const styles = StyleSheet.create({
  container: {
    marginBottom: 10,
    marginRight: 20,
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
  }
});

export default PortfolioList;
