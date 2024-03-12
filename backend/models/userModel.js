const mongoose = require("mongoose");
const bcrypt = require("bcryptjs");

//Schema
const userSchema = mongoose.Schema({
   username:{
    required: true,
    type: String,
   },
    email:{
    required: true,
    type: String,
    unique:true,
   },
   password:{
    required: true,
    type: String,
   },
   isAdmin:{
    type: Boolean,
    default: false,
   }
} ,
{
    timestamps: true,
})

userSchema.pre("save" , async function(next){
if(!this.isModified("password")){
 next();
}
const salt = await bcrypt.genSalt(10);
this.password = await bcrypt.hash(this.password , salt);
next();
});

userSchema.methods.isPasswordMatch = async function (enteredpassword){
    return await bcrypt.compare(enteredpassword , this.password);
}


const user = mongoose.model('User' , userSchema);

module.exports = user;