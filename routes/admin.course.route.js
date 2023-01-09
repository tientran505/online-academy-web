import express from 'express';
import userModel from '../utils/models/user.model.js';
import categoryService from '../services/category.service.js';
import courseService from '../services/course.service.js'

const router = express.Router();

router.get('/', async (req, res) => {
    var courseList = JSON.parse(JSON.stringify(await courseService.findAll()));
    var categoryList = JSON.parse(JSON.stringify(await categoryService.findAll()));

    for (let i = 0; i < courseList.length; i++) {
        for (let j = 0; j < categoryList.length; j++) {
            if (courseList[i]['category'] === categoryList[j]['_id']) {
                courseList[i]['title'] = categoryList[j]['title'];
            }
        }
    }

    res.render('vwAdmin/course', {
      courses: courseList,
      cates: categoryList,
    });
});

router.get('/orderName', async (req, res) => {
    var courseList = JSON.parse(JSON.stringify(await courseService.findAll()));
    var categoryList = JSON.parse(JSON.stringify(await categoryService.findAll()));
    
    for (let i = 0; i < courseList.length; i++) {
        for (let j = 0; j < categoryList.length; j++) {
            if (courseList[i]['category'] === categoryList[j]['_id']) {
                courseList[i]['title'] = categoryList[j]['title'];
            }
        }
    }

    const order = req.query.orderName;

    if (order === 'A-Z') {
        res.render('vwAdmin/course', {
            courses: courseList.sort(function(a, b) {
                return a.course_name.charCodeAt(0) - b.course_name.charCodeAt(0);
            }),
            cates: categoryList,
        });
    }
    else if (order === 'Z-A') {
        res.render('vwAdmin/course', {
            courses: courseList.sort(function(a, b) {
                return b.course_name.charCodeAt(0) - a.course_name.charCodeAt(0);
            }),
            cates: categoryList,
        });
    }
});

router.get('/orderAuthor', async (req, res) => {
    var courseList = JSON.parse(JSON.stringify(await courseService.findAll()));
    var categoryList = JSON.parse(JSON.stringify(await categoryService.findAll()));
    
    for (let i = 0; i < courseList.length; i++) {
        for (let j = 0; j < categoryList.length; j++) {
            if (courseList[i]['category'] === categoryList[j]['_id']) {
                courseList[i]['title'] = categoryList[j]['title'];
            }
        }
    }

    const order = req.query.orderAuthor;

    if (order === 'A-Z') {
        res.render('vwAdmin/course', {
            courses: courseList.sort(function(a, b) {
                return a.authors.charCodeAt(0) - b.authors.charCodeAt(0);
            }),
            cates: categoryList,
        });
    }
    else if (order === 'Z-A') {
        res.render('vwAdmin/course', {
            courses: courseList.sort(function(a, b) {
                return b.authors.charCodeAt(0) - a.authors.charCodeAt(0);
            }),
            cates: categoryList,
        });
    }
});

router.get('/category', async (req, res) => {
    var courseList = JSON.parse(JSON.stringify(await courseService.findAll()));
    var categoryList = JSON.parse(JSON.stringify(await categoryService.findAll()));

    const order = req.query.cateID;

    let courseOrderCate = [];
    let cate = JSON.parse(JSON.stringify(await categoryService.findCategoryById(order)));

    for (let i = 0; i < courseList.length; i++) {
        if (order === courseList[i]['category']) {
            courseList[i]['title'] = cate['title'];
            courseOrderCate.push(courseList[i]);
        }
    }

    res.render('vwAdmin/course', {
        courses: courseOrderCate,
        cates: categoryList,
    })
});

router.post('/disable', async (req, res) => {
    var courseList = JSON.parse(JSON.stringify(await courseService.findAll()));

    const lengthID = courseList[0]['_id'].length;
    const order = req.body.txtDisable;
    const orderID = order.slice(0, lengthID);
    const orderAction = order.slice(lengthID + 1);

    await courseService.patch(orderID, orderAction);
    
    return res.redirect('/admin/course');
});

export default router;