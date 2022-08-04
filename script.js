let totalprecio = document.getElementById("preciototal")
const galeriaProductos = document.getElementById("galeriaProductos")
const divCarrito = document.getElementById("divCarrito")
let carrito = [] 

document.addEventListener("DOMContentLoaded", () =>{
    fetchData()
    if(localStorage.getItem("carrito")){
        carrito = JSON.parse(localStorage.getItem("carrito"))
        pintarCarrito()
    }
})

const fetchData = async () => {
    try {
        const res = await fetch("productos.json")
        const data = await res.json()
        mostrarCards(data)
    } catch (error) {
        console.log(error);
    }
}

const mostrarCards = data =>{
    data.forEach(producto => {
        galeriaProductos.innerHTML += `
        <div class="card" id="producto${producto.id}">
            <div class="card-body">
                <h5 class="card-title" id="item-title"> ${producto.nombre}</h5>
                <img class="card-img" id="item-img" src=${producto.img} alt="imagenproducto">
                <p class="card-marca" id="item-marca"> Marca: ${producto.marca}</p>
                <p class="card-precio" id="item-precio"> Precio: $ ${producto.precio}</p>
                <button id="boton${producto.id}"class="btn">Agregar al Carrito</button>
            </div>
        </div>
        `
    });
    escucharbtn(data)
}

const escucharbtn = (data) => {
    data.forEach((producto) => {
        document
            .querySelector(`#boton${producto.id}`)
            .addEventListener("click", ()=>{
                addCarrito(producto)
                Toastify({
                    text: "Producto Agregado",
                    duration: 3000,
                    close: true,
                    gravity: "top", 
                    position: "right", 
                    stopOnFocus: true,
                    style: {
                      background: "linear-gradient(to right, #00b09b, #96c93d)",
                    },
                    onClick: function(){}
                  }).showToast();
        })   
     })
}

function addCarrito(producto) {
    const existe = carrito.some(element=>element.id === producto.id)

    const productomod = {...producto,cantidad: 1}
    delete productomod.stock
   
    if(existe){
        carrito.map(element=>{
            if(element.id === producto.id){
                element.cantidad++
                return element
            }
        })
    }else{
        carrito.push(productomod)
    }

    pintarCarrito()
}


function pintarCarrito(){
    divCarrito.innerHTML = ""
    carrito.forEach(item =>{
        divCarrito.innerHTML += `
        <div class="cartContenedor">
            <div class="cartItem">
                <div >
                    <div class="itemImagen">
                        <img src='${item.img}' alt="imagen" class="imagencarrito">
                    </div>
                </div>
                <div>
                    <div class="contenedormarca">
                        <p class="marcatext">${item.marca.replace("Marca:","")}</p>
                    </div>
                </div>
                <div>
                    <div class="contenedorprecio">
                        <p class="preciotext">${item.precio}</p>
                    </div>
                </div>
                <div>
                    <div class="contenedorcantidad">
                        <p class="cantidad">${item.cantidad}</p>
                        <button class="btnremove" id="${item.id}" type="button">Eliminar Producto</button>
                    </div>
                </div>
            </div>
        </div>
        `       
        removerProd()
        actualizarTotal()
        localStorage.setItem("carrito", JSON.stringify(carrito))    
    })
}

function removerProd(){
    let botonRemove = document.querySelectorAll(".btnremove")
    botonRemove.forEach((element)=>{
        element.addEventListener("click", (e) =>{
           let id = parseInt(e.target.id)
           carrito = carrito.filter((element)=>{
               return element.id !== id
           })

           localStorage.setItem("carrito", JSON.stringify(carrito))    

           pintarCarrito()
           Toastify({
            text: "Producto Borrado",
            duration: 3000, 
            close: true,
            gravity: "top", 
            position: "right", 
            stopOnFocus: true,
            style: {
              background: "linear-gradient(to right, #ff0202, #571c1c)",
            },
            onClick: function(){}
          }).showToast();
          actualizarTotal()
        })
    })
}


function actualizarTotal(){
   
    let total = 0

    carrito.forEach(element=>{
        let precioproducto = element.precio
        let cantidadproducto = element.cantidad

        total = total + precioproducto * cantidadproducto
    })

    totalprecio.innerHTML = `
    <p class="preciofinal">PRECIO TOTAL $ ${total}</p>
    <button id="finalizarcompra" class="compra" type="button"> COMPRAR </button>
    `

    finalizarCompra()
}

function finalizarCompra(){
    let botoncompra = document.getElementById("finalizarcompra")
    botoncompra.addEventListener("click",()=>{
        swal("Compra Realizada!", "En breve recibiras tus productos!", "success");
        carrito = []
        pintarCarrito()
        actualizarTotal()
    })
}