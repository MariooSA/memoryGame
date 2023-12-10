// contador para saber si es la primera carta ( de una pareja ) que pulsamos
let contador = 0;
// carta1 y carta2 almacena variables
let carta1;
let carta2;
// numeroAciertos para saber cuando hay que sacar el modal
let numeroAciertos = 0
let parejas = 3
// numeroFallos para imprimir por pantalla las parejas que quedan por descubrir
let numeroFallos = parejas
//permitirClick es para evitar clicks muy seguidos, se buguea
let permitirClick = true;

$(document).ready(function () {
    // inicializar un array de diccionarios con los valores de las tarjetas
    const cartas = [
        { id: 1, src: "https://icones.pro/wp-content/uploads/2021/06/symbole-github-gris.png", alt: "github" },
        { id: 2, src: "https://icones.pro/wp-content/uploads/2021/06/symbole-github-gris.png", alt: "github" },
        { id: 3, src: "https://cdn.icon-icons.com/icons2/792/PNG/512/TWITTER_icon-icons.com_65536.png", alt: "twitter" },
        { id: 4, src: "https://cdn.icon-icons.com/icons2/792/PNG/512/TWITTER_icon-icons.com_65536.png", alt: "twitter" },
        { id: 5, src: "https://cdn.icon-icons.com/icons2/792/PNG/512/INSTAGRAM_icon-icons.com_65535.png", alt: "instagram" },
        { id: 6, src: "https://cdn.icon-icons.com/icons2/792/PNG/512/INSTAGRAM_icon-icons.com_65535.png", alt: "instagram" }
    ];
    // barajar el array
    const cartasBarajadas = barajarArray(cartas);

    // bucle para generar las tarjetas del juego y añadirlas al tablero
    for (let i = 0; i < cartasBarajadas.length; i++) {
        const carta = cartasBarajadas[i];
        const cadaCarta = $('<div class="carta" data-id="' + carta.id + '"></div>');
        const caraDelante = $('<div class="cara delante"></div>');
        const caraDetras = $('<div class="cara detras"></div>');
        const img = $('<img src="' + carta.src + '" alt="' + carta.alt + '">');

        caraDetras.append(img);
        cadaCarta.append(caraDelante, caraDetras);
        $('#tablero').append(cadaCarta);
        actualizarNumeros()
    }
});

// función para mover posiciones de las cartas, devuelve el array
function barajarArray(ArrayCartas) {
    // iterar desde el último elemento hasta el primero en el array ( .length - 1, porque la ultima posicion del array siempre es la longitud - 1 )
    for (let i = ArrayCartas.length - 1; i > 0; i--) {
        // generar un índice aleatorio entre 0 e i ( la ultima posicion del array )
        let j = Math.floor(Math.random() * (i + 1));
        // intercambiar las cartas en las posiciones i y j
        [ArrayCartas[i], ArrayCartas[j]] = [ArrayCartas[j], ArrayCartas[i]];
    }
    // console.log(ArrayCartas)
    return ArrayCartas;
}
// al hacer click en una carta comprueba el contador, si es 0 es la primera carta que clickeamos, si es 1 es la segunda
// dar la vuelta a la carta que hacemos click
$("#tablero").on("click", ".carta", function () {
    if (permitirClick) {
        if (contador === 0) {
            console.log("Carta: " +contador)
            carta1 = $(this);
            $(this).css("transform", "rotateY(180deg)");
            contador++;
        } else {
            console.log("Carta: " +contador)
            carta2 = $(this);
            $(this).css("transform", "rotateY(180deg)");

            //desactiva los clicks para que no de la vuelta a mas cartas mientras se comprueba la pareja
            permitirClick = false;

            // comprobar si las dos cartas coinciden comprobando ids
            // si coincide suma 1 numeroAciertos, sino le da la vuelta otra vez
            if (
                (carta1.data("id") === 1 && carta2.data("id") === 2) ||
                (carta1.data("id") === 2 && carta2.data("id") === 1) ||
                (carta1.data("id") === 3 && carta2.data("id") === 4) ||
                (carta1.data("id") === 4 && carta2.data("id") === 3) ||
                (carta1.data("id") === 5 && carta2.data("id") === 6) ||
                (carta1.data("id") === 6 && carta2.data("id") === 5)
            ) {
                console.log("bien")
                numeroAciertos++
                numeroFallos = parejas - numeroAciertos
                actualizarNumeros();

                // permitir clics otra vez
                setTimeout(() => {
                    permitirClick = true;
                }, 550);

            } else {
                console.log("fallo")
                setTimeout(() => {
                    carta1.css("transform", "rotateY(0deg)");
                    carta2.css("transform", "rotateY(0deg)");
                    permitirClick = true;
                }, 1000);
            }

            contador--;
        }
    }
    // si hay 3 aciertos saca el modal
    if (numeroAciertos === parejas) {
        sacarModal()
    }
});

