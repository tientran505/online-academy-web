import express from 'express';
import courseModel from '../utils/models/course.model.js';

const router = express.Router();

router.get('/:id', async (req, res) => {
  const id = req.params.id;
  const table = await courseModel.findOne({course_name: 'NodeJS'});
  const list = JSON.parse(JSON.stringify(table));
  console.log(list);
  res.render('vwDetail/detail-academy', {
    course: list,
  });
});

export default router;