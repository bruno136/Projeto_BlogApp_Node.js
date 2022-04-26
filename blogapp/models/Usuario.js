//Instanciando o pacote mongoose para utilizar o mongodb
const { intersection } = require("lodash");
const mongoose = require("mongoose");
const Schema = mongoose.Schema;

//Criando o model - Usuario  - que são os campos que esse documento vai ter
const Usuario = new Schema({
    nome: {
        type: String,
        require: true
    },
    email: {
        type: String,
        require: true
    },
    eAdmin: {  //Controle para saber quem é admin ou não
        type: Number,
        default: 0
    },
    senha: {
        type: String,
        require: true
    }
});

//Criando o nome da collection e os campos que irá ter
mongoose.model('usuarios', Usuario);