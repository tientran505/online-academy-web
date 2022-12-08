import express from 'express';
import connectDB from './utils/config/db.js';
import dotenv from 'dotenv';
import { engine } from 'express-handlebars';

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
  })
);

app.set('view engine', 'hbs');
app.set('views', './views');

app.get('/', (req, res) => {
  res.render('home');
});

app.listen(3000);

app.listen(port, () => {
  console.log(
    `Online Academy Application listening at http://localhost:${port}`
  );
});
