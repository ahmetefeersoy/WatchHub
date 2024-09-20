import React, { useContext, useState, useRef, useEffect } from 'react';
import { StyleSheet, Text, View, ScrollView } from 'react-native';
import { LinearGradient } from 'expo-linear-gradient';
import { AuthContext } from '../store/auth-context'; 
import useResult from '../hooks/useResult';
import ResultsList from '../components/ResultsList';
import Loading from '../components/Loading'; 

const HomeScreen = React.memo(() => {
  const { isAuthenticated } = useContext(AuthContext); 
  const [searchApi, results, errorMessage, clearResults] = useResult();
  const [loading, setLoading] = useState(true);
  const isFetched = useRef(false); // Bir kez çalışıp çalışmadığını izlemek için

  const fetchData = async () => {
    if (!isFetched.current) {
      await searchApi(); 
      const timer = setTimeout(() => setLoading(false), 1500);
      isFetched.current = true;  // İşlemi tamamladığımızı işaretliyoruz
      return () => clearTimeout(timer); // Temizleme işlemi
    }
  };
  useEffect(() => {
    if (isAuthenticated) {
      fetchData();
    }
  }, [isAuthenticated]);

  const filterResultsByGenre = (genre) => results.filter(result => result.genre.includes(genre));

  if (loading && isAuthenticated) {
    return <Loading message="Loading movies..." />;
  }

  return (
    <LinearGradient colors={['#173d39', '#000000']} style={styles.gradient}>
      <View style={styles.container}>
        {isAuthenticated ? (
          <ScrollView showsVerticalScrollIndicator={false} nestedScrollEnabled={true}
          >
            {['Science Fiction', 'Drama', 'Crime', 'Action', 'History', 'Adventure', 'Romance', 'Fantasy', 'Mystery', 'Thriller', 'War', 'Comedy', 'Animation'].map(genre => (
              <ResultsList key={genre} title={`${genre}`} results={filterResultsByGenre(genre)} />
            ))}
          </ScrollView>
        ) : (
          <View style={styles.alertContainer}>
            <Text style={styles.alertText}>Please log in to view this content.</Text>
          </View>
        )}
      </View>
    </LinearGradient>
  );
});

const styles = StyleSheet.create({
  gradient: {
    flex: 1,
  },
  container: {
    flex: 1,
    padding: 5,
    marginTop: 10,
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
});

export default HomeScreen;
