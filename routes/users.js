var express = require('express');
var express = require('express');
var router = express.Router();
var User = require('../models/User');
var url = require('url')


/* GET home page. */
router.get('/registration',(req, res)=>{
  res.render('registration')
})

router.post('/registration',(req, res, next)=>{
  User.create(req.body,(err, data)=>{
    if(err) return next(err);
    res.redirect('/users/login')
  })

})

router.get('/login',(req, res)=>{
  var path = url.parse(req.url,true)
  req.session.path = path.pathname
  var local = res.locals
  res.render('login',{local,res})
})


router.get('/logout',(req, res)=>{
  req.session.destroy((err, data)=>{
    if(err) return next(err)
    // res.render('index',{data,title:"express"})
    res.redirect('/')
  })
})

router.post('/login',(req, res)=>{
  console.log(req.session.path,"hello there")
  var {email,password} = req.body;
  User.findOne({email},(err, user)=>{
    
    if(err) return res.redirect('/users/login');
    if(!user) return res.redirect('/users/login')
    console.log(user.verifyPassword(password))
    if(!user.verifyPassword(password)) return res.redirect('/users/login');
    req.session.userId = user.id;
    req.session.name = user.name;
    
    
    res.redirect(`/users/${req.session.path}`);
      
    // }else{
    //   res.send("incorrect password")
    // }
  })
  
})
router.get('/userinfo',(req, res)=>{
  var user = req.user
  res.render('userInfo',{ user })
})

router.get('/edit',(req,res)=>{
  res.render('userEditForm')
})

router.post('/edit',(req, res)=>{
  console.log(req.user)
  User.findByIdAndUpdate(req.user.id,req.body,(err,user)=>{
    if(err) return next(err)
    res.render('userInfo', { user })
  })
})
module.exports = router;
