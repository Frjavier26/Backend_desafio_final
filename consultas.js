const { Pool } = require('pg');
const bcrypt = require('bcryptjs');

const pool = new Pool({
  host: process.env.DB_HOST,
  user: process.env.DB_USER,
  password: process.env.DB_PASSWORD,
  database: process.env.DB_DATABASE,
  port: process.env.DB_PORT,
  ssl: true,
  allowExitOnIdle: true,
});

//FUNCION PARA OBTENER LOS USUARIOS
const getUsuarios = async (user_email) => {
  const values = [user_email];
  const consulta = 'SELECT * FROM usuarios WHERE user_email = $1';

  const {
    rows: [usuario],
    rowCount,
  } = await pool.query(consulta, values);

  if (rowCount === 0) {
    throw {
      code: 404,
      message: 'No se encontró ningún usuario con este email',
    };
  }
  // Eliminar la propiedad 'password' del objeto usuario si existe
  if (usuario.password) {
    delete usuario.password;
  }
  return usuario;
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

const vereficarCredencial = async (user_email, user_password) => {
  const values = [user_email];
  const consulta = 'SELECT * FROM usuarios WHERE user_email = $1';

  const {
    rows: [usuario],
    rowCount,
  } = await pool.query(consulta, values);

  const { user_password: passwordEncriptada } = usuario;
  const passwordEsCorrecta = bcrypt.compareSync(
    user_password,
    passwordEncriptada
  );
  console.log('password correcta? ', passwordEsCorrecta);
  console.log('rowCount: ', rowCount);

  if (!passwordEsCorrecta || !rowCount)
    throw { code: 401, message: 'Email o contraseña incorrecta' };
};

// MODIFICACION DE USUARIOS
const modificarUsuario = async (user_name, user_lastname, id) => {
  const consulta =
    'UPDATE usuarios SET user_name = $1, user_lastname = $2 WHERE id = $3';
  const values = [user_name, user_lastname, id];
  const { rowCount } = await pool.query(consulta, values);
  if (rowCount === 0) {
    throw { code: 404, message: 'No se consiguio ningun usuario con este id' };
  }
};

//Aregar nuevo producto
const agregarProducto = async (
  product,
  precio,
  url,
  short_description,
  long_description,
  user_email
) => {
  const consulta =
    'INSERT INTO productos values(DEFAULT, $1, $2, $3, $4, $5, $6)';
  const values = [
    product,
    precio,
    url,
    short_description,
    long_description,
    user_email,
  ];
  const result = await pool.query(consulta, values);
  console.log('Producto agregado');
};

// MODIFICAR UN PRODUCTO
const modificarProducto = async (
  producto,
  price,
  img,
  descripcion_corta,
  descripcion,
  id
) => {
  const consulta =
    'UPDATE productos SET product_name = $1, price = $2, img_url = $3, short_description = $4, long_description = $5 WHERE id = $6';
  const values = [
    producto,
    price,
    img,
    descripcion_corta,
    descripcion,
    id
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
