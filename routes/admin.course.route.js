import express from 'express';
import courseModel from '../utils/models/course.model.js';

const router = express.Router();

router.get('/', async (req, res) => {
    const list = await courseModel.find();
    var courseList = JSON.parse(JSON.stringify(list));
    console.log(courseList)
    res.render('vwAdmin/course', {
      courses: courseList,
    });
});

export default router;