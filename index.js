listaYatesDisponibles = [];
listaYatesDisponibles = listaYates.filter((yate) => yate.Estado == "D");
onload = () => {
    //selecciono div donde va a ir la tabla de los yates
    let divPrincipal = document.querySelector("#principal");
    //creo la tabla
    let tabla = document.createElement("table");
    tabla.id = "tablaYates";
    divPrincipal.appendChild(tabla);
    //creo el tbody
    let tbody = document.createElement("tbody");
    tbody.id = "cuerpoTabla";
    tabla.appendChild(tbody);
    
    document
        .querySelector("#btnHacerPujas")
        .addEventListener("click", ValidarDatosPuja);

    pintarYates(listaYatesDisponibles);

    document.querySelector("#btnVerMas").addEventListener("click", verMas);
    document
        .querySelector("#btnVerMasCaro")
        .addEventListener("click", verMasCaro);

    document
        .querySelector("#btnOrdenarPorDescripcion")
        .addEventListener("click", ordernarPorDesc);

    document.querySelectorAll("a")[1].addEventListener("click", () => {
        location.href = "./pujasRealizadas.html";
    });
};

//variable auxiliar para controlar la longitud de los elementos a pintar
var indiceAux = 4;
function pintarYates(lista) {
    cuerpoTabla = document.querySelector("#cuerpoTabla");
    //creo la fila
    let fila = document.createElement("tr");
    cuerpoTabla.appendChild(fila);
    lista.slice(0, indiceAux).forEach((yate) => {
        fila.innerHTML += `
            <td>
                <img class="imagenMin" src="/imagenes/${yate.Foto}"/>
                <p onclick="verDetalle(${yate.Codigo})" id="${yate.Codigo}">Ver detalle</p>
                <p>${yate.FechaCierrePuja}</p>
                <p>${yate.PrecioMinimo}</p>
                <p>Puja: <input type="text" id="${yate.Codigo}" style="width:100px"></input></p>
            </td>
                `;
    });
}

function verMas() {
    //condicionamos para controlar que si pintamos mas de los elementos que hay nos muestre mensaje
    if (indiceAux <= listaYatesDisponibles.length) {
        pintarYates(listaYatesDisponibles.slice(indiceAux, indiceAux + 4));
        indiceAux += 4;
    } else {
        alert("No hay mas yates");
    }
}

function verDetalle(id_yate) {
    //localizamos el objeto donde hemos click para guadarlo en una variable
    let datosYate = listaYatesDisponibles.find(
        (yate) => yate.Codigo == id_yate
    );
    //compruebo si ya hay pintado uno pues lo elimino para no pintar otro cada vez que se hace click
    if ((div = document.getElementById("divDatos"))) {
        div.remove();
    }

    let divDatosYate = document.createElement("div");
    divDatosYate.id = "divDatos";
    document.querySelector("#principal").appendChild(divDatosYate);
    divDatosYate.className = "centrado";
    divDatosYate.innerHTML = `
        <p style="text-align:center;cursor:pointer" onclick="cerrarDivDatos(${divDatosYate.id})">X</p>
        <img class="imagenMax" src="/imagenes/${datosYate.Foto}"/>
        <p>${datosYate.Descripcion}</p>
        <p>${datosYate.FechaCierrePuja}</p>
        <p>${datosYate.PrecioMinimo}</p>
        `;
}

function cerrarDivDatos(e) {
    document.querySelector(`#${e.id}`).remove();
}

function verMasCaro() {
    //guardamos el yate mas caro
    let yateMasCaro = listaYatesDisponibles.sort(
        (a, b) => b.PrecioMinimo - a.PrecioMinimo
    )[0];
    //gurdamos el id del yate
    let codigoYate = yateMasCaro.Codigo;
    //llamamos a la funcion verDetalle para pintar los datos
    verDetalle(codigoYate);
}

function ordernarPorDesc() {
    document.getElementById("tablaYates").remove();
    listaOrdenadaAZ = listaYatesDisponibles.sort((a, b) => {
        if (a.Descripcion > b.Descripcion) {
            return -1;
        }
        if (a.Descripcion < b.Descripcion) {
            return 1;
        }
        return 0;
    });
    pintarYates(listaOrdenadaAZ);
}

