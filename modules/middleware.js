var User = require('../models/User')
exports.isLoggedin = (req, res, next)=>{
    if(req.session.userId){
        next();
    }else{
        req.flash('error','You need to login first')
        res.redirect('/users/login')
    }

}


exports.loggedUserInfo = (req, res, next)=>{
    if(req.session && req.session.userId){
        var userid = req.session.userId;
        // console.log(userid, req)
        User.findById(userid,"-password",(err, data)=>{
            if(err) {
                return console.log("loggeduserInfo error")
            }
            req.user = data;
            res.locals.user = data;
            next();
        })
    }else{
        req.user = null;
        res.locals.user = null;
        next();
    }
}

