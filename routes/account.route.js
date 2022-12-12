import express from 'express';

const router = express.Router();

router.get('/register', (req, res) => {
  res.render('vwAccount/register', {
    isPress: true,
  });
});

export default router;
