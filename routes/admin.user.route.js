import express from 'express';
import userService from '../services/user.service.js';
import userModel from '../utils/models/user.model.js';

const router = express.Router();

router.get('/', async (req, res) => {
  const list = await userModel.find();
  var userList = JSON.parse(JSON.stringify(list));

  for (let i = 0; i < userList.length; i++) {
    userList[i]['no'] = i + 1;
    var date = new Date(userList[i]['birthday']);
    if (isNaN(date.getDate())) {
      userList[i]['birthday'] = ' ';
    } else {
      userList[i]['birthday'] = `${
        date.getDate() - 1
      }/${date.getMonth()}/${date.getFullYear()}`;
    }
  }

  res.render('vwAdmin/vwUser/admin', {
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
    } else {
      userList[i]['birthday'] = `${
        date.getDate() - 1
      }/${date.getMonth()}/${date.getFullYear()}`;
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
    res.render('vwAdmin/user', {
      users: userList,
    });
  } else if (order === 'descending') {
    res.render('vwAdmin/user', {
      users: userList.reverse(),
    });
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
    } else {
      userList[i]['birthday'] = `${
        date.getDate() - 1
      }/${date.getMonth()}/${date.getFullYear()}`;
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
    res.render('vwAdmin/user', {
      users: userList.sort(function (a, b) {
        return a.name.charCodeAt(0) - b.name.charCodeAt(0);
      }),
    });
  } else if (order === 'Z-A') {
    res.render('vwAdmin/user', {
      users: userList.sort(function (a, b) {
        return b.name.charCodeAt(0) - a.name.charCodeAt(0);
      }),
    });
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
    } else {
      userList[i]['birthday'] = `${
        date.getDate() - 1
      }/${date.getMonth()}/${date.getFullYear()}`;
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
      users: userList.sort(function (a, b) {
        return a.email.charCodeAt(0) - b.email.charCodeAt(0);
      }),
    });
  } else if (order === 'Z-A') {
    res.render('vwAdmin/admin', {
      users: userList.sort(function (a, b) {
        return b.email.charCodeAt(0) - a.email.charCodeAt(0);
      }),
    });
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
    } else {
      userList[i]['birthday'] = `${
        date.getDate() - 1
      }/${date.getMonth()}/${date.getFullYear()}`;
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
      users: userList.sort(function (a, b) {
        return a.birthday - b.birthday;
      }),
    });
  } else if (order === 'descending') {
    res.render('vwAdmin/user', {
      users: userList.sort(function (a, b) {
        return b.birthday - a.birthday;
      }),
    });
  }
});

router.post('/Role', async (req, res) => {
  var order = req.body.value;

  const list = await userModel.find({ role: order });
  var userList = JSON.parse(JSON.stringify(list));

  for (let i = 0; i < userList.length; i++) {
    userList[i]['no'] = i + 1;
    var date = new Date(userList[i]['birthday']);
    if (isNaN(date.getDate())) {
      userList[i]['birthday'] = ' ';
    } else {
      userList[i]['birthday'] = `${
        date.getDate() - 1
      }/${date.getMonth()}/${date.getFullYear()}`;
    }

    if (isNaN(userList[i]['name'].charCodeAt(0))) {
      userList[i]['name'] = ' ';
    }

    if (isNaN(userList[i]['email'].charCodeAt(0))) {
      userList[i]['email'] = ' ';
    }
  }

  res.render('vwAdmin/user', {
    users: userList,
  });
});

router.post('/CreatedDate', (req, res) => {
  console.log(req.body.value);
  res.render('vwAdmin/user');
});

router.get('/:id', async (req, res) => {
  const { id } = req.params;

  const user = JSON.parse(JSON.stringify(await userService.findById(id)));

  return res.render('vwAdmin/vwUser/edit', {
    user,
    isBlocked: user.status === 'blocked',
  });
});

router.post('/patch', async (req, res) => {
  const { statusSelect, userID } = req.body;
  await userService.updateStatus(userID, statusSelect);
  return res.redirect('/admin/user');
});

router.post('/del', async (req, res) => {
  const { userID } = req.body;
  // await userService.del(userID);
  return res.redirect('/admin/user');
});

export default router;
