import express from 'express';
import Course from '../utils/models/course.model.js';
import CourseService from '../services/course.service.js';
import fs from 'fs';
import multer from 'multer';
import path from 'path';
const router = express.Router();
import Lecture from '../utils/models/lecture.model.js';
import Section from '../utils/models/section.model.js';

router.get('/addCourse', async (req, res) => {
  res.render('vwCourse/addCourse');
});

router.post('/addCourse', (req, res) => {
  const storage = multer.diskStorage({
    destination: function (req, file, cb) {
      const { id } = req.body;
      const path = `./public/imgs/${id}`;
      fs.mkdirSync(path, { recursive: true });
      cb(null, path);
    },
    filename: function (req, file, cb) {
      cb(
        null,
        file.fieldname + file.originalname + path.extname(file.originalname)
      );
    },
  });

  const upload = multer({ storage: storage });
  upload.array('img', 5)(req, res, async function (err) {
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
        is_completed: is_completed ? true : false,
        price,
        sale,
        brief_description,
        detail_description,
      });

      res.redirect('/course/viewSectionLecture/' + course._id);
    }
  });
});
router.get('/viewSectionLecture/:id', async (req, res) => {
  const course_id = req.params.id || '';
  const p = await CourseService.loadSectionLecture(course_id);
  for (const c of p) {
    // console.log(c.lectures);
  }
  res.render('vwCourse/viewSectionLecture', {
    course_id: course_id,
    section: p,
    empty: p.length === 0,
  });
});

router.get('/editSection/:id', async (req, res) => {
  const course_id = req.params.id || '';
  const p = await CourseService.loadSectionLecture(course_id);

  res.render('vwCourse/editSection', {
    course_id: course_id,
    section: p,
    empty: p.length === 0,
  });
});

router.get('/addSection/:id', async (req, res) => {
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
  console.log(p);
  console.log(p.SectionName.length);
  for (let i = 0; i < p.SectionName.length; i++) {
    //console.log(p[Object.keys(p)[i]]);
    if (p.SectionName[i] !== '') {
      const section = await Section.create({
        title: p.SectionName[i],
        course_id,
      });
      console.log(section);
    }
  }
  res.redirect('/course/viewSectionLecture/' + course_id);
});
router.get('/addLecture/:id', async (req, res) => {
  const section_id = req.params.id || '';
  const section = Section.find({ _id: section_id });
  res.render('vwCourse/addLecture', {
    section: section,
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

export default router;
