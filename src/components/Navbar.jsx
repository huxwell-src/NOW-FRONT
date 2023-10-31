import React, { useState } from 'react';
import { Sidebar } from 'primereact/sidebar';
import { Button } from 'primereact/button';
import Cookies from 'js-cookie';
import { Link } from 'react-router-dom';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome'
import { faRightFromBracket } from '@fortawesome/free-solid-svg-icons'

const Navbar = ({ nombre }) => {
    const [visible, setVisible] = useState(false);
    const menuData = [
        { label: 'Inicio', url: '#' },
        { label: 'Acerca de', url: '#' },
        { label: 'Servicios', url: '#' },
        { label: 'Contacto', url: '#' },
    ];

    return (
        <>
            <nav className="bg-sky-500 p-4">
                <div className="mx-auto">
                    <div className="flex items-center justify-between">
                        <div className="flex items-center">
                            <button onClick={() => setVisible(true)}>
                                <svg xmlns="http://www.w3.org/2000/svg" className="mr-8 h-8 fill-white" viewBox="0 0 448 512">
                                    <path d="M0 96C0 78.3 14.3 64 32 64H416c17.7 0 32 14.3 32 32s-14.3 32-32 32H32C14.3 128 0 113.7 0 96zM0 256c0-17.7 14.3-32 32-32H416c17.7 0 32 14.3 32 32s-14.3 32-32 32H32c-17.7 0-32-14.3-32-32zM448 416c0 17.7-14.3 32-32 32H32c-17.7 0-32-14.3-32-32s14.3-32 32-32H416c17.7 0 32 14.3 32 32z" />
                                </svg>
                            </button>
                            <img src="https://i.ibb.co/KLSCrjv/logo-white.png" className="mr-2 h-8" alt="" />
                            <a href="#" className="text-2xl font-bold text-white">NOW App</a>
                        </div>
                        <ul className="flex space-x-4">
                            <li><a href="#" className="text-white hover:underline">{nombre}</a></li>
                        </ul>
                    </div>
                </div>
            </nav>
            <div className="card flex justify-content-center">
                <Sidebar header={<div className="px-4 text-2xl font-bold">Menu</div>} visible={visible} onHide={() => setVisible(false)}>
                    <aside className=" text-gray-950">
                        <ul className="p-2">
                            {menuData.map((item, index) => (
                                <li key={index}>
                                    <Link
                                        to={item.url}
                                        className="block rounded-xl px-4 py-2 text-gray-950 duration-200 hover:bg-gray-50 hover:text-sky-900"
                                    >
                                        {item.label}
                                    </Link>
                                </li>
                            ))}
                            <button className='w-full flex  rounded-xl px-4 py-2 text-gray-950 duration-200 hover:bg-gray-50 hover:text-sky-900'>
                                <FontAwesomeIcon className='h-6 mr-3 text-sky-700' icon={faRightFromBracket} />
                                Logout
                            </button>
                        </ul>

                    </aside>
                </Sidebar>
            </div>
        </>
    );
};

export default Navbar;
