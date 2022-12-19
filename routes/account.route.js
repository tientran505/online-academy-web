import express from 'express';
import User from '../utils/models/user.model.js';
import bcypt from 'bcryptjs';
import moment from 'moment';

const router = express.Router();

router.get('/register', (req, res) => {
  res.render('vwAccount/register', {
    isRegister: true,
  });
});

router.get('/login', (req, res) => {
  res.render('vwAccount/login', {
    isLogin: true,
  })
})

router.get('/valid-user', async(req, res) => {
  const username = req.query.username;
  const email = req.query.email;

  const userExist = await User.findOne({username});
  const emailExist = await User.findOne({email});

  return res.json({
    userExist: userExist === null,
    emailExist: emailExist === null,
  })
})

router.post('/register', async (req, res) => {
  console.log(req.body);

  const {username, name, email, dob, password} = req.body;

  const salt = await bcypt.genSalt(10);
  const hashedPassword = await bcypt.hash(password, salt);
  const birthday = moment(dob, 'DD/MM/YYYY').format('MM/DD/YYYY');

  const user = await User.create({
    username,
    password: hashedPassword,
    name,
    email,
    birthday,
    role: 'student',
  })

  res.render('vwAccount/register', {
    isPress: true,
  });
});

export default router;
