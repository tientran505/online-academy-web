import express from 'express';
import courseModel from '../utils/models/course.model.js';
import userModel from '../utils/models/user.model.js';
import mongoose from 'mongoose';
import courseService from '../services/course.service.js';
import userService from '../services/user.service.js';
import reviewService from '../services/review.service.js';

const router = express.Router();

router.get('/:id', async (req, res) => {
  let isRegistered = true;
  const id = mongoose.Types.ObjectId(req.params.id);
  const list = [];
  list.push(JSON.parse(JSON.stringify(await courseModel.findById(id))));

  if (req.session.auth) {
    const { _id } = req.session.authUser;
    const user = JSON.parse(JSON.stringify(await userService.findById(_id)));
    const registered = await userService.checkRegistered(_id, id);
    if (registered === null) {
      isRegistered = true;
    } else {
      isRegistered = false;
    }

    for (let h = 0; h < user.favorite_courses.length; h++) {
      if (user.favorite_courses[h] === list[0]['_id']) {
        list[0]['heart'] = true;
      } else {
        list[0]['heart'] = false;
      }
    }
  }

  const u = JSON.parse(
    JSON.stringify(await userService.findById(list[0].author))
  );

  if (u.name !== null) list[0]['authorName'] = u.name;
  else list[0]['authorName'] = '';

  const category_list = await courseModel.find({
    category: mongoose.Types.ObjectId(list[0].category),
    _id: { $ne: id },
  });

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

  const s5 = await reviewService.getCountRatingByStar(id, 5);
  const s4 = await reviewService.getCountRatingByStar(id, 4);
  const s3 = await reviewService.getCountRatingByStar(id, 3);
  const s2 = await reviewService.getCountRatingByStar(id, 2);
  const s1 = await reviewService.getCountRatingByStar(id, 1);
  const total = await reviewService.getCountRating(id);
  const avg = Math.floor(
    (s5 * 5 + s4 * 4 + s3 * 3 + s2 * 2 + s1 * 1) / total
  ).toFixed(1);

  const limitItems = 3;
  const curPage = req.query.page || 1;
  const offset = (curPage - 1) * limitItems;
  const nPage = Math.ceil(total / limitItems);
  const pageNumber = [];

  for (let i = 1; i <= nPage; i++) {
    pageNumber.push({
      value: i,
      isCurrent: i === +curPage,
    });
  }

  let course_review = JSON.parse(
    JSON.stringify(await reviewService.findCondition(id, offset, limitItems))
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

  const fStar = {
    num: s5,
    percentage: Math.floor((s5 * 100) / total),
  };

  const foStar = {
    num: s4,
    percentage: Math.floor((s4 * 100) / total),
  };

  const thStar = {
    num: s3,
    percentage: Math.floor((s3 * 100) / total),
  };

  const twStar = {
    num: s2,
    percentage: Math.floor((s2 * 100) / total),
  };

  const oStar = {
    num: s1,
    percentage: Math.floor((s1 * 100) / total),
  };
  const section = await courseService.loadSectionLecture(id);

  res.render('vwDetail/detail-academy', {
    course: list[0],
    slide: slideList,
    emptySlide: slideList.length === 0,
    isRegistered: isRegistered,
    course_review,
    fStar,
    foStar,
    thStar,
    twStar,
    oStar,
    total,
    avg,
    section,
    pageNumber,
    prePage,
    nextPage,
  });
});

router.post('/review/:id', async (req, res) => {
  const { rate, content } = req.body;
  const courseID = req.params.id;
  const { _id } = req.session.authUser;

  var today = new Date();
  var dd = String(today.getDate()).padStart(2, '0');
  var mm = String(today.getMonth() + 1).padStart(2, '0'); //January is 0!
  var yyyy = today.getFullYear();

  today = dd + '/' + mm + '/' + yyyy;

  const review = {
    course: courseID,
    user: _id,
    content,
    rating: rate,
    created_date: today,
  };

  await reviewService.createOne(review);

  return res.redirect('/detail/' + courseID);
});

router.post('/addwatchlist', async (req, res) => {
  console.log('add to watchlist');
  const { _id } = req.session.authUser;
  const idCourse = req.body.txtCourse;

  const user = await userService.checkHeart(_id, idCourse);

  if (user === null) {
    await userService.insertFavoriteCourse(_id, idCourse);
  } else {
    await userService.removeFavoriteCourse(_id, idCourse);
  }

  return res.redirect('/detail/' + idCourse);
});

router.post('/addregisteredlist', async (req, res) => {
  const { _id } = req.session.authUser;
  const idCourse = req.body.txtCourse;

  await userService.insertRegisteredCourse(_id, idCourse);
  return res.redirect('/detail/' + idCourse);
});

export default router;
