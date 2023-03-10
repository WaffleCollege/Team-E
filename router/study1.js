const express = require("express");
const router = express.Router();

router
  .get('/', (req, res) => {
	  res.render('home.ejs');
  })
  .get('/course', (req, res) => {
	  res.render('course.ejs');
  })
  .get('/study', (req, res) => {
	  res.render('study.ejs');
  })
  .get('/studypage', (req, res) => {
	res.render('studypage.ejs');
  });

module.exports = router;