import express from 'express';
import courseModel from '../utils/models/course.model.js';
import mongoose from 'mongoose';

const router = express.Router();

router.get('/:id', async (req, res) => {
  const id = mongoose.Types.ObjectId(req.params.id);
  const table = await courseModel.find({_id: id});
  const list = JSON.parse(JSON.stringify(table));
  console.log(list);
  res.render('vwDetail/detail-academy', {
    course: list,
  });
});

export default router;