if ("loading" in HTMLImageElement.prototype) {
    // Si el navegador soporta lazy-load, tomamos todas las imágenes que tienen la clase
    // `lazyload`, obtenemos el valor de su atributo `data-src` y lo inyectamos en el `src`.
    const images = document.querySelectorAll("img.lazyload");
    images.forEach((img) => {
        img.src = img.dataset.src;
    });
    // Muestra mensaje
    console.log("El navegador soporta `lazy-loading`...");
} else {
    // Importamos dinámicamente la libreria `lazysizes`
    let script = document.createElement("script");
    script.async = true;
    script.src =
        "https://cdnjs.cloudflare.com/ajax/libs/lazysizes/5.2.0/lazysizes.min.js";
    document.body.appendChild(script);
    console.log("Lazi loading no soportado, incorpora Libreria lazysizes.min.js");
}

/// Inicializar CLOUDINARI para la carga de imagenes.
const cloudName = 'muchosregistros';      // Mi cuenta
const unsignedUploadPreset = 'bbisdqo0';  // Mi almacen publico

// URL que invoca el recuadro para elegir la imagen de INPUT de abajo
var fileSelect = document.getElementById("fileSelect");
// Es el INPUT de tipo file para cargar un archivo
var fileElem = document.getElementById("fileElem");

/**Texto de los botones*/
const addToList = 'Agregar a la lista';
const cancel = 'Cancelar';

// Constantes GLOBALES formulario
const miArticulo = document.getElementById('articulo'),
    miDescripcion = document.getElementById('descripcion'),
    miPrecio = document.getElementById('precio'),
    miImagen = document.getElementById('imagen');

const form = document.getElementById('form'),
    miBoton = document.getElementById('boton');

/**Imagen por default en el fomulario */
const urlImagenDefault = 'https://res.cloudinary.com/muchosregistros/image/upload/w_100,c_scale/v1644423533/hyfqmzt4ppv3awfbuo0e.png';

// Initialize Cloud Firestore through Firebase
firebase.initializeApp({
    apiKey: "AIzaSyC7IxVax8cZ5eLwEhlHE5leNVlX7TBUIQ0",
    authDomain: "firestorecrud-f8226.firebaseapp.com",
    projectId: "firestorecrud-f8226",
});

var db = firebase.firestore();

//Controla la accion del boton enviar
// controlar Funcion Submit del formulario
form.addEventListener('submit', (e) => {
    e.preventDefault();
    guardarOrCancelar();
});

form.addEventListener('change', (event) => {
    console.log("Hubo cambios");

    if (checkInputs() === true) {
        console.log("campos Vacios");
        setSubmitDisable(miBoton);
    } else {
        console.log("Sin campos vacios");
        setSubmitEnable(miBoton);
    }
})


// ACTIVA / DESACTIVA Boton enviar
setSubmitDisable(miBoton);

function setSubmitDisable(boton) {
    boton.disabled = true;
    const botonControl = boton.parentElement;  // .form-control
    //Agrega la clase del boton Inactivo
    botonControl.className = 'inactivo enviar';
}
function setSubmitEnable(boton) {
    boton.disabled = false;
    const botonControl = boton.parentElement;  // .form-control
    //Agrega la clase del boton Inactivo
    botonControl.className = ' enviar';
}

//Agrega Imagen por default al Formulario
setImagenPorDefault(urlImagenDefault);

/**Carga una imagen por default para un producto*/
function setImagenPorDefault(url) {
    // Coloca Url por default
    document.getElementById('imagen').value = url;
    // Agrega Imagen por default a la galeria 
    let imgDefault = new Image(); // HTML5 Constructor
    imgDefault.src = url;  /**Asigna el nuevo URL reconfigurado con escala*/
    imgDefault.alt = 'Imagen de articulo por default';  /**Por si no se muestra la imagen*/
    document.getElementById('gallery').appendChild(imgDefault); /**Agrega a la Galeria la imagen recien creada*/
}

