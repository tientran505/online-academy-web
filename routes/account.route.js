import express from 'express';
import User from '../utils/models/user.model.js';
import Course from '../utils/models/course.model.js';
import userService from '../services/user.service.js';
import bcypt from 'bcryptjs';
import moment from 'moment';
import mailService from '../services/mail.service.js';
import otpEmailsModel from '../utils/models/otp-emails.model.js';

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

  if (user.status === 'blocked') {
    return res.render('vwAccount/login', {
      errMessage: 'Your account was blocked. Please contact to adminstrator for more information'
    })
  }

    if (user.status === 'inactive' || user.staus === 'unactive') {
    return res.render('vwAccount/login', {
      errMessage: 'Your account is not activated. Can\'t sign in'
    })
  }

  req.session.auth = true;
  const users = JSON.parse(JSON.stringify(user));
  res.locals.lcTeacher = false;
  if (user.role === 'student') {
    users.permission = 0;
  } else if (user.role === 'teacher') {
    users.permission = 1;
    res.locals.lcTeacher = true;
  } else if (user.role === 'admin') {
    users.permission = 2;
  }

  req.session.authUser = users;
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

router.get('/valid-otp', async (req, res) => {
  const {email, otp} = req.query;

  console.log('email la ' +  email);
  console.log('otp la' + otp);
  const otpUser = JSON.parse(JSON.stringify(await otpEmailsModel.findOne({email})));
 

  console.log(otp);
  console.log(otpUser);
  console.log(otp===otpUser.code);

  return res.json({
    isValid: otp === otpUser.code,
  });
});

router.post('/register', async (req, res) => {
  const { username, name, email, dob, password, otpVal } = req.body;

  if (typeof(otpVal) !== 'undefined') {
    await userService.updateStatusByEmail(email, "accessible");

    return res.redirect('/account/login');
  }

  const otp = mailService.generateOTP();
  await mailService.sendOTP(email, otp);

  const salt = await bcypt.genSalt(10);
  const hashedPassword = await bcypt.hash(password, salt);
  const birthday = moment(dob, 'DD/MM/YYYY').format('MM/DD/YYYY');

  await otpEmailsModel.deleteMany({email: email});

  const user = JSON.parse(JSON.stringify(await User.create({ 
    username,
    password: hashedPassword,
    name,
    email,
    birthday,
    role: 'student',
    status: 'inactive',
  })));

 const otpUser = await otpEmailsModel.create({
    code: otp,
    email: email,
  })

  console.log('asdasdasd' + otpUser);


  res.render('vwAccount/otp', {
    user,
  });
});

router.get('/changeprofile', async (req, res) => {
  const { username } = req.session.authUser;
  const table = await User.find({ username: username });
  const list = JSON.parse(JSON.stringify(table));

  res.render('vwAccount/changeprofile', {
    list: list,
  });
});

router.post('/savechangeprofile', async (req, res) => {
  const { username, name, email, password, newpassword, confirmpassword } =
    req.body;

  const table = await User.findOne({ username: username });
  const list = JSON.parse(JSON.stringify(table));
  console.log(username, name, email, password, newpassword, confirmpassword);
  if (
    !list ||
    !password ||
    (list != null &&
      password != null &&
      !(await bcypt.compare(password, list.password)))
  ) {
    // if (!list || !password || !bcypt.compare(password, list.password)) {
    console.log(
      password,
      list.password,
      !bcypt.compare(password, list.password)
    );
    return res.render('vwAccount/changeprofileerror', {
      username: username,
      errTitle: 'Invalid password',
      errMessage: 'You need to enter your old password to change profile',
    });
  } else {
    console.log(
      password,
      list.password,
      list != null &&
        password != null &&
        !(await bcypt.compare(password, list.password))
    );
    //doi pass
    if (newpassword != null) {
      if (newpassword != confirmpassword) {
        return res.render('vwAccount/changeprofileerror', {
          username: username,
          errTitle: 'Invalid new password',
          errMessage:
            'You cannot leave new password blank if you want to change password',
        });
      }
      //check name, email
      if (name == null) {
        return res.render('vwAccount/changeprofileerror', {
          username: username,
          errTitle: 'Invalid name',
          errMessage: 'You cannot leave name field blank',
        });
      }
      if (email == null) {
        return res.render('vwAccount/changeprofileerror', {
          username: username,
          errTitle: 'Invalid email',
          errMessage: 'You cannot leave email field blank',
        });
      }
      //update
      const salt = await bcypt.genSalt(10);
      const hashedPassword = await bcypt.hash(newpassword, salt);
      const u = await userService.findByIdAndUpdate(
        list._id,
        name,
        hashedPassword,
        email
      );
    } else {
      if (name == null) {
        console.log(3);
        return res.render('vwAccount/changeprofileerror', {
          username: username,
          errTitle: 'Invalid name',
          errMessage: 'You cannot leave name field blank',
        });
      }
      if (email == null) {
        console.log(3);
        return res.render('vwAccount/changeprofileerror', {
          username: username,
          errTitle: 'Invalid email',
          errMessage: 'You cannot leave email field blank',
        });
      }
      //update
      const u = await userService.findByIdAndUpdate(
        list._id,
        name,
        list.password,
        email
      );
    }
  }

  return res.redirect('/account/profile');
});

