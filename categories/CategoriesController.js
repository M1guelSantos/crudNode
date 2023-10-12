const express = require("express");
const router = express.Router();
const Category = require("./Category")
const slugify = require("slugify")


router.get("/admin/categories/new", (req,res) => {
    res.render("admin/categories/new")
});

router.post("/categories/save", (req,res)=>{
    var title = req.body.title
    if(title != undefined){

        Category.create({
            title: title,
            slug: slugify(title)
        }).then(()=>{
            res.redirect("/")
        })

    }else{
        res.redirect("admin/categories/new") //caso seja invalido o nome redireciona
    }
})    

    router.get("/admin/categories", (req,res)=>{
        Category.findAll().then(categories =>{
            res.render("admin/categories/index", {categoria: categories}) // Passando categorias para frontEnd. O nome da variável que sera levado pra view
        })
    })

module.exports = router; 