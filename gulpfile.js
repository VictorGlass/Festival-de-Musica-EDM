//WorkFlow.
//Funciones Utiles.

const { src, dest, watch, parallel} = require('gulp');

//Dependencias de CSS a SASS.
const sass = require('gulp-sass')(require('sass'));
const plumber = require('gulp-plumber');
//
const autoprefixer = require('autoprefixer');                  //
const cssnano = require('cssnano');                            //Comprime el codigo CSS para minimizar espacio.
const postcss = require('gulp-postcss');                       //
const sourceMaps = require('gulp-sourcemaps');                 //Crea un mapa de CSS para poder leerlo.

//Dependencias de Imagenes Cache.
const cache = require('gulp-cache');

//Dependencias de Imagenes Aligeradas.
const imagemin = require('gulp-imagemin');

//Dependencias de Imagenes Webp.
const webp = require('gulp-webp');

//Dependencia de Imegenes Avif.
const avif = require('gulp-avif');

//Aligerando Codigo de JavaScript.
const terser = require('gulp-terser');


//Funcion CSS a SASS.
function css(done) {
    src("src/scss/**/*.scss")             //Identifica el archivo SASS
    .pipe( sourceMaps.init())             //Inicia un mapa para poder leer el codigo css.
    .pipe( plumber() )
    .pipe( sass() )                       //Compilarlo
    .pipe( postcss([autoprefixer(), cssnano() ]) )
    .pipe( sourceMaps.write('.'))         //Escribe el codigo comprimido de css.
    .pipe( dest("build/css") )            //Almacenar en el disco duro
    done();                               //Avisa el termino del proceso.
}

//Funcion Imagenes Aligeradas.
function imagenes( done ) {
    const opciones = {
        optimizationLevel: 3
    }
    src("src/img/**/*.{png,jpg}")          //Identifica la ruta.
    .pipe( cache( imagemin(opciones) ) )  
    .pipe( dest('build/img') )            //Almacena las imagenes.
    done();                               //Avisa que termina el proceso
}


//Registrando la Funcion Webp.
function versionWebp( done ) {
    const opciones = {
        quality: 50                       //Calidad de las imagenes.
    };
    src("src/img/**/*.{png,jpg}")         //Los {} logran que admita otros formatos.
    .pipe( webp( opciones) )
    .pipe( dest('build/img') )            //Almacena las imagenes en otra carpeta.
    done();                               //Avisa el termino del proceso.
}

//Registrando la Funcion Avif.
function versionAvif( done ) {            //Funcion de Imagenes Avif.
    const opciones = {                   
        quality: 50                       //Calidad de las imagenes.
    };
    src("src/img/**/*.{png,jpg}")         //Los {} logran que admita otros formatos.
    .pipe( avif( opciones) )
    .pipe( dest('build/img') )            //Almacena las imagenes en otra carpeta.
    done();                               //Avisa el termino del proceso.
}

//Funcion de Galeria en JavaScript.
function javascript( done ) {             //Funcion de JavaScript.
    src("src/js/**/*.js")                 //Oberserva la ruta.
    .pipe( sourceMaps.init() )
    .pipe( terser() )
    .pipe( sourceMaps.write('.') )
    .pipe(dest('build/js') );              //Almacena las imagenes en otra carpeta.
    done();                               //Avisa el termino del proceso.
}


//Funcion Dev Generalizada.
function dev(done) {                      //Funcion Dev.
    watch("src/scss/**/*.scss", css)      //Identifica la ruta.
    watch("src/js/**/*.js", javascript)   //Observa la ruta.
    done();                               //Avisa el termino del proceso.
}

//Ejecutacion de Funciones.
exports.css = css;                                                               //Ejecutara Funcion de CSS.
exports.js = javascript;                                                         //Ejecutara Funcion de JavaScript.
exports.imagenes = imagenes;                                                     //Ejecutara Funcion de Imagenes.
exports.versionWebp = versionWebp;                                               //Ejecutara Funcion de versionWebp.
exports.versionAvif = versionAvif;                                               //Ejecutara Funcion de versionAvif.
exports.dev = parallel( imagenes, versionWebp, versionAvif, javascript, dev);    //Ejecutara Funcion Todo en uno.