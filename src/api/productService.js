// api/productService.js
import axios from 'axios';
import Cookies from 'js-cookie';

const BASE_URL = 'http://127.0.0.1:8000/api';

// Función para obtener la lista de productos desde la API
export const getProducts = async () => {
  try {
    const token = Cookies.get('token');

    const response = await axios.get(`${BASE_URL}/productos`, {
      headers: {
        Authorization: `Token ${token}`,
      },
    });

    if (!response.data) {
      throw new Error('Error al obtener productos');
    }

    return response.data;
  } catch (error) {
    console.error('Error al obtener productos:', error);
    throw error;
  }
};
