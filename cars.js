const Router = require('koa-router');

const router = new Router({
	prefix: '/cars'
});

let cars = [
	{ id: 1, nombre: 'Toyota', modelo: 'Corolla', anio: 2015 },
	{ id: 2, nombre: 'Peugeot', modelo: '208', anio: 2017 },
	{ id: 3, nombre: 'Honda', modelo: 'Civic', anio: 2014 }
];

/* ---------------------- Routes ----------------------- */
/* API REST Get All */
router.get('/', (ctx, next) => {
	ctx.body = {
		status: 'success',
		message: cars
	};
	next();
});

/* API REST Get x ID */
router.get('/:id', (ctx, next) => {
	let getCurrentCar = cars.filter(function(car) {
		if (car.id == ctx.params.id) {
			return true;
		}
	});

	if (getCurrentCar.length) {
		ctx.body = getCurrentCar[0];
	} else {
		ctx.response.status = 404;
		ctx.body = {
			status: 'error!',
			message: 'Car Not Found with that id!'
		};
	}
	next();
});

/* API REST Post */
router.post('/new', (ctx, next) => {
	// Check if any of the data field not empty
	if (
		!ctx.request.body.id ||
		!ctx.request.body.nombre ||
		!ctx.request.body.modelo ||
		!ctx.request.body.anio
	) {
		ctx.response.status = 400;
		ctx.body = {
			status: 'error',
			message: 'Please enter the data'
        }
	} else {
		let newCar = cars.push({
			id: ctx.request.body.id,
			nombre: ctx.request.body.nombre,
			modelo: ctx.request.body.modelo,
			anio: ctx.request.body.anio
		});
		ctx.response.status = 201;
		ctx.body = {
			status: 'success',
			message: `New car added with id: ${ctx.request.body.id} & nombre: ${
				ctx.request.body.nombre
			}`
		};
	}
	next();
});

/* API REST Put */
router.put('/update/:id', (ctx, next) => {
	// Check if any of the data field not empty
	if (
		!ctx.request.body.id ||
		!ctx.request.body.nombre ||
		!ctx.request.body.modelo ||
		!ctx.request.body.anio
	) {
		ctx.response.status = 400;
		ctx.body = {
			status: 'error',
			message: 'Please enter the data'
        }
	} else {
        let id = ctx.params.id
        let index = cars.findIndex(car => car.id == id)
		cars.splice(index,1,ctx.request.body)
		ctx.response.status = 201;
		ctx.body = {
			status: 'success',
			message: `New car updated with id: ${ctx.request.body.id} & nombre: ${
				ctx.request.body.nombre
			}`
		};
	}
	next();
});

/* API REST Delete */
router.delete('/delete/:id', (ctx, next) => {
    let id = ctx.params.id
	let index = cars.findIndex(car => car.id == id)
    cars.splice(index,1)
    ctx.response.status = 200;
    ctx.body = {
        status: 'success',
        message: `Car deleted with id: ${id}`
    };
	next();
});


module.exports = router;