import express from 'express';
import Course from '../utils/models/course.model.js';
import CourseService from '../services/course.service.js';
import fs from 'fs';
import multer from 'multer';
import path from 'path';
const router = express.Router();
import Lecture from '../utils/models/lecture.model.js';
import Section from '../utils/models/section.model.js';
import authWithRequiredPermission from '../mdw/auth.mdw.js';
import SubCategory from '../utils/models/sub-category.model.js';
router.get('/addCourse', authWithRequiredPermission(1), async (req, res) => {
  const category = await SubCategory.find();
  const list = JSON.parse(JSON.stringify(category));
  // console.log(list);
  res.render('vwCourse/addCourse', {
    category : list,
  });
});

router.post('/addCourse', (req, res) => {
  let img;
  const storage = multer.diskStorage({
    destination: function (req, file, cb) {

      const path = `./public/imgs/`;
      fs.mkdirSync(path, { recursive: true });
      cb(null, path);
    },
    filename: function (req, file, cb) {
      img =  file.originalname + path.extname(file.originalname);
      cb(
        null,
         file.originalname + path.extname(file.originalname)
      );
    },
  });

  //
  const upload = multer({ storage: storage });
  upload.single('img', 1)(req, res, async function (err) {
    if (err) {
      console.error(err);
    } else {

      const {

        course_name,
        is_completed,
        price,
        sale,
        brief_description,
        detail_description,
      } = req.body;
      const course = await Course.create({
        course_name,
        author: req.session.authUser._id,
        is_completed: is_completed ? true : false,
        price,
        sale,
        img,
        rate: 0,
        brief_description,
        detail_description,
      });

      res.redirect('/course/viewSectionLecture/' + course._id);
    }
  });
});
router.get('/editCourse/:id', authWithRequiredPermission(1), async (req, res) => {
  const course_id = req.params.id || '';
  const category = await SubCategory.find();
  const c = await Course.findOne({ _id: course_id });

  const listcategory = JSON.parse(JSON.stringify(category));
    // console.log(listcategory);

  // for(const ca in listcategory){
  //   if(ca._id === c.category){
  //     ca.choice = true;
  //   }
  // }
  const listcourse = JSON.parse(JSON.stringify(c));
  console.log(listcourse);

  // console.log(list);
  res.render('vwCourse/editCourse', {
    course_id:listcourse.course_id,
    course_name: listcourse.course_name,
    brief_description:listcourse.brief_description,
    detail_description:listcourse.detail_description,
    sale:listcourse.sale,
    price:listcourse.price,
    is_complete: listcourse.is_complete,
    category:listcategory,
  });
});
router.post('/editCourse/:id', authWithRequiredPermission(1), async (req, res) => {

    let img;
    const storage = multer.diskStorage({
      destination: function (req, file, cb) {

        const path = `./public/imgs/`;
        fs.mkdirSync(path, { recursive: true });
        cb(null, path);
      },
      filename: function (req, file, cb) {
        img =  file.originalname + path.extname(file.originalname);
        cb(
            null,
            file.originalname + path.extname(file.originalname)
        );
      },
    });

    //
    const upload = multer({ storage: storage });
    upload.single('img', 1)(req, res, async function (err) {
      if (err) {
        console.error(err);
      } else {
        const course_id = req.params.id || '';
        const {
          course_name,
          is_completed,
          price,
          sale,
          brief_description,
          detail_description,
        } = req.body;
        const course = await Course.updateOne(
            {_id: course_id},
            {
              course_name,
              author: req.session.authUser._id,
              is_completed: is_completed ? true : false,
              price,
              sale,
              img,

              brief_description,
              detail_description,
            });


        res.redirect('/course/viewCourses/' );
      }
    });
  });
router.get('/viewSectionLecture/:id', authWithRequiredPermission(1), async (req, res) => {
  const course_id = req.params.id || '';
  const p = await CourseService.loadSectionLecture(course_id);
 const a = await Course.findOne({_id:course_id});
  res.render('vwCourse/viewSectionLecture', {
    course_id: course_id,
    course_name: a.course_name,
    section: p,
    empty: p.length === 0,
  });
});

router.get('/editSection/:id', authWithRequiredPermission(1), async (req, res) => {
  const course_id = req.params.id || '';
  const p = await CourseService.loadSectionLecture(course_id);

  res.render('vwCourse/editSection', {
    course_id: course_id,
    section: p,
    empty: p.length === 0,
  });
});

