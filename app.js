const express=require('express');
const bodyParser=require('body-parser');
const exphbs=require('express-handlebars');
const path=require('path');
const nodemailer=require('nodemailer');

const app=express();

// View engine setup
app.engine('handlebars', exphbs.engine({
    extname:'handlebars',
    defaultLayout: 'contact',
    layoutsDir:'views'
}));
app.set('view engine', 'handlebars');

// Static folder
app.use('/public',express.static(path.join(__dirname,'public')));

// Body Parser Middleware
// parse application/x-www-form-urlencoded
app.use(bodyParser.urlencoded({extended: false}));
app.use(bodyParser.json());

app.get('/',(req,res)=>{
    res.render('contact');
});

app.listen(8080,()=>{
    console.log('Server started...');
});