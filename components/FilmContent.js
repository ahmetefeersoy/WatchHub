import React, { useEffect, useState,useContext } from 'react';
import { StyleSheet, Text, View, Image,Animated, ScrollView, Dimensions, ActivityIndicator, TouchableOpacity, Alert } from 'react-native';
import { LinearGradient } from 'expo-linear-gradient';
import { WebView } from 'react-native-webview';
import useApi from '../util/api';
import Ionicons from '@expo/vector-icons/Ionicons';
import AntDesign from '@expo/vector-icons/AntDesign';
import { AuthContext } from '../store/auth-context';
import { postUserPortfolio,deleteUserPortfolio } from '../util/Auth';
import usePortfolio from '../hooks/usePortfolio';

const { width } = Dimensions.get('window');

// YouTube URL'sini embed formatına dönüştür
const getTrailerUrl = (url) => {
    const videoId = url.split('v=')[1]?.split('&')[0];
    return videoId ? `https://www.youtube.com/embed/${videoId}` : null;
};

export default function FilmContent({ id }) {
    const [fetchPortfolio,portfolio ] = usePortfolio();
    const [result, setResult] = useState(null);
    const [loadingWebView, setLoadingWebView] = useState(true);
    const [addedToList, setAddedToList] = useState(false);
    const api = useApi();
    const { token, username, isAuthenticated } = useContext(AuthContext);
    const getNames = () => {
        if (Array.isArray(result)) {
          return result.map(item => item.name);
        }
        return [];
      };
    const getResult = async (id) => {
        try {
            const response = await api.get(`/api/films/${id}`);
            const isInPortfolio = portfolio.some(item => item.name === response.data.name);
            setResult(response.data); 
            setAddedToList(isInPortfolio);

        } catch (error) {
            console.error('Failed to fetch data', error);
        }
    };


    useEffect(() => {
        if (id) {
            getResult(id);
        }
    }, [id,portfolio]);

    if (!result) {
        return null;
    }


    const handleAddToList = async () => {
    
        if (addedToList) {
          try {
            await deleteUserPortfolio(result.name, token);
            setAddedToList(false);
            Alert.alert('List Update', 'Removed from your list.');
          } catch (error) {
            console.error('Failed to remove film from list:', error);
          }
        } else {
          try {
            
            await postUserPortfolio(result.name, token);
            setAddedToList(true);
            Alert.alert('List Update', 'Added to your list.');
          } catch (error) {
            console.error('Failed to add film to list:', error);
          }
        }
      };
    return (
        <LinearGradient
            colors={['#173d39', '#000000']}
            style={styles.gradient}
        >
            <ScrollView contentContainerStyle={styles.container}>
                <View style={styles.titleContainer}>
                    <Text style={styles.title}>{result.name}</Text>
                </View>
                <View style={styles.imageAndDescription}>
                    <Image source={{ uri: result.coverImageUrl }} style={styles.image} />
                    <View style={styles.descriptionContainer}>
                        <Text style={styles.description}>{result.description}</Text>
                         
                        <TouchableOpacity
                            style={[styles.addButton, addedToList && styles.addedButton]}
                            onPress={handleAddToList}
                        >
                            <View style={styles.iconContainer}>
                                {addedToList ? (
                                    <AntDesign name="check" size={24} color="white" />
                                ) : (
                                    <Ionicons name="add" size={24} color="white" />
                                )}
                            </View>
                        </TouchableOpacity>
                        <Text style={styles.listText}>
                            My List
                        </Text>
                    </View>
                </View>
                <View style={styles.detailsContainer}>
                    <Text style={styles.textBold}>Genre: <Text style={styles.text}>{result.genre}</Text></Text>
                    <Text style={styles.textBold}>Duration: <Text style={styles.text}>{result.duration} mins</Text></Text>
                    <Text style={styles.textBold}>Release Year: <Text style={styles.text}>{result.releaseYear}</Text></Text>
                    {/* <Text style={styles.textBold}>Platform: <Text style={styles.text}>{result.platform}</Text></Text> */}
                </View>
               
                {result.trailerUrl ? (
                    <View style={styles.webViewContainer}>
                        {loadingWebView && (
                            <View style={styles.loadingContainer}>
                                <ActivityIndicator size="large" color="#ffffff" />
                            </View>
                        )}
                        <WebView
                            source={{ uri: getTrailerUrl(result.trailerUrl) }}
                            style={loadingWebView ? styles.hiddenWebView : styles.webView}
                            onLoadEnd={() => setLoadingWebView(false)}
                            onError={(error) => {
                                console.error('WebView Error:', error);
                                setLoadingWebView(false);
                            }}
                        />
                    </View>
                ) : (
                    <Text style={styles.textBold}>No trailer available</Text>
                )}
            </ScrollView>
        </LinearGradient>
    );
}

const styles = StyleSheet.create({
    gradient: {
        flex: 1,
        width: '100%',
        height: '100%',
    },
    container: {
        padding: 10,
        flexGrow: 1, 
    },
    imageAndDescription: {
        flexDirection: 'row',
        alignItems: 'flex-start',
        marginBottom: 20,
    },
    descriptionContainer: {
        flex: 1,
        marginLeft: 10,
        justifyContent: 'center', 
    },
    titleContainer: {
        flexDirection: 'column',
        alignItems: 'center',
        marginVertical: 10,
        marginTop: 20,
    },
    title: {
        fontSize: 24,
        color: 'white',
        fontWeight: 'bold',
        textAlign: 'center',
    },
    detailsContainer: {
        marginTop: 20,
    },
    textBold: {
        fontSize: 16,
        color: 'white',
        fontWeight: 'bold',
        marginVertical: 5,
    },
    text: {
        fontSize: 14,
        color: 'white',
    },
    description: {
        color: 'white',
        fontSize: 16,
        flexShrink: 1, 
    },
    image: {
        width: width * 0.35, 
        height: width * 0.67, 
        borderRadius: 10,
    },
    webViewContainer: {
        marginTop: 20,
        height: 200,
        borderWidth: 2,
        borderColor: "white",
    },
    webView: {
        flex: 1,
        width: '100%',
    },
    hiddenWebView: {
        flex: 0,
        width: '100%',
        height: 0,
    },
    loadingContainer: {
        ...StyleSheet.absoluteFillObject,
        justifyContent: 'center',
        alignItems: 'center',
        backgroundColor: 'rgba(0, 0, 0, 0.5)',
    },
    addButton: {
        width: 40,
        height: 40,
        borderRadius: 20,
        backgroundColor: 'rgba(0, 0, 0, 0.5)', // Green color for added button
        justifyContent: 'center',
        alignItems: 'center',
        marginTop: 10,
    },
    addedButton: {
        backgroundColor: 'rgba(0, 0, 0, 0.5)', // Green color when added
    },
    iconContainer: {
        justifyContent: 'center',
        alignItems: 'center',
    },
    listText: {
        fontSize: 14,
        color: 'white',
        textAlign: 'flex-start',
        marginTop: 5,
    },
});
