import { Component } from "react";
import axios from "axios";
import Cookies from "js-cookie";
import { Navigate } from "react-router-dom";
import { Link } from "react-router-dom";
import Button from "../components/UI/Button";
import InputText from "../components/UI/InputText";

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
      loading: false, 
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

  handleCheckboxChange = () => {
    this.setState((prevState) => ({
      rememberMe: !prevState.rememberMe,
    }));
  };

  handleLogin = async (e) => {
    e.preventDefault();

    // Establecer el estado de carga a true
    this.setState({ loading: true });

    const loginData = {
      email: this.state.email,
      password: this.state.password,
    };

    try {
      const response = await axios.post(
        `${import.meta.env.VITE_BACKEND_URL_BASE}/login`,  
        loginData
      );

      if (response.data.token) {
        const token = response.data.token;

        const userResponse = await axios.get(`${import.meta.env.VITE_BACKEND_URL_BASE}/user`, {
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
    } finally {
      // Establecer el estado de carga a false, independientemente del resultado
      this.setState({ loading: false });
    }
  };

  render() {
    if (this.state.loggedIn) {
      return <Navigate to="/dashboard" />;
    }
    return (
      <div className="min-h-[100dvh] flex items-center justify-center duration-200 bg-white sm:bg-slate-100  dark:bg-slate-950 ">
        {this.state.loading && (
          <div id="loading-container">
            <div id="loading-dots">
              <div className="loading-dot"></div>
              <div className="loading-dot"></div>
              <div className="loading-dot"></div>
            </div>
          </div>
        )} 

        {!this.state.loading && (
          <div className="bg-white p-2 rounded-xl sm:shadow-custom w-screen sm:w-auto">
            <div className="flex min-h-full flex-col justify-center px-2 py-12 sm:px-8">
              <div className="sm:mx-auto flex justify-center items-center sm:w-full sm:max-w-sm">
                <img
                  className="h-12 "
                  src="https://i.ibb.co/j3dmr5L/logo-white.jpg"
                  alt="Your Company"
                />
                <span className="text-4xl font-bold text-gray-800 ml-4 ">
                  NOW
                </span>
              </div>

              <div className="mt-10 sm:mx-auto sm:w-full sm:max-w-sm">
                {this.state.errorMessage && (
                  <p className="text-red-500 font-medium text-sm mb-4">
                    {this.state.errorMessage}
                  </p>
                )}

                <form className="space-y-6" onSubmit={this.handleLogin}>
                  <InputText
                    label="Email"
                    type="email"
                    onChange={(e) => this.setState({ email: e.target.value })}
                    placeholder="Tu email"
                  />

                  <InputText
                    label="Contraseña"
                    type="password"
                    onChange={(e) =>
                      this.setState({ password: e.target.value })
                    }
                    placeholder="Tu contraseña"
                  />

                  <div className="flex items-center">
                    <input
                      type="checkbox"
                      className="form-checkbox cursor-pointer h-4 w-4 accent-primary-500 duration-150"
                      checked={this.state.rememberMe}
                      onChange={this.handleCheckboxChange}
                      name=""
                      id=""
                    />
                    <span className="ml-1"> Recuérdame</span>
                  </div>
                  <Button label="Ingresar" type="submit" full />
                </form>

                <Link>
                  <span className="block hover:underline w-full text-center mt-4 cursor-pointer ">
                    ¿Olvidaste tu contraseña?
                  </span>
                </Link>
              </div>
            </div>
          </div>
        )}
      </div>
    );
  }
}

export default Login;
