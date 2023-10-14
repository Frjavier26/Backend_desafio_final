const { Pool } = require('pg');
const bcrypt = require('bcryptjs');

const pool = new Pool({
  host: 'localhost',
  user: process.env.PGUSER,
  password: process.env.PGPASSWORD,
  database: process.env.PGDATABASE,
  port: process.env.PGPORT,
  allowExitOnIdle: true,
});

//FUNCION PARA OBTENER LOS USUARIOS
const getUsuarios = async () => {
  const { rows: usuarios } = await pool.query('SELECT * FROM usuarios');
  return usuarios;
};

// Registro de usuario con clave encriptada// DEBERIAMOS AGREGAR LO QUE ES ROL Y NOMBRE, ESO LO VEREMOS AL HACER LA BASE DE DATOS
const registrarUsuario = async (usuario) => {
  let { name, lastName, email, password } = usuario;
  const passwordEncriptada = bcrypt.hashSync(password);
  password = passwordEncriptada;
  const values = [name, lastName, email, passwordEncriptada];
  const consulta = 'INSERT INTO usuarios values (DEFAULT, $1, $2, $3, $4)';
  await pool.query(consulta, values);
};

//Funcion para inicio de sesion // compareSync hace la comparacion entre la contraseña encriptada vs la contraseña original

const vereficarCredencial = async (email, password) => {
  const values = [email];
  const consulta = 'SELECT * FROM usuarios WHERE correo = $1';

  const {
    rows: [usuario],
    rowCount,
  } = await pool.query(consulta, values);

  const { clave: passwordEncriptada } = usuario;
  const passwordEsCorrecta = bcrypt.compareSync(password, passwordEncriptada);
  console.log(passwordEsCorrecta);
  console.log(rowCount);

  if (!passwordEsCorrecta || !rowCount)
    throw { code: 401, message: 'Email o contraseña incorrecta' };
};

// MODIFICACION DE USUARIOS
const modificarUsuario = async (name, lastName, id) => {
  const consulta =
    'UPDATE usuarios SET nombre = $1, apellido = $2 WHERE id = $3';
  const values = [name, lastName, id];
  const { rowCount } = await pool.query(consulta, values);
  if (rowCount === 0) {
    throw { code: 404, message: 'No se consiguio ningun usuario con este id' };
  }
};

//Aregar nuevo producto
const agregarProducto = async (
  nombre_producto,
  precio,
  url_imagen,
  descripcion_corta,
  descripcion
) => {
  const consulta = 'INSERT INTO productos values(DEFAULT, $1, $2, $3, $4, $5)';
  const values = [
    nombre_producto,
    precio,
    url_imagen,
    descripcion_corta,
    descripcion,
  ];
  const result = await pool.query(consulta, values);
  console.log('Producto agregado');
};

// MODIFICAR UN PRODUCTO
const modificarProducto = async (
  nombre_producto,
  precio,
  url_imagen,
  descripcion_corta,
  descripcion,
  id
) => {
  const consulta =
    'UPDATE productos SET nombre_producto = $1, precio = $2, url_imagen = $3, descripcion_corta = $4, descripcion = $5 WHERE id = $6';
  const values = [
    nombre_producto,
    precio,
    url_imagen,
    descripcion_corta,
    descripcion,
    id,
  ];
  const { rowCount } = await pool.query(consulta, values);
  if (rowCount === 0) {
    throw { code: 404, message: 'No se consiguio ningun viaje con este id' };
  }
};

//ELIMINAR UN PRODUCTO
const deleteProducto = async (id) => {
  const consulta = 'DELETE FROM productos WHERE id = $1';
  const values = [id];
  const { rowCount } = await pool.query(consulta, values);
  if (!rowCount)
    throw { code: 404, message: 'No se encontró ningún evento con este ID' };
};

//FUNCION PARA OBTENER LOS PRODUCTOS
const getProductos = async () => {
  const { rows: productos } = await pool.query('SELECT * FROM productos');
  return productos;
};

//Funcion para obtener un producto por id

const getProducto = async (id) => {
  const consulta = 'SELECT * FROM productos WHERE id = $1';
  const value = [id];
  const { rows: producto } = await pool.query(consulta, value);
  return producto;
};

module.exports = {
  registrarUsuario,
  vereficarCredencial,
  getProductos,
  modificarProducto,
  deleteProducto,
  agregarProducto,
  getUsuarios,
  modificarUsuario,
  getProducto,
};
