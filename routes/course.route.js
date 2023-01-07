import express from 'express';
import Course from '../utils/models/course.model.js';
import CourseService from '../services/course.service.js';
import fs from 'fs'
import multer from 'multer';
import path from 'path';

const router = express.Router();

router.get('/list/:course', async (req, res) => {
  const course = req.params.course || "";
  let total;
  if(course === "All"){
   total =  await Course.find().count();
  }
  else{
    total =  await Course.find({category:course}).count();
  }
  const limit = 6;
  const curPage = req.query.page || 1;
  const offset = (curPage - 1)*limit;
  //const total =  await Course.find().count();
  const nPage = Math.ceil(total/limit);
  const pageNumber =[];
  for (let i =1;i <= nPage; i++){
    pageNumber.push({
      value:i,
      isCurrent: i ===+curPage,
    })
  }
  let list;
  if(course === "All"){
    list = await CourseService.findCondition(offset,limit);
   
  }
  else{
    list = await CourseService.findConditionCategory( course,offset,limit );
    
  }
  
  // const p = await CourseService.findAll();
  // // list = JSON.parse(JSON.stringify(p));
  // console.log(p);
  // // const list = JSON.parse(JSON.stringify(p));
  let prePage;
  let nextPage;
  if(1 ===+curPage){
    prePage =0;
  }
  else{
    prePage = +curPage -1;
  }
  if(+nPage===+curPage){
    nextPage= 0;
  }
  else if(+nPage===0){
    nextPage=0;
  }
  else{
    nextPage = +curPage +1;
  }

  res.render('vwCourse/byCat', {
    course: list,
    pageNumber: pageNumber,
    empty: list.length === 0,
    prePage: prePage,
    nextPage: nextPage,
  });
});
//
// router.get('/editor', async (req, res) => {
//   res.render('vwCourse/add');
// });
// router.post('/editor', (req, res) => {
//   console.log(req.body);
//   res.render('vwCourse/add');
// });


router.get('/upload', async (req, res) => {
  res.render('vwCourse/upload');
});

router.post('/upload',(req, res) => {
  const storage = multer.diskStorage({
    destination: function (req, file, cb) {
      const { id } = req.body
      const path = `./public/imgs/${id}`
      fs.mkdirSync(path, { recursive: true })
      cb(null,path)
    },
    filename: function (req, file, cb) {
      cb(null, file.fieldname + file.originalname +path.extname(file.originalname));
    }
  });

  // console.log(req.body);
  // console.log(req.file);
  const upload = multer({ storage: storage });
  upload.array('img',5)(req,res, async function(err){
    // console.log(req.body);
    if(err){
      console.error(err);
    }
    else{
      const {course_name, is_completed,price, sale,brief_description,detail_description} =req.body;
      // console.log(req.body);
      const course = await Course.create({
        course_name,
        is_completed: is_completed?true:false,
        price,
        sale,
        brief_description,
        detail_description,
      });
      
      // console.log(course)
      res.render('vwCourse/upload');
    }
  })
});
export default router;
