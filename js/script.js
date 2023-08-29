/* Script inicial que inicializa el generador y carga todo cuando se carga el sitio */
/* =============== variables globales ================= */
let coleccion_productos = []; //array que contrendra todos los productos del JSON, este no lo vamos a cambiar para siempre tener guardada la lista original
let coleccion_mostrada = []; //array que vamos a usar para filtrar y ordenar, inicialmente contendra lo mismo que coleccion_productos
let carrito = [];
let DateTime = luxon.DateTime;
let divCont = document.getElementById("divcontenedor"); //este es el contenedor que tendra todos los productos mostrados
let contenedorCarrito = document.getElementById("carritoBody"); //este es el contenedor que tendra los productos del CARRITO
let fechaAcceso = document.getElementById("fechaAcceso");
let btnOrdenar = document.getElementById("btnOrdenar");
let btnFiltrar = document.getElementById("btnFiltrar");
let btnReset = document.getElementById("btnReset");
let sumatoria = document.getElementById("sumatoria");//sumatoria del total de la compra
let cantProdu = document.getElementById("cantProdu");//cantidad de items ene l carrito
let badgeCarrito = document.getElementById("badgeCarrito");
let btnVaciar = document.getElementById("vaciarCarrito");
let btnComprar = document.getElementById("comprarCarrito");
const url = '../js/db.json';
let totalProductos = 0;
/* ===================================================== */

/* =============== Logica del codigo ================= */
document.addEventListener("DOMContentLoaded", () => {
  let guardados = [];

  //Funcion Asincronica que carga los productos desde el archivo json
  const cargarBase = async () => {
    const resp = await fetch(url);
    guardados = await resp.json();
    guardados.forEach((elemento) => {
      //lo primero que hacemos es guardar en coleccion_productos todos los elementos del archivo json
      const { nombre, precio, tipo, codigo, urlImg } = elemento; //desestructuramos el elemento
      let nuevoProdu = new Producto(nombre, precio, tipo, codigo, urlImg);
      coleccion_productos.push(nuevoProdu);
    });

    //cargo la fecha de ultimo acceso
    let fecha = JSON.parse(localStorage.getItem("fechaAcc")) || "";
    if (fecha != "") {
      fechaAcceso.innerText = "Ultimo Acceso: " + fecha;
      let fechaNueva = DateTime.now();
      //actualiza la hora de ultimo acceso como la de hoy, para mostrarla la proxima vez
      localStorage.setItem(
        "fechaAcc",
        JSON.stringify(fechaNueva.toLocaleString())
      );
    } else {
      //si es la primera vez que se ingresa muestra como ultimo acceso la fecha actual
      let fechaNueva = DateTime.now();
      fechaAcceso.innerText = "Ultimo Acceso: " + fechaNueva.toLocaleString();
      localStorage.setItem(
        "fechaAcc",
        JSON.stringify(fechaNueva.toLocaleString())
      );
    }

    //inicializamos el gestor de productos
    let gestor = new GestorProductos();
    gestor.iniciar();

    //asignamos el evento al boton que ordena, dependiendo que opcion fue seleccionada
    //llama a las distintas funciones del gestor
    btnOrdenar.onclick = function () {
      if (document.querySelector("#alfabeticamente").checked) {
        gestor.ordenarAlfabeticamente();
      } else {
        if (document.querySelector("#menorPrecio").checked) {
          gestor.ordenarMenorprecio();
        } else {
          if (document.querySelector("#mayorPrecio").checked) {
            gestor.ordenarMayorprecio();
          }
        }
      }
    };

    //asignamos el evento al boton que filtra, dependiendo que opcion fue seleccionada
    //llama a las distintas funciones del gestor
    btnFiltrar.onclick = function () {
      if (document.querySelector("#tapizFiltro").checked) {
        gestor.filtrarTapiz();
      } else {
        if (document.querySelector("#colganteFiltro").checked) {
          gestor.filtrarColgante();
        } else {
          if (document.querySelector("#mesaFiltro").checked) {
            gestor.filtrarMesa();
          }
        }
      }
    };
    //Boton que resetea los el filtrado y el orden y vuelve a mostrar la coleccion original
    btnReset.onclick = function (){
      gestor.resetFiltros();
    }
  };

  cargarBase();
});


