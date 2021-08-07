const fs = require("fs");

class Archivo {
  //Supone que se ingresa el nombre y la extensión
  constructor(nombre) {
    this.nombre = `./${nombre}`;
  }

  async leer() {
    try {
      if (fs.existsSync(this.nombre)) {
        let content = await fs.promises.readFile(this.nombre, "utf-8");
        let contentJ = JSON.parse(content);
        console.log(contentJ);
      } else {
        console.log([]);
      }
    } catch (error) {
      console.log("Hubo un error", error);
    }
  }

  async guardar(producto) {
    try {
      if (fs.existsSync(this.nombre)) {
        let content = await fs.promises.readFile(this.nombre, "utf-8");
        let contentJ = JSON.parse(content);
        contentJ.push({ ...producto, id: contentJ.length + 1 });
        let contentM = JSON.stringify(contentJ);
        await fs.promises.writeFile(this.nombre, contentM);
      } else {
        let contentM = JSON.stringify([{ ...producto, id: 1 }]);
        await fs.promises.writeFile(this.nombre, contentM);
      }
    } catch (error) {
      console.log("Hubo un error", error);
    }
  }

  async borrar() {
    try {
      await fs.promises.unlink(this.nombre);
    } catch (error) {
      console.log("Hubo un error", error);
    }
  }
}

let archivo1 = new Archivo("productos.txt");

//PRUEBAS
//archivo1.leer();

//archivo1.guardar({ title: "fideos", price: 180, thumbmail: "/img/fideos.png" });

archivo1.guardar({ title: "Harina", price: 187, thumbmail: "/img/harina.jpg" });

//archivo1.borrar();
