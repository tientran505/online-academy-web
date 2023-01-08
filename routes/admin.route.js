import express from 'express';
import userModel from '../utils/models/user.model.js';
import mongoose from 'mongoose';

const router = express.Router();

router.get('/', async (req, res) => {
    const list = await userModel.find();
    var userList = JSON.parse(JSON.stringify(list));
    
    for (let i = 0; i < userList.length; i++) {
        userList[i]['no'] = i + 1;
        var date = new Date(userList[i]['birthday']);
        if (isNaN(date.getDate())) {
            userList[i]['birthday'] = ' ';
        }
        else {
            userList[i]['birthday'] = `${date.getDate() - 1}/${date.getMonth()}/${date.getFullYear()}`;
        }
    }
    
    res.render('vwAdmin/admin', {
        users: userList,
    });
});

router.post('/No', async (req, res) => {
    const list = await userModel.find();
    var userList = JSON.parse(JSON.stringify(list));

    for (let i = 0; i < userList.length; i++) {
        userList[i]['no'] = i + 1;
        var date = new Date(userList[i]['birthday']);
        if (isNaN(date.getDate())) {
            userList[i]['birthday'] = ' ';
        }
        else {
            userList[i]['birthday'] = `${date.getDate() - 1}/${date.getMonth()}/${date.getFullYear()}`;
        }

        if (isNaN(userList[i]['name'].charCodeAt(0))) {
            userList[i]['name'] = ' ';
        }

        if (isNaN(userList[i]['email'].charCodeAt(0))) {
            userList[i]['email'] = ' ';
        }
    }

    var order = req.body.value;

    if (order === 'ascending') {
        res.render('vwAdmin/admin', {
            users: userList,
        });
    }
    else if (order === 'descending') {
        res.render('vwAdmin/admin', {
            users: userList.reverse(),
        })
    }
});

router.post('/Name', async (req, res) => {
    const list = await userModel.find();
    var userList = JSON.parse(JSON.stringify(list));

    for (let i = 0; i < userList.length; i++) {
        userList[i]['no'] = i + 1;
        var date = new Date(userList[i]['birthday']);
        if (isNaN(date.getDate())) {
            userList[i]['birthday'] = ' ';
        }
        else {
            userList[i]['birthday'] = `${date.getDate() - 1}/${date.getMonth()}/${date.getFullYear()}`;
        }

        if (isNaN(userList[i]['name'].charCodeAt(0))) {
            userList[i]['name'] = ' ';
        }
        
        if (isNaN(userList[i]['email'].charCodeAt(0))) {
            userList[i]['email'] = ' ';
        }
    }

    var order = req.body.value;

    if (order === 'A-Z') {
        res.render('vwAdmin/admin', {
            users: userList.sort(function(a, b) {return a.name.charCodeAt(0) - b.name.charCodeAt(0)}),
        });
    }
    else if (order === 'Z-A') {
        res.render('vwAdmin/admin', {
            users: userList.sort(function(a, b) {return b.name.charCodeAt(0) - a.name.charCodeAt(0)}),
        })
    }
});

router.post('/Email', async (req, res) => {
    const list = await userModel.find();
    var userList = JSON.parse(JSON.stringify(list));

    for (let i = 0; i < userList.length; i++) {
        userList[i]['no'] = i + 1;
        var date = new Date(userList[i]['birthday']);
        if (isNaN(date.getDate())) {
            userList[i]['birthday'] = ' ';
        }
        else {
            userList[i]['birthday'] = `${date.getDate() - 1}/${date.getMonth()}/${date.getFullYear()}`;
        }

        if (isNaN(userList[i]['name'].charCodeAt(0))) {
            userList[i]['name'] = ' ';
        }

        if (isNaN(userList[i]['email'].charCodeAt(0))) {
            userList[i]['email'] = ' ';
        }

    }

    var order = req.body.value;

    if (order === 'A-Z') {
        res.render('vwAdmin/admin', {
            users: userList.sort(function(a, b) {return a.email.charCodeAt(0) - b.email.charCodeAt(0)}),
        });
    }
    else if (order === 'Z-A') {
        res.render('vwAdmin/admin', {
            users: userList.sort(function(a, b) {return b.email.charCodeAt(0) - a.email.charCodeAt(0)}),
        })
    }
});

router.post('/DoB', async (req, res) => {
    const list = await userModel.find();
    var userList = JSON.parse(JSON.stringify(list));

    for (let i = 0; i < userList.length; i++) {
        userList[i]['no'] = i + 1;
        var date = new Date(userList[i]['birthday']);
        if (isNaN(date.getDate())) {
            userList[i]['birthday'] = ' ';
        }
        else {
            userList[i]['birthday'] = `${date.getDate() - 1}/${date.getMonth()}/${date.getFullYear()}`;
        }

        if (isNaN(userList[i]['name'].charCodeAt(0))) {
            userList[i]['name'] = ' ';
        }

        if (isNaN(userList[i]['email'].charCodeAt(0))) {
            userList[i]['email'] = ' ';
        }
    }

    var order = req.body.value;

    if (order === 'ascending') {
        res.render('vwAdmin/admin', {
            users: userList.sort(function(a, b) {return a.birthday - b.birthday}),
        });
    }
    else if (order === 'descending') {
        res.render('vwAdmin/admin', {
            users: userList.sort(function(a, b) {return b.birthday - a.birthday}),
        })
    }
});

router.post('/Role', async (req, res) => {
    var order = req.body.value;

    const list = await userModel.find({role: order});
    var userList = JSON.parse(JSON.stringify(list));

    for (let i = 0; i < userList.length; i++) {
        userList[i]['no'] = i + 1;
        var date = new Date(userList[i]['birthday']);
        if (isNaN(date.getDate())) {
            userList[i]['birthday'] = ' ';
        }
        else {
            userList[i]['birthday'] = `${date.getDate() - 1}/${date.getMonth()}/${date.getFullYear()}`;
        }

        if (isNaN(userList[i]['name'].charCodeAt(0))) {
            userList[i]['name'] = ' ';
        }

        if (isNaN(userList[i]['email'].charCodeAt(0))) {
            userList[i]['email'] = ' ';
        }

    }

    res.render('vwAdmin/admin', {
        users: userList,
    })
});

export default router;