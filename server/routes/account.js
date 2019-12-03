const express = require('express');
const router = express.Router();
const register = require('../module/register.js');
const login = require('../module/login.js');
const user = require('../module/user.js');

router.post('/login', (req, res) => {
  login.execute(req.body).then((account) => {
    // Success on login
    // Alter session
    req.session.loginInfo = {
      _id: account.id,
      email: account.email,
      username: account.nickname,
      level: account.level,
      exp: account.exp,
    };
    res.json({ 'success' : true});
  }).catch((err) => {
    // Fail on login
    console.log(err);
    res.status(401).json(err);
  });
});
router.get('/logout', (req, res) => {
  req.session.destroy(err =>
  { 
    if(err)
      return res.status(401).json({ 'err': err});
    else
      return res.json({ success: true }); });
  }
);
router.get('/getSessionInfo', (req, res) => {
    if(req.session.loginInfo == undefined)
        return res.status(401).json({ err: 1 });
    res.json({ info: req.session.loginInfo });
});
router.post('/register', (req, res) =>{
  register.execute(req.body).then((account) => {
    req.session.loginInfo = {
        _id: account.id,
        email: account.email,
        username: account.nickname,
        level: account.level,
        exp: account.exp,
    };
    res.json({'success': true});
  }).catch((err) => {
    // Fail on Register
    console.log(err);
    res.status(401).json({ err: err });
  });
});
router.post('/getUserInfo', (req, res) => {
  user.getUserInfo(req.body).then(response => {
    res.json(response);
  }).catch(error => {
    res.status(401).json({ err: err });
  });
});
router.post('/updateUserInfo', (req, res) => {
  user.updateUserInfo(req.body)
  .then(response => {
    res.json(response);
  }).catch(error => {
    res.status(401).json(error);
  });
});
module.exports = router;