router.get('/addSection/:id', authWithRequiredPermission(1), async (req, res) => {
  const course_id = req.params.id || '';
  const p = await CourseService.loadSectionLecture(course_id);
  res.render('vwCourse/addSection', {
    course_id: course_id,
    section: p,
    empty: p.length === 0,
  });
});

router.post('/addSection/:id', async (req, res) => {
  const course_id = req.params.id || '';
  const p = req.body;
  console.log(req.body);
  console.log(p.SectionName.length);
  for (let i = 0; i < p.SectionName.length; i++) {
    //console.log(p[Object.keys(p)[i]]);
    if (p.SectionName[i] !== '') {
      const section = await Section.create({
        title: p.SectionName[i],
        course_id,
      });
      console.log(section);
      res.redirect('/course/viewSectionLecture/' + course_id);
      // res.render('vwCourse/viewListContent',{
      //     course_id: course._id,
      //     course_name: course.course_name,
      //
      // });
    }
  }
});

router.get('/viewSectionLecture/:id', authWithRequiredPermission(1), async (req, res) => {
  const course_id = req.params.id || '';
  const c = await Course.findOne({ _id: course_id });
  const p = await CourseService.loadSectionLecture(course_id);
  const list = JSON.parse(JSON.stringify(c));
  console.log(list.course_name);
  // console.log(list);
  res.render('vwCourse/viewSectionLecture', {
    course_id: course_id,
    course_name: list.course_name,
    section: p,
    empty: p.length === 0,
  });
});
// router.get('/addSection', async (req, res) => {
//     res.render('vwCourse/addSection');
// });
//
// router.post('/addSection', async (req, res) => {
//     // res.render('vwCourse/newContent');
//     const storage = multer.diskStorage({
//         destination: function (req, file, cb) {
//             // const { id } = req.body
//             const path = `./public/imgs/`
//             fs.mkdirSync(path, { recursive: true })
//             cb(null,path)
//         },
//         filename: function (req, file, cb) {
//             cb(null, file.fieldname + file.originalname +path.extname(file.originalname));
//         }
//     });
//
//
//     // console.log(req.file);
//     const upload = multer({ storage: storage });
//     upload.array('img',5)(req,res, async function(err){
//         // console.log(req.body);
//         if(err){
//             console.error(err);
//         }
//         else{
//             console.log(req.body);
//             const {title, Lecture,status} =req.body;
//
//
//             // console.log(course)
//             // res.render('vwCourse/newContent');
//         }
//     })
// });
router.get('/editCourseSection/:id', authWithRequiredPermission(1), async (req, res) => {
  const course_id = req.params.id || '';
  const c = await Course.findOne({ _id: course_id });
  const p = await CourseService.loadSectionLecture(course_id);
  const list = JSON.parse(JSON.stringify(c));
  // console.log(list);
  res.render('vwCourse/editCourseSection', {
    course_id: course_id,
    course_name: list.course_name,
    section: p,
    empty: p.length === 0,
  });
});
router.post('/editCourseSection/:id', async (req, res) => {
  // console.log(req.body);
  const p = req.body;
  const course_id = req.params.id || '';
  const course = await Course.updateOne(
    { _id: course_id },
    {
      course_name: p.course_name,
    }
  );
  if(p.title != null){
  for (let i = 0; i < p.title.length; i++) {
    const section = await Section.updateOne(
      {
        _id: p.id[i],
      },
      {
        title: p.title[i],
      }
    );
  }}
  res.redirect('/course/viewSectionLecture/' + course_id);
});
router.get('/editLecture/:id', authWithRequiredPermission(1), async (req, res) => {
  const lecture_id = req.params.id || '';
  const p = await Section.findOne({ lectures: lecture_id });
  // console.log(p.title);
  const l = await Lecture.findOne({ _id: lecture_id });
  const list = JSON.parse(JSON.stringify(l));
  // console.log(l.title);
  // const section = Section.find({_id:section_id});
  res.render('vwCourse/editLecture', {
    section_name: p.title,
    course_id: p.course_id,
    lecture_title: list.title,
    lecture_id: list._id,
    lecture_url: list.url,
  });
});
router.post('/editLecture/:id', async (req, res) => {
  // console.log(req.body);
  const lecture_id = req.params.id || '';
  const p = req.body;
  const s = await Section.findOne({ lectures: lecture_id });
  // console.log(s.course_id);
  const list = JSON.parse(JSON.stringify(s));

  const lecture = await Lecture.updateOne(
    { _id: p.id },
    {
      title: p.title,
      url: p.url,
    }
  );
  // console.log(lecture);
  res.redirect('/course/viewSectionLecture/' + list.course_id);

  // const lecture_id = req.params.id || "";
  // const p = await Section.findOne({lectures: lecture_id});
  // // console.log(p.title);
  // const l = await Lecture.findOne({_id: lecture_id});
  // const list =  JSON.parse(JSON.stringify(l));
  // // console.log(l.title);
  // // const section = Section.find({_id:section_id});
  // res.render('vwCourse/editLecture',{
  //     section_name: p.title,
  //     lecture_title: list.title,
  //     lecture_id:list._id,
  //     lecture_url:list.url,
  // });
});
router.get('/addSection/:id', authWithRequiredPermission(1), async (req, res) => {
  const course_id = req.params.id || '';
  const p = await CourseService.loadSectionLecture(course_id);
  
  res.render('vwCourse/addSection', {
    course_id: course_id,
    section: p,
    empty: p.length === 0,
  });
});
router.get('/viewCourses', authWithRequiredPermission(1), async (req, res) => {

  const course = await Course.find({author: req.session.authUser._id});
  const list = JSON.parse(JSON.stringify(course));
  // console.log(list);
  // const p = await CourseService.loadSectionLecture(course_id);
  res.render('vwCourse/viewCourses', {
    course: list,
    empty: list.length ===0,
  });
});
router.post('/addSection/:id', async (req, res) => {
  const course_id = req.params.id || '';
  const p = req.body;
  console.log(p);
  if(p.SectionName != null){
  for (let i = 0; i < p.SectionName.length; i++) {
    if (p.SectionName[i] !== '') {
      const section = await Section.create({
        title: p.SectionName[i],
        course_id,
      });
      // console.log(section);
    }
  }}
  res.redirect('/course/viewSectionLecture/' + course_id);
});

