import express from 'express';
import Course from '../utils/models/course.model.js';

const router = express.Router();

router.get('/', async (req, res) => {

  const limit = 6;
  const curPage = req.query.page || 1;
  const offset = (curPage - 1)*limit;
  const total =  await Course.find().count();
  const nPage = Math.ceil(total/limit);
  const pageNumber =[];
  for (let i =1;i <= nPage; i++){
    pageNumber.push({
      value:i,
      isCurrent: i ===+curPage,
    })
  }
  const p = await Course.find().skip(offset).limit(limit);
  const list = JSON.parse(JSON.stringify(p));
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
  else{
    nextPage = +curPage +1;
    
  }
  //console.log(list);
  
  res.render('vwCourse/byCat', {
    course: list,
    pageNumber: pageNumber,
    empty: list.length === 0,
    prePage: prePage,
    nextPage: nextPage,
  });
});

export default router;
