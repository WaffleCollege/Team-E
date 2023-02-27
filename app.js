let express = require("express");
let app  = express();
const port = 3000;

app.use(express.static('public'));

app.get('/', (req, res) => {
	res.render('home.ejs');
});
app.get('/course', (req, res) => {
	res.render('course.ejs');
});

app.get('/study', (req, res) => {
	res.render('study.ejs');
});



app.listen(port, () => {
	console.log(`listening at http://localhost:${port}`);
});

