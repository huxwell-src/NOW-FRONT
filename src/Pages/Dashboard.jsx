import React, { Component } from 'react';
import { getUserData } from '../api/userService';
import { Navigate } from 'react-router-dom';
import Cookies from 'js-cookie';

class Dashboard extends Component {
  constructor(props) {
    super(props);
    this.state = {
      user: null,
      loggedOut: false,
    };
  }

  async componentDidMount() {
    const token = Cookies.get('token');

    if (token) {
      try {
        const userData = await getUserData(token);
        this.setState({ user: userData });
      } catch (error) {
        console.error('Error al obtener datos del usuario:', error);
      }
    }
  }

  render() {
    const { user, loggedOut } = this.state;

    if (loggedOut) {
      // Redirige al usuario a la página de inicio de sesión cuando se ha cerrado la sesión
      return <Navigate to="/" />;
    }

    if (!user) {
      return (
        <div role="status" className="w-screen h-screen flex items-center justify-center">
          {/* Tu código para mostrar un spinner de carga */}
        </div>
      );
    }

    return (
      <>
        <div className="ml-10 mt-24">
          
          <p className="text-4xl font-bold text-sky-700 mb-2">¡Bienvenido, {user.rol} {user.nombre} {user.apellido}!</p>
          <p className="mb-2">ID: {user.id_user}</p>
          <p className="mb-2">Rut: {user.rut}</p>
          <p className="mb-2">Rol: {user.rol}</p>
          <p className="mb-2">Email: {user.email}</p>
          <p className="mb-2">Carrera: {user.carrera.map(carrera => carrera.nombre).join(', ')}</p>
          <p className="mb-2">Curso: {user.curso}</p>
        </div>
      </>
    );
  }
}

export default Dashboard;
