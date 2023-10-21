const express = require('express');
const app = express();
const cors = require('cors');
const jwt = require('jsonwebtoken');

const {
  getProductos,
  registrarUsuario,
  vereficarCredencial,
  modificarProducto,
  deleteProducto,
  agregarProducto,
  getUsuarios,
  modificarUsuario,
  getProducto,
} = require('./consultas');
const {
  checkearCredenciales,
  reporte,
  tokenVerification,
} = require('./middlewares');

require('dotenv').config();

app.listen(3000, console.log('SERVER ON'));
app.use(cors());
app.use(express.json());

// Registro de usuario
app.post('/usuarios', checkearCredenciales, async (req, res) => {
  try {
    const usuario = req.body;
    await registrarUsuario(usuario);
    res.send('Usuario creado con éxito');
  } catch (error) {
    console.error(error);
    res.status(500).send('Error al crear el usuario: ' + error.message);
  }
});

// INICIO DE SESION USUARIO YA REGISTRADO // jwt.sign genera un token, primer argumento es un payload y llave secreta se usa para decodificar el token
app.post('/login', async (req, res) => {
  try {
    const { user_email, user_password } = req.body;
    await vereficarCredencial(user_email, user_password);
    const token = jwt.sign({ user_email }, 'Llave_secreta');
    res.send(token);
  } catch (error) {
    console.log(error);
    res.status(error.code || 500).send(error);
  }
});

//  RUTA GET PARA VISUALIZAR LOS USUARIOS
app.get('/usuarios', tokenVerification, async (req, res) => {
  try {
    const token = req.header('Authorization').split('Bearer ')[1];
    const { user_email } = jwt.decode(token);
    const usuario = await getUsuarios(user_email);
    console.log('usuario de app.get/usuarios: ', usuario);
    res.json(usuario);
  } catch (error) {
    res.status(error.code || 501).send('error app.get');
  }
});

app.put('/usuarios/:id', reporte, async (req, res) => {
  const { id } = req.params;
  const { name, lastName } = req.body; // aqui colocaremos lo que queremos modificar del producto
  const Authorization = req.header('Authorization'); // Da la autorizacion al token para poder hacer la modificacion
  const token = Authorization.split('Bearer ')[1];
  jwt.verify(token, 'Llave_secreta'); // Verifica el token y le da el ok
  const { user_email } = jwt.decode(token); // decodifica el token para ver la informacion que posee
  try {
    await modificarUsuario(name, lastName, id);
    res.send(`El usuario ${user_email} ha modificado el usuario de id ${id}`);
  } catch (error) {
    res.status(error.code || 500).send(error);
  }
});

// Agregar un producto
app.post('/productos', async (req, res) => {
  try {
    const Authorization = req.header('Authorization'); // Da la autorizacion al token para poder hacer la modificacion
    const token = Authorization.split('Bearer ')[1];
    jwt.verify(token, 'Llave_secreta'); // Verifica el token y le da el ok
    const { user_email } = jwt.decode(token); // decodifica el token para ver la informacion que posee
    const { product, precio, url, short_description, long_description } =
      req.body;
    await agregarProducto(
      product,
      precio,
      url,
      short_description,
      long_description,
      user_email
    );
    res.send('Producto agregado con éxito');
  } catch (error) {
    const { code } = error;
    if (code == '23502') {
      res
        .status(400)
        .send(
          'Se ha violado la restricción NOT NULL en uno de los campos de la tabla'
        );
    } else {
      res.status(500).send(error);
    }
  }
});

//  RUTA GET PARA VISUALIZAR LOS PRODUCTOS
app.get('/productos', async (req, res) => {
  try {
    const productos = await getProductos();
    res.json(productos);
  } catch (error) {
    res.status(error.code || 500).send(error);
  }
});

// Ruta GET productos/:id
app.get('/productos/:id', reporte, async (req, res) => {
  try {
    const { id } = req.params;
    const producto = await getProducto(id);
    res.json(producto);
  } catch (error) {
    res.status(error.code || 500).send(error);
  }
});

//Modificacion de producto con autorizacion de token
app.put('/productos/:id', reporte, async (req, res) => {
  try {
    const { id } = req.params;
    const { producto, price, img, descripcion_corta, descripcion } = req.body; // aqui colocaremos lo que queremos modificar del producto
    const Authorization = req.header('Authorization'); // Da la autorizacion al token para poder hacer la modificacion
    const token = Authorization.split('Bearer ')[1];
    jwt.verify(token, 'Llave_secreta'); // Verifica el token y le da el ok
    const { user_email } = jwt.decode(token); // decodifica el token para ver la informacion que posee
    await modificarProducto(
      producto,
      price,
      img,
      descripcion_corta,
      descripcion,
      id
    );
    res.send(`El usuario ${user_email} ha modificado el producto de id ${id}`);
  } catch (error) {
    res.status(error.code || 500).send(error);
  }
});

// Borrar producto con autorizacion de token
app.delete('/productos/:id', reporte, async (req, res) => {
  try {
    const { id } = req.params;
    const Authorization = req.header('Authorization');
    const token = Authorization.split('Bearer ')[1];
    jwt.verify(token, 'Llave_secreta');
    const { correo } = jwt.decode(token);
    await deleteProducto(id);
    res.send(`El usuario ${correo} ha eliminado el producto de id ${id}`);
  } catch (error) {
    res
      .status(404)
      .send({ message: 'No se encontró ningún producto con ese id' });
  }
});

module.exports = app;
