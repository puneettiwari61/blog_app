var mongoose =  require('mongoose')
var Schema = mongoose.Schema;
var bcrypt = require('bcrypt')

var userSchema = new Schema({
    name:{
        type: String,
        required: true
    },
    email:{
        type: String,
        required: true,
        match: /\S+@\S+\.\S+/i
    },
    username: {
        type: String,
        required : true,
        minlength:5
    },
    password: {
        type: String,
        required: true,
        minlength:3
    },
    articlesId:[{
        type:Schema.Types.ObjectId,
        ref: "Article"
    }],
    commentsId:[{
        type:Schema.Types.ObjectId,
        ref: "Comment"
    }]

},{timestamps : true})

userSchema.pre('save',function(next){
    console.log(this,"before")
    if(this.password && this.isModified('password')) {
        this.password = bcrypt.hashSync(this.password, 10)
        }
    console.log(this,"after")
    next();
    
})
userSchema.methods.verifyPassword = function(password){
    return bcrypt.compareSync(password, this.password) 
}
module.exports = mongoose.model('User',userSchema);