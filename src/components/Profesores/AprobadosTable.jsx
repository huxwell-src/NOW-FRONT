import { useState, useEffect } from "react";
import { Dialog } from "primereact/dialog";
import { InputTextarea } from "primereact/inputtextarea";
import { InputText } from "primereact/inputtext";
import { MultiSelect } from "primereact/multiselect";
import axios from "axios";
import Cookies from "js-cookie";
import { getProducts } from "../../api/productService";
import Button from "../UI/Button";
import Table from "../UI/Table";
import Header from "../UI/Header";
import { FaCircleXmark } from "react-icons/fa6";
import { MdError } from "react-icons/md";
import {
  FaExclamationCircle,
  FaCheckCircle,
  FaTimesCircle,
  FaBoxOpen,
  FaBox,
} from "react-icons/fa";

const RevisionTable = () => {
  const [solicitudes, setSolicitudes] = useState([]);
  const [filteredSolicitudes, setFilteredSolicitudes] = useState([]);
  const [products, setProducts] = useState([]);
  const [visible, setVisible] = useState(false);
  const [selectedSolicitud, setSelectedSolicitud] = useState(null);
  const [selectedFilterOptions, setSelectedFilterOptions] = useState([]);
  const [filterValue, setFilterValue] = useState("");

  useEffect(() => {
    const fetchData = async () => {
      try {
        const token = Cookies.get("token");

        if (!token) {
          console.error("Token no encontrado en las cookies");
          return;
        }

        const config = {
          headers: {
            Authorization: `Token ${token}`,
          },
        };

        const userDataResponse = await axios.get(
          "http://127.0.0.1:8000/api/user",
          config
        );
        const currentUser = userDataResponse.data.user;

        const solicitudesResponse = await axios.get(
          "http://127.0.0.1:8000/api/solicitudes",
          config
        );

        const productsData = await getProducts();

        const solicitudesUsuarioActual = solicitudesResponse.data.filter(
          (solicitud) => solicitud.profesor.id_user === currentUser.id_user
        );

        const solicitudesNoEnRevision = solicitudesUsuarioActual.filter(
          (solicitud) => solicitud.estado !== "en revisión"
        );

        setSolicitudes(solicitudesNoEnRevision);
        setFilteredSolicitudes(solicitudesNoEnRevision);
        setProducts(productsData);
      } catch (error) {
        console.error(
          "Error al obtener las solicitudes o datos del usuario:",
          error
        );
      }
    };

    fetchData();
  }, []);

  const showDetailsDialog = (rowData) => {
    setVisible(true);
    setSelectedSolicitud(rowData);
  };

  const hideDetailsDialog = () => {
    setVisible(false);
  };

  const handleFilterChange = (e) => {
    setSelectedFilterOptions(e.value);
  };

  const getEstadoStyleClass = (estado) => {
    switch (estado) {
      case "en revisión":
        return {
          class: "text-yellow-900 bg-yellow-300",
          icon: <FaExclamationCircle />,
        };
      case "Completado":
        return {
          class: "text-green-800 bg-green-100",
          icon: <FaCheckCircle />,
        };
      case "Rechazado":
        return {
          class: "text-red-800 bg-red-100",
          icon: <FaTimesCircle />,
        };
      case "reportado":
        return {
          class: "text-red-800 bg-red-100",
          icon: <MdError />,
        };
      case "en preparación":
        return {
          class: "text-yellow-700 bg-amber-100",
          icon: <FaBoxOpen />,
        };
      default:
        return {
          class: "text-yellow-700 bg-amber-100 ",
          icon: <FaBox />,
        };
    }
  };

  const getProductNameById = (productId) => {
    const product = products.find((prod) => prod.id_producto === productId);
    return product ? product.nombre : "Producto no encontrado";
  };

  const handleInputChange = (e) => {
    setFilterValue(e.target.value);
    filterTable(selectedFilterOptions, e.target.value);
  };

  const filterTable = (filterOptions, filterText) => {
    const filteredData = solicitudes.filter((solicitud) => {
      const alumno = `${solicitud.usuario.nombre} ${solicitud.usuario.apellido}`;
      return (
        (filterOptions.length === 0 || filterOptions.includes(solicitud.estado)) &&
        (alumno.toLowerCase().includes(filterText.toLowerCase()) ||
          solicitud.id_solicitud.toString().includes(filterText.toLowerCase()))
      );
    });
    setFilteredSolicitudes(filteredData);
  };


  const columnsToShow = [
    {
      field: "id_solicitud",
      name: "ID",
      content: (row) => (
        <div>
          <div>{row.id_solicitud}</div>
        </div>
      ),
    },
    {
      field: "usuario",
      name: "Alumno",
      content: (row) => (
        <div className="flex gap-1">
          <div>{row.usuario.nombre}</div>
          <div>{row.usuario.apellido}</div>
        </div>
      ),
    },
    {
      field: "estado",
      name: "Estado",
      content: (row) => (
        <div
          className={`${
            getEstadoStyleClass(row.estado).class
          } flex flex-row-reverse items-center gap-1 w-fit px-4 rounded-full capitalize text-center`}
        >
          {getEstadoStyleClass(row.estado).icon} {row.estado}
        </div>
      ),
    },

    {
      field: "fecha_creacion",
      name: "Fecha de creación",
      content: (row) => (
        <div>
          <div>{row.fecha_creacion}</div>
        </div>
      ),
    },
    {
      field: "fecha_entrega",
      name: "Fecha de entrega",
      content: (row) => (
        <div>
          <div>{row.fecha_entrega}</div>
        </div>
      ),
    },
    {
      field: "aprobacion",
      name: "Decisión",
      content: (row) => (
        <div>
          <div>
            {row.aprobacion ? (
              <div className="flex items-center gap-2">
                <span>Aprobado</span>
                <span className="text-green-700">
                  <FaCheckCircle />
                </span>
              </div>
            ) : (
              <div className="flex items-center gap-2">
                <span>Rechazado</span>
                <span className="text-red-700">
                  <FaCircleXmark />
                </span>
              </div>
            )}
          </div>
        </div>
      ),
    },
    {
      field: "detalles",
      name: "Detalles",
      content: (row) => (
        <div>
          <Button
            label="Detalles"
            color="text"
            iconClassName="mx-1"
            className="text-sky-700 font-semibold"
            onClick={() => showDetailsDialog(row)}
          />
        </div>
      ),
    },
  ];

  return (
    <>
      <Header
        title="Historial de solicitudes"
        subtitle="Solicitudes sin revisar"
        imageUrl="https://modernize-react.adminmart.com/assets/ChatBc-d3c45db6.png"
      />

      <div className="m-4">
        <div className="bg-white mb-4 p-4 rounded-lg">
          <h2 className="mb-2 text-xl font-medium">Buscar Solicitud</h2>
          <div className="flex flex-col sm:flex-row gap-2">
            <span className="p-input-icon-left w-full">
              <i className="pi pi-search" />
              <InputText
              placeholder="Buscar alumno o id"
              className="w-full"
              value={filterValue}
              onChange={handleInputChange}
            />
            </span>
            <MultiSelect
              placeholder="Seleccione estados"
              value={selectedFilterOptions}
              options={[
                { label: "En revisión", value: "en revisión" },
                { label: "Completado", value: "Completado" },
                { label: "Rechazado", value: "Rechazado" },
                { label: "Reportado", value: "reportado" },
                { label: "En Preparación", value: "en preparación" },
              ]}
              className="color-sky-600"
              display="chip"
              maxSelectedLabels={3}
              onChange={handleFilterChange}
            />
          </div>
        </div>

        <Table columns={columnsToShow} data={solicitudes} paginator={true} />
        <Dialog
          header="Detalles de la solicitud"
          visible={visible}
          onHide={hideDetailsDialog}
          breakpoints={{ "960px": "75vw", "641px": "100vw" }}
          style={{ width: "50vw" }}
          maximizable
        >
          {selectedSolicitud &&
            selectedSolicitud.productos &&
            selectedSolicitud.productos.length > 0 && (
              <>
                <Table
                  columns={[
                    {
                      field: "id_producto",
                      name: "ID",
                      content: (rowData) => rowData.id_producto,
                    },
                    {
                      field: "nombre",
                      name: "Nombre",
                      content: (rowData) => (
                        <span>{getProductNameById(rowData.id_producto)}</span>
                      ),
                    },
                    {
                      field: "cantidad",
                      name: "Cantidad",
                      content: (rowData) => rowData.cantidad,
                    },
                  ]}
                  data={selectedSolicitud.productos}
                />
                <div className="my-4">
                  <h2 className="text-lg font-semibold">
                    Nota de la solicitud:
                  </h2>
                  <InputTextarea
                    rows={5}
                    className="w-full"
                    disabled
                    value={selectedSolicitud.nota || "No hay notas"}
                    style={{
                      backgroundColor: selectedSolicitud.nota
                        ? "#fff"
                        : "#f0f0f0",
                    }}
                  />
                </div>
              </>
            )}
        </Dialog>
      </div>
    </>
  );
};

export default RevisionTable;
