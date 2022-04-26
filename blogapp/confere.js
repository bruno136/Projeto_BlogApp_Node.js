var erros = [];

erros.push({texto: "Nome do slug é muito pequeno"});
erros.push({texto: "Nome da categoria é muito pequeno"});
erros.push({texto: "Nome inválido"});

var defe = {err : erros};

for (a of defe.err){
    console.log(a);
}
