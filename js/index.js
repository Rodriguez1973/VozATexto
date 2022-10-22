/*En estas variables seleccionamos las librerias en función del navegador utilizado*/
var SpeechRecognition = SpeechRecognition || webkitSpeechRecognition
var SpeechGrammarList = SpeechGrammarList || webkitSpeechGrammarList
var SpeechRecognitionEvent =
  SpeechRecognitionEvent || webkitSpeechRecognitionEvent

//Construcción de los objetos para el reconocimiento y reproducción de voz.
let reconocimiento = new SpeechRecognition() //Objeto que representa la interfaz del controlador para el servicio de reconocimiento de voz.
var listaReconocimientoPalabras = new SpeechGrammarList() //Objeto que representa una lista de palabras o patrones de palabras que queremos que reconozca el servicio de reconocimiento.
const discurso = new SpeechSynthesisUtterance() //Representa una solicitud de voz. Contiene el contenido que debe leer el servicio de voz e información sobre cómo leerlo (por ejemplo, idioma, tono y volumen).

/*Referencias a los botones y objetos del formulario.*/
const bInicio = document.getElementById('btnInicio') //Botón Comenzar.
const bParar = document.getElementById('btnParar') //Botón Terminar.
const textoTextArea = document.getElementById('texto') //Referencia <textarea id="texto">.
const bReproducir = document.getElementById('btnReproducir') //Botón Reproducir.
const bCancelar = document.getElementById('btnCancelar') //Botón cancelar reproducción.
const bReproducirPalabra = document.getElementById('btnReproducirPalabra') //Botón reproducir palabra.
const cajaTexto= document.getElementById('cajatexto') //Contenedor <div id="cajatexto">.
const palabraReproducir=document.getElementById('palabraReproducir') //Input <input id="palabraReproducir">.
let textoCajaTexto =cajaTexto.innerText //Texto dentro del <div id="cajatexto">.

/*Idioma inicialmente seleccionado*/
let idiomaSeleccionado = 'en-US'

//Añade el evento que se produce al cambio en el <select id="idioma">.
document.getElementById('idioma').addEventListener(
  'change',
  () => {
    //Valor de la <select id="idioma".
    let idioma = document.getElementById('idioma').value
    let texto = '' //Texto a procesar.
    //Español.
    if (idioma === 'es-ES') {
      //Cambia texto dentro del <div id="cajaTexto> a español.
      texto = document.getElementById('cajatexto').innerText =
        'Hace mucho , muchísimo tiempo , en el próspero pueblo de Hamelín , en Alemania , sucedió algo muy extraño : una mañana , cuando sus gordos y satisfechos habitantes salieron de sus casas , encontraron las calles invadidas por miles de ratones que merodeaban por todas partes , devorando con mucha ansia el grano de sus repletos graneros y la comida de sus bien provistas despensas . Nadie acertaba a comprender la causa de tal invasión , y lo que era aún peor , nadie sabía qué hacer para acabar con tan inquietante plaga de ratones . Por más que pretendían exterminarlos o , al menos , ahuyentarlos , tal parecía que cada vez acudían más y mas ratones a la ciudad. Tal era la cantidad de ratones que , día tras día , se adueñaban de las calles y de las casas , que hasta los mismos gatos huían asustados .'
    }

    //Inglés americano.
    if (idioma === 'en-US') {
      //Cambia texto dentro del <div id="cajaTexto> a inglés.
      texto = document.getElementById('cajatexto').innerText =
        'a long , long time ago , in the prosperous town of Hamelin , in Germany , something very strange happened : one morning , when its fat and satisfied inhabitants left their houses , they found the streets invaded by thousands of mice that were prowling everywhere , devouring eagerly for grain from their overflowing barns and food from their well stocked pantries . No one was able to understand the cause of such an invasion , and what was even worse, no one knew what to do to put an end to such a disturbing plague of mice . As much as they tried to exterminate them or , at least , chase them away , it seemed that more and more mice were coming to the city . such was the number of mice that , day after day , took over the streets and houses , that even the cats themselves fled in fear '
    }

    //Francés.
    if (idioma === 'fr-FR') {
      //Cambia texto dentro del <div id="cajaTexto> a francés.
      texto = document.getElementById('cajatexto').innerText =
        "Il y a très , très longtemps , dans la ville prospère de Hamelin , en Allemagne , quelque chose de très étrange s'est produit : un matin , alors que ses habitants gras et satisfaits quittaient leurs maisons , ils trouvèrent les rues envahies par des milliers de souris qui rôdaient partout , dévorant avec impatience le grain de leurs granges débordantes et la nourriture de leurs garde-manger bien garnis . Personne n'était capable de comprendre la cause d'une telle invasion , et ce qui était encore pire , personne ne savait quoi faire pour mettre un terme à un si inquiétant fléau de souris . Autant qu'ils essayaient de les exterminer ou , du moins , de les chasser , il semblait que de plus en plus de souris arrivaient dans la ville . Tel était le nombre de souris qui , jour après jour , envahissaient les rues et les maisons , que même les chats eux-mêmes s'enfuyaient de peur ."
    }
    //Establece el idioma seleccionado.
    idiomaSeleccionado=idioma
    //Establece el idioma seleccionado para el reconocimiento.
    reconocimiento.lang = idiomaSeleccionado;
    //Llamada a la función que crea la gramática que reconocerá.
    crearGramatica(texto)
  },
  false,
)

/*Añade el evento que se produce al click en el <button id="btnReproducir">*/
bReproducir.addEventListener(
  'click',
  () => {
    //Reproduce el texto dentro del div
    leerTexto(textoCajaTexto)
  },
  false,
)