// Devuelve TRUE si hay un error y FALSE si no lo hay.
function checkInputs() {
    // Obtiene el contenido de los inputs
    const articuloValue = miArticulo.value.trim(),
        descripcionValue = miDescripcion.value.trim(),
        precioValue = miPrecio.value.trim();

    let haveAnError = false;

    if (articuloValue === '') {
        haveAnError = true;
    }
    if (descripcionValue === '') {
        haveAnError = true;
    }
    if (precioValue === '') {
        haveAnError = true;
    }
    return haveAnError;
}

// GUARDA o CANCELA segun el Texto que Tenga.
function guardarOrCancelar() {  /// Esta podria ir dentro de la funcion Guardar
    let texto = document.getElementById('boton').innerHTML;

    switch (texto) {
        case cancel:
            //Limpia el Formulario
            resetFormulario();
            // Suprime el boton de Guardar cambios               
            document.getElementById('guardar-edicion').style.display = 'none';
            break;
        case addToList:
            //Valida los campos y escribe en Firebase mediante guardar()
            if (checkInputs() === false) {
                console.log('No hubo errores, envia los datos');
                guardar();
                //  resetFormulario();
            } else {
                console.log('Hubo errores, no envies los datos');
            }
            break;
        default:
            //Declaraciones ejecutadas cuando ninguno de los valores coincide con el valor de la expresión
            console.log('Ningun texto coincide');
            document.getElementById('boton').innerHTML = addToList;
            break;
    }
}

/**Estilos del Campo de Texto*/
function setInicialFor(input) {
    const formControl = input.parentElement;  // .form-control
    // Agrega la clase por defecto o inicial
    formControl.className = 'form-control inicial';
}
function setErrorFor(input, message) {
    const formControl = input.parentElement;  // .form-control
    const small = formControl.querySelector('small');
    small.innerText = message;
    // Modifica la clase del elemento 
    formControl.className = 'form-control error';
}
function setSuccessFor(input) {
    const formControl = input.parentElement;  // .form-control
    // Agrega la clase error
    formControl.className = 'form-control success';
}

// Activa estilo EXITO / ERROR para campo vacio
function aplicaEstiloAlInput(input) {
    let nombreMayus = input.id.toString().toUpperCase();
    if (input.value.trim() === '') {
        setErrorFor(input, nombreMayus + ' no puede quedar vacio');
    } else {
        setSuccessFor(input);
    }
}

/**Accion GANA / PIERDE Focus un Campo*/
miArticulo.addEventListener('focusin', (event) => {
    event.target.style.background = 'paleturquoise';
});
miDescripcion.addEventListener('focusin', (event) => {
    event.target.style.background = 'paleturquoise';
});
miPrecio.addEventListener('focusin', (event) => {
    event.target.style.background = 'paleturquoise';
});

miArticulo.addEventListener('focusout', (event) => {
    event.target.style.background = '';
    aplicaEstiloAlInput(event.target);
});
miDescripcion.addEventListener('focusout', (event) => {
    event.target.style.background = '';
    aplicaEstiloAlInput(event.target);
});
miPrecio.addEventListener('focusout', (event) => {
    event.target.style.background = '';
    aplicaEstiloAlInput(event.target);
});

