//Carregando o módulo express, que está dentro da pasta node_modules
const express = require('express');

//Carregando a biblioteca para criar rotas em arquivos separados
const router = express.Router();

//Instanciando o pacote mongoose para utilizar o mongodb
const { intersection } = require("lodash");
const mongoose = require("mongoose");
require("../models/Usuario"); //Importando model categorias
const Usuario = mongoose.model("usuarios"); //usando model de forma externa

//Instanciando o pacote para criptografar a senha
const bcrypt = require("bcryptjs")

//Chamando o passport
const passport = require("passport");
const eAdmin = require('../helpers/eAdmin');

//Rota para registro de usuário
router.get("/registro", function(req,res){
    res.render("usuario/registro")
})

//Rota para validar registro de usuário
router.post("/registro", function(req,res){

    //Verificação dos erros no formulário
    var erros = [];

    if(!req.body.nome || typeof req.body.nome == undefined || req.body.nome == null){
        erros.push({texto: "Nome Inválido"});
    }
    if(!req.body.email || typeof req.body.email == undefined || req.body.email == null){
        erros.push({texto: "E-mail Inválido"});
    }
    if(!req.body.senha || typeof req.body.senha == undefined || req.body.senha == null){
        erros.push({texto: "Senha Inválida"});
    }
    if(!req.body.senha2 || typeof req.body.senha2 == undefined || req.body.senha2 == null){
        erros.push({texto: "Senha2 Inválida"});
    }
    if(req.body.senha.length < 4){
        erros.push({texto: "Senha muito curta"});
    }
    if(req.body.senha != req.body.senha2 ){
        erros.push({texto: "As senhas são diferentes, tente novamente!"});
    }

    //Verificando se existe erros, se existir, exibir na tela de registro
    if(erros.length > 0){

        res.render("usuario/registro", {erros: erros})

    }else{

        //Pesquisando se existe um usuário com aquele email já no cadastro
            Usuario.findOne({email: req.body.email}).then(function(usuario){
                //Se existir um usuário com aquele email entra nesse if e resultará em erro.
                if(usuario){
                    req.flash("error_msg","Já existe uma conta com esse email no sistema!!!");
                    res.redirect("/usuario/registro"); //Rota para exibir área pricipal admin
                }else{
                    //Instalando o pacote para criptografar a senha
                    //npm install --save bcryptjs
                    const novoUsuario = new Usuario({
                        nome: req.body.nome,
                        email: req.body.email,
                        senha: req.body.senha,
                        ///eAdmin: 1
                    })

                    //criptografando a senha, o salt é um valor aleatorio que é misturado com o hash
                    bcrypt.genSalt(10, function(erro,salt){
                        bcrypt.hash(novoUsuario.senha,salt, function(erro, hash){
                            if(erro){
                                req.flash("error_msg","Houve um erro durante o salvamento da senha!!!");
                                res.redirect("/"); //Rota para exibir área pricipal admin
                            }

                            //Armazenando a senha criptografada
                            novoUsuario.senha = hash;

                            //Verificando se vai salvar no banco correto
                            novoUsuario.save().then(function(){
                                req.flash("success_msg","Usuário criado com sucesso!!!");
                                res.redirect("/"); //Rota para exibir área pricipal admin
                            }).catch(function(err){
                                req.flash("error_msg","Houve um erro ao criar o usuário, tente novamente!!!");
                                res.redirect("/usuario/registro"); //Rota para exibir área pricipal admin
                            });

                        });
                    })

                }

            }).catch(function(err){
                req.flash("error_msg","Houve um erro interno !!!");
                res.redirect("/"); //Rota para exibir área pricipal admin
            });
    }

})

//Rota para login
router.get("/login",function(req,res){
    res.render("usuario/login");
})

//Rota para receber login
router.post("/login", function(req,res,next){

    //sempre que quiser autenticar alguma coisa usa essa função
    passport.authenticate("local", {
        successRedirect:  "/" ,//O caminho para redirecionar caso a autenticação tenha acontecido com sucesso
        failureRedirect: "/usuario/login",
        failureFlash: true
    })(req, res, next)

})

//Rota para logout, sair do sistema
router.get("/logout", function(req,res){

    //Fazendo logout da aplicação, automaticamente o passport faz isso
    req.logout();
    req.flash("success_msg","Deslogado com sucesso!!!");
    res.redirect("/")
})


//Exportando rota
module.exports = router;