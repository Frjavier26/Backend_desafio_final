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

const usuarioExiste = (req, res, next) => {
    const { correo, clave } = req.body
    if (!correo || !clave) {
        res
            .status(401)
            .send({ message: "No se recibieron las credenciales en esta consulta" })
    }
    next()
}

module.exports = { verificarUsuario, reporte, usuarioExiste };
