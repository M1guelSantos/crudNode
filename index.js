const express = require("express")
const app = express ();
const bodyParser = require("body-parser")
const connection = require("./database/database")

//view engine = ejs
app.set('view engine', 'ejs')
app.use(express.static('public'));

//body parser
app.use(bodyParser.urlencoded({extended: false}));
app.use(bodyParser.json());

//conctando bd

connection
.authenticate()
.then(()=>{
    console.log("Conexao feita comm sucesso!")
}).catch((error) => {
    console.log(error);
})


app.get ("/", (req,res) => {
    res.render("index");
})


app.listen(8080, () =>{
    console.log("O servidor esta rodando")
})