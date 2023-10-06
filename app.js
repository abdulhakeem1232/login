const express=require('express');
const path=require('path');
const session=require("express-session")
const flash=require('express-flash');
const { render } = require('ejs');
const app=express();

const port=process.env.PORT || 3000;

app.use(function (req, res, next) {
    res.header('Cache-Control', 'private, no-cache, no-store, must-revalidate');
    res.header('Expires', '-1');
    res.header('Pragma', 'no-cache');
    next()
});



app.set('view engine','ejs')
app.use(express.static('public'));
app.use(express.urlencoded({extended:true}));
app.use(flash())

const data={
    email:'hakeem@gmail.com',
    password:'hakeem11',
}


app.use(session({
    secret:'secret key',
    resave:false,
    saveUninitialized:false
}))




function checkSignIn(req,res,next){
    if(req.session.isAuth){
        next();
    }
    else{
        res.redirect('/');
    }
}

app.use('/static',express.static(path.join(__dirname,'public')))
app.use('/static',express.static(path.join(__dirname,'public/assets')))

app.get('/',(req,res)=>{
    if(req.session.isAuth){
       res. redirect('/home')
    }
    else{
        res.render('login')
    }
})
app.post('/login',(req,res)=>{
    if(req.body.email==data.email){
        if(req.body.password==data.password){
            req.session.isAuth=true;
            res.redirect('/home')
        }
        else{
            req.flash('error','Incorrect Password');
            res.render('login',{error:"Invalid password"})
        }
    }
    else{
        res.render('login',{error:"Invalid E-mail"})
            
    }
})
app.get('/home',checkSignIn,(req,res)=>{
    res.render('home')
})
app.get('/logout',(req,res)=>{
    req.session.destroy()
    res.redirect('/');
})


app.listen(port,()=>{console.log(`Listening to the server on http://localhost:${port}`);})