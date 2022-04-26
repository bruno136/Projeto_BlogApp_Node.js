//helpers para permitir que apenas usuarios autenticados entrem em certas rotas
//Criando um midwares para determinar qual usuário vai acessar qual rota
module.exports = {
    eAdmin: function(req,res,next){

        //Se um usuário está autenticado
        if(req.isAuthenticated() && req.user.eAdmin == 1){
            return next();
        }
        req.flash("error_msg", "Você precisa ser um admin")
        res.redirect("/")

    }
}