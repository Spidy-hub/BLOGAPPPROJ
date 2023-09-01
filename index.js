const express = require('express')
const app = express()
require('./mongoose/mongoose')
require('dotenv').config()
const route = require('./routes/auth') 
const postRoute = require('./routes/posts')  
const cookieParser = require('cookie-parser');
const path = require('path');
const { requireAuth, checkUser } = require('./middleware/middleware');
const Post = require('./models/Post')

//this is to read the body of the given page
app.use(express.urlencoded({ extended: false }));

//add the ejs
app.set('views', path.join(__dirname, 'views'));
app.set('view engine', 'ejs');

// middlewares
app.use(express.static(path.join(__dirname, 'public')));
app.use(express.json())
app.use(cookieParser());
// Serve static files
app.use(express.static(path.join(__dirname, 'uploads')));

app.get('*', checkUser);
app.get('/', requireAuth, async (req, res) => {
    try {
      const posts = await Post.find();  
      res.render('home', { posts });
    } catch (error) {
      res.status(500).json({ error: 'Error fetching posts' });
    }
});

// create post
app.get('/post', requireAuth,(req, res) => { res. render('write')})

// delete post
app.get('/delete/:id', requireAuth, async(req, res) => {
  const post = await Post.findById(req.params.id)
  res. render('delete', {post})})
  
app.get('/delete-confirm/:id', requireAuth, async(req, res) => { 
  const post = await Post.findById(req.params.id)
  res. render('delete-confirm', {post})})

//get udate post
app.get('/update/:id', requireAuth,async(req, res) => { 
  const post = await Post.findById(req.params.id)
  res. render('update', {post})})

app.use(route)
app.use(postRoute)
app.listen(process.env.PORT, ()=>{
    console.log(`Server running successfully at http://localhost:${process.env.PORT}`)
})
