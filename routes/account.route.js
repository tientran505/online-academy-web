import express from 'express';
import User from '../utils/models/user.model.js';
import Course from '../utils/models/course.model.js';
import userService from '../services/user.service.js';
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
  if (!user || !bcypt.compare(password, user.password)) {
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

router.post('/changeprofile', async (req, res) => {
  const username = req.body.value;
  const table = await User.find({username: username});
  const list = JSON.parse(JSON.stringify(table));

  res.render('vwAccount/changeprofile', {
    list: list,
  });
});

router.post('/savechangeprofile', async (req, res) => {
  const { username, name, email, password, newpassword, confirmpassword } = req.body;

  const table = await User.find({username: username});
  const list = JSON.parse(JSON.stringify(table));

  if (!list || !password || !bcypt.compare(password, list[0].password)) {
      return res.render('vwAccount/changeprofile', {
        list: list,
        errMessage: 'Invalid old password.',
      });
  } else {
    //doi pass
      if(newpassword != null) {
          if (newpassword != confirmpassword) {
              return res.render('vwAccount/changeprofile', {
                list: list,
                errMessage: 'Invalid new password.',
              });
          }
        //check name, email
          if(name == null){
              return res.render('vwAccount/changeprofile', {
                list: list,
                errMessage: 'Invalid name.',
              });
          }
          if(email == null){
              return res.render('vwAccount/changeprofile', {
                list: list,
                errMessage: 'Invalid email.',
              });
          }
          //update
          const salt = await bcypt.genSalt(10);
          const hashedPassword = await bcypt.hash(newpassword, salt);
          const u = await userService.findByIdAndUpdate(list[0]._id, name, hashedPassword, email);
      } else {
        //khong doi pass
        //check name, email
        if(name == null){
            return res.render('vwAccount/changeprofile', {
              list: list,
              errMessage: 'Invalid name.',
            });
        }
        if(email == null){
            return res.render('vwAccount/changeprofile', {
              list: list,
              errMessage: 'Invalid email.',
            });
        }
        //update
        const salt = await bcypt.genSalt(10);
        const hashedPassword = await bcypt.hash(password, salt);
        const u = await userService.findByIdAndUpdate(list[0]._id, name, hashedPassword, email);
      }
      
  }
  console.log("finish");
  return res.redirect('/account/profile');
});

router.get('/profile', async (req, res) => {
  const {username} = req.session.authUser;
  const table = await User.find({username: username});
  const list = JSON.parse(JSON.stringify(table));

  const courseTable = await Course.find();
  const courseList = JSON.parse(JSON.stringify(courseTable));

  console.log(list[0]['role'] === 'student');

  if(list[0]['role'] === 'student'){
    let watchlist = [];
    let watchlistactive = [];
    let subWatchlist = [];
    let count = 0;
    for(let i = 0; i < courseList.length; i++){
      for(let j = 0; j < list[0].favorite_courses.length && j < 3; j++){
        if(courseList[i]['_id'] === list[0].favorite_courses[j]){
          watchlistactive.push(courseList[i]);
        }
      }
    }
    for(let i = 0; i < courseList.length; i++){
      for(let j = 3; j < list[0].favorite_courses.length; j++){
        if(courseList[i]['_id'] === list[0].favorite_courses[j]){
          subWatchlist.push(courseList[i]);
          count++;
          if(count == 3) {
            count = 0;
            watchlist.push({subWatchlist: subWatchlist});
            subWatchlist = [];
            page++;
          }
        }
      }
    }
    watchlist.push({subWatchlist: subWatchlist});

    let registeredList = [];
    let registeredListactive = [];
    let subRegisteredList = [];
    count = 0;
    for(let i = 0; i < courseList.length; i++){
      for(let j = 0; j < list[0].registered_courses.length && j < 3; j++){
        console.log(list[0].registered_courses[j]['_id']);
        if(courseList[i]['_id'] === list[0].registered_courses[j]){ 
          registeredListactive.push(courseList[i]);
        }
      }
    }
    for(let i = 0; i < courseList.length; i++){
      for(let j = 3; j < list[0].registered_courses.length; j++){
        if(courseList[i]['_id'] === list[0].registered_courses[j]){
          subRegisteredList.push(courseList[i]);
          count++;
          if(count == 3) {
            count = 0;
            registeredList.push({subRegisteredList: subRegisteredList});
            subRegisteredList = [];
          }
        }
      }
    }
    registeredList.push({subRegisteredList: subRegisteredList});

    res.render('vwAccount/profile', {
      list: list,

      watchlistactive: watchlistactive,
      watchlistempty: watchlistactive.length === 0,

      watchlist: watchlist,
      watchlistempty2: watchlist[0].subWatchlist.length != 0,

      registeredListactive: registeredListactive,
      registeredempty: registeredListactive.length === 0,

      registeredList: registeredList,
      registeredempty2: registeredList[0].subRegisteredList.length != 0,
    });
  } else {

  }
  
  
});

export default router;
