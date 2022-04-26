//Carregando o módulo express, que está dentro da pasta node_modules
const express = require('express');

//Carregando a biblioteca para criar rotas em arquivos separados
const router = express.Router();

//Instanciando o pacote mongoose para utilizar o mongodb
const { intersection } = require("lodash");
const mongoose = require("mongoose");
require("../models/Categoria"); //Importando model categorias
require("../models/Postagem"); //Importando model categorias
const Categoria = mongoose.model("categorias"); //usando model de forma externa
const Postagem = mongoose.model("postagens"); //usando model de forma externa

//Carregando helpers para determinar permissão
const {eAdmin} = require("../helpers/eAdmin")


router.get('/', eAdmin, function(req,res){
    res.render("admin/index"); // chamando o arquivo index.handlebars dentroa da pasta views/admin
})


//Rota para exibir todas categorias
router.get('/categorias', eAdmin, function(req,res){
    //Parte para exibir lista de categorias na página de categorias e ordenando pela data no formato decrescente
    Categoria.find().sort({date: 'desc'}).then(function(categorias){
        res.render("admin/categorias",{categorias: categorias}); // chamando o arquivo categorias.handlebars dentroa da pasta views/admin
    }).catch(function(err){
        req.flash("error_msg","Houve um erro ao listar as categorias !!!");
        res.redirect("/admin"); //Rota para exibir área pricipal admin
    });
   
})

//Rota que é chamada quando uma nova categoria é criada
router.post('/categorias/nova', eAdmin,function(req,res){

//Fazendo o tratamento dos erros
    var erros = [];

    if(!req.body.nome || typeof req.body.nome == undefined || req.body.nome == null){
        erros.push({texto: "Nome inválido"});
    }

    if(!req.body.slug || typeof req.body.slug == undefined || req.body.slug== null){
        erros.push({texto: "Slug inválido"});
    }

    if(req.body.nome.length < 2){
        erros.push({texto: "Nome da categoria é muito pequeno"});
    }

    if(req.body.slug.length < 2){
        erros.push({texto: "Nome do slug é muito pequeno"});
    }

//Condição se array for maior que zero exibir mensagens de erro na tela
    if( erros.length > 0){
        res.render("admin/addcategorias",{erros: erros}); // chamando o arquivo addcategorias.handlebars dentroa da pasta views/admin
    }
    else{
        //Recebendo os dados do formulario
        const novaCategoria = {
            nome: req.body.nome,
            slug: req.body.slug
        }

        //Salvando a nova categoria no banco
        new Categoria(novaCategoria).save().then(() => {
            //console.log("Categoria registrado com sucesso !!!");
            req.flash("success_msg","Categoria criada com sucesso !!!");
            res.redirect("/admin/categorias"); //Chamando Rota para exibir todas categorias
        }).catch((err) => {
            req.flash("error_msg","Ouve um erro ao salvar a categoria, tente novamente !!!");
            res.redirect("/admin"); //Rota para exibir área pricipal admin
            //console.log("Erro ao inserir categoria: " + err);
        });
    }

});

//Rota para editar categorias
router.get("/categorias/edit/:id", eAdmin, function(req,res){
    Categoria.findOne({_id: req.params.id}).then(function(categoria){
        res.render("admin/editcategorias", {categoria:categoria}); // Chamando o arquivo editcategorias.handlebars dentroa da pasta views/admin
    }).catch(function(err){
        req.flash("error_msg","Esta categoria não existe");
        res.redirect("/admin/categorias"); //Chamando Rota para exibir todas categorias
    })
});

//Rota para quando editar categoria
router.post("/categorias/edit", eAdmin, function(req,res){
    Categoria.findOne({_id: req.body.id}).then(function(categoria){

        categoria.nome = req.body.nome
        categoria.slug = req.body.slug

        categoria.save().then(function(){
            req.flash("success_msg","Categoria editada com sucesso !!!");
            res.redirect("/admin/categorias"); //Chamando Rota para exibir todas categorias
        }).catch(function(err){
            req.flash("error_msg","Houve um erro interno ao salvar edição da categoria");
            res.redirect("/admin/categorias"); //Chamando Rota para exibir todas categorias
        });

    }).catch(function(err){
        req.flash("error_msg","Houve um erro ao editar a categoria");
        res.redirect("/admin/categorias"); //Chamando Rota para exibir todas categorias
    });
})

//Rota para deletar a categoria através do formulario
router.post("/categorias/deletar", eAdmin, function(req,res){
    Categoria.remove({_id: req.body.id}).then(function(){ //req.body.id é para pegar os dados do formulario (body) significa isso
        req.flash("success_msg","Categoria deletada com sucesso !!!");
        res.redirect("/admin/categorias"); //Chamando Rota para exibir todas categorias
    }).catch(function(err){
        req.flash("error_msg","Houve um erro ao deletar a categoria");
        res.redirect("/admin/categorias"); //Chamando Rota para exibir todas categorias
    });
});

//Rota para adicionar categorias
router.get('/categorias/add', eAdmin, function(req,res){
    res.render("admin/addcategorias"); // chamando o arquivo addcategorias.handlebars dentro da pasta views/admin
})

