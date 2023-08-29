class GestorProductos {
  //funcion que inicializa todo
  iniciar() {

    this.cargaDom(coleccion_productos); //Cargamos en el DOM la lista de productos original

    coleccion_mostrada = coleccion_productos; //coleccion mostrada es el array que vamos a usar para filtrar
    
    //revisamos el local storage para ver si habia productos cargados previamente, si hay los agregamos al carrito
    let carritoGuardado = JSON.parse(localStorage.getItem("keyCarrito")) || "";
    if (carritoGuardado != ""){
      console.log(carritoGuardado);
      carritoGuardado.forEach((elemento) =>
      {
        const { nombre, precio, tipo, codigo, urlImg,cantidad } = elemento;
        let produ = new Producto(nombre,precio,tipo,codigo,urlImg);
        produ.cantidad = cantidad;
        agregarCarrito(produ);
      })
    }
    //eventos del boton vaciar y comprar del carrito
    btnVaciar.onclick = function (){

      Swal.fire({
        title: "Está que quiere vaciar el carrito?",
        icon: "warning",
        showCancelButton: true,
        confirmButtonText: "Sí, Vaciar",
        cancelButtonText: "No, volver",
      }).then((result) => {
        if (result.isConfirmed) {
          //vaciar el carrito simplemente hago que el array se vacie y llamo a actualizarCarrito
          carrito = [];
          actualizarCarrito();
          Toastify({
            text: "Carrito Vacio!",
            duration: 3000,
            gravity: "bottom",
            position: "right",
            style: { background: "red" },
          }).showToast();
        } else {
          Toastify({
            text: "No se ha borrado nada",
            duration: 3000,
            gravity: "bottom",
            position: "right",
            style: { background: "green" },
          }).showToast();
        }
      });
    }

    btnComprar.onclick = function (){
      Swal.fire({
        title: "Funcion no disponible por ahora",
        icon: "warning",
        confirmButtonText: "Ok",
      })

    }
  }

  //Funcion que carga la coleccion que le mandemos en el dom
  cargaDom(coleccion) {
    divCont.innerHTML = "";
    //creo un fragmento que luego sera agregado con todas las cards al contenedor
    let fragment = document.createDocumentFragment();
    coleccion.forEach((element) => {
      let contenedor = document.createElement("div");
      const { nombre, precio, tipo, codigo, urlImg } = element; //desestructuramos el elemento

      contenedor.innerHTML = `<h3 class="fs-1">${nombre}</h3> 
                              <img src="../img/${urlImg}" alt="" class="imgProducto" >                          
                              <p>Precio: $${precio}</p> 
                              <p>Tipo: ${tipo}</p>`;
      contenedor.className = "producto";

      let botonAgregar = document.createElement("button");

      botonAgregar.className = "boton";
      botonAgregar.innerHTML = "Agregar al Carrito";

      //generamos un boton agregar en cada producto para que lo sume al carrito
      botonAgregar.onclick = function () {
        //genero un nuevo producto para agregar al carrito, igual al que estamos agregando
        let nuevoPr = new Producto(nombre,precio,tipo,codigo,urlImg);
        agregarCarrito(nuevoPr);

        Toastify({
          text: nombre + " agregado!",
          duration: 3000,
          gravity: "bottom",
          position: "right",
          className: "tostada",
          style: { background: "#f9f5f0"},
          }).showToast();

      };
      contenedor.appendChild(botonAgregar);
      fragment.appendChild(contenedor);
    });
    //agrego el fragmento al contenedor.
    divCont.appendChild(fragment);
  }
//=====================================================================//
// Funciones que se llaman desde el script principal dependiendo la
// opcion que se haya seleccionado para ordenar los productos que se muestran
//=====================================================================//
  //funcion que ordena los productos alfabeticamente
  ordenarAlfabeticamente(){
    coleccion_mostrada = coleccion_mostrada.sort((a,b)=>{
      if(a.nombre > b.nombre){
        return 1;
      }
      if(a.nombre < b.nombre){
        return -1;
      }
      return 0;
    })
    //cargo en el dom la coleccion ordenada
    this.cargaDom(coleccion_mostrada);
  }

  //funcion que ordena los productos por precios de menor a mayor
  ordenarMenorprecio(){
    coleccion_mostrada = coleccion_mostrada.sort((a,b)=>{
      if(a.precio > b.precio){
        return 1;
      }
      if(a.precio < b.precio){
        return -1;
      }
      return 0;
    })
    //cargo en el dom la coleccion ordenada
    this.cargaDom(coleccion_mostrada);

  }
  //funcion que ordena los productos por precios de mayor a menor
  ordenarMayorprecio(){
    coleccion_mostrada = coleccion_mostrada.sort((a,b)=>{
      if(a.precio < b.precio){
        return 1;
      }
      if(a.precio > b.precio){
        return -1;
      }
      return 0;
    })
    //cargo en el dom la coleccion ordenada
    this.cargaDom(coleccion_mostrada);
  }

  //============================================================================//
  //Funciones que se llaman para filtrar los productos mostrados, en el script
  //inicial se llama a cada una de estas dependiendo que opcion eligio el usuario
  //============================================================================//
  filtrarTapiz(){
    coleccion_mostrada = coleccion_productos;
    coleccion_mostrada = coleccion_mostrada.filter(el => el.tipo == "Tapiz");
    this.cargaDom(coleccion_mostrada);
  }
  filtrarColgante(){
    coleccion_mostrada = coleccion_productos;
    coleccion_mostrada = coleccion_mostrada.filter(el => el.tipo == "Colgante");
    this.cargaDom(coleccion_mostrada);
  }
  filtrarMesa(){
    coleccion_mostrada = coleccion_productos;
    coleccion_mostrada = coleccion_mostrada.filter(el => el.tipo == "Mesa");
    this.cargaDom(coleccion_mostrada);
  }
  //si reseteamos los filtros se muestra nuevamente la coleccion original
  resetFiltros(){
    coleccion_mostrada = coleccion_productos;
    this.cargaDom(coleccion_mostrada);
  }
}

