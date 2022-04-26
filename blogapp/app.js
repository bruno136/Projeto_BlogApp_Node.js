//Instalação do pacote express dentro da pasta do projeto para se utilizar
//npm install express --save

//Handlebars é um tamplate que dá muitas fucionalidades ao html, consegue usar estruturas de repetição
//consegue usar estruturas condicionais, e exibir dados do back-end no arquivo html
// npm install --save express-handlebars

//Instalando o body-parser para trabalhar com os dados recebidos do fórmulario
// npm install --save body-parser

//Comando para instalar o pacote para se utilizar o banco de dados mongodb com o Node
// npm install --save mongoose   é um ODM que abstrai toda camada de banco de dados, facilita os comandos

//Instalar esse pacote para poder inserir usuário
//npm install lodash --save

//Instalar o pacote da sessão
//npm install --save express-session

//Instalar o pacote da sessão conexão flash
//npm install --save connect-flash

//Express é um framework que serve auxiliar na montagem de aplicações web com node.js
//Ferramenta muito usada para criar aplicações
//é um framework minimalista (trazem poucos recursos mais ajudam bastante, são rápidos)

//O passport é um middlewares de autentificação, específico para o express, com ele consegue fazer
// diversos tipos de autentificação
// A estratégia que vai usar é a Local,ela se chama assim pq a gente usa o nosso proprio banco de dados
// para autenticar o usuário
// npm install --save passport
// npm install --save passport-local

//Carregando modulos

//Carregando o módulo express, que está dentro da pasta node_modules
const express = require('express');

//Criando uma cópia da função express
const app = express();

//Carregando handlebars
const {engine}  = require ('express-handlebars');

//Carregando o body-parser
const bodyParser = require('body-parser');

//Carregando a sessão
const session = require("express-session");

//Carregando flash da sessão
const flash = require("connect-flash");

//Carregando as rotas do admin
const admin = require("./routes/admin");

//Carregando as rotas do admin
const usuarios = require("./routes/usuario");

//Carregando módulo path que serve para trabalhar com diretorios, manipular pastas
const path = require('path');

//Instanciando o pacote mongoose para utilizar o mongodb
const { intersection } = require("lodash");
const mongoose = require("mongoose");
//const { Passport } = require('passport/lib');

//Carregando o model de postagem
require("./models/Postagem");
const Postagem = mongoose.model("postagens");

//Carregando o model de categoria
require("./models/Categoria");
const Categoria = mongoose.model("categorias");

//Chamando auth.js
const passport = require("passport");
require("./config/auth")(passport)

//Configurações

//app.use é um middlewares

//Configurando a sessão e o flash, o flash tem que ficar abaixo da sessão
app.use(session({
    secret: "cursodenode", //chave para gerar a sessão, pode ser qulquer coisa
    resave: true,
    saveUninitialized: true
}))

app.use(passport.initialize());
app.use(passport.session());
app.use(flash());

//Configurando o middlewares
app.use(function(req,res,next){
    //Criando variáveis globais que consegue acessar em qualquer parte da aplicação
    //Irá mostrar a mensagem de sucesso toda vez que ocorrer uma requisição com sucesso ou de erro
    res.locals.success_msg =  req.flash("success_msg");
    res.locals.error_msg =  req.flash("error_msg");
    res.locals.error = req.flash("error");
    // req.user, a biblioteca passport cria automaticamente assim que um usuário está logado no sistema
    res.locals.user = req.user || null //guardar os dados do usuário autenticado e caso não exista será passado null
    next();
});


//Configurando body-parser
app.use(bodyParser.urlencoded({extended: false}));
app.use(bodyParser.json());

//Configurando o handlebars e usando como tamplate que quer usar, pois são muitos tamplates,
// Tamplate Engine
//main é o tamplate padrão da aplicação
//utilizar a opção runtimeOptions com as propriedades allowProtoPropertiesByDefault e allowProtoMethodsByDefault 
// com valor true para segurança do sistema
app.engine('handlebars', engine( 
    {
        defaultLayout: 'main',
        runtimeOptions: {
        allowProtoPropertiesByDefault: true,
        allowProtoMethodsByDefault: true,
        }
    }))
