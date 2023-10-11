const socket = io()

const form = document.getElementById('formProduct');
const Productos = document.getElementById('Productos');

socket.emit('connection', 'Conexión establecida');

form.addEventListener('submit', e => {
    e.preventDefault()
    console.log(e.target);
    const datForm = new FormData(e.target) //formulario que dispara el evento
    const product = Object.assign(Object.fromEntries(datForm)) //convierte el formulario en un objeto
    socket.emit('agregarProducto', product);
    e.target.reset()
});

socket.on('productos', productos => {
    Productos.innerHTML = '';
    productos.forEach(producto => {
        Productos.innerHTML += `<div class="product">
            <h2>${producto.title}</h2>
            <p>${producto.description}</p>
            <p>${producto.code}</p>
            <p>${producto.price}</p>
            <p>${producto.status}</p>
            <p>${producto.stock}</p>
            <p>${producto.category}</p>
            <img src="${producto.thumbnail}" alt="${producto.title}">
        </div>`
    });
});
