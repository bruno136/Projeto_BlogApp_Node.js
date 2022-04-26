//Instalação do pacote express dentro da pasta do projeto para se utilizar
//npm install express --save

//Comando para instalar Nodemon para atualizar servidor automaticamente
//npm install nodemon -g
// nodemon index.js

//Comando para instalar o pacote para se utilizar o banco de dados mongodb com o Node
// npm install --save sequelize   é um ODM que abstrai toda camada de banco de dados, facilita os comandos
// npm install --save mysql2

//Handlebars é um tamplate que dá muitas fucionalidades ao html, consegue usar estruturas de repetição
//consegue usar estruturas condicionais, e exibir dados do back-end no arquivo html
// npm install --save express-handlebars

//Instalando o body-parser para trabalhar com os dados recebidos do fórmulario
// npm install --save body-parser

//Express é um framework que serve auxiliar na montagem de aplicações web com node.js
//Ferramenta muito usada para criar aplicações
//é um framework minimalista (trazem poucos recursos mais ajudam bastante, são rápidos)

//Carregando o módulo express, que está dentro da pasta node_modules
const express = require('express');

//Criando uma cópia da função express
const app = express();

//Handlebars é um tamplate que dá muitas fucionalidades ao html, consegue usar estruturas de repetição
//consegue usar estruturas condicionais, e exibir dados do back-end no arquivo html
// npm install --save express-handlebars

//Carregando handlebars
const {engine}  = require ('express-handlebars');

//Carregando o body-parser
const bodyParser = require('body-parser');

// Pacote para comunicar com o banco
const Sequelize = require('sequelize'); 

//Receber o arquivo models onde está Post.js
const Post = require("./models/Post");

//Configurando o handlebars e usando como tamplate que quer usar, pois são muitos tamplates,
//Config
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

//Conexão do banco
//Conectando com o banco Sequelize(banco, usuario,senha, objeto json)
    const sequelize = new Sequelize('test','root', 'caio99481345@', {
        host: "localhost", // máquina que quer se conectar
        dialect: 'mysql' //qual banco de dados que quer se conectar
    }); 

//Configurando body-parser
app.use(bodyParser.urlencoded({extended: false}));
app.use(bodyParser.json());

//Criando Rotas
//Retornando todos os posts que existem dentro da tabela
app.get("/",function(req,res){
    Post.findAll({order: [['id', 'DESC']]}).then(function(posts){
        res.render('home',{posts: posts});
    })   
});

app.get('/cad',function(req,res){
    //res.send("Rota de cadastro!!!")
    //A função render serve para renderizar o arquivo que deseja, que está na pasta views
    res.render('formulario'); //exibindo o arquivo handlebars que deseja atrvés da função res.render()
});

//Rota para receber os dados de cadastro e vai poder somente ser acessada quando usar o método post
//Não consegue acessar essa rota pelo o URL com post, somente com get
/*app.post('/add',function(req,res){
    //Pegando dados do formulário    
    res.send("Titulo: " + req.body.titulo + " Conteudo: " + req.body.conteudo);
});
*/
//Rota para criar usuário
app.post('/add',function(req,res){
    Post.create({
        titulo: req.body.titulo,
        conteudo: req.body.conteudo
    }).then(function(){
        res.redirect('/');
    }).catch(function(){
        res.send("Erro na criação do post !!!");
    })
});

//Rota para deletar
app.get('/deletar/:id', function(req,res){
    Post.destroy({where : {'id' : req.params.id}}).then(function(){
        res.send("Postagem deletada com sucesso !!!");
    }).catch(function(error){
        res.send("Esta postagem não existe !!!");
    })//função destroy, destruir um recurso dentro da tabela
})

//Abrindo o servidor, e tem que ser a última linha do código e utilizando uma função de callback para chamar um evento
app.listen(8081, function(){
    console.log("Servidor rodando !!!");
}); //localhost:8081



//Instalação do pacote express dentro da pasta do projeto para se utilizar
//npm install express --save

//Comando para instalar Nodemon para atualizar servidor automaticamente
//npm install nodemon -g
// nodemon index.js

//Comando para instalar o pacote para se utilizar o banco de dados mongodb com o Node
// npm install --save mongoose   é um ODM que abstrai toda camada de banco de dados, facilita os comandos

//Instanciando o pacote mongoose para utilizar o mongodb
const { intersection } = require("lodash");
const mongoose = require("mongoose");

//Configurando o mongoose

mongoose.Promise = global.Promise; // isso evita alguns erros durante o desenvolvimento da aplicação

//Depois do localhost/nome do banco
mongoose.connect("mongodb://localhost/aprendendo").then(() => {
    console.log("MongoDB Conectado...");
}).catch((err)=>{
    console.log("Houve um erro ao conectar ao mongoDB: "+err);
})

//Criando o model - Usuários  - que são os campos que esse documento vai ter

const UsuarioSchema = mongoose.Schema({
    nome : {
        type: String,
        require: true //indica se o campo é obrigatório ou não
    },
    sobrenome: {
        type: String,
        require: true //indica se o campo é obrigatório ou não
    },
    email: {
        type: String,
        require: true //indica se o campo é obrigatório ou não
    },
    idade: {
        type: Number,
        require: true //indica se o campo é obrigatório ou não
    },
    pais: {
        type: String
    }
})

//Criando o nome da collection e os campos que irá ter
mongoose.model('usuarios', UsuarioSchema);

const Bruno = mongoose.model('usuarios'); //precisa referenciar primeiro o usuario

//Inserindo dados e se quiser colocar novos dados é só mudar os campos
new Bruno({
    nome: "Pablo",
    sobrenome: "Silva",
    email: "teste1@gmail.com",
    idade: 19,
    pais: "EUA"
}).save().then(() => {
    console.log("Usuário registrado com sucesso !!!");
}).catch((err) => {
    console.log("Erro ao inserir usuário: " + err);
});

//Instalar esse pacote para poder inserir usuário
//npm install lodash --save

