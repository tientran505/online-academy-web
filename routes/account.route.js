import express from 'express';
import User from '../utils/models/user.model.js';
import bcypt from 'bcryptjs';
import moment from 'moment';

const router = express.Router();

router.get('/register', (req, res) => {
  res.render('vwAccount/register');
});

router.get('/login', (req, res) => {
  res.render('vwAccount/login');
});

router.post('/login', async (req, res) => {
  const { username, password } = req.body;

  const user = await User.findOne({ username });

  if (
    user === null ||
    (user !== null && !(await bcypt.compare(password, user.password)))
  ) {
    return res.render('vwAccount/login', {
      errMessage: 'Invalid credentials.',
    });
  }

  req.session.auth = true;
  req.session.authUser = user;

  const url = '/';
  return res.redirect(url);
});

router.post('/logout', async (req, res) => {
  req.session.auth = false;
  req.session.authUser = null;

  const url = '/';
  return res.redirect(url);
});

router.get('/valid-user', async (req, res) => {
  const username = req.query.username;
  const email = req.query.email;

  const userExist = await User.findOne({ username });
  const emailExist = await User.findOne({ email });

  return res.json({
    userExist: userExist === null,
    emailExist: emailExist === null,
  });
});

router.post('/register', async (req, res) => {
  console.log(req.body);

  const { username, name, email, dob, password } = req.body;

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
  });

  res.render('vwAccount/register');
});

export default router;
