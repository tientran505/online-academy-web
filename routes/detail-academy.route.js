import express from 'express';

const router = express.Router();

router.get('/detail', (req, res) => {
  res.render('vwDetail/detail-academy');
});

export default router;