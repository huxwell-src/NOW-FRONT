import React, { Component } from 'react';
import { getUserData } from '../api/userService';
import { Navigate } from 'react-router-dom';
import Cookies from 'js-cookie';
import Layout from '../components/Layout';

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
        <Layout nombre={<p>¡Bienvenido/a, {user.nombre} {user.apellido}!</p>} />
        <div className="text-center mt-[68px]">
          <p className="text-xl font-semibold mb-2">¡Bienvenido, {user.nombre} {user.apellido}!</p>
          <p className="mb-2">{user.id_user}</p>
          <p className="mb-2">{user.rut}</p>
          <p className="mb-2">{user.email}</p>
          <p className="mb-2">{user.rol}</p>
          <p className="mb-2">{user.carrera.map(carrera => carrera.nombre).join(', ')}</p>
          <p className="mb-2">{user.curso}</p>
        </div>
      </>
    );
  }
}

export default Dashboard;
