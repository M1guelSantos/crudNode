const express = require("express");
const router = express.Router();
const Category = require("../categories/Category")
const Article = require("./Article")
const slugify = require("slugify")


router.get ("/admin/articles", (req,res) => {
        Article.findAll({
            include: [{model: Category}]
        }).then(articles=>{
            res.render("admin/articles/index", {articles: articles})
        })
    });
    
router.get("/admin/articles/new", (req,res) =>{
    Category.findAll().then(categories=>{
        res.render("admin/articles/new", {categories: categories})
    })
});

router.post("/articles/save", (req,res) => {
    var title = req.body.title
    var body = req.body.body
    var category = req.body.category

    Article.create({
        title: title,
        slug: slugify(title),
        body: body,
        categoryId: category
    }).then(() => {
        res.redirect("/admin/articles")
    })
})

router.post("/articles/delete", (req,res)=>{
    var id = req.body.id
    if(id != undefined){
        if(!isNaN(id)){

            Article.destroy({
                where: {
                    id: id //estou destruindo o id que for igual minha var ID
                }
            }).then(()=>{
                res.redirect("/admin/articles")
            })

        }else{
            res.redirect("/admin/articles")
        }
         
    }else{
        res.redirect("/admin/articles") //caso seja invalido o nome redireciona
    }
})    

router.get("/admin/articles/edit/:id", (req,res)=>{
    var id = req.params.id
    Article.findByPk(id).then(article => {
        if(article != undefined){
            Category.findAll().then(categories =>{
                res.render("admin/articles/edit", {article: article, categories: categories})
            })
        }else{
        res.redirect("/")    
        }
    }).catch(err =>{
        res.redirect("/")
    })
})

router.post("/articles/update", (req,res) => {
    var id = req.body.id;
    var title = req.body.title;
    var body = req.body.body;
    var category = req.body.category

    Article.update({title: title, body: body, categoryId: category, slug:slugify(title)},{
        where :{
            id: id
        }
    }).then(() => {
        res.redirect("/admin/articles")
    }).catch(err =>{
        res.redirect("/")
    })
})

router.get("/articles/page/:num", (req,res) => {
    var page = req.params.num
    var offset = 0

    if(isNaN(page) || 1){
        offset = 0;
    }else{
        offset = parseInt(page) * 2;
    }

    Article.findAndCountAll({
        limit: 2,
        offset: offset // Retornar dados a partir de um valor
    }).then(articles => {        
        res.json(articles)
    })
})

module.exports = router;