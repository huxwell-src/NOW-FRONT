import { createContext, useContext, useEffect, useState } from "react";
import axios from "axios";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import {
  faArrowLeft,
  faHouse,
  faGraduationCap,
  faChalkboardUser,
  faArrowRight,
  faScrewdriverWrench,
  faArrowRightFromBracket,
  faTicket,
  faToolbox,
} from "@fortawesome/free-solid-svg-icons";
import { Tooltip } from "primereact/tooltip";
import { getUserToken } from "../../api/userService";
import { Link, useLocation } from "react-router-dom";
import { IoMenu } from "react-icons/io5";
import Button from "./Button";
import { removeUserToken } from "../../api/userService";

const SidebarContext = createContext();

export function Sidebar({ children }) {
  const [user, setUser] = useState(null);
  const [expanded, setExpanded] = useState(true);
  const [dropdownOpen, setDropdownOpen] = useState(false);
  const [sidebarVisible, setSidebarVisible] = useState(true);

  const handleLogout = () => {
    removeUserToken();
    setUser(null);
    setDropdownOpen(false);
    window.location.reload();
  };

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

          setUser(response.data.user);
        } catch (error) {
          console.error("Error al obtener datos del usuario:", error);
        }
      }
    };
    fetchData();
  }, []);

  useEffect(() => {
    const handleResize = () => {
      if (window.innerWidth < 1280) {
        setExpanded(false);
      } else {
        setExpanded(true);
      }
    };

    handleResize(); // Llamada inicial
    window.addEventListener("resize", handleResize);

    return () => {
      // Limpia el evento de cambio de tamaño al desmontar el componente
      window.removeEventListener("resize", handleResize);
    };
  }, []);
  return (
    <div className="flex h-screen">
      <aside
        className={`bg-white fixed z-[999] sm:block sm:z-auto h-full sm:static transition-all duration-200 border-r shadow-sm
    ${expanded && sidebarVisible ? "w-68" : "w-[4.5rem] hidden"}`}
      >
        <nav className="h-full flex flex-col">
          <div className="p-4 pb-2 flex justify-between items-center">
            {/* Logo */}
            <div className="flex items-center w-full max-w-sm ">
              <img
                className={`overflow-hidden transition-all duration-200
                ${expanded ? "h-8" : "w-0"}`}
                src="https://i.ibb.co/j3dmr5L/logo-white.jpg"
                alt="Logo now"
              />
              <span
                className={`text-3xl font-bold text-gray-800 overflow-hidden transition-all
                      ${expanded ? "w-auto ml-3" : "w-0"}`}
              >
                NOW
              </span>
            </div>
            {/* Button */}

            <Button
              onClick={() => setExpanded((curr) => !curr)}
              color="text"
              size="sm"
              label={
                expanded ? (
                  <FontAwesomeIcon
                    className="rounded-lg bg-gray-50 text-primary-900 hover:bg-gray-100 text-xl"
                    icon={faArrowLeft}
                  />
                ) : (
                  <FontAwesomeIcon
                    className="rounded-lg bg-gray-50 text-primary-900 hover:bg-gray-100 text-xl"
                    icon={faArrowRight}
                  />
                )
              }
            />
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
                        {user.nombre.split(" ")[0]}
                        {user.apellido.split(" ")[0]}
                      </h4>
                      <span className="text-xs text-gray-600">
                        {user.email}
                      </span>
                    </div>
                    <div className="flex items-center">
                      <div className="relative">
                        <Button
                          color="text"
                          icon={faArrowRightFromBracket}
                          size="sm"
                          iconClassName="rounded-lg bg-gray-50 hover:bg-gray-100 text-xl text-primary-900"
                          onClick={handleLogout}
                        />
                      </div>
                    </div>
                  </div>
                </div>
              </>
            )}
          </div>
        </nav>
      </aside>
      <main className="flex-1 bg-slate-100 overflow-x-hidden overflow-y-auto">
        <div className="bg-white sm:hidden border p-2 border-slate-200 flex justify-between items-center mx-4 mt-2 rounded-lg ">
          <Button
            onClick={() => setExpanded((curr) => !curr)}
            className={`sm:hidden aspect-square
            transition-all duration-300 !p-1 `}
            color="text"
            label={
              <div className="rounded-lg bg-gray-50 text-primary-900 hover:bg-gray-100 text-2xl">
                <IoMenu />
              </div>
            }
          />
          <div className="flex justify-center items-center mx-2">
            <img
              className="overflow-hidden transition-all duration-200 h-5"
              src="https://i.ibb.co/j3dmr5L/logo-white.jpg"
              alt="Logo now"
            />
            <span className="text-xl font-bold text-gray-800 overflow-hidden transition-all w-auto ml-3">
              NOW
            </span>
          </div>
        </div>
        <div className="container mx-auto">{children}</div>
      </main>
    </div>
  );
}
export function SidebarItem() {
  const { expanded } = useContext(SidebarContext);
  const location = useLocation();
  const [user, setUser] = useState(null);

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

          setUser(response.data.user);
        } catch (error) {
          console.error("Error al obtener datos del usuario:", error);
        }
      }
    };
    fetchData();
  }, []);

  let menuData;
  switch (user?.rol) {
    case "Administador":
      menuData = [
        {
          label: "Inicio",
          url: "/dashboard",
          icon: faHouse,
          alert: false,
        },
        {
          label: "Alumnos",
          url: "/Alumnos",
          icon: faGraduationCap,
          alert: false,
        },
        {
          label: "Profesores",
          url: "/Profesores",
          icon: faChalkboardUser,
          alert: false,
        },
        {
          label: "Productos",
          url: "/Products",
          icon: faChalkboardUser,
          alert: false,
        },
      ];
      break;
    case "Alumno":
      menuData = [
        { label: "Inicio", url: "/dashboard", icon: faHouse },
        { label: "Productos", url: "/productos", icon: faScrewdriverWrench },
        {
          label: "Historial",
          url: "/Solicitudes",
          icon: faTicket,
          title: "Mis solicitudes",
        },
      ];
      break;
    case "Profesor":
      menuData = [
        { label: "Inicio", url: "/dashboard", icon: faHouse },
        { label: "Revision", url: "/Revision", icon: faChalkboardUser },
        { label: "Historial", url: "/HistorialPrf", icon: faChalkboardUser },
      ];
      break;
    case "Bodeguero":
      menuData = [
        { label: "Inicio", url: "/dashboard", icon: faHouse },
        { label: "Preparacion", url: "/Preparacion", icon: faToolbox },
        { label: "Entrega", url: "/Entrega", icon: faToolbox },
        { label: "Pendientes", url: "/Pendientes", icon: faToolbox },
      ];
      break;
    default:
      // Si el rol no coincide con ninguno de los casos anteriores, puedes proporcionar un conjunto de datos predeterminado o mostrar un mensaje de error.
      console.error("Rol de usuario no reconocido");
      menuData = []; // O proporciona un conjunto de datos predeterminado vacío
  }

  return (
    <>
      {menuData.map((item, index) => (
        <Link key={index} to={item.url}>
          <li
            id={item.label} // Usamos el índice para crear identificadores únicos
            className={`relative flex items-center py-2 px-3 my-1 font-medium rounded-md cursor-pointer transition-colors
              ${
                location.pathname === item.url
                  ? "bg-primary-200/70 text-primary-600"
                  : "hover:bg-primary-100/60 text-primary-900 "
              }`}
          >
            <FontAwesomeIcon icon={item.icon} />
            {!expanded && (
              <Tooltip target={`#${item.label}`} content={item.label} />
            )}
            <span
              className={`mx-2 overflow-hidden transition-all
                  ${expanded ? "w-52 ml-3" : "w-0"}`}
              data-tip
              data-for={`tooltip-${index}`}
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
