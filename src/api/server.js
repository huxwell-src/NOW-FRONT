const express = require("express");
const cors = require("cors");

const app = express();

// Configurar CORS para permitir todas las solicitudes (ajusta la configuración según tus necesidades)
app.use(cors());

// Rutas y otras configuraciones del servidor
// ...

app.listen(8000, () => {
  console.log("Servidor API iniciado en el puerto 8000");
});