router.get('/profile', async (req, res) => {
  const { username } = req.session.authUser;
  const table = await User.find({ username: username });
  const list = JSON.parse(JSON.stringify(table));

  const courseTable = await Course.find();
  const courseList = JSON.parse(JSON.stringify(courseTable));

  if (list[0]['role'] === 'student') {
    let watchlist = [];
    let watchlistactive = [];
    let subWatchlist = [];
    let count = 0;
    for (let i = 0; i < courseList.length; i++) {
      for (let j = 0; j < list[0].favorite_courses.length && j < 3; j++) {
        if (courseList[i]['_id'] === list[0].favorite_courses[j]) {
          watchlistactive.push(courseList[i]);
        }
      }
    }
    for (let i = 0; i < courseList.length; i++) {
      for (let j = 3; j < list[0].favorite_courses.length; j++) {
        if (courseList[i]['_id'] === list[0].favorite_courses[j]) {
          subWatchlist.push(courseList[i]);
          count++;
          if (count == 3) {
            count = 0;
            watchlist.push({ subWatchlist: subWatchlist });
            subWatchlist = [];
            page++;
          }
        }
      }
    }
    watchlist.push({ subWatchlist: subWatchlist });

    let registeredList = [];
    let registeredListactive = [];
    let subRegisteredList = [];
    count = 0;
    for (let i = 0; i < courseList.length; i++) {
      for (let j = 0; j < list[0].registered_courses.length && j < 3; j++) {
        console.log(list[0].registered_courses[j]['_id']);
        if (courseList[i]['_id'] === list[0].registered_courses[j]) {
          registeredListactive.push(courseList[i]);
        }
      }
    }
    for (let i = 0; i < courseList.length; i++) {
      for (let j = 3; j < list[0].registered_courses.length; j++) {
        if (courseList[i]['_id'] === list[0].registered_courses[j]) {
          subRegisteredList.push(courseList[i]);
          count++;
          if (count == 3) {
            count = 0;
            registeredList.push({ subRegisteredList: subRegisteredList });
            subRegisteredList = [];
          }
        }
      }
    }
    registeredList.push({ subRegisteredList: subRegisteredList });

    res.render('vwAccount/profile', {
      list: list,
      isStudent: list[0]['role'] === 'student',

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
    let id = list[0]['_id'];

    let authorlist = [];
    for (let i = 0; i < courseList.length; i++) {
      if (courseList[i]['author'] === id) {
        authorlist.push(courseList[i]);
      }
    }
    console.log(authorlist);
    let createdlist = [];
    let createdlistactive = [];
    let subcreatedlist = [];
    let count = 0;

    for (let i = 0; i < authorlist.length && i < 3; i++) {
      createdlistactive.push(authorlist[i]);
    }
    for (let i = 3; i < authorlist.length; i++) {
      subcreatedlist.push(authorlist[i]);
      count++;
      if (count == 3) {
        count = 0;
        createdlist.push({ subcreatedlist: subcreatedlist });
        subcreatedlist = [];
        page++;
      }
    }
    createdlist.push({ subcreatedlist: subcreatedlist });
    res.render('vwAccount/profile', {
      list: list,
      isStudent: list[0]['role'] === 'student',

      createdlistactive: createdlistactive,
      createdlistempty: createdlistactive.length === 0,

      createdlist: createdlist,
      createdlistempty2: createdlist[0].subcreatedlist.length != 0,
    });
  }
});

export default router;
