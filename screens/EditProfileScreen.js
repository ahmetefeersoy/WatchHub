import AsyncStorage from "@react-native-async-storage/async-storage";
import { KeyboardAwareScrollView } from 'react-native-keyboard-aware-scroll-view'
import React, { useState, useEffect, useContext, useCallback } from 'react';
import { Alert, Image, ScrollView, StyleSheet, Text, TouchableOpacity, View } from 'react-native';
import { LinearGradient } from 'expo-linear-gradient';
import { SafeAreaView } from 'react-native-safe-area-context';
import { TextInput, Button, Modal } from 'react-native-paper';
import { Picker } from '@react-native-picker/picker';
import { MaterialIcons } from "@expo/vector-icons";
import * as ImagePicker from 'expo-image-picker';

import { AuthContext } from '../store/auth-context';
import { getUserProfile, saveUserProfile } from '../util/Auth';
import { COLORS, COUNTRIES, FONTS } from '../constants/theme';

const EditProfileScreen = ({ navigation }) => {
    const { token, username, isAuthenticated } = useContext(AuthContext);
    const [selectedImage, setSelectedImage] = useState(null);
    const [firstName, setFirstName] = useState("");
    const [lastName, setLastName] = useState("");
    const [profilImageUrl, setProfilImageUrl] = useState("")
    const [email, setEmail] = useState("");
    const [country, setCountry] = useState("");
    const [showCountryPicker, setShowCountryPicker] = useState(false);
    const [pickerOptions, setPickerOptions] = useState([]);

    const countries = COUNTRIES;

    const handleShowCountryPicker = useCallback(() => {
        setPickerOptions(countries); 
        setShowCountryPicker(true); 
    }, [countries]);

    const handleSelectCountry = useCallback((itemValue) => {
        setCountry(itemValue);
    }, []);

    function renderCountryPicker() {
        return (
            <Modal
                animationType='slide'
                transparent={true}
                visible={showCountryPicker}
                onRequestClose={() => setShowCountryPicker(false)}
            >
                <View style={styles.modalContainer}>
                    <View style={styles.modalContent}>
                        <Picker
                            selectedValue={country}
                            onValueChange={handleSelectCountry}
                            style={styles.picker}
                        >
                            {pickerOptions.map((country, index) => (
                                <Picker.Item key={index} label={country} value={country} />
                            ))}
                        </Picker>
                        <TouchableOpacity
                            onPress={() => setShowCountryPicker(false)}
                            style={styles.closeButtonContainer}
                        >
                            <Text style={styles.closeButton}>Close</Text>
                        </TouchableOpacity>
                    </View>
                </View>
            </Modal>
        );
    }

    useEffect(() => {
        async function fetchUserProfile() {
            try {
                const storedToken = await AsyncStorage.getItem('token');
                const storedUsername = await AsyncStorage.getItem('username');
                // const storedImageUri = await AsyncStorage.getItem('profileImage'); 
                const userProfile = await getUserProfile(storedUsername, storedToken);

                if (storedToken && storedUsername) {
                    setFirstName(userProfile.firstName);
                    setLastName(userProfile.lastName);
                    setEmail(userProfile.email);
                    setCountry(userProfile.country);
                    setProfilImageUrl(userProfile.profilImageUrl);

                }
            } catch (error) {
                console.error('Error fetching user profile:', error);
            }
        }

        fetchUserProfile();
    }, []); 

    const handleImageSelection = useCallback(async () => {
        // Galeri iznini kontrol et
        const { status } = await ImagePicker.getMediaLibraryPermissionsAsync();
        if (status !== 'granted') {
            Alert.alert(
                'Permission needed',
                'Sorry, we need camera roll permissions to make this work!',
                [
                    {
                        text: 'Grant Permission',
                        onPress: async () => {
                            const { status } = await ImagePicker.requestMediaLibraryPermissionsAsync();
                            if (status === 'granted') {
                                let result = await ImagePicker.launchImageLibraryAsync({
                                    mediaTypes: ImagePicker.MediaTypeOptions.Images,
                                    allowsEditing: true,
                                    aspect: [4, 4],
                                    quality: 1,
                                });
    
                                if (!result.canceled && result.assets && result.assets.length > 0) {
                                    const imageUri = result.assets[0].uri;
                                    setSelectedImage(imageUri);
                                    setProfilImageUrl(imageUri);
                                    console.log('Selected Image URI:', imageUri); // Log URL here
                                    // await AsyncStorage.setItem('profileImage', imageUri);
                                }
                            } else {
                                Alert.alert('Permission Denied', 'You need to grant permission to access the gallery.');
                            }
                        },
                    },
                    {
                        text: 'Cancel',
                        style: 'cancel',
                    },
                ]
            );
        } else {
            let result = await ImagePicker.launchImageLibraryAsync({
                mediaTypes: ImagePicker.MediaTypeOptions.Images,
                allowsEditing: true,
                aspect: [4, 4],
                quality: 1,
            });
    
            if (!result.canceled && result.assets && result.assets.length > 0) {
                const imageUri = result.assets[0].uri;
                setProfilImageUrl(imageUri);
                setSelectedImage(imageUri);
                console.log('Selected Image URI:', imageUri); // Log URL here
                // await AsyncStorage.setItem('profileImage', imageUri);
            }
        }
    }, []);
    const handleSave = useCallback(async () => {
        try {
            console.log('Profil Image URL before save:', profilImageUrl); // Log URL here
            const profileData = {
                username: username,
                firstName: firstName || '',   // Eğer boşsa, boş string gönder
                lastName: lastName || '',     // Eğer boşsa, boş string gönder
                country: country || '',       // Eğer boşsa, boş string gönder
                profilImageUrl: profilImageUrl || '', // Eğer boşsa, boş string gönder
            };
    
            await saveUserProfile(username, token, profileData);
            Alert.alert('Profile Updated', 'Your profile has been updated successfully!');
        } catch (error) {
            Alert.alert('Update Failed', 'Failed to update profile. Please try again.');
            console.error('Error updating user profile: editprofile', error.response ? error.response.data : error.message);
        }
    }, [username, token, firstName, lastName, country, profilImageUrl]);

    if (!isAuthenticated) {
        return (
            <LinearGradient colors={['#173d39', '#000000']} style={styles.gradient}>
                <SafeAreaView style={{ flex: 1, paddingHorizontal: 22 }}>
                    <View style={styles.centeredContainer}>
                        <Text style={styles.infoText}>Please log in to edit profile</Text>
                    </View>
                </SafeAreaView>
            </LinearGradient>
        );
    }

    return (
        <LinearGradient colors={['#173d39', '#000000']} style={styles.gradient}>
            <SafeAreaView style={{ flex: 1, paddingHorizontal: 22 }}>
                <KeyboardAwareScrollView>

                    <View style={styles.imageContainer}>
                        <TouchableOpacity onPress={handleImageSelection}>
                            <Image
                                source={profilImageUrl ? { uri: profilImageUrl } : require('../assets/image/profileDefault.jpg')}
                                style={styles.profileImage}
                            />
                            <View style={styles.cameraIcon}>
                                <MaterialIcons name="photo-camera" size={22} color={COLORS.white} />
                            </View>
                        </TouchableOpacity>
                    </View>
                    <View>
                        <View style={styles.inputContainer}>
                            <TextInput
                                label="Username"
                                value={username}
                                mode="outlined"
                                style={[styles.input, styles.nonEditableInput]}  // Apply the non-editable style
                                left={<TextInput.Icon icon="account" color={COLORS.primary} />}
                                editable={false}
                            />
                        </View>
                        <View style={styles.inputContainer}>
                            <TextInput
                                label="First Name"
                                value={firstName}
                                onChangeText={setFirstName}
                                mode="outlined"
                                style={styles.input}
                                left={<TextInput.Icon icon="account" color={COLORS.primary} />}
                            />
                        </View>
                        <View style={styles.inputContainer}>
                            <TextInput
                                label="Last Name"
                                value={lastName}
                                onChangeText={setLastName}
                                mode="outlined"
                                style={styles.input}
                                left={<TextInput.Icon icon="account" color={COLORS.primary} />}
                            />
                        </View>
                        <View style={styles.inputContainer}>
                            <TextInput
                                label="Email"
                                value={email}
                                mode="outlined"
                                style={[styles.input, styles.nonEditableInput]}  // Apply the non-editable style
                                left={<TextInput.Icon icon="email" color={COLORS.primary} />}
                                editable={false}
                            />
                        </View>
                            <View style={styles.inputContainer}>
                                <TextInput
                                    label="Country"
                                    onPress={handleShowCountryPicker}
                                    value={country}
                                    editable={false}
                                    mode="outlined"
                                    style={styles.input}
                                    left={<TextInput.Icon icon="map" color={COLORS.primary} />}
                                />
                            </View>

                        <Button mode="contained" onPress={handleSave} style={styles.saveButton}>
                            Save
                        </Button>
                    </View>
                    {renderCountryPicker()}
                </KeyboardAwareScrollView>
            </SafeAreaView>
        </LinearGradient>
    );
};

