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
        { label: "Mario Perez Aguilera ", value: 55 },
        { label: "Daniel Valdebenito Celedon", value: 56 },
        { label: "Guillermo Pizarro lopez", value: 57 },
        { label: "Vladimir Quezada Cid", value: 58 },
        { label: "Richard Chaparro Cares", value: 59 },
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
    this.setState({
      cart: updatedCart,
      badgeValue: updatedCart.length,
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
      this.setState({
        cart: updatedCart,
        badgeValue: updatedCart.length,
      });
    }
  };

  printSolicitud = async () => {
    const token = Cookies.get('token');
  
    if (token) {
      try {
        // Obtener datos del usuario
        const userData = await getUserData(token);
  
        // Validations
        if (!this.state.selectedProfesor) {
          // Show an error toast or handle the error accordingly
          this.toast.current.show({
            severity: "error",
            summary: "Error",
            detail: "Seleccione un profesor antes de enviar la solicitud.",
            life: 3000,
          });
          return;
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
  
        // Construir el objeto de solicitud
        const solicitud = {
          fecha: new Date().toLocaleDateString('es-CL'),
          fecha_entrega: fechaEntrega.toLocaleDateString('es-CL'),
          productos: this.state.cart,
          profesor: this.state.selectedProfesor,
          aprobacion: this.state.aprobacion,
          usuario: userData, // Incluir información completa del usuario
        };
  
        // Cerrar el modal
        this.setState({
          cart: [],
          badgeValue: 0,
          visible: false,
          fechaEntrega: fechaEntrega, // Update fechaEntrega in the state
        });
  
        // Mostrar un toast o realizar otras acciones si es necesario
        this.toast.current.show({
          severity: "success",
          summary: "Solicitud Enviada",
          detail: "La solicitud se ha enviado correctamente.",
          life: 2000, // Display time in milliseconds
        });
  
        console.log(JSON.stringify(solicitud, null, 2));
      } catch (error) {
        // Manejar errores
        console.error('Error al obtener datos del usuario:', error);
      }
    }
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
          paginator
          rows={25}
          rowsPerPageOptions={[25, 50, 100, 200]}
        >
          <Column field="nombre" header="Nombre" />
          <Column field="descripcion" header="Descripción" />
          <Column field="stock" header="stock" />
          <Column frozen alignFrozen="right" body={this.addToCartTemplate} />
        </DataTable>
        <Toast ref={this.toast} />

        <Dialog
          header="Carrito de Compras"
          visible={this.state.visible}
          breakpoints={{ "960px": "75vw", "641px": "100vw" }}
          style={{ width: "70vw" }}
          onHide={() => this.setState({ visible: false })}
          footer={renderFooter}
        >
          <Dropdown
            value={this.state.selectedProfesor}
            options={this.state.initialProfessors}
            onChange={(e) => this.setState({ selectedProfesor: e.value })}
            placeholder="Seleccione un profesor"
          />

          <DataTable value={this.state.cart} size="small">
            <Column field="nombre" header="Nombre" />
            <Column field="stock" header="Stock" />
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
