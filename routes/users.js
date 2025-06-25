var express = require('express');
var router = express.Router();
const User = require('../models/userModel');

/* GET users listing. */

router.get('/createUser', (req, res) => {
  const newUser = new User({
    name: 'daniel',
    email: 'daniel66@gmail.com',
    password: '11223344',
  });

  newUser.save()
    .then(() => {
      res.send('User created');
    })
    .catch((error) => {
      console.error(error);
      
    });
});

router.post('/login', async (req, res) => {
  const { email, password } = req.body;
  
  const user = await User.findOne({ email });
  if (!user || !(await bcrypt.compare(password, user.password))) {
    return res.status(401).send('Invalid credentials');
  }

  req.session.user = user; // ✅ Store user in session
  res.redirect('/dashboard'); // Redirect to dashboard or any other page
});

module.exports = router;