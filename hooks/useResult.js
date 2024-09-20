import { useEffect, useState, useContext } from 'react';
import useApi from '../util/api';
import { AuthContext } from '../store/auth-context';

const useResult = () => {
  const api = useApi();
  const [results, setResults] = useState([]);
  const [errorMessage, setErrorMessage] = useState('');
  const { isAuthenticated } = useContext(AuthContext); 
  
  const searchApi = async (searchFilm = '', pageSize) => {
    try {
      // Parametreleri dinamik olarak ekleyelim
      const params = { Name: searchFilm };
      if (pageSize) {
        params.PageSize = pageSize; // PageSize varsa ekleriz
      }

      const response = await api.get('/api/films', { params });
      setResults(response.data);
      setErrorMessage('');
    } catch (err) {
      console.error("API error:", err); // Hata ayrıntılarını konsola yazdırın
      setErrorMessage('Something went wrong!');
    }
  };

  const clearResults = () => {
    setResults([]);
  };

  useEffect(() => {
    if (isAuthenticated) {
      searchApi();
    }
  }, [isAuthenticated]);

  return [searchApi, results,clearResults, errorMessage];
};

export default useResult;
