

const request = require("supertest");
const server = require("../index");

describe("Operaciones CRUD",  () => {


    it("GET/productos devuelve status 200, tipo de arreglo, no vacio", async () => {
        const response = await request(server).get("/productos").send()
        const body = response.body
        const status = response.statusCode;

        expect(status).toBe(200);
        expect(body).toBeInstanceOf(Object)
        expect(body.length).toBeGreaterThan(0)
    })

    it("POST/productos agregar nuevo producto", async () => {
        const nuevoProducto = { nombre_producto: "prueba_test", precio: 1520, url_imagen: "prueba_test", descripcion_corta: "prueba_test", descripcion: "prueba_test" }
        const { body: productos }= await request(server).post("/productos").send(nuevoProducto)
        expect(productos).toContainEqual(nuevoProducto)
    })

    it("DELETE/productos/:id obtener codigo 404 al intentar eliminar un producto con ID inexistente", async () => {
        const jwt = "token"
        const { statusCode } = await request(server)
            .delete("/productos/500")
            .set("Authorization", jwt)
            .send()
        expect(statusCode).toBe(404)
    })

    

})