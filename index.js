const express = require("express")
const app = express ();
const bodyParser = require("body-parser")
const connection = require("./database/database")

const categoriesController = require("./categories/CategoriesController")
const articlesController = require("./articles/ArticlesController")

//Importando models
const Article = require("./articles/Article");
const Category = require("./categories/Category");

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


app.use("/", categoriesController)
app.use ("/", articlesController)

app.get ("/", (req,res) => {
    res.render("index");
})


app.listen(8080, () =>{
    console.log("O servidor esta rodando")
})