
const verificarUsuario = async (req, res, next) => {
    const { correo, clave } = req.body
    if (!correo || !clave) {
        res.status(400)
        res.send({message: "Credenciales invalidas"})
    }
    next();
}

const reporte = async (req, res, next) => {
    const parametros = req.params
    const url = req.url
    console.log(`
    Hoy ${new Date ()}
    se ha recibido una consulta en la ruta ${url}
    con los parametros :`, parametros)
    next();
}



module.exports = {verificarUsuario, reporte}