const Koa = require('koa');
const koaBody = require('koa-body');

const app = new Koa();

app.use(koaBody());

let cars = require('./cars.js');

// Use the Router on the sub route /books
app.use(cars.routes());

// Server listen
const PORT = 8080
const server = app.listen(PORT, () => {
    console.log(`Servidor Autos-App Koa escuchando en el puerto ${server.address().port}`)
})
server.on('error', error => console.log('Error en Servidor Koa:',error))
