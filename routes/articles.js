var express = require('express');
var router = express.Router();
var Article = require('../models/article')
var Comment = require('../models/comment')
var middleware = require('../modules/middleware')
var User = require('../models/User')


/* GET home page. */

router.get('/',(req, res, next) =>{
    // Article.find({},(err,articleArray)=>{
    //     if(err) return next(err)
    //     res.render('articlespage',{ articleArray })
    // })
    Article.find()
    .populate("authorId")
    .exec((err, articleArray)=>{
        if(err) return next(err)
        res.render('articlespage',{articleArray})
    })
    
})

//article create get 

router.get('/create',(req, res, next)=>{
    res.render('articlePostForm')
})

// article create post

router.post('/',middleware.isLoggedin,(req, res, next)=>{
    req.body.authorId = req.user.id
    
//    User.findById(req.user.id)
//   .populate('articlesId')
//   .exec((err,user)=>{
//       if(err){
//           return console.log("err", err)
//       }
//     // console.log(user,'',schedule)
//     console.log(user)
//     res.end()
//   })
    Article.create(req.body,(err, article)=>{
        if(err) return next(err)
        User.findByIdAndUpdate(req.user.id,{$push : {articlesId : article.id}},(err, user)=>{
            if(err) return next(err)
            res.redirect('/articles')
        } )
    })
})

// article comment view get

router.get('/:articleId/view',(req,res, next)=>{
    Article
    .findById(req.params.articleId)
    .populate('comments')
    .exec((err,data) =>{
      if(err) return next(err);
      console.log(data)
      res.render('singleArticle',{data})
    
    })
  })

//  create comment post
router.post('/:articleId/view',middleware.isLoggedin,(req, res, next) =>{
    // req.body.articleId = req.params.articleId; //articleId is the key we are adding .It must match with the name given in schema
    req.body.authorId = req.user.id
    Comment.create(req.body,(err, data) => {
        if(err) return next(err)
        Article.findByIdAndUpdate(req.params.articleId,{$push : {comments : data.id}},(err, article)=>{
            if(err) return next(err)
            User.findByIdAndUpdate(req.user.id,{$push :{commentsId : data.id}},(err, user)=>{
                console.log(user)
                if(err) return next(err)
                res.redirect('/articles/'+req.params.articleId+'/view')

            })
            })
            
        })
        
        
    })



router.use(middleware.isLoggedin)

// edit comment

router.get('/:id/edit',(req, res, next)=>{
    Article.findById(req.params.id,(err,data) =>{
        if(err) return next(err)
        res.render('articleEditForm',{ data })
    })
})
router.post('/:id/edit',(req, res, next) => {
    Article.findByIdAndUpdate(req.params.id,req.body,(err,data) =>{
        if(err) return next(err);
        res.redirect(`/articles/${req.params.id}/view`)
    })
})

//  delete comment

router.get('/:id/delete',(req, res, next) =>{
    Article.findOneAndDelete({_id: req.params.id},(err,data)=>{
        if(err) return next(err)
        res.redirect('/articles')
    })
})

// like article 
router.get('/:id/likes',(req, res, next)=>{
    Article.findByIdAndUpdate(req.params.id,{$inc: {likes:1}},(err,data)=>{
        if(err) return next(err)
        res.redirect(`/articles/${req.params.id}/view`)
    })
})
// router.get('/:id/likes',(req, res, next)=>{
//     Article.findByIdAndUpdate(req.params.id,{$inc: {likes:1}},(err,data)=>{
//         if(err) return next(err)
//         res.redirect(`/articles/${req.params.id}/view`)
//     })
// })
// router.get('/:id/view/editcomment',(req, res, next)=>{
//     Article
//     .findById(req.params.articleId)
//     .populate('comments','content')
//     .exec((err,data) =>{
//       if(err) return next(err);
//       res.render('singleArticle',{data})
//       console.log(data)
//     })
//   })
// })

router.get('/:articleId/:commentId', async (req, res, next) => {
console.log(req.body,'comment')
console.log(req.params.commentId)
    try{
        const article = await Article.findByIdAndUpdate(req.params.articleId, {$pull:{comments:req.params.commentId}})
        const comment = await Comment.findByIdAndRemove(req.params.commentId)
        res.redirect('/articles/'+req.params.articleId+"/view")

    }catch(e){
        next(err)
    }
    // Article.findByIdAndUpdate(req.params.articleId,(err,article)=>{
    //     Comment.findOneAndDelete(req.params.id,(err, data)=>{
    //         if(err) return next(err)
    //         res.redirect()
    //     })
    // })


  
})
module.exports = router;