/**Toma la imagen que se carga la procesa y reduce su pixelaje*/
function processRedimencionaUploadImagen(file) {
    // referencia el input donde carga la imagen
    // const file = document.querySelector("#upload").files[0];
    /**Crea un Lector de archivos*/
    const reader = new FileReader();
    // SI el input esta vacio finaliza la funcion
    if (!file) {
        console.log("No se ha seleccionado ninguna Imagen");
        return
    };
    /**readAsDataURL es usado para leer el contenido del especificado Blob o File */
    reader.readAsDataURL(file);
    /*FileReader: load event-->The event is fired when a file has been read successfully.load**/
    reader.onload = function (event) {
        /**Crea un nuevo elemento tipo imagen*/
        const imgElement = document.createElement("img");
        /**Le asigna una fuente a la iamgen*/
        imgElement.src = event.target.result;
        /**result en  readAsDataURL() -> Es una cadena con una URL que 
         * representa los datos del archivo. result data: */
        /**VISUAL*///        document.querySelector("#input").src = event.target.result;

        /*FileReader: load event-->The event is fired when a file has been read successfully.load**/
        imgElement.onload = function (e) {
            /**La etiqueta HTML5 <canvas> se utiliza para 
             * dibujar gráficos, sobre la marcha, con JavaScript.*/
            const canvas = document.createElement("canvas");
            // Ancho que ha de tener el grafico a crear
            const MAX_WIDTH = 400;
            /**Tamaño de la escala es  400px / 1200px = 1*(400)/3(400) = 1/3 = ratio Compresor 66%  */
            const scaleSize = MAX_WIDTH / e.target.width;
            /**Al grafico Canva le asigna el ancho que le indicamos*/
            canvas.width = MAX_WIDTH;
            /**Al alto del grafico le asignamos el alto original multiplicado por la escala*/
            /**Ejemplo Original Height 900 Canva.height = 900*1/3 = 900/1*1/3 = 900/3 = 300*/
            /**Esto mantiene simpre la relacion*/
            canvas.height = e.target.height * scaleSize;

            /**canvas CanvasElement.getContext() retorna un contexto de dibujo en el lienzo,
             *  o null si el identificador del contexto no está soportado.*/
            /**"2d", dando lugar a la creación de un objeto CanvasRenderingContext2D 
             * que representa un contexto de renderizado de dos dimensiones. */
            const ctx = canvas.getContext("2d");
            /**Aqui dibuja la imagen => void ctx.drawImage(image, dx, dy, dWidth, dHeight);*/
            ctx.drawImage(e.target, 0, 0, canvas.width, canvas.height);
            /**Con la informacion codificada crea la ruta de la imagen resultado */
            const srcEncoded = ctx.canvas.toDataURL(e.target, "image/jpeg");
            /**Agrega la imagen creada al div con id output*/
            /**VISUAL*///   document.querySelector("#output").src = srcEncoded;
            /**Imprime la ruta de la imagen resultado*/
            console.log(srcEncoded);
            // regresa la imagen reducida a 400 de ancho
            //return srcEncoded;
            uploadFile(srcEncoded);
        };
    };
};


/**Como se precarga la imagen que va a Cloudinary*/
/**SELECCION DE IMAGEN*/
/** Pasos
 *  1. Al hacer Click en el Link "Elige imagen" invoca funcion(e) anonima
 *  2. La funcion anonima evalua si existe la variable "fileElem" 
 *  3. fileElem es la invocacion  de un input de tipo archivo que esta oculto
 *  4. Al existir fileElem la funcion simula un Click en el campo y despliega 
 *     la ventana para elegir.   
 */
fileSelect.addEventListener("click", function (e) {
    if (fileElem) {
        fileElem.click();
    }
    e.preventDefault(); // prevent navigation to "#"
}, false);

/**Se invoca desde el campo tipo FILE al percibir un cambio*/
// *********** Handle selected files ******************** //
var manejarFiles = function (files) {
    for (var i = 0; i < files.length; i++) {
        processRedimencionaUploadImagen(files[i]);
    }
};
//Ya no se usa pero es Util
/**Carga la imagen con la resolucion Original*/
var handleFiles = function (files) {
    for (var i = 0; i < files.length; i++) {
        uploadFile(files[i]); // call the function to upload the file
    }
};

