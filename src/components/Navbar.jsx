import React, { Component } from 'react';
import { Sidebar } from 'primereact/sidebar';
import { Button } from 'primereact/button';
import Cookies from 'js-cookie';
import { Link } from 'react-router-dom';
import axios from 'axios'; // Asegúrate de importar axios
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faSignOutAlt, faGraduationCap, faChalkboardUser, faHouse, faToolbox } from '@fortawesome/free-solid-svg-icons'; // Cambié el nombre del icono

class Navbar extends Component {
    constructor(props) {
        super(props);
        this.state = {
            user: null,
            loggedOut: false,
            visible: false, // Mueve la definición de 'visible' al estado del componente
        };
    }

    async componentDidMount() {
        const token = Cookies.get('token');

        if (token) {
            try {
                const response = await axios.get('http://127.0.0.1:8000/api/user', {
                    headers: {
                        Authorization: `Token ${token}`,
                    },
                });

                this.setState({ user: response.data.user });
            } catch (error) {
                console.error('Error al obtener datos del usuario:', error);
            }
        }
    }

    handleLogout = () => {
        // Elimina la cookie y establece loggedOut en true
        Cookies.remove('token');
        this.setState({ user: null, loggedOut: true });
        window.location.reload();
    }

    render() {
        const menuData = [
            { label: 'Inicio', url: '#', icon: faHouse },
            { label: 'Alumnos', url: '#', icon: faGraduationCap },
            { label: 'Profesores', url: '#', icon: faChalkboardUser },
            { label: 'Productos', url: '#', icon: faToolbox},
        ];

        const header = (
            <div className='flex items-center'>
                <img src="https://i.ibb.co/MGH712D/logo-white.jpg" className="mr-2 h-8" alt="" />
                <span href="#" className="text-3xl font-bold text-gray-600">NOW</span>
            </div>
        );

        const { visible } = this.state; // Obtén 'visible' del estado

        return (
            <>
                <nav className="bg-sky-500 p-4">
                    <div className="mx-auto">
                        <div className="flex items-center justify-between">
                            <div className="flex items-center">
                                <button onClick={() => this.setState({ visible: true })}>
                                    <svg xmlns="http://www.w3.org/2000/svg" className="mr-8 h-8 fill-white" viewBox="0 0 448 512">
                                        <path d="M0 96C0 78.3 14.3 64 32 64H416c17.7 0 32 14.3 32 32s-14.3 32-32 32H32C14.3 128 0 113.7 0 96zM0 256c0-17.7 14.3-32 32-32H416c17.7 0 32 14.3 32 32s-14.3 32-32 32H32c-17.7 0-32-14.3-32-32zM448 416c0 17.7-14.3 32-32 32H32c-17.7 0-32-14.3-32-32s14.3-32 32-32H416c17.7 0 32 14.3 32 32z" />
                                    </svg>
                                </button>
                                <img src="https://i.ibb.co/KLSCrjv/logo-white.png" className="mr-2 h-8" alt="" />
                                <span href="#" className="text-3xl font-bold text-white">NOW</span>
                            </div>
                            <ul className="flex space-x-4">
                                <li><a href="#" className="text-white hover:underline">{this.state.user ? this.state.user.nombre : 'Invitado'}</a></li>
                            </ul>
                        </div>
                    </div>
                </nav>
                <div className="card flex justify-content-center">
                    <Sidebar header={header} visible={visible} onHide={() => this.setState({ visible: false })}>
                        <aside className="text-gray-950 h-full flex flex-col justify-between">
                            <ul className="p-2  ">
                                {menuData.map((item, index) => (
                                    <li key={index} className='hover:bg-sky-500/10 rounded-lg group duration-500' >
                                        
                                        <Link
                                            to={item.url}
                                            className="block rounded-xl p-2 text-gray-500 group-hover:font-bold group-hover:text-sky-500 "
                                        >
                                            <FontAwesomeIcon className="h-6 mr-3 w-12 text-gray-500 group-hover:text-sky-500 " icon={item.icon} />
                                            {item.label}
                                        </Link>
                                    </li>
                                ))}
                                
                            </ul>
                            <div>
                                <button className="w-full flex rounded-xl px-4 py-2 text-gray-950 duration-200 hover:bg-gray-50 hover:text-sky-900" onClick={this.handleLogout}>
                                    <FontAwesomeIcon className="h-6 mr-3 text-sky-700" icon={faSignOutAlt} />
                                    Logout
                                </button>
                            </div>
                        </aside>
                    </Sidebar>
                </div>
            </>
        );
    }
}

export default Navbar;
