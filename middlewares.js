const verificarUsuario = async (req, res, next) => {
  const { email, password } = req.body;
  if (!email || !password) {
    res.status(400);
    res.send({ message: 'Credenciales invalidas' });
  }
  next();
};

const reporte = async (req, res, next) => {
  const { parametros } = req.params;
  const { body } = req.body;
  const url = req.url;
  console.log(
    `
    Hoy ${new Date()}
    se ha recibido una consulta en la ruta ${url}
    con los siguientes datos :
    Parámetros: ${parametros}
    Body: ${body}`
  );
  next();
};

module.exports = { verificarUsuario, reporte };
