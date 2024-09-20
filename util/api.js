import { useContext } from 'react';
import axios from './axios'; // axios instance'ı import ediyoruz
import { AuthContext } from '../store/auth-context';

const useApi = () => {
  const { token } = useContext(AuthContext);

  const apiInstance = axios.create({
    headers: {
      Authorization: `Bearer ${token}`
    }
  });

  return apiInstance;
};

export default useApi;
