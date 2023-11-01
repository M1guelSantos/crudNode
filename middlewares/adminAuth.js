function adminAuth(req, res, next){ // Next -> dar continuidade a requisição
    if(req.session.user != undefined){
        next();
    }else{
        res.redirect("/login")
    }
}

module.exports = adminAuth