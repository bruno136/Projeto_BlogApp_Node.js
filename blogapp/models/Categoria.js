//Instanciando o pacote mongoose para utilizar o mongodb
const { intersection } = require("lodash");
const mongoose = require("mongoose");
const Schema = mongoose.Schema;

//Criando o model - Categoria  - que são os campos que esse documento vai ter
const Categoria = new Schema({
    nome: {
        type: String,
        require: true
    },
    slug: {
        type: String,
        require: true
    },
    date: {
        type: Date,
        default: Date.now()
    }
});

//Criando o nome da collection e os campos que irá ter
mongoose.model('categorias', Categoria);