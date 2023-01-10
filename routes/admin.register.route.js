import express from 'express';
import userService from '../services/user.service.js';
import userModel from '../utils/models/user.model.js';
import moment from 'moment';
import User from '../utils/models/user.model.js'
import bcypt from 'bcryptjs';

const router = express.Router();

router.get('/', (req, res) => {
    return res.render('vwAdmin/register');
})

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

router.post('/', async (req, res) => {
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
    role: 'teacher',
    status: 'accesible',
  });

  return res.render('vwAdmin/register');
})

export default router;
