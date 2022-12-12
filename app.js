import express from 'express';
import connectDB from './utils/config/db.js';
import dotenv from 'dotenv';
import { engine } from 'express-handlebars';
import User from './utils/models/User.js';
import accountRouter from './routes/account.route.js';
import hbs_sections from 'express-handlebars-sections';

dotenv.config();
const port = process.env.PORT || 5000;
connectDB();

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
    },
  })
);

app.set('view engine', 'hbs');
app.set('views', './views');

app.get('/', (req, res) => {
  res.render('home');
});

app.get('/user', async (req, res) => {
  const p = await User.find();

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

app.listen(3000);

app.listen(port, () => {
  console.log(
    `Online Academy Application listening at http://localhost:${port}`
  );
});
