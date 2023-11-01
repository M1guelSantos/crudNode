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

module.exports = router;