// *********** Upload file to Cloudinary ******************** //
function uploadFile(file) {
    var url = `https://api.cloudinary.com/v1_1/${cloudName}/upload`;
    var xhr = new XMLHttpRequest();
    var fd = new FormData();
    xhr.open('POST', url, true);
    xhr.setRequestHeader('X-Requested-With', 'XMLHttpRequest');

    /**Limpia de la Galeria la Imagen Anterior*/
    document.getElementById('gallery').innerHTML = '';
    // Reset the upload progress bar
    document.getElementById('progress').style.width = 0;

    // Update progress (can be used to show progress indicator)
    xhr.upload.addEventListener("progress", function (e) {

        document.getElementById('porcentaje').innerHTML = ``; /*Resetea el porcentaje*/
        /**Calcula el progeso de la carga*/
        var progress = Math.round((e.loaded * 100.0) / e.total);
        /**Incrementa el ancho del progreso*/
        document.getElementById('progress').style.width = progress + "%";

        /**Crea y agrega la etiqueta que contiene el avance en Numero*/
        var newLabel = document.createElement('label');
        newLabel.innerHTML = `${progress} %`;
        document.getElementById('porcentaje').appendChild(newLabel);

        console.log(`fileuploadprogress data.loaded: ${e.loaded},
  data.total: ${e.total}`);

        console.log(progress);
        if (progress === 100) {
            /**Cambia de color al finalizar la carga*/
            document.getElementById('progress').style.background = "lime";
        }

    });

    /**Area barra de progreso*/
    xhr.onreadystatechange = function (e) {
        if (xhr.readyState == 4 && xhr.status == 200) {
            // File uploaded successfully
            var response = JSON.parse(xhr.responseText);
            // https://res.cloudinary.com/cloudName/image/upload/v1483481128/public_id.jpg

            /**Extrae la URL del JSON respuesta*/
            var url = response.secure_url;
            console.log(url); /**URL extraida de la respuesta */
            
            // Create a thumbnail of the uploaded image, with 150px width
            var tokens = url.split('/'); /**DIVIDE LA URL y su delimitador es */

            console.log(tokens); /**Arreglo de strings con el resultado de la division. */

            tokens.splice(-2, 0, 'w_100,c_scale'); /**Inserta elemento dos posiciones antes ultimo*/
            // w=width y h=height --> 150=150 px                 

            var img = new Image(); // HTML5 Constructor
            img.src = tokens.join('/');  /**Asigna el nuevo URL reconfigurado con escala*/
            img.alt = response.public_id;  /**Por si no se muestra la imagen*/

            document.getElementById('gallery').appendChild(img); /**Agrega a la Galeria la imagen recien creada*/

            // Agregar url del Thumbnail al formulario
            document.getElementById('imagen').value = img.src;
           // document.getElementById('imagen').value = url;

            console.log(img.src);

            /**Muestra la opcion para cambiar Imagen*/
            document.getElementById('fileSelect').innerHTML = 'Cambiar imagen';
        }
    };

    fd.append('upload_preset', unsignedUploadPreset);
    fd.append('tags', 'browser_upload'); // Optional - add tag for image admin in Cloudinary
    fd.append('file', file);
    xhr.send(fd);
} // Fin de upload FILE

// Agregar documentos
function guardar() {
    //Almacena contenido de los campos
    var articulo = document.getElementById('articulo').value,
        descripcion = document.getElementById('descripcion').value,
        precio = document.getElementById('precio').value,
        imagen = document.getElementById('imagen').value;
    //Calcula fecha y hora Actual para registrar hora de creacion
    let timeStamp = new Date(Date.now());

    db.collection("articulos").add({
        articulo: articulo,
        descripcion: descripcion,
        precio: precio,
        imagen: imagen,
        fechaHoraCreacion: timeStamp,
        fechaHoraModificacion: timeStamp,

    })
        .then((docRef) => {
            console.log("Document written with ID: ", docRef.id);
            //Restaura el formulario
            resetFormulario();
        })
        .catch((error) => {
            console.error("Error adding document: ", error);
        });
}

/**Donde Mostrar los Datos?? */
// En Una Tabla 
var table = document.getElementById('table');

// LEE Documentos de Firebase
//  Visualizacion en Tiempo Real
/** Traer datos Una sola vez => Get()
 *  Leer Cambios y mostrarlos => onSnapshot
 * Remplaza get()  por onSnapshot()
 * Se Elimina .get().then((querySnapshot)...) y queda .onSnapshot((querySnapshot)...) 
 */

let comprasRef = db.collection("articulos");
comprasRef.orderBy("fechaHoraModificacion", "desc").onSnapshot((querySnapshot) => {
    table.innerHTML = "";
    querySnapshot.forEach((doc) => {
        console.log(`${doc.id} => ${doc.data().fechaHora}`);
        table.innerHTML += `
        <tr>
        <td>${doc.data().articulo}</td>
        <td>${doc.data().descripcion}</td>
        <td>${doc.data().precio}</td>
        </tr>
        <tr>
        <td><img src="${doc.data().imagen}" alt="${doc.data().imagen}"></td>
        <td><button class="btn btn-warning" onclick="editar('${doc.id}','${doc.data().articulo}','${doc.data().descripcion}','${doc.data().precio}','${doc.data().imagen}')">Editar</button></td>
        <td><button class="btn btn-danger" onclick="eliminar('${doc.id}')">Eliminar</button></td>
        </tr>
        <tr></tr>        
        <tr></tr>                
        `
    });
});