router.get('/addLecture/:id', authWithRequiredPermission(1), async (req, res) => {
  const section_id = req.params.id || '';
  const section = Section.find({ _id: section_id });
  res.render('vwCourse/addLecture', {
    section: section,
    course_id: section.course_id,
  });
});

router.post('/addLecture/:id', async (req, res) => {
  const section_id = req.params.id || '';
  const s = await Section.findOne({ _id: section_id });
  // console.log(s.course_id);
  const list = JSON.parse(JSON.stringify(s));
  const p = req.body;
  for (let i = 0; i < p.title.length; i++) {
    // console.log(p.title[i],p.url[i])
    if (p.title[i] !== '' && p.url[i] != '') {
      const lecture = await Lecture.create({
        title: p.title[i],
        url: p.url[i],
      });
      // console.log(lecture);
      const section = await Section.updateOne(
        {
          _id: section_id,
        },
        {
          $push: {
            lectures: lecture._id,
          },
        }
      );
    }
    res.redirect('/course/viewSectionLecture/' + list.course_id);
  }
});
router.post('/lecture/del', async function (req, res) {
 const p = req.body;
 // console.log(p);
 const l = await Lecture.deleteOne({ _id: p.id });
  const s = await Section.findOne({ lectures: p.id });
  const list = JSON.parse(JSON.stringify(s));
  // console.log(list);
  res.redirect('/course/viewSectionLecture/' + list.course_id);
});
router.post('/del/:id', async function (req, res) {
  const course_id = req.params.id || '';
  console.log(course_id);
  const course = await Course.deleteOne({ _id: course_id});
  console.log(course);
  res.redirect('/course/viewCourses/');
});
router.post('/section/del/:id', async function (req, res) {
  const section_id = req.params.id || '';
  const s = await Section.findOne({_id:section_id});
  if(s != null){
  const course_id = s.course_id;
  console.log(course_id);
  const section = await Section.deleteOne({ _id: section_id});
  console.log(section);
  res.redirect('/course/editCourseSection/' + course_id);}
  else{
    res.redirect('/course/viewCourses/');
  }

});
export default router;
