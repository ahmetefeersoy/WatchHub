import React, { useEffect, useState,useContext } from 'react';
import { StyleSheet, Text, View, Image,Animated, ScrollView, Dimensions, ActivityIndicator, TouchableOpacity, Alert,RefreshControl } from 'react-native';
import { LinearGradient } from 'expo-linear-gradient';
import { WebView } from 'react-native-webview';
import { TextInput } from 'react-native-paper';
import useApi from '../util/api';
import Ionicons from '@expo/vector-icons/Ionicons';
import AntDesign from '@expo/vector-icons/AntDesign';
import { AuthContext } from '../store/auth-context';
import { postUserComment } from '../util/Comment';

const { width } = Dimensions.get('window');

export default function CommentContent({ id, setModalVisible }) {
    const [result, setResult] = useState(null);
    const [rating, setRating] = useState(0);
    const [commentContent, setCommentContent] = useState("");
    const api = useApi();
    const { token } = useContext(AuthContext);
    
    const getResult = async (id) => {
        try {
            const response = await api.get(`/api/films/${id}`);
            setResult(response.data); 
        } catch (error) {
            console.error('Failed to fetch data', error);
        }
    };

    useEffect(() => {
        if (id) {
            getResult(id);
        }
    }, [id]);

    if (!result) {
        return null;
    }

    const handleSave = async () => {
        if (!commentContent || rating === 0) {
            Alert.alert('Please enter your comment and rating!');
            return;
        }

        const commentData = {
            starRating: rating,
            content: commentContent
        };

        try {
            await postUserComment(id, token, commentData);
            Alert.alert('Comment saved successfully');
            setModalVisible(false); // Modalı kapat
        } catch (error) {
            Alert.alert('Failed to save comment');
        }
    };

    const handleCancel = () => {
        setModalVisible(false); // Modalı kapat, kaydetmeden çık
    };

    const handleRating = (index) => {
        setRating(index);
    };

    const handleCommentChange = (text) => {
        if (text.length <= 250) {
            setCommentContent(text);
        }
    };

    return (
        <LinearGradient
            colors={['#173d39', '#000000']}
            style={styles.gradient}
        >
            <ScrollView contentContainerStyle={styles.container}>
                <View style={styles.headerContainer}>
                    <TouchableOpacity onPress={handleCancel} style={styles.headerButton}>
                        <Text style={styles.headerButtonText}>Cancel</Text>
                    </TouchableOpacity>
                    <TouchableOpacity onPress={handleSave} style={styles.headerButton}>
                        <Text style={styles.headerButtonText}>Save</Text>
                    </TouchableOpacity>
                </View>

                <View style={styles.titleContainer}>
                    <Image 
                        source={{ uri: result.coverImageUrl }} 
                        style={styles.resultImage} 
                    />
                    <Text style={styles.resultTitle}>{result.name}</Text>
                </View>

                <View style={styles.ratingContainer}>
                    {[...Array(5)].map((_, index) => (
                        <TouchableOpacity key={index} onPress={() => handleRating(index + 1)}>
                            <AntDesign 
                                name={index < rating ? "star" : "staro"} 
                                size={32} 
                                color="#FFD700" 
                                style={styles.starIcon} 
                            />
                        </TouchableOpacity>
                    ))}
                </View>

                <View style={styles.commentContainer}>
                    <TextInput
                        label="Add comment..."
                        value={commentContent}
                        onChangeText={handleCommentChange}
                        multiline
                        style={styles.commentInput}
                        maxLength={250}
                    />
                    <Text style={[styles.charCount, { color: commentContent.length === 250 ? 'red' : '#ffffff' }]}>
                        {commentContent.length}/250
                    </Text>
                </View>
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
    headerContainer: {
        flexDirection: 'row',
        justifyContent: 'space-between',
        alignItems: 'center',
        marginBottom: 20,
    },
    headerButton: {
        padding: 10,
    },
    headerButtonText: {
        color: '#FFD700',
        fontSize: 18,
        fontWeight: 'bold',
    },
    titleContainer: {
        flexDirection: 'row',
        alignItems: 'center',
        marginVertical: 10,
        marginTop: 20,
        marginBottom: 20,
        paddingVertical: 5,
    },
    resultImage: {
        width: 50,
        height: 75,
        marginRight: 10,
        borderRadius: 10,
    },
    resultTitle: {
        fontSize: 20,
        color: '#ffffff',
        flex: 1,
        fontWeight: 'bold',
    },
    ratingContainer: {
        flexDirection: 'row',
        justifyContent: 'center',
        marginBottom: 20,
    },
    starIcon: {
        marginHorizontal: 5,
    },
    commentContainer: {
        marginBottom: 20,
    },
    commentInput: {
        backgroundColor: '#ffffff',
        borderRadius: 10,
        padding: 10,
    },
    charCount: {
        marginTop: 5,
        fontSize: 14,
        textAlign: 'right',
    },
});
