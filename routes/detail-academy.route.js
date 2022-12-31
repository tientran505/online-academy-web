import express from 'express';
import courseModel from '../utils/models/course.model.js';
import User from '../utils/models/user.model.js';
import mongoose from 'mongoose';

const router = express.Router();

router.get('/:id', async (req, res) => {
  const id = mongoose.Types.ObjectId(req.params.id);
  
  const table = await courseModel.find({_id: id});
  const category_list = await courseModel.find({category: table[0].category, _id: {$ne: id}});

  const list = JSON.parse(JSON.stringify(table));
  const list_cate = JSON.parse(JSON.stringify(category_list));

  res.render('vwDetail/detail-academy', {
    course: list,
    cate: list_cate,
  });
});

export default router;