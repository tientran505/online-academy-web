import express from 'express';
import Course from '../utils/models/course.model.js';
const router = express.Router();

router.get('/',async (req, res) => {
    const p = await Course.find();
    const list = JSON.parse(JSON.stringify(p));
    res.render('vwCourse/byCat',{
        course: list,
    });

});

export default router;