//Rotas para Postagens

//Rota para principal de postagens
router.get('/postagens', eAdmin, function(req,res){

    //Dentro do populate vai passar o nome do campo criado no model que é categoria exemplo:
    //categoria: {
        //type: Schema.Types.ObjectId,
        //ref: "categorias",
        //required: true
    //}

   //Faz o uso de uma funcionalidade do mongodb que é o populate que filtra as informações através do id
    Postagem.find().populate("categoria").sort({data: "desc"}).then(function(postagens){
        res.render("admin/postagens", {postagens: postagens}); // chamando o arquivo postagens.handlebars dentroa da pasta views/admin
    }).catch(function(err){
        req.flash("error_msg", "Houve um erro ao listar as postagens!!");
        res.redirect("/admin");
    });
    
   
})

//Rota para página de adição de categorias
router.get('/postagens/add', eAdmin, function(req,res){
    Categoria.find().then(function(categorias){
        res.render("admin/addpostagens",{categorias:categorias});// chamando o arquivo addpostagens.handlebars dentroa da pasta views/admin
    }).catch(function(err){
        req.flash("error_msg","Houve um erro ao carregar o formulário");
        res.redirect("/admin");  //Rota para exibir área pricipal admin
    });
})

//Rota para criação de postagem nova
router.post('/postagens/nova', eAdmin, function(req,res){

//Fazendo o tratamento dos erros
    var erros = [];

    if(req.body.categoria == "0"){
        erros.push({texto: "Categoria inválida, registre uma categoria !!!"});
    }

    //Condição se array for maior que zero exibir mensagens de erro na tela
    if( erros.length > 0){
        res.render("admin/addpostagens",{erros: erros}); // chamando o arquivo addpostagens.handlebars dentroa da pasta views/admin
    }
    else{
        //Recebendo os dados do formulario
        const novaPostagem = {
            titulo: req.body.titulo,
            slug: req.body.slug,
            descricao: req.body.descricao,
            conteudo: req.body.conteudo,
            categoria: req.body.categoria,
        }

        //Salvando a nova categoria no banco
        new Postagem(novaPostagem).save().then(() => {
            //console.log("Categoria registrado com sucesso !!!");
            req.flash("success_msg","Postagem criada com sucesso !!!");
            res.redirect("/admin/postagens"); // Chamando a pagina de exibição das postagens
        }).catch((err) => {
            req.flash("error_msg","Ouve um erro ao salvar a categoria, tente novamente !!!");
            res.redirect("/admin/postagens");  // Chamando a pagina de exibição das postagens
            //console.log("Erro ao inserir categoria: " + err);
        });
    }

});

//Rota para edição de postagens
router.get("/postagens/edit/:id", eAdmin, function(req,res){

    //Fazendo a busca da Postagem e da Categoria
    Postagem.findOne({_id: req.params.id}).then(function(postagem){

        Categoria.find().then(function(categorias){
            res.render("admin/editpostagens", {categorias: categorias, postagem: postagem});
        }).catch(function(err){
            req.flash("error_msg","Houve um erro ao listar as categorias!!!");
            res.redirect("/admin/postagens");  // Chamando a pagina de exibição das postagens
        });

    }).catch(function(err){
        req.flash("error_msg","Houve um erro ao carregar o formulario de edição!!!");
        res.redirect("/admin/postagens");  // Chamando a pagina de exibição das postagens
    });

});

//Rota para atualizar a postagem
router.post("/postagens/edit", eAdmin, function(req,res){

    //Parte para  atualização de postagem
    Postagem.findOne({_id: req.body.id}).then(function(postagem){

        postagem.titulo = req.body.titulo;
        postagem.descricao = req.body.descricao;
        postagem.conteudo = req.body.conteudo;
        postagem.slug = req.body.slug;
        postagem.categoria = req.body.categoria;

        postagem.save().then(function(){
            req.flash("success_msg", "Postagem editada com sucesso !!!");
            res.redirect("/admin/postagens");  // Chamando a pagina de exibição das postagens
        }).catch(function(err){
            req.flash("error_msg","Erro interno!!!");
            res.redirect("/admin/postagens");  // Chamando a pagina de exibição das postagens
        });

    }).catch(function(err){
        console.log(err);
        req.flash("error_msg","Houve um erro ao salvar postagem!!!");
        res.redirect("/admin/postagens");  // Chamando a pagina de exibição das postagens
    });

});


//Rota para deletar postagem, não é através de formulario
//essa forma não é uma forma segura pois passa o id na barra de navegação
router.get("/postagens/deletar/:id", eAdmin, function(req,res){
    
    //Parte para deletar postagem
    Postagem.remove({_id: req.params.id}).then(function(){
        req.flash("success_msg", "Postagem deletada com sucesso !!!");
        res.redirect("/admin/postagens");  // Chamando a pagina de exibição das postagens
    }).catch(function(err){
        req.flash("error_msg","Houve um erro interno!!!");
        res.redirect("/admin/postagens");  // Chamando a pagina de exibição das postagens
    })
})

//Exportando mudulo
module.exports = router;