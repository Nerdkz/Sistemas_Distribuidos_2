const restify = require( "restify" );
const mongoose = require ( "mongoose" );
const server = restify.createServer();

const database = require( "./database" );
const dao = require( "./dao" );


server.use(restify.plugins.queryParser());
server.use(restify.plugins.bodyParser());

const memeURL = '/meme';

// print no console com as requisições feitas que ajuda na hora de debugar
function logRequest(req, res, next) {

    let msg = `[${req.getRoute().method}] ${req.href()}`

    if(req.body){
      
      msg +=  ` => ${JSON.stringify(req.body)}`;
    }
    console.log(msg);
    next();
}


// Função utilizada para realizar a autenticação, ela sempre é rodada, pois é  injetada como handler do restify.
async function autenticar(req, res, next) {
    
    const token = req.header("token");
    
    if (!token) {

      res.json(403, { msg: "Token não fornecido!" });
    } 
    else if (!(await autenticacao.validar(token))) {
      
        res.json(401, { msg: "Token inválido!" });
    } 
    else {
      
        next();
    }
}
  
// Realizar o login
server.post("/auth/login", async (req, res) => {
    
    let username = req.body.username;
    let password = req.body.password;
  
    let response = await autenticacao.logar(username, password);
    res.json(response.status, response.data);
});

// POST http://localhost:3000/meme => Create
server.post(`${memeURL}`, logRequest, autenticar,async (req, res) => {

    let meme = {
        
        titulo: req.body.titulo,
        descricao: req.body.descricao,
        ano: req.body.ano,
    };
    

    let memeCriado = await dao.inserir(meme);
    res.json(memeCriado);
        
});

// PATCH http://localhost:3000/meme/id => Update
server.patch(`${memeURL}/:id`, logRequest, autenticar, async (req, res) => {
    

    let meme = {
        
        titulo: req.body.titulo,
        descricao: req.body.descricao,
        ano: req.body.ano,
    };
    
    let memeAtualizado = await dao.atualizar(req.params.id, carro);
    res.json(memeAtualizado);    
});

// GET http://localhost:3000/meme => Read
server.get(`${memeURL}`, logRequest,autenticar, async (req, res) => {
    
    let meme = await dao.listar();
    res.json(meme);    
});

// GET http://localhost:3000/meme/id => Read by id
server.get(`${memeURL}/:id`, logRequest, autenticar, async (req, res) => {
    
    let meme = await dao.listar();
    res.json(meme);
});

// DELETE http://localhost:3000/meme/id => Delete
server.del(`${memeURL}`, logRequest, autenticar, async (req, res) => {
    
    await dao.excluir(req.body.id);
    res.send(204); 
});



server.listen(3000, () => {
    console.log(`O servidor está rodando!`);

    mongoose.connect(database.DB_URL, database.DB_SETTINGS, (err) => {
        if(!err){
            //conectou com o mongodb
            console.log(`Aplicação conectada ao MongoDB : ${database.DB_SETTINGS.dbName}`);
        }
        else{
            //deu erro a conexao
            console.log(`Erro ao conectar ao MongoDB: ${database.DB_URL}`);
            console.log(`Erro: ${err}`);
        }
    });
});
