import express from 'express';
import courseModel from '../utils/models/course.model.js';
import User from '../utils/models/user.model.js';
import mongoose from 'mongoose';

const router = express.Router();

router.get('/:id', async (req, res) => {
  const id = mongoose.Types.ObjectId(req.params.id);

  const table = await courseModel.find({ _id: id });
  
  const category_list = await courseModel.find({
    category: table[0].category,
    _id: { $ne: id },
  });

  const list = JSON.parse(JSON.stringify(table));
  const list_cate = JSON.parse(JSON.stringify(category_list));

  let limit = Math.ceil((list_cate.length > 5 ? 5 : list_cate.length) / 3);

  const slideList = [];
  let listSlide = [];
  let listCate = [];
  let k = 0;
  for (let i = 0; i < limit; i++) {
    listCate = [];
    listSlide = [];
    let size = list_cate.length - 3 * i > 3 ? 3 : list_cate.length - 3 * i;
    for (let j = 0; j < size; j++) {
      list_cate[k].price =
        parseInt(list_cate[k].price) - parseInt(list_cate[k].sale);
      listCate.push(list_cate[k]);
      k++;
    }
    listSlide.push({ cates: listCate, activeSlide: i === 0 });
    slideList.push({ slides: listSlide });
  }

  res.render('vwDetail/detail-academy', {
    course: list,
    slide: slideList,
  });
});

export default router;
