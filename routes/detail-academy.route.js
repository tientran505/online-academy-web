import express from 'express';
import courseModel from '../utils/models/course.model.js';
import User from '../utils/models/user.model.js';
import mongoose from 'mongoose';

const router = express.Router();

router.get('/:id', async (req, res) => {
  console.log('params: ' + req.params.id);

  const id = mongoose.Types.ObjectId(req.params.id);
  const table = await courseModel.findById(id);

  const list = JSON.parse(JSON.stringify(table));
  res.render('vwDetail/detail-academy', {
    course: list,
  });
});

export default router;
