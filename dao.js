const Meme = require( "./database/models/Meme" );

// Inserir Meme
async function inserir(meme){
    return new Promise(
        async function(resolve, reject){
            let result = await Meme.create(meme);
            return result;
        }
    );
}

// Atualizar Meme
async function atualizar(id, meme){
    return new Promise(
        async function(resolve, reject){
            // faz a verificação se o meme existe antes de atualizar
            let searchMeme = await Meme.findByIdAndUpdate(id, meme);
            
            //se tiver algum resultado da busca da operação de update ele envia o resultado 
            if(searchMeme){
                let result = await Meme.findById(id);
                return result;
            }
            else{
                return;
            }
        }
    );
}

// Listar meme(s)
async function listar(){
    return new Promise(
        async function(resolve, reject){
            let result = await Meme.find();
            return result;
        }
    );    
}

// Listar meme por id
async function listar(id){
    return new Promise(
        async function(resolve, reject){
            let result = await Meme.findById(id);
            return result;
        }
    );    
}

// Excluir meme
async function excluir(id){
    return new Promise(
        async function(resolve, reject) {
            await Meme.findByIdAndRemove(id);
            return;
        }
    );    
}

module.exports = {
    inserir,
    atualizar,
    listar,
    excluir
}