function ValidarDatosPuja() {
    //variable que funciona como flag
    let error = [];

    //validamos que uno de los radios este seleccionado
    let nodeListRadios = document.getElementsByName("tipo");
    if (
        !nodeListRadios[0].checked &&
        !nodeListRadios[1].checked &&
        !nodeListRadios[2].checked
    ) {
        error.push("seleccione tipo");
    }

    //validamos puerto de recogida "Valencia","Barcelona","Ibiza","Bilbao","Sagunto","Ferrol","Santander","Vigo","Ferrol"
    var listaPuertos = [
        "valencia",
        "barcelona",
        "ibiza",
        "bilbao",
        "sagunto",
        "ferrol",
        "santander",
        "vigo",
        "ferrol",
    ];

    //nombre del puerto escrito por el usuario
    nombrePuerto = document.querySelector("#txtPuerto");
    nombrePuerto = nombrePuerto.value.trim().toLowerCase();

    if (listaPuertos.includes(nombrePuerto) == false) {
        error.push("inserte un puerto valido");
    }

    //validamos fecha - En “Fecha aviso” debe haber una fecha valida posterior a la fecha del sistema en al menos 2 días.
    let regexFecha = /^[0-9]{2}[\/]{1}[0-9]{2}[\/]{1}[0-9]{4}$/;
    let inputFecha = document.querySelector(".fecha").value;
    if (inputFecha == "") {
        error.push("campo fecha vacio");
    } else {
        if (!regexFecha.test(inputFecha)) {
            error.push("formato fecha invalida");
        } else {
            //fecha actual la divido para convertirla en objeto fecha
            inputFecha = inputFecha.split("/");
            fechaCliente = inputFecha[0] + "/" + inputFecha[1] + "/" + inputFecha[2];
            //convierto la fecha a un objeto fecha para luego comparar
            fechaUsuario = new Date(
                parseInt(inputFecha[2]),
                parseInt(inputFecha[1] - 1),
                parseInt(inputFecha[0])
            );
            let fechaActual = new Date();
            //dia introducido por el usuario
            let diaFechaUsuario = fechaUsuario.getDate();
            //dia de la fecha actual
            let diaActual = fechaActual.getDate();
            //comprobamos que el dia introducido sea 2 dias mas que la fecha actual
            if (diaFechaUsuario < diaActual + 2) {
                error.push(
                    "la fecha introducida tiene que ser 2 dias mas a la actual"
                );
            }
        }
    }

    //validamos formato tarjeta
    inputTarjeta = document.querySelector(".tarjeta").value;
    let regexTarjeta = /^[A-Z]{3}[-][0-9]{5}$/;
    if (!regexTarjeta.test(inputTarjeta)) {
        error.push("formato tarjeta invalida");
    }

    if (error.length > 0) {
        console.log(error);
    } else {
        console.log("no hay errores en el formulario");
        guardarDatosPuja(fechaCliente, nombrePuerto, inputTarjeta);
    }
}

// Pujas: de cada puja que haga el usuario se debe almacenar:
// o Código del yate
// o Precio de la Puja (precio puesto por el usuario para ese yate)
// o Puerto de recogida (puerto en el que se va a recoger el yate en caso de ganar)
// o Tarjeta de pago (tarjeta con la que se pagará la puja)
// o Fecha de aviso

listaPujas = [];
function guardarDatosPuja(fecha, puerto, tarjeta) {
    //cojo los valores de los inputs puja
    let inputsPuja = document
        .querySelector("#tablaYates")
        .querySelectorAll("input");
    
    for (let i = 0; i < inputsPuja.length; i++) {
        if (inputsPuja[i].value != "") {
            let yate = listaYatesDisponibles.find(ele => ele.Codigo == inputsPuja[i].id )
            if (inputsPuja[i].value > yate.PrecioMinimo) {
                // objeto puja
                let nuevaPuja = {
                    codigoYate: yate.Codigo,
                    precioPuja: inputsPuja[i].value,
                    puertoRecogida: puerto,
                    tarjetaPago: tarjeta,
                    fechaAviso: fecha,
                    Foto: yate.Foto
                };
                listaPujas.push(nuevaPuja);
                localStorage.setItem("pujasRealizadas",JSON.stringify(listaPujas));
            }
        };
    }
}
