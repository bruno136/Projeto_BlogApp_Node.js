const localStrategy = require("passport-local").Strategy

//Instanciando o pacote mongoose para utilizar o mongodb
const { intersection } = require("lodash");
const mongoose = require("mongoose");

//Instanciando o pacote para criptografar
const bcrypt = require("bcryptjs");

//Model de usuário
require("../models/Usuario");
const Usuario = mongoose.model("usuarios");

module.exports = function(passport){

    //Falando o campo que vai analisar
    passport.use(new localStrategy({usernameField: 'email', passwordField: "senha"},function(email, senha, done){
        Usuario.findOne({email: email}).then(function(usuario){
            if(!usuario){
                return done(null, false, {message: "Esta conta não existe"}); //dados da autenciação se der errado
            }

            //Comparando a senha com a do usuário achado
            bcrypt.compare(senha, usuario.senha, function(erro, batem){

                //Se as senhas batem
                if(batem){
                    return done(null,usuario);
                }else{
                    return done(null, false, {message: "Senha incorreta!!!"});
                }

            })

        })


    }))

    //Salvar os dados do usuário em uma sessão
    passport.serializeUser(function(usuario,done){

        //passar os dados do usuário para uma sessão
        done(null,usuario.id);

    })

    passport.deserializeUser(function(id, done){
        Usuario.findById(id, function(err, usuario){ //procurando um usuário pelo id dele
            done(err, usuario)
        })
    })

}