// BORRAR documentos
function eliminar(id) {
    db.collection("articulos").doc(id).delete().then(() => {
        console.log("Document successfully deleted!");
    }).catch((error) => {
        console.error("Error removing document: ", error);
    });
}

// EDITAR documento
function editar(id, articulo, cantidad, nota, imagen) {
    /**Activa el Boton de GUARDAR / CANCELAR*/
    setSubmitEnable(miBoton);
    //Limpia la galeria de la imagen por default
    limpiaGaleria();
    // Escribe en los campos los valores del renglon seleccionado
    document.getElementById('articulo').value = articulo;
    document.getElementById('descripcion').value = cantidad;
    document.getElementById('precio').value = nota;
    document.getElementById('imagen').value = imagen;
    // Muestra la imagen en Galery para que pueda ser editada.
    var img = new Image(); // HTML5 Constructor
    img.src = imagen;  /**Asigna el nuevo URL reconfigurado con escala*/
    img.alt = imagen;  /**Por si no se muestra la imagen*/
    document.getElementById('gallery').appendChild(img); /**Agrega a la Galeria la imagen recien creada*/

    //Edita el texto del boton
    document.getElementById('boton').innerHTML = cancel;

    /**Cambia el Texto por si el User quiere cambiar la imagen */
    document.getElementById('fileSelect').innerHTML = 'Cambiar imagen';

    var btnGuardarEdicion = document.getElementById('guardar-edicion');
    btnGuardarEdicion.style.display = 'unset';
    // Crea una funcion anonima para ejecutar cuando se haga click

    btnGuardarEdicion.onclick = function () {
        // El ID no va a cambiar
        let compraRef = db.collection("articulos").doc(id);
        // Capturar los cambios realizados en los campos
        let articuloEditado = document.getElementById('articulo').value,
            descripcionEditada = document.getElementById('descripcion').value,
            precioEditado = document.getElementById('precio').value,
            imagenEditada = document.getElementById('imagen').value;
        // Calcula la fecha y hora actual del cambio 
        let timeStamp = new Date(Date.now());

        // Actualiza los cambios
        return compraRef.update({
            articulo: articuloEditado,
            descripcion: descripcionEditada,
            precio: precioEditado,
            imagen: imagenEditada,
            fechaHoraModificacion: timeStamp,
        })
            .then(() => {
                console.log("Document successfully updated!");
                //Limpia el formulario
                resetFormulario();
                //Oculta Boton Edicion
                btnGuardarEdicion.style.display = 'none';
            })
            .catch((error) => {
                // The document probably doesn't exist.
                console.error("Error updating document: ", error);
            });
    }
}

function resetFormulario() {
    // Si exito Regresa al boton su texto original
    document.getElementById('boton').innerHTML = addToList;
    // Limpia los campos
    document.getElementById('articulo').value = '';
    document.getElementById('descripcion').value = '';
    document.getElementById('precio').value = '';
    document.getElementById('imagen').value = '';

    /**Limpia la Galeria*/
    limpiaGaleria();
    /**Resetea la barra de progreso*/
    document.getElementById('progress').style.width = 0;
    /**Borra el porcentaje en numero*/
    document.getElementById('porcentaje').innerHTML = '';
    // Regresa el texto original
    document.getElementById('fileSelect').innerHTML = 'Elije una imagen';
    //Restablece la imagen Por Default
    setImagenPorDefault(urlImagenDefault);
    /**Deshabilita el Boton */
    setSubmitDisable(miBoton);
}

function limpiaGaleria() {
    document.getElementById('gallery').innerHTML = '';
}

form.addEventListener('submit', () => {
    console.log('El formulario ha sido enviado');
    resetValidaciones();
});

function resetValidaciones() {
    /**Uso constantes iniciales
     * const miArticulo = document.getElementById('articulo')*/
    setInicialFor(miArticulo, 'Nombre del articulo no puede quedar vacio');
    setInicialFor(miDescripcion, 'Nombre del articulo no puede quedar vacio');
    setInicialFor(miPrecio, 'Nombre del articulo no puede quedar vacio');
}

