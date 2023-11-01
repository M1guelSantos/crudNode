const express = require("express");
const app = express ();
const bodyParser = require("body-parser");
const session = require("express-session");
const connection = require("./database/database");

const categoriesController = require("./categories/CategoriesController")
const articlesController = require("./articles/ArticlesController")
const usersController = require("./user/UsersController")


//Importando models
const Article = require("./articles/Article");
const Category = require("./categories/Category");
const User = require("./user/User")

// Sessions
app.use(session({
    secret: "literalmentequalquercoisa", cookie: {maxAge: 30000000}
}))

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
app.use("/", usersController)

app.get("/session", (req, res) => {
    req.session.treinamento = "Formacao nodeJs"
    req.session.ano = 2019
    req.session.email = "miguel00@gmail.com"
    req.session.user = {
        username: "MiguelDoido",
        email: "miguel00@gmail.com",
        id: 10
    }
    res.send("Sessao Gerada")
})

app.get("/leitura", (req, res) => {
    res.json({
        treinamento: req.session.treinamento,
        ano: req.session.ano,
        email: req.session.email,
        user: req.session.user
    })
})

app.get ("/", (req,res) => {

    Article.findAll({
        order: [
            ['id', 'DESC']
        ],
        limit: 4
    }).then(articles =>{
        Category.findAll().then(categories=>{
         res.render("index", {articles: articles, categories: categories});
        })  
    })
})

app.get("/:slug", (req,res) => {
    var slug = req.params.slug
    Article.findOne({
        where: {
            slug: slug
        }
    }).then(article =>{
        if(article != undefined){
            Category.findAll().then(categories=>{
                res.render("article", {article: article, categories: categories});
               })  
        }else{
            res.redirect("/")
        }
    }).catch(err =>{
        res.redirect("/")
    })
})

app.get("/category/:slug", (req,res) => {
    var slug = req.params.slug
    Category.findOne({
        where:{
            slug: slug
        },
        include: [{model: Article}]
    }).then( category => {
        if(category != undefined){
            Category.findAll().then(categories => {
                res.render("index", {articles: category.articles, categories: categories})
            })
        }else{
            res.redirect("/")
        }
    }).catch(err => {
        res.redirect("/")
    })
})

app.listen(8080, () =>{
    console.log("O servidor esta rodando")
})