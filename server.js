const express = require("express")
const sqlite3 = require("sqlite3").verbose()

const app = express()

app.use(express.json())
app.use(express.static("public"))

const db = new sqlite3.Database("banco.db")

db.serialize(()=>{

db.run(`
CREATE TABLE IF NOT EXISTS usuarios(
id INTEGER PRIMARY KEY,
user TEXT,
pass TEXT
)
`)

db.run(`
CREATE TABLE IF NOT EXISTS produtos(
id INTEGER PRIMARY KEY,
nome TEXT,
estoque INTEGER
)
`)

db.run(`
CREATE TABLE IF NOT EXISTS pedidos(
id INTEGER PRIMARY KEY,
cliente TEXT,
produto TEXT,
qtd INTEGER,
status TEXT,
data TEXT
)
`)

db.run(`
INSERT INTO usuarios(user,pass)
SELECT 'admin','123'
WHERE NOT EXISTS (
SELECT 1 FROM usuarios WHERE user='admin'
)
`)

})


// LOGIN

app.post("/login",(req,res)=>{

db.get(

"SELECT * FROM usuarios WHERE user=? AND pass=?",

[req.body.user, req.body.pass],

(err,row)=>{

res.json({ok:!!row})

}

)

})


// PRODUTOS

app.get("/produtos",(req,res)=>{

db.all("SELECT * FROM produtos",(e,r)=>res.json(r))

})

app.post("/produtos",(req,res)=>{

db.run(

"INSERT INTO produtos(nome,estoque) VALUES(?,?)",

[req.body.nome, req.body.estoque]

)

res.json({ok:true})

})


// PEDIDOS

app.get("/pedidos",(req,res)=>{

db.all("SELECT * FROM pedidos",(e,r)=>res.json(r))

})

app.post("/pedidos",(req,res)=>{

let data = new Date().toLocaleDateString()

db.run(

"INSERT INTO pedidos(cliente,produto,qtd,status,data) VALUES(?,?,?,?,?)",

[
req.body.cliente,
req.body.produto,
req.body.qtd,
"Encomendado",
data
]

)

res.json({ok:true})

})

app.listen(3000,()=>{

console.log("V9 rodando")

})