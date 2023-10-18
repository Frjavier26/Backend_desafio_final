const jwt = require("jsonwebtoken")

const checkearCredenciales = async (req, res, next) => {
  const { name, lastName, email, password  } = req.body;
  if (!name || !lastName || !email || !password) {
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

const tokenVerification = (req, res, next) => {
    const token = req.header("Authorization").split("Bearer ")[1]
    if (!token) throw { code: 401, message: "Debe incluir el token en las cabeceras (Authorization)" }

    const tokenValido = jwt.verify(token, "Llave_secreta")
    if (!tokenValido) throw { code: 401, message: "El token es inválido" }
    next()
}

module.exports = { checkearCredenciales, reporte, tokenVerification };
