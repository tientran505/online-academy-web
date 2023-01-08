import express from 'express';
import connectDB from './utils/config/db.js';
import dotenv from 'dotenv';
import { engine } from 'express-handlebars';
import User from './utils/models/user.model.js';
import Course from './utils/models/course.model.js';
import accountRouter from './routes/account.route.js';
import hbs_sections from 'express-handlebars-sections';
import detailRouter from './routes/detail-academy.route.js';
import path, { dirname } from 'path';
import { fileURLToPath } from 'url';
import courseRouter from './routes/course.route.js';
import categoryService from './services/category.service.js';
import courseTeacherRouter from './routes/course_teacher.route.js';
import numeral from 'numeral';
import session from 'express-session';
import subCategoryModel from './utils/models/sub-category.model.js';
import mongoose from 'mongoose';

import adminRoute from './routes/admin.user.route.js';
import categoryRoute from './routes/admin.category.route.js';
import adminCourseRoute from './routes/admin.course.route.js'

dotenv.config();
const port = process.env.PORT || 5000;
connectDB();

const __dirname = dirname(fileURLToPath(import.meta.url));

const app = express();

app.use(
  express.urlencoded({
    extended: true,
  })
);

app.engine(
  'hbs',
  engine({
    extname: 'hbs',
    defaultLayout: 'main.hbs',
    helpers: {
      section: hbs_sections(),
      format_number(val) {
        return numeral(val).format('0,0');
      },
      inc(val, option) {
        return parseInt(val) + 1;
      },
    },
  })
);

app.use('/public', express.static(path.join(__dirname, 'public')));
app.set('view engine', 'hbs');
app.set('views', __dirname + '/views');

app.set('trust proxy', 1); // trust first proxy
app.use(
  session({
    secret: 'SECRET_KEYYYYYY',
    resave: false,
    saveUninitialized: true,
    cookie: {
      // secure: true
    },
  })
);

app.use(async (req, res, next) => {
  if (typeof req.session.auth === 'undefined') {
    res.locals.auth = false;
  }

  res.locals.auth = req.session.auth;
  res.locals.authUser = req.session.authUser;

  next();
});

app.use(async (req, res, next) => {
  let sub = await subCategoryModel.aggregate([
    {
      $group: {
        _id: '$category',
        items: {
          $addToSet: {
            name: '$title',
          },
        },
      },
    },
    {
      $lookup: {
        from: 'categories',
        localField: '_id',
        foreignField: '_id',
        as: '_id',
      },
    },
  ]);

  res.locals.lcCategories = JSON.parse(JSON.stringify(sub));

  next();
});

app.get('/', async (req, res) => {
  console.log(req.session.auth);
  console.log(req.session.authUser);
  res.render('home');
});

app.get('/user', async (req, res) => {
  const p = await User.findOne({ username: 'tientranssss' });

  console.log(p);
  res.status(200).json(p);
});

app.post('/user/register', async (req, res) => {
  const { username, password } = req.body;

  const user = await User.create({
    username,
    password,
  });

  if (user) {
    console.log(user);
    res.status(201).json({
      _username: user.username,
      _password: user.password,
    });
  } else {
    res.status(400);
    throw new Error('Invalid user data');
  }
});

app.get('/product', (req, res) => {
  const p = {
    name: 'Laptop',
    price: 3000,
  };

  res.status(200).json(p);
});

app.use('/account', accountRouter);
app.use('/detail', detailRouter);
app.use('/course', courseRouter);
app.use('/course', courseTeacherRouter);

app.use('/admin/user', adminRoute);
app.use('/admin/category', categoryRoute);
app.use('/admin/course', adminCourseRoute);

app.listen(3000);

app.listen(port, () => {
  console.log(
    `Online Academy Application listening at http://localhost:${port}`
  );
});
