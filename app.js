let express = require("express");
let app  = express();
const port = 3000;
const router = require('./router/study1')

app.use(express.static('public'));
app.use('/', router);

app.listen(port, () => {
	console.log(`listening at http://localhost:${port}`);
});

