const express = require("express");
const router = express.Router();
const User = require("./User")
const bycrypt = require("bcryptjs")


router.get("/admin/user", (req,res) => {
    User.findAll().then(users =>{
        res.render("admin/users/index", {users: users})
    })
})

router.get("/admin/users/create", (req,res) => {
    res.render("admin/users/create")
})

router.post("/users/create", (req,res) => {
    var email = req.body.email;
    var password = req.body.password; 


    User.findOne({where: {email: email}}).then( user =>{
        if(user == undefined){
            var salt = bycrypt.genSaltSync(10);
            var hash = bycrypt.hashSync(password, salt);
        
            User.create({
                email: email,
                password: hash
            }).then(() => {
                res.redirect("/")
            }).catch(err => {
                res.redirect("/")
            })
        }else{
            res.redirect("/admin/users/create")
        }
    })   
})

router.get("/login", (req, res) => {
    res.render("admin/users/login")
})

router.post("/authenticate", (req, res) => {
   var email = req.body.email
   var password = req.body.password

   User.findOne({where: {email: email}}).then( user =>{
    if(user != undefined){
        var correct = bycrypt.compareSync(password, user.password) // Bycrypt transformar senha que o usuario colocou no form em uma hash e comparar com a hash do bd(criacao de conta)

        if(correct){
            req.session.user = {
                id: user.id,
                email: user.email
            }
            res.redirect("/admin/articles")
        }else{
        res.redirect("/login")
        }
    }else{
        res.redirect("/login")
    }
   })
})

router.get("/logout", (req, res) => {
    req.session.user = undefined
    res.redirect("/")
})

module.exports = router;
