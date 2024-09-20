import AsyncStorage from "@react-native-async-storage/async-storage";
import { createContext, useState, useEffect } from "react";

export const AuthContext = createContext({
  token: '',
  isAuthenticated: false,
  twoFactorEnabled: false, 
  setTwoFactorEnabled:()=>{},
  authenticate: (token, username) => {},
  logout: () => {},
  username: '',
  setUsername: (username) => {}
});

function AuthContextProvider({ children }) {
  const [authToken, setAuthToken] = useState(null);
  const [username, setUsername] = useState('');
  const [twoFactorEnabled, setTwoFactorEnabled] = useState(false); // Yeni state


  useEffect(() => {
    async function fetchTokenAndUsername() {
      const storedToken = await AsyncStorage.getItem("token");
      const storedUsername = await AsyncStorage.getItem("username");
      const storedTimestamp = await AsyncStorage.getItem("timestamp");

      if (storedToken && storedUsername && storedTimestamp) {
        const now = new Date().getTime();
        const diffInDays = (now - parseInt(storedTimestamp)) / (1000 * 60 * 60 * 24);
        if (diffInDays < 7) {
          setAuthToken(storedToken);
          setUsername(storedUsername);
        } else {
          AsyncStorage.removeItem("token");
          AsyncStorage.removeItem("username");
          AsyncStorage.removeItem("timestamp");
        }
      }
    }

    fetchTokenAndUsername();
  }, []);

  function authenticate(token, username) {
    const timestamp = new Date().getTime().toString(); // Mevcut zaman damgası

    setAuthToken(token);
    setUsername(username);
    AsyncStorage.setItem("token", token);
    AsyncStorage.setItem("username", username);
    AsyncStorage.setItem("timestamp", timestamp);
  }

  function logout() {
    setAuthToken(null);
    setUsername('');
    AsyncStorage.removeItem("token");
    AsyncStorage.removeItem("username");
    AsyncStorage.removeItem("timestamp");
    // AsyncStorage.removeItem("profileImage");
  }

  const value = {
    token: authToken,
    isAuthenticated: !!authToken,
    authenticate: authenticate,
    twoFactorEnabled: twoFactorEnabled,
    setTwoFactorEnabled: setTwoFactorEnabled,
    logout: logout,
    username: username,
    setUsername: setUsername
  };

  return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>;
}

export default AuthContextProvider;
