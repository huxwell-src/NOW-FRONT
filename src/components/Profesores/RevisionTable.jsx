import { useState, useEffect, useCallback } from "react";
import { Dialog } from "primereact/dialog";
import Button from "../UI/Button";
import axios from "axios";
import Cookies from "js-cookie";
import Table from "../UI/Table";
import Header from "../UI/Header";
import { getProducts } from "../../api/productService";
import ToggleButton from "../UI/ToggleButton";
import { InputTextarea } from "primereact/inputtextarea";
import toast, { Toaster } from "react-hot-toast";
import { faCheck, faPenToSquare, faX } from "@fortawesome/free-solid-svg-icons";

const RevisionTable = () => {
  const [solicitudes, setSolicitudes] = useState([]);
  const [products, setProducts] = useState([]);
  const [visible, setVisible] = useState(false);
  const [selectedSolicitud, setSelectedSolicitud] = useState(null);
  const [currentUser, setCurrentUser] = useState(null);
  const [allButtonsActivated, setAllButtonsActivated] = useState(false);
  const [rowStates, setRowStates] = useState({});
  const [nota, setNota] = useState("");

  const fetchData = useCallback(async () => {
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

      const solicitudesUsuarioActual = solicitudesResponse.data.filter(
        (solicitud) => solicitud.profesor.id_user === currentUser.id_user
      );

      const solicitudesEnRevision = solicitudesUsuarioActual.filter(
        (solicitud) => solicitud.estado === "en revisión"
      );

      const productsData = await getProducts();

      setSolicitudes(solicitudesEnRevision);
      setProducts(productsData);
      setCurrentUser(currentUser);
    } catch (error) {
      console.error(
        "Error al obtener las solicitudes o datos del usuario:",
        error
      );
    }
  }, []);

  useEffect(() => {
    fetchData();
  }, [fetchData]);

  const showDetailsDialog = (rowData) => {
    setSelectedSolicitud(rowData);
    setVisible(true);
  };

  const hideDetailsDialog = () => {
    setVisible(false);
    setNota("");
    fetchData();
  };

  const handleNotaChange = (e) => {
    setNota(e.target.value);
  };


  const getProductNameById = (productId) => {
    const product = products.find((prod) => prod.id_producto === productId);
    return product ? product.nombre : "Producto no encontrado";
  };

  const enviarFormulario = async () => {
    try {
      if (!selectedSolicitud) {
        console.error("No hay solicitud seleccionada para enviar.");
        return;
      }

      const { id_solicitud, productos } = selectedSolicitud;

      const allButtonsActivated = productos.every(
        (producto) => rowStates[producto.id_producto]
      );

      if (!allButtonsActivated) {
        console.error("No todos los ToggleButtons están activados.");
        return;
      }

      const dataToSend = {
        id_solicitud: id_solicitud,
        usuario: selectedSolicitud.usuario.id_user,
        nota: nota,
        estado: "en preparación",
        aprobacion: true,
      };

      console.log("JSON a enviar:", JSON.stringify(dataToSend, null, 2));

      const token = Cookies.get("token");
      const config = {
        headers: {
          Authorization: `Token ${token}`,
        },
      };

      const response = await axios.put(
        `http://127.0.0.1:8000/api/solicitudes/${id_solicitud}`,
        dataToSend,
        config
      );

      toast.success("Solicitud autorizada")

      console.log("Respuesta del servidor:", response.data);

      const updatedSolicitudes = solicitudes.map((solicitud) =>
        solicitud.id_solicitud === id_solicitud
          ? { ...solicitud, ...dataToSend }
          : solicitud
      );

      setSolicitudes(updatedSolicitudes);

      hideDetailsDialog();
    } catch (error) {
      console.error("Error al enviar el formulario:", error);
    }
  };

  const enviarRechazo = async () => {
    try {
      if (!selectedSolicitud) {
        console.error("No hay solicitud seleccionada para completar");
        return;
      }

      const token = Cookies.get("token");
      const config = {
        headers: {
          Authorization: `Token ${token}`,
        },
      };

      console.log(selectedSolicitud.id_solicitud);

      const solicitudData = {
        id_solicitud: selectedSolicitud.id_solicitud,
        usuario: selectedSolicitud.usuario.id_user,
        estado: "Rechazado",
        nota: nota,
      };

      const completadaResponse = await axios.put(
        `http://127.0.0.1:8000/api/solicitudes/${solicitudData.id_solicitud}`,
        solicitudData,
        config
      );

      console.log("Solicitud rechazada:", completadaResponse.data);

      toast.success("solicitud rechazada")

      fetchData();

      hideDetailsDialog();
    } catch (error) {
      console.error("Error al rechazar la solicitud:", error);
    }
  };

  const checkAllButtonsActivated = () => {
    const allButtonsActivated = selectedSolicitud?.productos?.every(
      (producto) => rowStates[producto.id_producto]
    );
    console.log("All Buttons Activated:", allButtonsActivated);
    setAllButtonsActivated(allButtonsActivated);
  };

  const columnsToShow = [
    {
      name: "ID",
      center: true,
      content: (row) => (
        <div>
          <div className="m-0 text-center  text-base leading-6">
            {row.id_solicitud}
          </div>
        </div>
      ),
    },

    {
      name: "Alumno",
      content: (row) => (
        <div>
          <div className="m-0 text-base leading-6">
            {row.usuario.nombre} <br />
            {row.usuario.apellido}
          </div>
        </div>
      ),
    },
    {
      name: "Fecha de Creación",
      content: (row) => (
        <div>
          <div className="m-0 text-base leading-6">
            {new Date(row.fecha_creacion).toLocaleDateString("es-ES")}
          </div>
        </div>
      ),
    },
    {
      name: "Fecha de Entrega",
      content: (row) => (
        <div>
          <div className="m-0 text-base leading-6">
            {new Date(row.fecha_entrega).toLocaleDateString("es-ES")}
          </div>
        </div>
      ),
    },
    {
      content: (row) => (
        <>
          <Button
            label="Autorizar"
            color="text"
            icon={faPenToSquare}
            iconClassName="mx-1"
            className="text-sky-700 font-semibold"
            onClick={() => showDetailsDialog(row)}
          />
        </>
      ),
    },
  ];

  const footerContent = (
    <div>
      <Button
        label="Rechazar"
        color="text"
        icon={faX}
        iconClassName="mx-1"
        className="text-red-600 font-semibold"
        onClick={enviarRechazo}
      />
      <Button
        label="Autorizar"
        color="success"
        icon={faCheck}
        iconClassName="mx-1"
        disabled={allButtonsActivated}
        onClick={enviarFormulario}
      />
    </div>
  );

  return (
    <>
      <Toaster />
      <Header
        title="Solicitudes Pendientes"
        subtitle="Solicitudes sin revisar"
        imageUrl="https://modernize-react.adminmart.com/assets/ChatBc-d3c45db6.png"
      />
      <div className="m-4">
        <Table
          columns={columnsToShow}
          data={solicitudes}
          paginator
        />
      </div>

      <Dialog
        header="Autorizacion de la solicitud"
        visible={visible}
        onHide={hideDetailsDialog}
        footer={footerContent}
        maximizable
        style={{ width: "50vw" }}
      >
        {selectedSolicitud &&
          selectedSolicitud.productos &&
          selectedSolicitud.productos.length > 0 && (
            <Table
              columns={[
                { name: "ID", content: (rowData) => rowData.id_producto },
                {
                  name: "Nombre",
                  content: (rowData) => getProductNameById(rowData.id_producto),
                },
                {
                  name: "Cantidad",
                  center: true,
                  content: (rowData) => (
                    <div className="text-center w-full">
                      <span>{rowData.cantidad}</span>
                    </div>
                  ),
                },
                {
                  name: "Acciones",
                  content: (rowData) => (
                    <ToggleButton
                      checked={rowStates[rowData.id_producto] || false}
                      onChange={() => {
                        const newStates = { ...rowStates };
                        newStates[rowData.id_producto] =
                          !rowStates[rowData.id_producto];
                        setRowStates(newStates);
                        checkAllButtonsActivated();
                      }}
                      onLabel="Autorizado"
                      offLabel="No autorizado"
                      colorOn="text"
                      colorOff="text"
                      offClassName="text-red-700" // Clases adicionales cuando está en estado "off"
                      className="font-semibold"
                    />
                  ),
                },
              ]}
              data={selectedSolicitud.productos}
              onRowSelect={(selectedRows) => handleRowSelect(selectedRows)}
              paginator={false}
            />
          )}
        <h2 className=" text-lg font-semibold my-4 ">Notas:</h2>
        <InputTextarea
          id="username"
          rows={5}
          className="w-full"
          value={nota}
          onChange={handleNotaChange}
        />
      </Dialog>
    </>
  );
};

export default RevisionTable;