//==========================================================================================//
//                                    Funciones externas                                    //
//==========================================================================================//

//funcion para agregar al carrito
function agregarCarrito(elemento) {
  //revisamos si el producto ya se encuentra en el carrito
  let bandera = carrito.some((producto) => producto.codigo == elemento.codigo);

  if (bandera) {//si el producto esta en el carrito solo aumentamos su cantidad, los demas quedan igual
    const carritoActualizado = carrito.map((produ) => {
      if (produ.codigo == elemento.codigo) {
        produ.cantidad++;
        return produ;
      } else {
        return produ;
      }
    });
    carrito = carritoActualizado;
  } else {
    //si el producto no estaba en el carrito simplemente lo agregamos
    carrito.push(elemento);
  }
  totalProductos++;
  actualizarCarrito();
 
 
}

//Funcion que actualiza el carrito, lo guarda en el storage y muestra en el offcanvas
//el carrito actualizado.
function actualizarCarrito() {

  contenedorCarrito.innerHTML = "";
  localStorage.setItem("keyCarrito",JSON.stringify(carrito));//guardamos en storage

  carrito.forEach((producto) => {
    
    let contenedor = document.createElement("div");
    const { nombre, precio, tipo, codigo, urlImg, cantidad } = producto; //desestructuramos el elemento

    //generamos la card del producto a mostrar en el carrito
    contenedor.innerHTML = `<div class="row mb-3 justify-content-around">
                              <div class="col-7 p-3">
                                <h3 class="titulo_prod_carrito">${nombre}</h3>                             
                                <p class="descripcion_prod_carrito">Precio: $${precio}</p> 
                                <p class="descripcion_prod_carrito">Cantidad: ${cantidad}</p>
                              </div>
                              <div class="col-5">
                                <img src="../img/${urlImg}" alt="" class="imgCarrito">
                              </div>
                            </div>`;
    contenedor.className = "productoCarrito producto";

    
    
    let botonBorrar = document.createElement("button");
    
    botonBorrar.className = "boton boton_carrito";
    botonBorrar.innerHTML = "Borrar";

   botonBorrar.onclick = function () {
      Swal.fire({
        title: "Está seguro de eliminar el producto?",
        icon: "warning",
        showCancelButton: true,
        confirmButtonText: "Sí, borrar",
        cancelButtonText: "No, volver",
      }).then((result) => {
        if (result.isConfirmed) {
          //si se presiona borrar, elimina el producto del carrito
          contenedorCarrito.removeChild(contenedor);
          carrito = carrito.filter((el) => el.codigo != codigo);
          actualizarCarrito();
          Toastify({
            text: nombre+" borrado!",
            duration: 3000,
            gravity: "bottom",
            position: "right",
            style: { background: "red" },
          }).showToast();
          actualizarCarrito();
        } else {
          Toastify({
            text: "No se ha borrado nada",
            duration: 3000,
            gravity: "bottom",
            position: "right",
            style: { background: "green" },
          }).showToast();
        }
      });
    };
    
    contenedor.appendChild(botonBorrar);
    contenedorCarrito.appendChild(contenedor);
  });

  let total = carrito.reduce(
    (acumulador, el) => acumulador + el.precio * el.cantidad,
    0
  );
  let totalProductos = carrito.reduce(
    (acumulador, el) => acumulador + el.cantidad,
    0
  );

  badgeCarrito.innerHTML=totalProductos;
  cantProdu.textContent = "Cantidad de Items: "+ totalProductos;
  sumatoria.textContent = "Total: $" + total;

}