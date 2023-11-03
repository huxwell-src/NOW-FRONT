import { Component } from 'react';
import axios from 'axios';
import Cookies from 'js-cookie';
import { Navigate } from "react-router-dom";

class Login extends Component {
  constructor(props) {
    super(props);
    this.state = {
      email: '',
      password: '',
      rememberMe: true,
      token: Cookies.get('token') || '',
      user: null,
      errorMessage: '',
      loggedIn: false, // Add a state variable to track login status.
    };
  }



  async handleLoginSuccess(token, user) {
    if (this.state.rememberMe) {
      Cookies.set('token', token, { expires: 365 });
    } else {
      Cookies.set('token', token);
    }
    this.setState({ token, user, loggedIn: true });
    window.location.reload();

  }

  handleLogout = () => {
    Cookies.remove('token');
    this.setState({ token: '', user: null });
  }

  handleLogin = async (e) => {
    e.preventDefault();

    try {
      const response = await axios.post('http://127.0.0.1:8000/api/login', {
        email: this.state.email,
        password: this.state.password,
      });

      if (response.data.token) {
        const token = response.data.token;
        const userResponse = await axios.get('http://127.0.0.1:8000/api/user', {
          headers: {
            Authorization: `Token ${token}`,
          },
        });

        this.handleLoginSuccess(token, userResponse.data.user);
      }
    } catch (error) {
      if (error.response && error.response.status === 400) {
        this.setState({ errorMessage: 'Correo electrónico o contraseña incorrectos.' });
      } else {
        console.error('Error de inicio de sesión:', error);
      }
    }
  };

  render() {
    if (this.state.loggedIn) {
      // Redirect to another component after successful login.
      return <Navigate to="/dashboard" />;
    }
    return (

      <div className="min-h-[100dvh] flex items-center justify-center sm:bg-[#0ea5e9]/80 duration-200">
        <div className="bg-white  p-6 rounded-xl sm:shadow-lg w-screen sm:w-auto">
          <div className="flex min-h-full flex-col justify-center px-6 py-12 lg:px-8">
            <div className="sm:mx-auto sm:w-full sm:max-w-sm">
              <img className="mx-auto h-24 w-auto" src="https://i.ibb.co/j3dmr5L/logo-white.jpg" alt="Your Company" />
              <h2 className="mt-10 text-center text-2xl font-bold leading-9 tracking-tight text-gray-900">Iniciar Sesion</h2>
            </div>
            {/* 

              {
                "rut": "987654321",
                "nombre": "Juan",
                "apellido": "Pérez",
                "email": "juan.perez@email.com",
                "password": "claveSegura456",
                "rol": "Profesor
              }

              {
                "rut": "555555555",
                "nombre": "María",
                "apellido": "Gómez",
                "email": "maria.gomez@email.com",
                "password": "miPassword123",
                "rol": "Administrador"
              }

              */}


            <div className="mt-10 sm:mx-auto sm:w-full sm:max-w-sm ">

              {this.state.errorMessage && (
                <p className="text-red-500 font-medium text-sm mb-4">{this.state.errorMessage}</p>
              )}

              <form className="space-y-6" onSubmit={this.handleLogin}>

                <div>
                  <label className="block text-sm font-medium leading-6 text-gray-900">Email</label>
                  <div className="mt-2">
                    <input type="email" required
                      onChange={(e) => this.setState({ email: e.target.value })}
                      className=" px-2 block w-full sm:w-96 rounded-md border-0 py-1.5 text-gray-900 shadow-sm ring-1 ring-inset ring-gray-300 placeholder:text-gray-400 focus:ring-2 focus:ring-inset focus:ring-indigo-600 sm:text-sm sm:leading-6" />
                  </div>
                </div>

                <div>
                  <label className="block text-sm font-medium leading-6 text-gray-900">Constraseña</label>
                  <div className="mt-2">
                    <input type="password" required
                      onChange={(e) => this.setState({ password: e.target.value })}
                      className="invalid:border-pink-500 invalid:text-pink-600 px-2 block w-full sm:w-96 rounded-md border-0 py-1.5 text-gray-900 shadow-sm ring-1 ring-inset ring-gray-300 placeholder:text-gray-400 focus:ring-2 focus:ring-inset focus:ring-indigo-600 sm:text-sm sm:leading-6" />
                  </div>
                </div>


                <button
                  type="submit"
                  className="bg-[#0ea5e9] text-white px-4 py-2 hover-bg-blue-600 focus:outline-none rounded-full hover:scale-105 active:scale-100 hover:drop-shadow-md active:drop-shadow-none drop-shadow-sm duration-100"
                >
                  Ingresar
                </button>
              </form>
            </div>
          </div>
        </div>
      </div>
    );
  }
}

export default Login;
