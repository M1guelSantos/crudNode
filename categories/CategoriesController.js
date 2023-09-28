const express = require("express");
const router = express.Router();


router.get ("/categories", (req,res) => {
    res.send("Ola");
})

router.get("/admin/categorias/new", (req,res) =>{
    res.send("Rota para criar nova categas")
});

module.exports = router;