reconocimiento.lang = idiomaSeleccionado //Establece el lenguaje del reconocimiento.
reconocimiento.continuous = true //Realiza el reconocimiento continuamente hasta que lo paremos.
reconocimiento.interimResults = false //No muestra los resultados intermedios del reconocimiento.

/*Evento onresult que se produce al recibir una entrada por el microfono*/
reconocimiento.onresult = (event) => {
  const resultados = event.results //Resultados del evento.
  console.log(resultados) //Muestra por consola los resultados obtenidos por la entrada de microfono.
  //Obtiene la transcripción del último reconocimiento.
  const frase = resultados[resultados.length - 1][0].transcript
  //Añade el texto al <textarea id="textoTextArea">
  textoTextArea.value += frase

  /*Resaltado del texto en función de si el reconocimiento coincide con el texto*/
  let palabras = frase.split(' ') //Array con las palabras del reconocimiento.
  let palabraBuscar = palabras[palabras.length - 1] //Última palabra.
  let informacion = textoCajaTexto.toLowerCase() //Texto dentro del <div id="cajatexto"> en minúculas.

  //Marcado en negrita de la palabra buscada.
  let expresionRegular=/palabraBuscar/ig
  let textoMarcado = informacion.replace(expresionRegular,'<b>' + palabraBuscar + '</b>')
  cajaTexto.innerHTML = textoMarcado    //Actualiza el contenedor.
  textoTextArea.value = palabraBuscar
}

//Evento onend del reconocimiento. Muestra mensaje por consola "Fin dictado".
reconocimiento.onend = (event) => {
  let mensaje = 'Fin de la grabación.'
  console.log(mensaje)
}

//Evento onerror del reconocimiento. Muestra error por consola.
reconocimiento.onerror = (event) => {
  let mensaje = 'Se ha producido un error.'
  leerTexto(mensaje)
  console.log('Error ' + event.error)
}

//Añade el evento click en el <button id="btnInicio">. Inicia el reconocimiento de voz.
bInicio.addEventListener(
  'click',
  () => {
    //Selecciona el mensaje a reproducir en función del idioma.
    switch (idiomaSeleccionado) {
      case 'es-ES':
        mensaje = 'Inicio de la grabación.'
        break
      case 'en-US':
        mensaje = 'Start of recording.'
        break
      case 'fr-FR':
        mensaje = "Début de l'enregistrement"
        break
    }
    //Reproduce el mensaje.
    leerTexto(mensaje)
    //Inicio del reconocimiento de voz.
    reconocimiento.start()
  },
  false,
)

/*Añade el evento click en el <button id='btnParar'>. Para el reconocimiento de voz.*/
bParar.addEventListener(
  'click',
  () => {
    //Selecciona el mensaje a reproducir en función del idioma.
    switch (idiomaSeleccionado) {
      case 'es-ES':
        mensaje = 'Fin de la grabación'
        break
      case 'en-US':
        mensaje = 'End of recording.'
        break
      case 'fr-FR':
        mensaje = "Fin d'enregistrement"
        break
    }
    //Reproduce el mensaje.
    leerTexto(mensaje)
    reconocimiento.abort()
  },
  false,
)

/*Funcion que lee el texto*/

function leerTexto(texto) {
  discurso.lang = idiomaSeleccionado //Establece el idioma de reproducción.
  discurso.text = texto //Establece el texto a reproducir
  discurso.volume = 1 //Establece el voluman al máximo.
  discurso.rate = 1 //Velocidad de habla.
  discurso.pitch = 1 //Tono de reproducción.
  window.speechSynthesis.speak(discurso) //Agrega el discurso a la cola de reproducción.
}

/*Añade el evento click en el <button id="btnCancelar">. Cancela la reproducción.*/
bCancelar.addEventListener(
  'click',
  () => {
    window.speechSynthesis.cancel()
  },
  false,
)

/*Añade el evento click en el <button id="btnReproducirPalabra">. Reproduce una palabra.*/
bReproducirPalabra.addEventListener(
  'click',
  () => {
    leerTexto(palabraReproducir.value)
  },
  false,
)

/*Añade el evento dblclick en el <button id="btnReproducirPalabra">. Reproduce una palabra.*/
cajaTexto.addEventListener('dblclick', () => {
    //Captura con doble click la palabra seleccionada y la reproduce.
    palabraReproducir.value = window.getSelection()
    leerTexto(palabraReproducir.value)
  },
  false,
)

/*Función que crea la gramática del texto*/
function crearGramatica(texto) {
  let palabrasTexto = texto.split(' ')  //Array con las palabras del contenedor.
  let arrayGramatica = []   //Array que contiene la gramática.
  //Recorre el array de palabrasTexto y si la palabra tiene mas de 2 caracteres la añade al array de gramática.  
  for (i = 0; i < palabrasTexto.length; i++) {
    if (palabrasTexto[i].length > 2) {
      arrayGramatica[i] = palabrasTexto[i]
      console.log(arrayGramatica[i])    //Muestra la palabra por la consola.
    }
  }
  
  let grammar = '#JSGF V1.0; grammar palabrasTexto; public <palabrasTexto> = ' + palabrasTexto.join(' | ') + ' ;'//Establece el string con la gramática.

  listaReconocimientoPalabras.addFromString(grammar, 1) //Toma una gramática presente en una cadena y la agrega al objeto SpeechGrammarList como un nuevo objeto SpeechGrammar.
  reconocimiento.grammars = listaReconocimientoPalabras //Establece una colección de objetos SpeechGrammar que representan las gramáticas que comprenderá el actual SpeechRecognition.
}