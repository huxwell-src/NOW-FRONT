import axios from 'axios';
import Cookies from "js-cookie";

export const getUserData = async (token) => {
  try {
    const response = await axios.get('http://127.0.0.1:8000/api/user', {
      headers: {
        Authorization: `Token ${token}`,
      },
    });
    return response.data.user;
  } catch (error) {
    console.error('Error al obtener datos del usuario:', error);
    throw error;
  }
};

export const getUserToken = () => {
  return Cookies.get("token"); // Reemplaza "token" con el nombre de tu cookie de token
};

export const removeUserToken = () => {
  return Cookies.remove("token"); // Reemplaza "token" con el nombre de tu cookie de token
};