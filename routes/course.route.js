import express from 'express';
import Course from '../utils/models/course.model.js';
import CourseService from '../services/course.service.js';
import courseModel from '../utils/models/course.model.js';
import categoryModel from '../utils/models/category.model.js';
import mongoose from 'mongoose';
import subcategoryModel from '../utils/models/sub-category.model.js';
import subCategoryModel from '../utils/models/sub-category.model.js';

const router = express.Router();

router.get('/list/:category_id', async (req, res) => {
  const category_id = req.params.category_id || '';
  // console.log(category_id);
  const total = await Course.find({ category: category_id }).count();
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
  const list = await CourseService.findConditionCategory(
    category_id,
    offset,
    limit
  );

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

router.post('/search', async (req, res) => {
  const { q } = req.query;
  const { select } = req.body;

  console.log(q, select);

  const limit = 6;
  const curPage = req.query.page || 1;
  const offset = (curPage - 1) * limit;
  const nPage = Math.ceil(total / limit);
  const pageNumber = [];
  for (let i = 1; i <= nPage; i++) {
    pageNumber.push({
      value: i,
      isCurrent: i === +curPage,
    });
  }

  let list;
  if (select === 'rating') {
  }

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

  select === 'rating'
    ? JSON.parse(
        JSON.stringify(
          await courseModel
            .find({ $text: { $search: q } })
            .sort({ rating: -1 })
            .populate('author')
        )
      )
    : JSON.parse(
        JSON.stringify(
          await courseModel
            .find({ $text: { $search: q } })
            .sort({ sale: 1 })
            .populate('author')
        )
      );

  return res.render('vwCourse/search', {
    list,
    numOfResult: list.length,
    text: q,
    rating: select === 'rating',
  });
});

router.get('/search', async (req, res) => {
  const { q, select,page } = req.query;

  const list = JSON.parse(
    JSON.stringify(
      await courseModel.find({ $text: { $search: q } }).populate('author')
    )
  );
  let path;
  if(select){
    path = '/course/search?q='+q+'&select='+select+'&';
  }
  else{
     path = '/course/search?q='+q+'&';
  }
  console.log(path);
  const total = list.length;
  const curPage = page || 1;
  console.log(curPage);
  const limit = 6;
  const offset = (curPage - 1) * limit;
  const nPage = Math.ceil(total / limit);
  const pageNumber = [];
  for (let i = 1; i <= nPage; i++) {
    pageNumber.push({
      value: i,
      isCurrent: i === +curPage,
    });
  }
  const list2 = JSON.parse(
      JSON.stringify(
          await courseModel.find({ $text: { $search: q } }).populate('author').skip(offset).limit(limit)
      )
  );
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
  return res.render('vwCourse/search', {
    list2,
    numOfResult: list.length,
    text: q,
    select: select,
    pageNumber: pageNumber,
    empty: list.length === 0,
    prePage: prePage,
    nextPage: nextPage,
    path: path,
  });
});

export default router;