const styles = StyleSheet.create({
    gradient: {
        flex: 1,
    },
    imageContainer: {
        top: -20,
        alignItems: "center",
        marginVertical: 22,
    },
    profileImage: {
        width: 100,
        height: 100,
        borderRadius: 50,
        borderColor: "white",
        borderWidth: 1,
    },
    cameraIcon: {
        position: "absolute",
        bottom: 2,
        right: 10,
        zIndex: 9999,
    },
    inputContainer: {
        flexDirection: "column",
        marginBottom: 6,
    },
    input: {
        height: 45,
        borderRadius: 20,
        marginVertical: 6,
        backgroundColor: "#F5F5F5",
    },
    pickerContainer: {
        marginTop: 10,
        borderRadius: 20,
        backgroundColor: '#F5F5F5',
        paddingHorizontal: 10,
        paddingVertical: 5,
    },
    saveButton: {
        marginTop: 20,
        marginBottom: 30,
    },
    centeredContainer: {
        flex: 1,
        justifyContent: 'center',
        alignItems: 'center',
    },
    infoText: {
        ...FONTS.h2,
        color: COLORS.white,
        textAlign: 'center',
    },
    modalContainer: {
        // flex: 1,
        justifyContent: 'center',
        alignItems: 'center',

        // backgroundColor: 'rgba(0, 0, 0, 0.5)', // Daha belirgin arka plan rengi
    },
    modalContent: {
        width: "90%",
        backgroundColor: 'white',  
        borderRadius: 20,
        alignItems:"center",
        justifyContent:"center",
        padding: 35,
        shadowOffset:{
            width:0,
            height:2,
        },
        shadowColor:"#000",
        shadowOpacity:0.25,
        shadowRadius:4,
        elevation:5
    },
    closeButtonContainer: {
        marginTop: 20, // Yüksekliği artırarak düğmenin görünür olmasını sağlayın
        alignItems: 'center', // Düğmeyi ortalayın
    },
    closeButton: {
        ...FONTS.body3,
        color: "red",
    },
    picker: {
        width: '100%',
        height: 200,
    }, nonEditableInput: {
        backgroundColor: "#A9A9A9", // Darker gray color for non-editable fields
        color: "#696969",           // Gray text color
    },
    editableInput: {
        backgroundColor: "#F5F5F5", // Lighter color for editable fields
        color: "#000000",           // Black text for editable fields
    },
});


export default EditProfileScreen;
