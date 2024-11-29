const {Router}= require('express');
const router = Router();
const User= require('../models/user');
const multer = require('multer');
const upload = multer({ storage: multer.memoryStorage() });
const { uploadImage } = require('../services/azureStorage'); 
const { createTokenForUser } = require('../services/authentication');

router.get('/signin', (req, res)=>{
    return res.render("signin");
})

router.get('/signup', (req, res)=>{
    return res.render("signup");
})

router.post('/signup', async (req, res)=>{
    const {fullName, email, password}= req.body;
    await User.create({fullName, email, password});
    return res.redirect('/');
})

router.post('/signin', async (req, res)=>{
    const {email, password}= req.body;
    try{
        const token= await User.matchPassword(email, password);
        return res.cookie('token', token).redirect('/');
    }
    catch(error){
        return res.render('signin', {error: "Incorrect email or password"});
    }
})

router.get('/logout', (req, res)=>{
    res.clearCookie('token').redirect('/');
})

// Get profile page
router.get('/profile', (req, res) => {
    if (!req.user) return res.redirect('/user/signin');
    res.render('profile', { user: req.user });
});

// Update profile picture
router.post('/profile', upload.single('profileImage'), async (req, res) => {
    try {
        if (!req.file) {
            return res.status(400).render('profile', { 
                user: req.user,
                error: 'Please select an image to upload'
            });
        }

        try {
            const profileImageURL = await uploadImage(req.file);
            console.log('Image uploaded successfully:', profileImageURL);

            // Update user in database
            const updatedUser = await User.findByIdAndUpdate(
                req.user._id, 
                { profileImageURL }, 
                { new: true }  // This returns the updated document
            );

            // Create new token with updated user info
            const newToken = createTokenForUser(updatedUser);
            
            // Set new token in cookie and redirect
            res.cookie('token', newToken).redirect('/user/profile');
        } catch (storageError) {
            console.error('Azure Storage Error:', storageError);
            return res.status(500).render('profile', {
                user: req.user,
                error: 'Error uploading image to storage: ' + storageError.message
            });
        }
    } catch (error) {
        console.error('Error updating profile:', error);
        res.status(500).render('profile', { 
            user: req.user,
            error: 'Error updating profile picture: ' + error.message
        });
    }
});

module.exports = router;