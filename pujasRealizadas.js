var listaPujas = [];

onload = () =>{
    tbody = document.querySelector("table").querySelector("tbody");
    listaPujas = JSON.parse(localStorage.getItem("pujasRealizadas"));
    pintarPujas(listaPujas);
}

function pintarPujas(lista){
    lista.forEach(ele => {
        let fila = document.createElement("tr");
        tbody.appendChild(fila);
        fila.className = "filaYate";
        fila.innerHTML += `
            <td><img src="./imagenes/${ele.Foto}" class="imagenMin"/></td>
            <td>${ele.fechaAviso}</td>
            <td>${ele.precioPuja}</td>
            <td>
                <p class="txtEliminar" onclick="eliminar(${ele.codigoYate})" id="${ele.codigoYate}">Eliminar</p>
                <p class="txtEditar" onclick="editarPuja(${ele.codigoYate})">Editar<input type="text" style="width:80px" id="inputCambiarPuja"/></p>
            </td>
        `;
    });
}

function eliminar(id) {
    //elimino la fila del yate que pulsamos
    document.querySelector(".filaYate").remove();
    //localizo el indice del yate para eliminarlo
    let indiceYate = listaPujas.findIndex(ele => ele.codigoYate == id);
    //lo elimino
    listaPujas.splice(indiceYate,1);
    //actualizo el localStorage
    localStorage.setItem("pujasRealizadas",JSON.stringify(listaPujas));
}

function editarPuja(id){
    //localizamos yate a editar
    let yate = listaPujas.find(ele => ele.codigoYate == id);
    let indexYate = listaPujas.findIndex(ele => ele.codigoYate == id);

    //recogemos valor del input
    let valorInput = document.querySelector("#inputCambiarPuja").value;
    if (valorInput != "") {
        yate.precioPuja = valorInput;
        // actulizo el locastorage con el nuevo dato cambiado
        localStorage.setItem("pujasRealizadas",JSON.stringify(listaPujas));

        document.querySelector(".filaYate").querySelectorAll("td")[2].innerHTML = valorInput;
        document.querySelector("#inputCambiarPuja").remove();
        document.querySelector(".txtEditar").removeEventListener("click",editarPuja);
        document.querySelector(".txtEditar").remove();
    }
}