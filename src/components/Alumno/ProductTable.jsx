import React, { Component } from "react";
import Button from "../UI/Button";
import Cookies from "js-cookie";
import axios from "axios";
import { getUserData } from "../../api/userService";
import Tag from "../UI/Tag";
import Table from "../UI/Table";
import Dropdown from "../UI/Dropdown";
import InputText from "../UI/InputText";
import Header from "../UI/Header";
import {
  faAdd,
  faCartPlus,
  faMinus,
  faTrash,
} from "@fortawesome/free-solid-svg-icons";

class ProductTable extends Component {
  constructor(props) {
    super(props);
    this.state = {
      visible: false,
      cart: [],
      products: [],
      estado: "En Aprobacion",
      badgeValue: 0,
      fechaEntrega: new Date(),
      profesores: 0,
      aprobacion: false,
      selectedProfesor: null,
      searchText: "", // Nuevo estado para el texto de búsqueda
      initialProfessors: [
        { label: "Mario Perez Aguilera ", value: 55, carrera: [2, 3] },
        { label: "Daniel Valdebenito Celedon", value: 56, carrera: [2] },
        { label: "Guillermo Pizarro lopez", value: 57, carrera: [3] },
        { label: "Vladimir Quezada Cid", value: 58, carrera: [4] },
        { label: "Richard Chaparro Cares", value: 59, carrera: [4] },
      ],
    };
    this.toast = React.createRef();
  }

  async componentDidMount() {
    const token = Cookies.get("token");

    if (token) {
      try {
        const response = await axios.get(
          "http://127.0.0.1:8000/api/productos",
          {
            headers: {
              Authorization: `Token ${token}`,
            },
          }
        );
        this.setState({ products: response.data }); // Actualiza el estado con los datos de los productos

        // Fetch user data to get carrera
        const userData = await getUserData(token);
        const userCarrera = userData.carrera.map((carrera) => carrera.id);

        // Filter professors based on user's carrera
        const filteredProfessors = this.state.initialProfessors.filter(
          (profesor) => profesor.carrera.some((c) => userCarrera.includes(c))
        );

        this.setState({ initialProfessors: filteredProfessors });
      } catch (error) {
        console.error("Error al obtener datos de productos:", error);
      }
    }
  }

  addToCart = (product) => {
    const updatedCart = [...this.state.cart];
    const index = updatedCart.findIndex(
      (item) => item.id_producto === product.id_producto
    );
    if (index !== -1) {
      updatedCart[index].quantity++;
    } else {
      updatedCart.push({ ...product, quantity: 1 });
    }

    // Calcular la cantidad total de productos en el carrito
    const totalQuantity = updatedCart.reduce(
      (total, item) => total + item.quantity,
      0
    );

    this.setState({
      cart: updatedCart,
      badgeValue: totalQuantity,
    });
  };

  removeFromCart = (product) => {
    const updatedCart = [...this.state.cart];
    const index = updatedCart.findIndex(
      (item) => item.id_producto === product.id_producto
    );
    if (index !== -1) {
      updatedCart.splice(index, 1); // Elimina completamente el producto del carrito

      // Calcular la cantidad total de productos en el carrito
      const totalQuantity = updatedCart.reduce(
        (total, item) => total + item.quantity,
        0
      );

      this.setState({
        cart: updatedCart,
        badgeValue: totalQuantity,
      });
    }
  };

