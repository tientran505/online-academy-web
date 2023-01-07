import express from 'express';
import Course from '../utils/models/course.model.js';
import CourseService from '../services/course.service.js';
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
router.get('/add', async (req, res) => {
  res.render('vwCourse/add');
});
router.post('/add', (req, res) => {
  console.log(req.body);
  res.render('vwCourse/add');
});
export default router;
