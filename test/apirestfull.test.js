const supertest = require("supertest");
const request = supertest("http://localhost:5000");
const expect = require("chai").expect;

describe("Test API Rest de productos", () => {
  describe("GET", () => {
    it("Todo los productos - Debería retornar un status 200", async () => {
      let response = await request.get("/api/productos/listar");
      expect(response.status).to.eql(200);
    });
  });
  describe("GET", () => {
    it("Un producto producto por id - Debería retornar un status 200", async () => {
      let response = await request.get(
        "/api/productos/listar/619397c309b805eebab92eb2"
      );
      expect(response.status).to.eql(200);
    });
  });
  describe("POST", () => {
    it("Debería incorporar un producto", async () => {
      let producto = {
        title: "Pera",
        price: 25,
        thumbnail: "ujkhgrfhkwesfuhbrkw",
      };
      let response = await request
        .post("/api/productos/guardar")
        .send(producto)
        .set("Accept", "application/json");
      expect(response.status).to.eql(200);
    });
  });
  describe("PUT", () => {
    it("Debería actualizar un producto", async () => {
      let productoA = {
        title: "Pera",
        price: 25,
        thumbnail: "url actualizada",
      };
      let response = await request
        .put("/api/productos/actualizar/61ae3ff88412bf41098c385")
        .send(productoA)
        .set("Accept", "application/json");
      expect(response.status).to.eql(200);
    });
  });
  describe("DELETE", () => {
    it("Debería eliminar un producto", async () => {
      let response = await request.delete(
        "/api/productos/borrar/61b134ff7013597af7c298de"
      );
      expect(response.status).to.eql(200);
    });
  });
});
