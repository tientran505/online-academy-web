import express from 'express';
import courseModel from '../utils/models/course.model.js';
import userModel from '../utils/models/user.model.js';
import mongoose from 'mongoose';
<<<<<<< HEAD
import courseService from '../services/course.service.js';
=======
import userService from '../services/user.service.js';
>>>>>>> 909c6ffcbb26408fcdc69595b1829473d3dd41c7

const router = express.Router();

router.get('/:id', async (req, res) => {
<<<<<<< HEAD
  const id = mongoose.Types.ObjectId(req.params.id);

  const u = await courseService.updateView(id);
  console.log(u);

  const table = await courseModel.find({ _id: id });
=======
  const id = (req.params.id);
  const {_id} = req.session.authUser;
  
  const user = JSON.parse(JSON.stringify(await userService.findById(_id)));
  const list = [];
  list.push(JSON.parse(JSON.stringify(await courseModel.findById(id))));

  const u = JSON.parse(JSON.stringify(await userService.findById(list[0].author)));

  if (u.name !== null)
    list[0]['authorName'] = u.name;
  else 
    list[0]['authorName'] = '';

  for (let h = 0; h < user.favorite_courses.length; h++) {
    if (user.favorite_courses[h] === list[0]['_id']) {
      list[0]['heart'] = true;
    }
    else {
      list[0]['heart'] = false;
    }
  }

  const registered = await userService.checkRegistered(_id, id);
  let isRegistered;
  if (registered === null) {
    isRegistered = true;
  }
  else {
    isRegistered = false;
  }
>>>>>>> 909c6ffcbb26408fcdc69595b1829473d3dd41c7

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
      list_cate[k].price = parseInt(list_cate[k].price) - parseInt(list_cate[k].sale);
      listCate.push(list_cate[k]);
      k++;
    }
    listSlide.push({ cates: listCate, activeSlide: i === 0 });
    slideList.push({ slides: listSlide });
  }

  res.render('vwDetail/detail-academy', {
    course: list[0],
    slide: slideList,
    emptySlide: slideList.length === 0,
    isRegistered: isRegistered,
  });
});

router.post('/addwatchlist', async (req, res) => {
  const {_id} = req.session.authUser;
  const idCourse = req.body.txtCourse;

  const user = await userService.checkHeart(_id, idCourse);

  if (user === null) {
    await userService.insertFavoriteCourse(_id, idCourse);
  }
  else {
    await userService.removeFavoriteCourse(_id, idCourse);
  }

  return res.redirect('/detail/' + idCourse);
});

router.post('/addregisteredlist', async (req, res) => {
  const {_id} = req.session.authUser;
  const idCourse = req.body.txtCourse;

  await userService.insertRegisteredCourse(_id, idCourse);
  return res.redirect('/detail/' + idCourse);
});

export default router;
