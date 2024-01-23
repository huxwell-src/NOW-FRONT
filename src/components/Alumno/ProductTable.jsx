import { useState, useEffect } from "react";
import Button from "../UI/Button";
import Cookies from "js-cookie";
import axios from "axios";
import { getUserData } from "../../api/userService";
import Tag from "../UI/Tag";
import Table from "../UI/Table";
import toast, { Toaster } from "react-hot-toast";
import { Dropdown } from "primereact/dropdown";
import InputText from "../UI/InputText";
import Header from "../UI/Header";
import { MultiSelect } from "primereact/multiselect";

import {
  faAdd,
  faCartPlus,
  faMinus,
  faTrash,
} from "@fortawesome/free-solid-svg-icons";

const ProductTable = () => {
  const [visible, setVisible] = useState(false);
  const [cart, setCart] = useState([]);
  const [products, setProducts] = useState([]);
  const [badgeValue, setBadgeValue] = useState(0);
  const [fechaEntrega, setFechaEntrega] = useState(new Date());
  const [selectedProfesor, setSelectedProfesor] = useState(null);
  const [searchText, setSearchText] = useState("");
  const [initialProfessors, setInitialProfessors] = useState([
    { label: "Mario Perez Aguilera ", value: 55, carrera: [2, 3] },
    { label: "Daniel Valdebenito Celedon", value: 56, carrera: [2] },
    { label: "Guillermo Pizarro lopez", value: 57, carrera: [3] },
    { label: "Vladimir Quezada Cid", value: 58, carrera: [4] },
    { label: "Richard Chaparro Cares", value: 59, carrera: [4] },
  ]);
  const [alumnos, setAlumnos] = useState([]);
  const [selectedAlumnos, setSelectedAlumnos] = useState([]);

  useEffect(() => {
    const fetchData = async () => {
      const token = Cookies.get("token");
  
      if (token) {
        try {
          // Obtener productos
          const productsResponse = await axios.get(
            `${import.meta.env.VITE_BACKEND_URL_BASE}/api/productos`,
            {
              headers: {
                Authorization: `Token ${token}`,
              },
            }
          );
  
          setProducts(productsResponse.data);
  
          // Obtener datos del usuario
          const userData = await getUserData(token);
          const userCarrera = userData.carrera.map((carrera) => carrera.id);
  
          // Filtrar profesores
          const filteredProfessors = initialProfessors.filter((profesor) =>
            profesor.carrera.some((c) => userCarrera.includes(c))
          );
  
          setInitialProfessors(filteredProfessors);
  
          // Obtener datos de alumnos (reemplaza 'api/alumnos' con la ruta correcta)
          const alumnosResponse = await axios.get(
            `${import.meta.env.VITE_BACKEND_URL_BASE}/api/create`,
            {
              headers: {
                Authorization: `Token ${token}`,
              },
            }
          );
  
          setAlumnos(alumnosResponse.data);
        } catch (error) {
          console.error("Error al obtener datos de productos, profesores o alumnos:", error);
        }
      }
    };
  
    fetchData();
  }, [initialProfessors]);
  
  
  const addToCart = (product) => {
    const updatedCart = [...cart];
    const index = updatedCart.findIndex(
      (item) => item.id_producto === product.id_producto
    );
    if (index !== -1) {
      updatedCart[index].quantity++;
    } else {
      updatedCart.push({ ...product, quantity: 1 });
    }

    const totalQuantity = updatedCart.reduce(
      (total, item) => total + item.quantity,
      0
    );

    setCart(updatedCart);
    setBadgeValue(totalQuantity);
  };

  const removeFromCart = (product) => {
    const updatedCart = [...cart];
    const index = updatedCart.findIndex(
      (item) => item.id_producto === product.id_producto
    );
    if (index !== -1) {
      updatedCart.splice(index, 1);

      const totalQuantity = updatedCart.reduce(
        (total, item) => total + item.quantity,
        0
      );

      setCart(updatedCart);
      setBadgeValue(totalQuantity);
    }
  };

  const printSolicitud = async () => {
    const token = Cookies.get("token");

    if (token) {
      try {
        const userData = await getUserData(token);

        if (!selectedProfesor) {
          toast.error("Seleccione un profesor");
          return;
        }

        for (const item of cart) {
          const productDetails = await axios.get(
            `${import.meta.env.VITE_BACKEND_URL_BASE}/api/productos/${
              item.id_producto
            }`,
            {
              headers: {
                Authorization: `Token ${token}`,
              },
            }
          );

          if (item.quantity > productDetails.data.disponibilidad) {
            console.log(
              `La cantidad solicitada de ${productDetails.data.nombre} es mayor a lo disponible.`
            );
            return;
          }
        }

        let fechaEntrega = new Date();
        fechaEntrega.setDate(fechaEntrega.getDate() + 14);

        if (fechaEntrega.getDay() === 0) {
          fechaEntrega.setDate(fechaEntrega.getDate() + 1);
        } else if (fechaEntrega.getDay() === 6) {
          fechaEntrega.setDate(fechaEntrega.getDate() + 2);
        }

        const productosDuplicados = cart.map((item) => ({
          id_producto: item.id_producto,
          cantidad: item.quantity,
        }));

        const solicitud = {
          usuario: userData.id_user,
          profesor: selectedProfesor,
          productos: productosDuplicados,
          companeros: [],
          fecha_creacion: new Date().toISOString().split("T")[0],
          fecha_entrega: fechaEntrega.toISOString().split("T")[0],
          fecha_devolucion: null,
          estado: "en revisión",
          aprobacion: false,
        };

        console.log("JSON a enviar:", solicitud);

        setCart([]);
        setBadgeValue(0);
        setVisible(false);
        setFechaEntrega(fechaEntrega);

        toast.success("Solicitud Enviada");

        const response = await axios.post(
          `${import.meta.env.VITE_BACKEND_URL_BASE}/api/solicitudes`,
          solicitud,
          {
            headers: {
              Authorization: `Token ${token}`,
              "Content-Type": "application/json",
            },
          }
        );

        for (const product of productosDuplicados) {
          const productDetails = await axios.get(
            `${import.meta.env.VITE_BACKEND_URL_BASE}/api/productos/${
              product.id_producto
            }`,
            {
              headers: {
                Authorization: `Token ${token}`,
              },
            }
          );

          const updatedDisponibilidad =
            productDetails.data.disponibilidad - product.cantidad;

          await axios.put(
            `${import.meta.env.VITE_BACKEND_URL_BASE}/api/productos/${
              product.id_producto
            }`,
            {
              ...productDetails.data,
              disponibilidad: updatedDisponibilidad,
            },
            {
              headers: {
                Authorization: `Token ${token}`,
                "Content-Type": "application/json",
              },
            }
          );
        }

        const responseProducts = await axios.get(
          `${import.meta.env.VITE_BACKEND_URL_BASE}/api/productos`,
          {
            headers: {
              Authorization: `Token ${token}`,
            },
          }
        );
        
        console.log("Productos desde la API:", responseProducts.data);
        setProducts(responseProducts.data);
      } catch (error) {
        console.error("Error al obtener datos del usuario:", error);
      }
    }
  };

  const calculateAvailabilityStatus = (disponibilidad, stock) => {
    if (disponibilidad === 0) {
      return { label: "Sin stock", color: "gray" };
    }

    const porcentaje = ((disponibilidad / stock) * 100).toFixed(2);

    if (porcentaje > 75) {
      return { label: "Alta", color: "green" };
    } else if (porcentaje <= 75 && porcentaje > 50) {
      return { label: "Media", color: "yellow" };
    } else if (porcentaje <= 50 && porcentaje > 25) {
      return { label: "Media-baja", color: "yellow" };
    } else {
      return { label: "Baja", color: "red" };
    }
  };

  const columnsToShow = [
    {
      name: "Producto",
      content: (row) => (
        <div>
          <div className="m-0 text-base leading-6 font-medium">
            {row.nombre}
          </div>
          <div className="m-0 text-sm font-normal leading-6 text-gray-700">
            {row.descripcion}
          </div>
        </div>
      ),
    },
    {
      name: "",
      content: (row) => {
        const { label, color } = calculateAvailabilityStatus(
          row.disponibilidad,
          row.stock
        );
        return (
          <div className="flex flex-col">
            <Tag color={color}>{label}</Tag>
          </div>
        );
      },
    },
    {
      name: "",
      content: (row) => (
        <Button
          icon={faCartPlus}
          color="text"
          className="text-primary-500 aspect-square"
          iconClassName=" text-lg "
          pill
          onClick={() => addToCart(row)}
          disabled={row.disponibilidad === 0}
        />
      ),
    },
  ];

  const cartColumns = [
    {
      name: "Producto",
      content: (row) => (
        <div>
          <div className="m-0 text-base leading-6 font-medium">
            {row.nombre}
          </div>
          <div className="m-0 text-sm font-normal leading-6 text-gray-700">
            {row.descripcion}
          </div>
        </div>
      ),
    },
    {
      name: "Cantidad",
      content: (row) => (
        <div className="flex items-center">
          <Button
            className="text-primary-500 font-bold aspect-square"
            onClick={() => decreaseQuantity(row)}
            disabled={row.quantity <= 1}
            color="text"
            size="sm"
            pill
            icon={faMinus}
          />
          <span className="text-base leading-6 mx-2 text-gray-700 font-normal">
            {row.quantity}
          </span>
          <Button
            className="text-primary-500 font-bold aspect-square"
            onClick={() => increaseQuantity(row)}
            disabled={row.quantity >= row.disponibilidad}
            color="text"
            size="sm"
            pill
            icon={faAdd}
          />
        </div>
      ),
    },
    {
      name: "Eliminar",
      content: (row) => (
        <Button
          className="text-red-500 hover:bg-red-50 aspect-square"
          onClick={() => removeFromCart(row)}
          color="text"
          pill
          icon={faTrash}
        />
      ),
    },
  ];

  const selectOptions = [
    { label: "Seleccionar Profesor", value: "" },
    ...initialProfessors.map((profesor) => ({
      label: profesor.label,
      value: profesor.value,
    })),
  ];

  const filteredProducts = products.filter((product) =>
    product.nombre.toLowerCase().includes(searchText.toLowerCase())
  );

  const increaseQuantity = (product) => {
    const updatedCart = [...cart];
    const index = updatedCart.findIndex(
      (item) => item.id_producto === product.id_producto
    );
    if (index !== -1) {
      updatedCart[index].quantity++;
      setCart(updatedCart);
    }
  };

  const decreaseQuantity = (product) => {
    const updatedCart = [...cart];
    const index = updatedCart.findIndex(
      (item) => item.id_producto === product.id_producto
    );
    if (index !== -1 && updatedCart[index].quantity > 1) {
      updatedCart[index].quantity--;
      setCart(updatedCart);
    }
  };

  return (
    <>
      <Toaster />
      <div className="max-h-screen">
        <Header
          title="Solicitar"
          subtitle="Texto personalizado"
          imageUrl="https://modernize-react.adminmart.com/assets/ChatBc-d3c45db6.png"
        />

        <div className="flex">
          {/* Primera Tabla: Lista de Productos */}
          <div className="m-4 w-3/5 rounded-xl shadow-custom bg-white">
            <div className="w-full border border-b rounded-t-xl">
              <h3 className="p-4 text-xl font-medium text-slate-800">
                Productos
              </h3>
            </div>

            <div className="p-4">
              <div className="my-4 w-full">
                <InputText
                  placeholder="Buscar Producto..."
                  className="!w-full"
                  onChange={(e) => setSearchText(e.target.value)}
                />
              </div>
              <Table
                columns={columnsToShow}
                data={filteredProducts}
                paginator
              />
            </div>
          </div>

          {/* Segunda Tabla: Carrito de Compras */}
          <div className="m-4 w-2/5 rounded-xl shadow-custom bg-white">
            <div className="w-full border border-b rounded-t-xl">
              <h3 className="p-4 text-2xl font-medium text-slate-800">
                Carrito
              </h3>
            </div>
            <div className="p-4">
              <div className="my-4">
                <label className="block text-sm font-medium text-gray-700">
                  Seleccionar Profesor
                </label>
                <Dropdown
                  options={selectOptions}
                  value={selectedProfesor || ""}
                  onChange={(e) => setSelectedProfesor(e.value)}
                  placeholder="Seleccionar Profesor"
                  className="w-full"
                />
              </div>
              <div className="my-4">
                <label className="block text-sm font-medium text-gray-700">
                  Seleccionar Compañeros
                </label>
                <MultiSelect
                  value={selectedAlumnos}
                  options={alumnos.map((alumno) => ({
                    label: alumno.nombre,
                    value: alumno.id,
                  }))}
                  onChange={(e) => setSelectedAlumnos(e.value)}
                  placeholder="Seleccionar Alumnos"
                  className="w-full"
                />
              </div>
              <Table columns={cartColumns} data={cart} />
            </div>
            <div className="p-4">
              <Button
                className="p-button-primary"
                onClick={printSolicitud}
                label="Siguiente"
              />
            </div>
          </div>
        </div>
      </div>
    </>
  );
};

export default ProductTable;
