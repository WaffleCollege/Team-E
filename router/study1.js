const express = require("express");
const router = express.Router();

router.get('/studypage', (req, res) => {
	res.render('studypage.ejs');
});

module.exports = router;