app.set('view engine', 'handlebars')

//Configurando o mongoose

mongoose.Promise = global.Promise; // isso evita alguns erros durante o desenvolvimento da aplicação

//Depois do localhost/nome do banco
mongoose.connect("mongodb://localhost/blogapp").then(() => {
    console.log("MongoDB Conectado...");
}).catch((err)=>{
    console.log("Houve um erro ao conectar ao mongoDB: "+err);
})

//Parte que explica como criar um middlewares, middlewares é  como se fosse um intermediário entre o
// cliente e o servidor, quando o cliente envia uma requisiçaõ ao servidor, antes dessa requisição chegar
// o middlewares tem o acesso a essa requisição assim podendo fazer o tratamento que quiser antes dessa
// requisição chegar ao servidor
//app.use(function(req,res,next){
 //   console.log("Oi eu sou um middlewares");
 //   next();
//});


//Configurando a pasta public que é dos arquivos estáticos, falando pro node que a pasta que
// está guardando todos os arquivos estáticos é pasta public
app.use(express.static(path.join(__dirname, "public")));


//Rotas da Aplicação

//Rota para exibição da página principal
app.get('/',function(req,res){

    //Exibindo dados de postagens na página principal
    Postagem.find().populate("categoria").sort({data: "desc"}).then(function(postagens){
        res.render('index', {postagens: postagens}); //chamando o aquivo index.handlebars dentro da views
    }).catch(function(err){
        req.flash("error_msg","Houve um erro interno !!!");
        res.redirect("/404");
    });

});

//Rota para o botão de leia mais do index
app.get("/postagem/:slug", function(req,res){

    //Pesquisando as postagens
    Postagem.findOne({slug: req.params.slug}).then(function(postagem){

        if(postagem){
            res.render("postagem/index", {postagem: postagem}) //chamando o aquivo index.handlebars dentro da views/postagem
        }else{
            //console.log(postagem);
            req.flash("error_msg","Está postagem não existe !!!");
            res.redirect("/");
        }

    }).catch(function(err){
        req.flash("error_msg","Houve um erro interno !!!");
        res.redirect("/");
    });

})

//Rota para listagem de categorias
app.get("/categorias",function(req,res){

        //Pesquisando as categorias
        Categoria.find().then(function(categorias){
            res.render("categoria/index", {categorias: categorias}); //chamando o aquivo index.handlebars dentro da views/categoria
        }).catch(function(err){
            req.flash("error_msg","Houve um erro interno a listar as categorias !!!");
            res.redirect("/");
        });

})


//Rota para listagem de postagens de determinada categoria
app.get("/categorias/:slug", function(req,res){

    Categoria.findOne({slug: req.params.slug}).then(function(categoria){

        if(categoria){

            Postagem.find({categoria: categoria._id}).then(function(postagens){
                res.render("categoria/postagens", {postagens: postagens, categoria: categoria});
            }).catch(function(err){
                req.flash("error_msg","Houve um erro ao listar os Post !!!");
                res.redirect("/");
            })

        }else{
            req.flash("error_msg","Esta categoria não existe !!!");
            res.redirect("/");
        }

    }).catch(function(err){
        req.flash("error_msg","Houve um erro interno ao carregar a página desta categoria !!!");
        res.redirect("/");
    });

})

//Rota para erro
app.get("/404",function(req,res){
    res.send("Erro 404 !!!");
});

//Configurando rotas para parte do admin. O "/admin" é um prefixo, poderia ser qualquer nome
app.use("/admin", admin); 

//Configurando rotas para parte do usuario. O "/usuario" é um prefixo, poderia ser qualquer nome
app.use("/usuario", usuarios); 


//Outros

//Abrindo o servidor, e tem que ser a última linha do código e utilizando uma função de callback para chamar um evento
const PORT = 8081;
app.listen(PORT, function(){
    console.log("Servidor rodando !!!");
}); //localhost:8081