  printSolicitud = async () => {
    const token = Cookies.get("token");

    if (token) {
      try {
        // Obtener datos del usuario
        const userData = await getUserData(token);

        // Validaciones
        if (!this.state.selectedProfesor) {
          // Mostrar un toast de error o manejar el error según sea necesario
          this.toast.current.show({
            severity: "error",
            summary: "Error",
            detail: "Seleccione un profesor antes de enviar la solicitud.",
            life: 3000,
          });
          return;
        }

        // Validar disponibilidad antes de enviar la solicitud
        for (const item of this.state.cart) {
          const productDetails = await axios.get(
            `http://127.0.0.1:8000/api/productos/${item.id_producto}`,
            {
              headers: {
                Authorization: `Token ${token}`,
              },
            }
          );

          if (item.quantity > productDetails.data.disponibilidad) {
            // Mostrar un toast de error o manejar el error según sea necesario
            this.toast.current.show({
              severity: "error",
              summary: "Error",
              detail: `La cantidad solicitada de ${productDetails.data.nombre} es mayor a lo disponible.`,
              life: 3000,
            });
            return;
          }
        }

        // Calculate fechaEntrega with at least 14 days from today
        let fechaEntrega = new Date();
        fechaEntrega.setDate(fechaEntrega.getDate() + 14);

        // Adjust fechaEntrega if it falls on a Saturday or Sunday
        if (fechaEntrega.getDay() === 0) {
          fechaEntrega.setDate(fechaEntrega.getDate() + 1); // Sunday, move to Monday
        } else if (fechaEntrega.getDay() === 6) {
          fechaEntrega.setDate(fechaEntrega.getDate() + 2); // Saturday, move to Monday
        }

        // Create a new list of duplicated products based on quantity
        const productosDuplicados = this.state.cart.map((item) => ({
          id_producto: item.id_producto,
          cantidad: item.quantity,
        }));

        // Build the solicitud object
        const solicitud = {
          usuario: userData.id_user,
          profesor: this.state.selectedProfesor,
          productos: productosDuplicados,
          companeros: [],
          fecha_creacion: new Date().toISOString().split("T")[0],
          fecha_entrega: fechaEntrega.toISOString().split("T")[0],
          fecha_devolucion: null,
          estado: "en revisión",
          aprobacion: false,
        };

        // Log the JSON to the console
        console.log("JSON a enviar:", solicitud);

        // Close the modal
        this.setState({
          cart: [],
          badgeValue: 0,
          visible: false,
          fechaEntrega: fechaEntrega,
        });

        // Show a success toast or perform other actions if needed
        this.toast.current.show({
          severity: "success",
          summary: "Solicitud Enviada",
          detail: "La solicitud se ha enviado correctamente.",
          life: 2000,
        });

        // Enviar la solicitud POST
        const response = await axios.post(
          "http://127.0.0.1:8000/api/solicitudes",
          solicitud,
          {
            headers: {
              Authorization: `Token ${token}`,
              "Content-Type": "application/json",
            },
          }
        );

        // Update disponibilidad for each product
        for (const product of productosDuplicados) {
          const productDetails = await axios.get(
            `http://127.0.0.1:8000/api/productos/${product.id_producto}`,
            {
              headers: {
                Authorization: `Token ${token}`,
              },
            }
          );

          const updatedDisponibilidad =
            productDetails.data.disponibilidad - product.cantidad;

          // Update product with new disponibilidad using PUT
          await axios.put(
            `http://127.0.0.1:8000/api/productos/${product.id_producto}`,
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

        this.componentDidMount();

        // Manejar la respuesta según sea necesario
        console.log("Respuesta del servidor:", response.data);
      } catch (error) {
        // Handle errors
        console.error("Error al obtener datos del usuario:", error);
      }
    }
  };

  calculateAvailabilityStatus = (disponibilidad, stock) => {
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

  render() {
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
          const { label, color } = this.calculateAvailabilityStatus(
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
            onClick={() => this.addToCart(row)}
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
              onClick={() => this.decreaseQuantity(row)}
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
              onClick={() => this.increaseQuantity(row)}
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
            onClick={() => this.removeFromCart(row)}
            color="text"
            pill
            icon={faTrash}
          />
        ),
      },
    ];

    const selectOptions = [
      { label: "Seleccionar Profesor", value: "" },
      ...this.state.initialProfessors.map((profesor) => ({
        label: profesor.label,
        value: profesor.value,
      })),
    ];

    const filteredProducts = this.state.products.filter((product) =>
      product.nombre.toLowerCase().includes(this.state.searchText.toLowerCase())
    );

    return (
      <>
        <div className=" max-h-screen  ">
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
                  {/* Agrega el InputText con evento onChange para el buscador */}
                  <InputText
                    placeholder="Buscar Producto..."
                    className="!w-full"
                    onChange={(e) =>
                      this.setState({ searchText: e.target.value })
                    }
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
                {/* Agrega el dropdown para seleccionar un profesor */}
                <div className="my-4">
                  <label className="block text-sm font-medium text-gray-700">
                    Seleccionar Profesor
                  </label>
                  <Dropdown
                    options={selectOptions}
                    value={this.state.selectedProfesor || ""}
                    onChange={(value) =>
                      this.setState({ selectedProfesor: parseInt(value, 10) })
                    }
                    placeholder="Seleccionar Profesor"
                  />
                </div>

                <Table columns={cartColumns} data={this.state.cart} />
              </div>
              <div className="p-4">
                <Button
                  className="p-button-primary"
                  onClick={this.printSolicitud}
                  // disabled={this.state.cart.length === 0}
                  label="Siguiente"
                />
              </div>
            </div>
          </div>
        </div>
      </>
    );
  }

  addToCartTemplate = (rowData) => (
    <div>
      <Button
        icon={faAdd}
        color="text"
        className="text-sky-500 aspect-square "
        onClick={() => this.addToCart(rowData)}
        // disabled={rowData.disponibilidad === 0} // Deshabilita el botón si la disponibilidad es 0
      />
    </div>
  );

  removeFromCartTemplate = (rowData) => (
    <div className="flex  gap-1 ">
      <Button
        icon={faAdd}
        color="text"
        onClick={() => this.increaseQuantity(rowData)}
      />

      <Button
        icon={faMinus}
        color="text"
        onClick={() => this.decreaseQuantity(rowData)}
      />
      <Button
        icon={faTrash}
        color="text"
        onClick={() => this.removeFromCart(rowData)}
      />
    </div>
  );

  increaseQuantity = (product) => {
    const updatedCart = [...this.state.cart];
    const index = updatedCart.findIndex(
      (item) => item.id_producto === product.id_producto
    );
    if (index !== -1) {
      updatedCart[index].quantity++;
      this.setState({
        cart: updatedCart,
      });
    }
  };

  decreaseQuantity = (product) => {
    const updatedCart = [...this.state.cart];
    const index = updatedCart.findIndex(
      (item) => item.id_producto === product.id_producto
    );
    if (index !== -1 && updatedCart[index].quantity > 1) {
      updatedCart[index].quantity--;
      this.setState({
        cart: updatedCart,
      });
    }
  };
}

export default ProductTable;
