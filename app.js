let express = require("express");
let app  = express();
const port = 3000;
const homerouter = require('./router/home');
const study1router = require('./router/study1');
const study2router = require('./router/study2');
const study3router = require('./router/study3');


app.use(express.static('public'));

app.use('/', homerouter);
app.use('/', study1router);
app.use('/', study2router);
app.use('/', study3router);


app.listen(port, () => {
	console.log(`listening at http://localhost:${port}`);
});

