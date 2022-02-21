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

// Constantes GLOBALES formulario
const miArticulo = document.getElementById('articulo'),
    miDescripcion = document.getElementById('descripcion'),
    miPrecio = document.getElementById('precio'),
    miImagen = document.getElementById('imagen');

// Initialize Cloud Firestore through Firebase
firebase.initializeApp({
    apiKey: "AIzaSyC7IxVax8cZ5eLwEhlHE5leNVlX7TBUIQ0",
    authDomain: "firestorecrud-f8226.firebaseapp.com",
    projectId: "firestorecrud-f8226",
});

var db = firebase.firestore();

/**Donde Mostrar los Datos?? */
// En Una Tabla 
var table = document.getElementById('container-articulos');

/**<LEER ARTICULOS>*/

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

        /**La imagen se guarda con el url de un Tumbnail
         * Por eso hay que convertir la URl        */
        let urlBase = doc.data().imagen;
        // Separa la URL Base en un array
        let tokens = urlBase.split('/'); /**DIVIDE LA URL y su delimitador es */
        /**Elimina 'w_100,c_scale' del array*/
        tokens.splice(-3, 1); /**Elimina desde el final -3, elimina 1 y no inserta nada*/

        /**Une el contenido del array en uno nuevo*/
        let urlModificada= tokens.join('/');
        console.log('URL modif ->'+ urlModificada); /**URL extraida de la respuesta */
       
        table.innerHTML += `
        <div class="articulo">
        <div class="imagen-articulo"> <img src="${urlModificada}" alt="${doc.data().articulo}" class="imagen">
        </div>
        <div class="precio-articulo" id="precio">$ ${doc.data().precio}</div>
        <div class="nombre-articulo" id="articulo">${doc.data().articulo}</div>
        <div class="descripcion-articulo" id="descripcion">${doc.data().descripcion}</div>
    </div>       
        `
    });
});
