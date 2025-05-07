const express = require('express');
const cors = require('cors');
const mongoose = require('mongoose');
const bcrypt = require('bcryptjs');
const jwt = require('jsonwebtoken');
const User = require('./models/User'); // Import User model
const Post = require('./models/Post'); // Ensure the 'Post' model is uppercase
const cookieParser = require('cookie-parser');
const multer = require('multer');
const fs = require('fs');
const path = require('path');

const app = express();
const salt = bcrypt.genSaltSync(10);
const secret = 'asjjdksdekldfndfjkdgjdgkdjfskjsdfksfh';

app.use(cors({ origin: 'http://localhost:3000', credentials: true }));
app.use(express.json());
app.use(cookieParser());

// Serve static files from the 'uploads' directory
app.use('/uploads', express.static(path.join(__dirname, 'uploads')));

// Connect to MongoDB
mongoose.connect('mongodb+srv://blog:blog@cluster0.qd0dvey.mongodb.net/?retryWrites=true&w=majority&appName=Cluster0', {
    useNewUrlParser: true,
    useUnifiedTopology: true,
});

// Middleware for handling file uploads
const uploadMiddleware = multer({ 
    dest: 'uploads/', // Temporary directory for uploaded files
    limits: { fileSize: 5 * 1024 * 1024 }, // Limit file size to 5MB
    fileFilter: (req, file, cb) => {
        const allowedMimeTypes = ['image/jpeg', 'image/png', 'image/gif'];
        if (allowedMimeTypes.includes(file.mimetype)) {
            cb(null, true);
        } else {
            cb(new Error('Invalid file type. Only JPG, PNG, and GIF are allowed.'));
        }
    },
});

app.post('/post', uploadMiddleware.single('file'), async (req, res) => {
    try {
        if (!req.file) {
            return res.status(400).json({ status: 'error', error: 'No file uploaded' });
        }

        const { originalname, path: tempPath } = req.file;
        const ext = path.extname(originalname).toLowerCase();
        const newFileName = path.join(__dirname, 'uploads', path.basename(tempPath) + ext);

        try {
            fs.renameSync(tempPath, newFileName); // Move file from temp directory to final location
        } catch (err) {
            console.error('Error renaming file:', err);
            return res.status(500).json({ status: 'error', error: 'Failed to save file' });
        }

        const { title, summary, content, publishedAt, author } = req.body;

        const postDoc = await Post.create({
            title,
            summary,
            content,
            cover: path.basename(newFileName), // Save image filename to 'cover'
            publishedAt: publishedAt ? new Date(publishedAt) : new Date(),
            author, // Save author name
        });

        res.json(postDoc);
    } catch (error) {
        console.error('Error creating post:', error);
        res.status(500).json({ status: 'error', error: 'Failed to create post' });
    }
});

// Route for getting posts
app.get('/post', async (req, res) => {
    try {
        const posts = await Post.find().sort({ publishedAt: -1 });
        res.json(posts);
    } catch (error) {
        console.error('Error fetching posts:', error);
        res.status(500).json({ status: 'error', error: 'Failed to fetch posts' });
    }
});

// Route for user registration
app.post('/register', async (req, res) => {
    const { username, password } = req.body;
    try {
        const hashedPassword = bcrypt.hashSync(password, salt);
        const user = await User.create({ username, password: hashedPassword });
        res.json({ status: 'ok', user });
    } catch (error) {
        console.error('Error during registration:', error);
        res.status(500).json({ status: 'error', error: 'Failed to register user' });
    }
});

// Route for user login
app.post('/login', async (req, res) => {
    const { username, password } = req.body;
    try {
        const user = await User.findOne({ username });
        if (user && bcrypt.compareSync(password, user.password)) {
            const token = jwt.sign({ id: user._id }, secret, { expiresIn: '1h' });
            res.cookie('token', token, { httpOnly: true, sameSite: 'strict' });
            res.json({ status: 'ok', user });
        } else {
            res.status(401).json({ status: 'error', error: 'Invalid username or password' });
        }
    } catch (error) {
        console.error('Error during login:', error);
        res.status(500).json({ status: 'error', error: 'Failed to login user' });
    }
});

// Route for user logout
app.post('/logout', (req, res) => {
    res.cookie('token', '', { httpOnly: true, expires: new Date(0), sameSite: 'strict' });
    res.json({ status: 'ok' });
});

app.get('/post/:id', async(req, res) => {
    const {id} = req.params;
    res.json(req.params);
   const postDoc = await post.findyId({id}).populate('author', ['username']);
   res.json(postDoc);
});

// Start the server
app.listen(4000, () => {
    console.log('Server running on port 4000');
});




