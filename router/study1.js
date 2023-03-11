const express = require("express");
const router = express.Router();

const bodyParser = require("body-parser");

const names = [];
const links = [];
const comments = [];

//middleware
router.use(bodyParser.json());
router.use(bodyParser.urlencoded({ extended: true }));

router.get('/studypage', (req, res) => {
  // console.log(names);
	res.render('studypage.ejs', {
    names: names, 
    links: links, 
    comments: comments, 
  });
});

router.post("/studypage", (req, res, next) => {
  const n = req.body.username;
  const link = req.body.link;
  const msg = req.body.comment;

  names.push(n);
  links.push(link);
  comments.push(msg);
  res.redirect('studypage');
});


module.exports = router;