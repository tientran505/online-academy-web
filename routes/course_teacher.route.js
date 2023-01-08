import express from 'express';
import Course from '../utils/models/course.model.js';
import CourseService from '../services/course.service.js';
import fs from 'fs'
import multer from 'multer';
import path from 'path';

const router = express.Router();

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
    console.log(req.file);
    const upload = multer({ storage: storage });
    upload.array('img',5)(req,res, async function(err){
        if(err){
            console.error(err);
        }
        else{
            console.log(req.body);
            const {course_name, is_completed,price, sale,brief_description,detail_description} =req.body;
            const course = await Course.create({
                course_name,
                is_completed: is_completed?true:false,
                price,
                sale,
                brief_description,
                detail_description,
            });
            console.log(course._id);

            res.redirect('viewCourseList/'+course._id);
            // res.render('vwCourse/viewListContent',{
            //     course_id: course._id,
            //     course_name: course.course_name,
            //
            // });
        }
    })
});
router.get('/viewCourseList/:id',async (req,res)=> {
    const course_id = req.params.id || "";
    const p = await CourseService.loadSectionLecture(course_id);
    for(const c of p){
        console.log(c.lectures);
    }
    res.render('vwCourse/viewListContent', {
        course_id: course_id,
        section: p,
        empty: p.length ===0,
    });
});
router.get('/newContent', async (req, res) => {
    res.render('vwCourse/newContent');
});

router.post('/newContent', async (req, res) => {
    // res.render('vwCourse/newContent');
    const storage = multer.diskStorage({
        destination: function (req, file, cb) {
            // const { id } = req.body
            const path = `./public/imgs/`
            fs.mkdirSync(path, { recursive: true })
            cb(null,path)
        },
        filename: function (req, file, cb) {
            cb(null, file.fieldname + file.originalname +path.extname(file.originalname));
        }
    });


    // console.log(req.file);
    const upload = multer({ storage: storage });
    upload.array('img',5)(req,res, async function(err){
        // console.log(req.body);
        if(err){
            console.error(err);
        }
        else{
            console.log(req.body);
            const {title, Lecture,status} =req.body;


            // console.log(course)
            res.render('vwCourse/newContent');
        }
    })
});
export default router;
