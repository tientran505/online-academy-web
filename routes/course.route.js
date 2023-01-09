import express from 'express';
import Course from '../utils/models/course.model.js';
import CourseService from '../services/course.service.js';

const router = express.Router();

router.get('/list/:category_id', async (req, res) => {

  const category_id = req.params.category_id || '';
  // console.log(category_id);
  const total = await Course.find({category: category_id}).count();
  // console.log(total);
  // const a = await Course.find().count();
  // console.log(a);
  const limit = 6;
  const curPage = req.query.page || 1;
  const offset = (curPage - 1) * limit;
  // const total =  await Course.find().count();
  const nPage = Math.ceil(total / limit);
  const pageNumber = [];
  for (let i = 1; i <= nPage; i++) {
    pageNumber.push({
      value: i,
      isCurrent: i === +curPage,
    });
  }
  const list = await CourseService.findConditionCategory(category_id, offset, limit);

  let prePage;
  let nextPage;
  if (1 === +curPage) {
    prePage = 0;
  } else {
    prePage = +curPage - 1;
  }
  if (+nPage === +curPage) {
    nextPage = 0;
  } else if (+nPage === 0) {
    nextPage = 0;
  } else {
    nextPage = +curPage + 1;
  }

  res.render('vwCourse/byCat', {
    course: list,
    pageNumber: pageNumber,
    empty: list.length === 0,
    prePage: prePage,
    nextPage: nextPage,
  });
});
router.get('/list', async (req, res) => {

  const total = await Course.find().count();

  const limit = 6;
  const curPage = req.query.page || 1;
  const offset = (curPage - 1) * limit;
  //const total =  await Course.find().count();
  const nPage = Math.ceil(total / limit);
  const pageNumber = [];
  for (let i = 1; i <= nPage; i++) {
    pageNumber.push({
      value: i,
      isCurrent: i === +curPage,
    });
  }
  let list;

  list = await CourseService.findCondition(offset, limit);

  let prePage;
  let nextPage;
  if (1 === +curPage) {
    prePage = 0;
  } else {
    prePage = +curPage - 1;
  }
  if (+nPage === +curPage) {
    nextPage = 0;
  } else if (+nPage === 0) {
    nextPage = 0;
  } else {
    nextPage = +curPage + 1;
  }

  res.render('vwCourse/byCat', {
    course: list,
    pageNumber: pageNumber,
    empty: list.length === 0,
    prePage: prePage,
    nextPage: nextPage,
  });
});

export default router;
