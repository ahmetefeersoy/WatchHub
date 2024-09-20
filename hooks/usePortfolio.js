import { useEffect, useState, useContext } from 'react';
import useApi from '../util/api'; // API işlevinizin yolu
import { AuthContext } from '../store/auth-context';

const usePortfolio = () => {
  const api = useApi();
  const { token } = useContext(AuthContext);
  const [results, setResults] = useState([]);
  const [errorMessage, setErrorMessage] = useState('');
  const fetchPortfolio = async () => {
    try {
      const response = await api.get('/api/portfolio', {
        headers: {
          'Authorization': `Bearer ${token}`
        }
      });
      setResults(response.data);
      setErrorMessage('');
    } catch (err) {
      setErrorMessage('Something went wrong!');
    }
  };

  useEffect(() => {
    fetchPortfolio();
  }, []);

  return [fetchPortfolio,results, errorMessage];
};

export default usePortfolio;
