const bcrypt = require('bcrypt')
const jwt = require('jsonwebtoken')
const User = require('../models/user.js')
require('dotenv').config()


const maxage = 3 * 24 * 60 * 60;
const createToke = (id) => {
  return jwt.sign({ id }, process.env.SECRET_KEY, {
    expiresIn: maxage
  });
}


// Basic email validation
function validateEmail(email) {
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    return emailRegex.test(email);
}
  
// Basic password validation
function validatePassword(password) {
  return password.length >= 6;
}
module.exports.register =  async(req, res) =>{
    try {
        const {name, email, password, cpassword} = req.body
        const userExist = await User.findOne({email : email})
        if(userExist){
            return res.send({"status":"failed", "message": "User Already Exists"})
        }else{
            if(name && email && password && cpassword){
                if (!validateEmail(email)) {
                    return res.status(400).json({ error: 'Invalid email format.' });
                }
                if (!validatePassword(password)) {
                    return res.status(400).json({ error: 'Password must be at least 6 characters long.' });
                }
                if(password === cpassword){
                    const salt = await bcrypt.genSalt()
                    const hashPassword = await bcrypt.hash(password,salt)
                    const token = createToke(userExist._id);
                    res.cookie('jwt', token, { httpOnly: true, maxAge: maxage * 1000 })                    
                    const user = new User ({
                        name: name,
                        email : email,
                        password: hashPassword,
                        cpassword: hashPassword,
                        token : token
                    })
                    await user.save()
                    res.redirect('/login')
                }else{
                    return res.send({"status":"failed", "message": "Password Doesn't Match"})
                }
            }else{
                return res.send({"status": "failed", "message": "All fields Required.."})
            }
        }
    } catch (error) {
        return res.send({"status":"failed","message": "server error"})
    }
}


module.exports.login = async(req, res) => {
    try {
        const {email, password} = req.body
        if(email && password){
            const userExist = await User.findOne({email : email})
            if(userExist != null){
                const isMatch = await bcrypt.compare(password, userExist.password)
                if((userExist.email === email) && isMatch){
                    const token = createToke(userExist._id);
                    res.cookie('jwt', token, { httpOnly: true, maxAge: maxage * 1000 })
                    res.redirect('/')
                    // res.status(200).json({ userExist: userExist._id });
                }else{
                    return res.send({'status':"failed", "message":"Email or Password is not Valid"})
                }
            }else{
                return res.send({'status':"failed", "message":"You are not a Register User"})
            }   
        }    
    } catch (error) {
        console.log(error)
        return res.send({"status":"failed", "message": "server error"})
    }
}


module.exports.register_get = (req, res) => {
    res.render('register');
  }
  
  module.exports.login_get = (req, res) => {
    res.render('login');
  }

  module.exports.logout_get= (req, res) => {
    res.cookie('jwt','' , {maxage : 1});
    res.redirect('/');
}