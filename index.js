import express from "express";
import bodyParser from "body-parser";

const app = express();
const port = 3000;
app.set('view engine', 'ejs');
app.use(bodyParser.urlencoded({ extended: true }));
app.use(express.static("public"));


var today = new Date();
var dd = String(today.getDate()).padStart(2, '0');
var mm = String(today.getMonth() + 1).padStart(2, '0'); //January is 0!
var yyyy = today.getFullYear();
today = mm + '/' + dd + '/' + yyyy;

let blogPosts = [ { id: 1, title: 'First Blog Post', content: 'This is the content of the first blog post.' }, ];

app.get("/", (req, res) => {
  res.render("index.ejs",{ blogPosts: blogPosts });
});

app.get("/edit/:id", (req, res) => {
  const blogPost = blogPosts.find(post => post.id === parseInt(req.params.id));

  if (blogPost) { 
    res.render('edit.ejs', { blogPost: blogPost, today : today  }); 
  } else { 
    res.status(404).send('Blog post not found'); 
  } 
});


app.get('/blog/:id', (req, res) => { 
  const blogPost = blogPosts.find(post => post.id === parseInt(req.params.id)); 
  
  if (blogPost) { 
    res.render('blog', { blogPost: blogPost, today : today  }); 
  } else { 
    res.status(404).send('Blog post not found'); 
  } });


app.post('/submit', (req, res) => { 
  const newPost = { 
    id: blogPosts.length + 1, 
    ...req.body
  }; 
  blogPosts.push(newPost); 
  res.redirect('/'); 
});

app.post('/delete/', (req, res) => { 
    const postId = parseInt(req.params.id); 
    blogPosts = blogPosts.filter(post => post.id !== postId); 
    res.redirect('/'); 
  });


app.post('/edit/:id', (req,res) => {
  const postId = parseInt(req.params.id);
  const updatedPost = req.body
  const postIndex = blogPosts.findIndex(post => post.id === postId);

  blogPosts[postIndex] = { id: postId, ...updatedPost }

  console.log(req.body, postId, )
  res.redirect('/');
})


app.listen(port, () => {
  console.log(`Server running on port ${port}`);
});
