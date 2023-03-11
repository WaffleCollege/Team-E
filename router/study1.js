const express = require("express");
const router = express.Router();

const bodyParser = require("body-parser");

const names = [];
// const links = [];
// const comments = [];

//middleware
router.use(bodyParser.json());
router.use(bodyParser.urlencoded({ extended: true }));

router.get('/studypage', (req, res) => {
  // console.log(names);
	res.render('studypage.ejs', {
    names: names, 
  });
});

router.post("/studypage", (req, res, next) => {
  const n = req.body.username;
  names.push(n);
  res.redirect('studypage');
});

// router.post("/studypage", (req, res, next) => {
//   links.push({ url: req.body.link });
//   res.redirect("/studypage");
// });

// router.post("/studypage", (req, res, next) => {
//   comments.push({ comment: req.body.comment });
//   res.redirect("/studypage");
// });

module.exports = router;
// module.exports = names;
// module.exports = links;
// module.exports = comments;