function sacarModal() {
    $("#modal").css("display", "flex");
}

// dar la vuelta a las cartas al reiniciar, reiniciar los aciertos y llamar a moverCartas
$(".reinicio").on("click", function () {
    $(".carta").css("transform", "rotateY(0deg)");
    $("#modal").css("display", "none");
    numeroAciertos = 0
    numeroFallos = parejas
    actualizarNumeros()
    // no llamo al metodo de barajar porque ya tenemos creadas las cartas, ahora solo tenemos que moverlas entre si
    // le pongo delay porque sino hace spoiler de las cartas antes de que se oculten
    setTimeout(moverCartas, 550);
});

function moverCartas() {
    let allCartas = $(".carta");
    
    // crear un array al que empujamos el contenido de allCartas, separando cada carta con el .each
    let cartasArray = [];
    allCartas.each(function () {
        cartasArray.push({
            html: $(this).html(),
            id: $(this).data("id")// coger por separado el id, porque al coger el html solo le coge el contenido de dentro de .carta
        });
    });
    // console.log(cartasArray)
    // barajar el array
    let nuevaPosicion = barajarArray(cartasArray);

    // asigna a cada carta antigua su nuevo valor despues de barajar
    // aqui es donde sustituye realmente una por otra
    allCartas.each(function (index) {
        $(this).html(nuevaPosicion[index].html);
        $(this).data("id", nuevaPosicion[index].id);
    });
}

//------- OTRO METODO DE MOVER LAS CARTAS AL REINICIAR --------//
//-------                TAMBIEN FUNCIONA              --------//
//-------                 ALGO MAS LARGO               --------//

// // intercambia una carta de posicion random con la que esta en la posicion i del array
// // llama a cambiarPosicion que es la que mueve realmente las cartas
// function moverCartas() {
//     let allCartas = $(".carta")
//     for (let cartaOriginal = 0; cartaOriginal < allCartas.length; cartaOriginal++) {
//         let numeroRandom = Math.floor(Math.random() * allCartas.length);// genera el indice random de a donde mover la carta i
//         let cartaRandom = allCartas.eq(numeroRandom);// la carta que se encuentra en el indice random
//         let cartaActual = allCartas.eq(cartaOriginal);// la carta que coincide con el indice del for
//         cambiarPosicion(cartaRandom, cartaActual);
//     }
// }

// // tiene una funcion similar a barajarArray
// function cambiarPosicion(carta1, carta2) {
//     // almacenar el contenido y el id de la carta que se va a mover
//     let contenidoCarta1 = carta1.html();
//     let IDCarta1 = carta1.data("id");

//     // poner el contenido de la carta2 en catra1
//     carta1.html(carta2.html());
//     carta1.data("id", carta2.data("id"));

//     // poner el contenido de carta1 en carta2
//     carta2.html(contenidoCarta1);
//     carta2.data("id", IDCarta1);
// }

// funcion para imprimir el numero de aciertos e incognitas que nos quedan
function actualizarNumeros() {
    $("#numAciertos").text(":" + numeroAciertos);
    $("#numFallos").text(":" + numeroFallos);
}