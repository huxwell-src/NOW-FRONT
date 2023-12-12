import React, { createContext, useContext, useEffect, useState } from "react";
import axios from "axios";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import {
  faArrowLeft,
  faEllipsisVertical,
  faHouse,
  faGraduationCap,
  faChalkboardUser,
  faArrowRight,
} from "@fortawesome/free-solid-svg-icons";
import { getUserToken } from "../api/userService";
import { Link } from "react-router-dom";

const SidebarContext = createContext();
export function Sidebar({ children }) {
  const [user, setUser] = useState(null);
  const [userRole, setUserRole] = useState(null);
  const [expanded, setExpanded] = useState(true);

  useEffect(() => {
    const fetchData = async () => {
      const token = getUserToken();

      if (token) {
        try {
          const response = await axios.get("http://127.0.0.1:8000/api/user", {
            headers: {
              Authorization: `Token ${token}`,
            },
          });

          const userRole = response.data.user.rol;
          setUser(response.data.user);
          setUserRole(userRole);
        } catch (error) {
          console.error("Error al obtener datos del usuario:", error);
        }
      }
    };
    fetchData();
  }, []); // El segundo argumento del useEffect ([]) significa que solo se ejecuta una vez al montar el componente.

  return (
    <div className="flex h-screen">
      <aside
        className={`bg-white trantision-all duration-200 border-r shadow-sm
      ${expanded ? "w-64" : "w-[4.5rem] "}`}
      >
        <nav className="h-full flex flex-col">
          <div className="p-4 pb-2 flex justify-between items-center">
            {/* Logo */}
            <div className="flex items-center w-full max-w-sm ">
              <img
                className={`overflow-hidden transition-all duration-200
                ${expanded ? "h-8" : "w-0"}`}
                src="https://i.ibb.co/j3dmr5L/logo-white.jpg"
                alt="Your Company"
              />
              <span
                className={`text-3xl font-bold text-gray-800 overflow-hidden transition-all
                      ${expanded ? "w-auto ml-3" : "w-0"}`}
              >
                NOW
              </span>
            </div>
            {/* Button */}
            <button onClick={() => setExpanded((curr) => !curr)}>
              {expanded ? (
                <FontAwesomeIcon
                  className="p-1.5 rounded-lg bg-gray-50 text-primary-900 hover:bg-gray-100 text-xl"
                  icon={faArrowLeft}
                />
              ) : (
                <FontAwesomeIcon
                  className="p-1.5 rounded-lg bg-gray-50 text-primary-900 hover:bg-gray-100 text-xl"
                  icon={faArrowRight}
                />
              )}
            </button>
          </div>

          <SidebarContext.Provider value={{ expanded }}>
            <ul className="flex-1 px-3">
              {/* Map over items and create SidebarItems */}
              <SidebarItem />
            </ul>
          </SidebarContext.Provider>
          <div>
            {/* Contenido adicional */}
            {user && (
              <>
                <div className="p-3 flex border-t">
                  <div className="h-12 w-12 aspect-square rounded-md text-primary-600 bg-primary-200/70 font-bold text-xl flex items-center justify-center">
                    <span>{user.nombre.charAt(0)}</span>
                    <span>{user.apellido.charAt(0)}</span>
                  </div>
                  <div
                    className={`flex justify-between items-center overflow-hidden transition-all
                      ${expanded ? "w-52 ml-3" : "w-0"}
                    `}
                  >
                    <div className="leading-4">
                      <h4 className="font-semibold">
                        {user.nombre.split(" ")[0]}{" "}
                        {user.apellido.split(" ")[0]}
                      </h4>
                      <span className="text-xs text-gray-600">
                        {user.email}
                      </span>
                    </div>
                    <FontAwesomeIcon
                      className="p-1.5 rounded-lg bg-gray-50 hover:bg-gray-100 text-xl"
                      icon={faEllipsisVertical}
                    />
                  </div>
                </div>
              </>
            )}
          </div>
        </nav>
      </aside>
      <main className="flex-1 bg-slate-100 overflow-x-hidden overflow-y-auto">
        {children}
      </main>
    </div>
  );
}

export function SidebarItem() {
  const { expanded } = useContext(SidebarContext);
  const menuDataAdmin = [
    {
      label: "Inicio",
      url: "/dashboard",
      icon: faHouse,
      active: false,
      alert: true,
    },
    {
      label: "Alumnos",
      url: "/Alumnos",
      icon: faGraduationCap,
      active: true,
      alert: false,
    },
    {
      label: "Profesores",
      url: "/Profesores",
      icon: faChalkboardUser,
      active: false,
      alert: true,
    },
    {
      label: "Productos",
      url: "/Products",
      icon: faChalkboardUser,
      active: false,
      alert: false,
    },
  ];
  return (
    <>
      {menuDataAdmin.map((item, index) => (
        <Link key={index} to={item.url}>
          <li
            className={`relative flex items-center py-2 px-3 my-1 font-medium rounded-md cursor-pointer transition-colors
            ${
              item.active
                ? "bg-primary-200/70 text-primary-600"
                : "hover:bg-primary-100/60 text-primary-900 "
            }`}
          >
            <FontAwesomeIcon icon={item.icon} />
            <span
              className={`mx-2 overflow-hidden transition-all
                      ${expanded ? "w-52 ml-3" : "w-0"}`}
            >
              {item.label}
            </span>
            {item.alert && (
              <div
                className={`absolute right-2 w-2 h-2 rounded bg-primary-500
              ${expanded ? "" : "top-2 right-2"}
            `}
              ></div>
            )}
          </li>
        </Link>
      ))}
    </>
  );
}
