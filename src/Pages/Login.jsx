import React, { Component } from "react";
import axios from "axios";
import Cookies from "js-cookie";
import { Navigate } from "react-router-dom";
import { InputText } from "primereact/inputtext";
import { Button } from "primereact/button";

class Login extends Component {
  constructor(props) {
    super(props);
    this.state = {
      email: "",
      password: "",
      rememberMe: true,
      token: Cookies.get("token") || "",
      user: null,
      errorMessage: "",
      loggedIn: false,
    };
  }

  async handleLoginSuccess(token, user) {
    if (this.state.rememberMe) {
      Cookies.set("token", token, { expires: 365 });
    } else {
      Cookies.set("token", token);
    }
    this.setState({ token, user, loggedIn: true });
    window.location.reload();
  }

  handleLogout = () => {
    Cookies.remove("token");
    this.setState({ token: "", user: null });
  };

  handleLogin = async (e) => {
    e.preventDefault();
  
    const loginData = {
      email: this.state.email,
      password: this.state.password,
    };
  
    try {
      const response = await axios.post(
        "http://127.0.0.1:8000/api/login",
        loginData
      );
  
      if (response.data.token) {
        const token = response.data.token;
  
        const userResponse = await axios.get("http://127.0.0.1:8000/api/user", {
          headers: {
            Authorization: `Token ${token}`,
          },
        });
  
        this.handleLoginSuccess(token, userResponse.data.user);
      }
    } catch (error) {
      if (error.response && error.response.status === 400) {
        this.setState({
          errorMessage: "Correo electrónico o contraseña incorrectos.",
        });
      } else {
        console.error("Error de inicio de sesión:", error);
      }
    }
  };
  

  render() {
    if (this.state.loggedIn) {
      return <Navigate to="/dashboard" />;
    }
    return (
      <div className="min-h-[100dvh] flex items-center justify-center sm:bg-[#0ea5e9]/80 duration-200">
        <div className="bg-white p-6 rounded-xl sm:shadow-lg w-screen sm:w-auto">
          <div className="flex min-h-full flex-col justify-center px-6 py-12 lg:px-8">
            <div className="sm:mx-auto sm:w-full sm:max-w-sm">
              <img
                className="mx-auto h-24 w-auto"
                src="https://i.ibb.co/j3dmr5L/logo-white.jpg"
                alt="Your Company"
              />
              <h2 className="mt-10 text-center text-2xl font-bold leading-9 tracking-tight text-gray-900">
                Iniciar Sesion
              </h2>
            </div>

            <div className="mt-10 sm:mx-auto sm:w-full sm:max-w-sm">
              {this.state.errorMessage && (
                <p className="text-red-500 font-medium text-sm mb-4">
                  {this.state.errorMessage}
                </p>
              )}

              <form className="space-y-6" onSubmit={this.handleLogin}>
                <div>
                  <label className="block text-sm font-medium leading-6 text-gray-900">
                    Email
                  </label>
                  <div className="mt-2">
                    <InputText
                      type="email"
                      required
                      onChange={(e) => this.setState({ email: e.target.value })}
                      className="input"
                    />
                  </div>
                </div>

                <div>
                  <label className="block text-sm font-medium leading-6 text-gray-900">
                    Contraseña
                  </label>
                  <div className="mt-2">
                    <InputText
                      type="password"
                      onChange={(e) =>
                        this.setState({ password: e.target.value })
                      }
                      className="input"
                    />
                  </div>
                </div>

                <div className="w-full flex justify-end">
                  <Button
                    type="submit"
                    label="Ingresar"
                    rounded
                    raised
                    severity="info"
                    className="bg-sky-500 border-0"
                  />
                </div>
              </form>
            </div>
          </div>
        </div>
      </div>
    );
  }
}

export default Login;
