import React, { Component } from "react";
import { DataTable } from "primereact/datatable";
import { Column } from "primereact/column";
import { Button } from "primereact/button";
import { Dialog } from "primereact/dialog";
import { Badge } from "primereact/badge";
import Cookies from "js-cookie";
import axios from "axios";
import { Dropdown } from "primereact/dropdown";
import Header from "../Header";
import { getUserData } from "../../api/userService";
import { Toast } from "primereact/toast";
import { Tag } from "primereact/tag";
import { classNames } from "primereact/utils";

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
      if (updatedCart[index].quantity > 1) {
        updatedCart[index].quantity--;
      } else {
        updatedCart.splice(index, 1);
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

  calculateAvailabilityPercentage = (disponibilidad, stock) => {
    if (stock === 0) {
      return 0; // Evitar la división por cero
    }
    return ((disponibilidad / stock) * 100).toFixed(2);
  };

  render() {
    const renderFooter = (
      <div>
        <Button
          label="Solicitar"
          icon="pi pi-check"
          onClick={this.printSolicitud}
          disabled={this.state.cart.length === 0} // Disable the button if the cart is empty
        />
        <Button
          label="Cerrar"
          icon="pi pi-times"
          onClick={() => this.setState({ visible: false })}
        />
      </div>
    );

    const routeData = [
      {
        id: 1,
        name: "Solicitud",
      },
      {
        id: 2,
        name: "Productos",
        hidden: true,
      },
    ];

    const scrollHeight = "calc(100vh - 256px)";

    return (
      <>
        <Header title="Productos" route={routeData}>
          <Button
            onClick={() => this.setState({ visible: true })}
            className="p-overlay-badge"
          >
            <i
              className="pi pi-shopping-cart p-overlay-badge"
              style={{ fontSize: "1.5rem" }}
            >
              <Badge value={this.state.badgeValue} severity="danger" />
            </i>
          </Button>
        </Header>

        <DataTable
          value={this.state.products}
          tableStyle={{ minWidth: "50rem" }}
          frozenWidth="200px"
          scrollable
          className=""
          scrollHeight={scrollHeight}
          paginator
          rows={25}
          rowsPerPageOptions={[25, 50, 100, 200]}
        >
          <Column field="nombre" header="Nombre" />
          <Column field="descripcion" header="Descripción" />
          <Column
            field="disponibilidad"
            header="Disponible"
            body={(rowData) => {
              const percentage = this.calculateAvailabilityPercentage(
                rowData.disponibilidad,
                rowData.stock
              );
              let tagClass, labelText, iconClass, className;

              if (percentage > 75) {
                tagClass = "success";
                labelText = "Alta";
                iconClass = "pi pi-check";
              } else if (percentage >= 50) {
                tagClass = "warning";
                labelText = "Media";
                iconClass = "pi pi-exclamation-triangle";
                
              } else if (percentage >= 25) {
                tagClass = "warning";
                labelText = "Media-Baja";
                iconClass = "pi pi-exclamation-triangle";
              } else if (percentage >= 1) {
                tagClass = "warning";
                labelText = "Media-Baja";
                iconClass = "pi pi-exclamation-triangle";
              } else {
                tagClass = "";
                className="!bg-gray-400"
                labelText = "Sin stock";
                iconClass = "pi pi-times ";
              }

              return (
                <div>
                  <Tag severity={tagClass} className={className} icon={iconClass}>
                    {labelText}
                  </Tag>
                </div>
              );
            }}
          />

          <Column frozen alignFrozen="right" body={this.addToCartTemplate} />
        </DataTable>
        <Toast ref={this.toast} />

        <Dialog
          header="Carrito de Compras"
          visible={this.state.visible}
          breakpoints={{ "960px": "75vw", "641px": "100vw" }}
          style={{ width: "70vw" }}
          maximizable
          onHide={() => this.setState({ visible: false })}
          footer={renderFooter}
        >
          <Dropdown
            value={this.state.selectedProfesor}
            options={this.state.initialProfessors}
            onChange={(e) => this.setState({ selectedProfesor: e.value })}
            placeholder="Seleccione un profesor"
            className="w-full my-4"
          />

          <DataTable value={this.state.cart} size="small">
            <Column field="nombre" header="Nombre" />
            <Column field="quantity" header="Cantidad" />
            <Column header="Acciones" body={this.removeFromCartTemplate} />
          </DataTable>
        </Dialog>
      </>
    );
  }

  addToCartTemplate = (rowData) => (
    <div>
      <Button
        icon="pi pi-cart-plus"
        text
        className="text-sky-500 aspect-square "
        severity="info"
        rounded
        size="large"
        onClick={() => this.addToCart(rowData)}
        disabled={rowData.disponibilidad === 0} // Deshabilita el botón si la disponibilidad es 0
      />
    </div>
  );
  

  removeFromCartTemplate = (rowData) => (
    <div className="flex  gap-1 ">
      <Button
        icon="pi pi-plus"
        rounded
        text
        size="small"
        severity="info"
        onClick={() => this.increaseQuantity(rowData)}
      />
      <Button
        icon="pi pi-minus"
        rounded
        text
        size="small"
        severity="info"
        onClick={() => this.decreaseQuantity(rowData)}
      />
      <Button
        icon="pi pi-trash"
        rounded
        text
        size="small"
        severity="danger"
        className="ml-3"
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
