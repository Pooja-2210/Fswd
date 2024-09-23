const express = require('express');
const mongoose = require('mongoose');
const session = require('express-session');
const bcrypt = require('bcryptjs');
const bodyParser = require('body-parser');
const app = express();
const PORT = process.env.PORT || 3000;

// MongoDB connection
mongoose.connect('mongodb://localhost/microblogging-app', {
    useNewUrlParser: true,
    useUnifiedTopology: true,
});

// Middleware
app.use(bodyParser.urlencoded({ extended: true }));
app.use(express.static('public'));
app.use(session({ secret: 'secretkey', resave: false, saveUninitialized: true }));

// User schema
const userSchema = new mongoose.Schema({
    username: { type: String, unique: true },
    password: String,
    following: [{ type: mongoose.Schema.Types.ObjectId, ref: 'User' }]
});
const User = mongoose.model('User', userSchema);

// Post schema
const postSchema = new mongoose.Schema({
    userId: { type: mongoose.Schema.Types.ObjectId, ref: 'User' },
    content: String,
    likes: [{ type: mongoose.Schema.Types.ObjectId, ref: 'User' }]
});
const Post = mongoose.model('Post', postSchema);

// Routes
app.get('/', (req, res) => {
    res.sendFile(__dirname + '/public/index.html');
});

app.get('/login', (req, res) => {
    res.sendFile(__dirname + '/public/login.html');
});

app.get('/register', (req, res) => {
    res.sendFile(__dirname + '/public/register.html');
});

app.get('/dashboard', async (req, res) => {
    if (!req.session.userId) {
        return res.redirect('/login');
    }

    const user = await User.findById(req.session.userId).populate('following');
    const posts = await Post.find({ userId: { $in: user.following.concat(user._id) } }).populate('userId');

    res.sendFile(__dirname + '/public/dashboard.html');
});

// Register new user
app.post('/register', async (req, res) => {
    const hashedPassword = await bcrypt.hash(req.body.password, 10);
    const newUser = new User({
        username: req.body.username,
        password: hashedPassword,
    });
    await newUser.save();
    res.redirect('/login');
});

// User login
app.post('/login', async (req, res) => {
    const user = await User.findOne({ username: req.body.username });
    if (user && await bcrypt.compare(req.body.password, user.password)) {
        req.session.userId = user._id;
        return res.redirect('/dashboard');
    }
    res.redirect('/login');
});

// Create a new post
app.post('/post', async (req, res) => {
    if (!req.session.userId) return res.redirect('/login');
    const newPost = new Post({
        userId: req.session.userId,
        content: req.body.content,
    });
    await newPost.save();
    res.redirect('/dashboard');
});

// Follow a user
app.post('/follow/:id', async (req, res) => {
    if (!req.session.userId) return res.redirect('/login');
    const userToFollow = await User.findById(req.params.id);
    const currentUser = await User.findById(req.session.userId);

    if (userToFollow && !currentUser.following.includes(userToFollow._id)) {
        currentUser.following.push(userToFollow._id);
        await currentUser.save();
    }
    res.redirect('/dashboard');
});

// Like a post
app.post('/like/:id', async (req, res) => {
    if (!req.session.userId) return res.redirect('/login');
    const post = await Post.findById(req.params.id);
    const userId = req.session.userId;

    if (post && !post.likes.includes(userId)) {
        post.likes.push(userId);
        await post.save();
    }
    res.redirect('/dashboard');
});

// Logout
app.get('/logout', (req, res) => {
    req.session.destroy();
    res.redirect('/');
});

// Start server
app.listen(PORT, () => {
    console.log(Server is running on http://localhost:${PORT});
});