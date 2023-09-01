const router = require('express').Router()
const Post = require('../models/Post')
const multer = require('multer')
const requireAuth = require('../middleware/middleware.js')

//FILE UPLOAD

const storage = multer.diskStorage({
    destination: (req, file, cb) => {
         cb(null, 'public/images/')                       
    }, 
    filename: (req, file, cb) => {
         cb(null, `${Date.now()}-${file.originalname}`);
    }
})
const upload = multer({ storage: storage });

//create post

router.post('/post', upload.single('photo'), async (req, res) => {
    const { title, content, name } = req.body;  
    const imagePath = 'images/' + req.file.filename;  
    try {
      const newPost = new Post({
        title:title,    
        content:content, 
        photo:imagePath, 
        name:name 
      });
      await newPost.save();
      res.redirect('/');
    } catch (error) {
      console.error('Error creating post:', error); 
      res.status(500).json({ error: 'Error creating post' });
    }
});


// get single post

router.get('/post/:postId', async (req, res) => {
  try {
      const post = await Post.findById(req.params.postId);
      console.log(post)
      if (!post) {
          return res.status(404).send('Post not found');
      }
      res.render('post', { post });
  } catch (error) {
      console.error(error);
      res.redirect('/'); 
  }
});


// update the post

router.post('/update/:postId', async (req, res) => {
  try {
    const post = await Post.findById(req.params.postId);
    if (!post) {
      return res.status(404).json("Post not found");
    }
    const loggedInUserId = req.body.userId;
    if (post.creator === loggedInUserId) {
      const { title, content, photo, name } = req.body;
       await Post.findByIdAndUpdate(post, { title, content, photo, name }, { new: true });
      res.redirect('/')
    } else {
      res.status(401).json("You can update only your post");
    }
  } catch (error) {
    res.status(500).json(error);
  } 
});
    

// delete a single post

router.post('/delete/:postId', async (req, res) => {
  try {
      const post = await Post.findById(req.params.postId);
      if (!post) {
          return res.status(404).json({ error: 'Post not found' });
      }
      const loggedInUserId = req.body.userId;
      if (post.creator === loggedInUserId) {
          await Post.findByIdAndDelete(post);
          res.redirect('/')
      } else {
          res.status(403).json({ error: 'You do not have permission to delete this post' });
      }
  } catch (error) {
      res.status(500).json({ error: 'Failed to delete post' });
  }
});



module.exports = router