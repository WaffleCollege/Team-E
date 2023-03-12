let express = require("express");
let app  = express();
const port = 3000;
const {Client} = require("pg");

app.use(express.static('public'));

app.use(express.json())
app.use(express.urlencoded({ extended: true}));

app.get('/', (req, res) => {
	res.render('home.ejs');
});
app.get('/course', (req, res) => {
	res.render('course.ejs');
});
app.get('/study', (req, res) => {
	res.render('study.ejs');
});
app.get('/login', (req, res) => {
	res.render('login.ejs');
});
app.get('/course-1', (req, res) => {
	res.render('studypage.ejs');
});

app.get('/course-2',(req,res)=>{
	res.render('course-2.ejs');
})
app.get('/course-3-1',(req,res)=>{
	res.render('course-3-1.ejs');
})

require("dotenv").config();

const {verifyIdToken} = require("./firebaseAdmin");
app.use(verifyIdToken);
let uid;

const client =  new Client({
	database: process.env.DB_NAME,
	user: process.env.DB_USER, //ユーザー名はデフォルト以外を利用した人は適宜変更すること
	password: process.env.DB_PASSWORD, //PASSWORDにはPostgreSQLをインストールした際に設定したパスワードを記述。
	host: process.env.DB_HOST,
	port: process.env.DB_PORT,

})

client.connect((err)=>{
	if(err){
		console.log("error connecting" + err.stack);
		return;
	}
	console.log("success");
})	

app.post("/createUser",async (req,res)=>{
	try{
	  uid = req.uid;
	  const results = await client.query("SELECT * FROM user_info WHERE uid = $1", [uid]);
	  if (results.rows.length) {
		// uidが既に存在する場合の処理
		res.status(409).send("User already exists"); // 409は"Conflict"というステータスコード
	  } else {
		const email = req.email;
		const userName = email.slice(0, email.indexOf('@'));
		await client.query("INSERT INTO user_info (uid,user_name, user_email) VALUES ($1,$2,$3)", [uid, userName, email]);
		res.send("User created");
	  }
	} catch (error) {
	  console.log(error);
	  res.status(500).send("Error");
	}
  });

  app.get("/searchUser",async (req,res)=>{
	try{
		const uid = req.query.uid;
		const responseData = await client.query("SELECT * FROM user_info");
		const filteredData = responseData.rows.filter(
			(data) => data.uid === uid
			);
		res.json(filteredData);
	}catch(error){
		console.log(error);
		res.status(500).send("Error");
	}
  });


  app.get("/searchLogbyUid",async (req,res)=>{
	try{
		const uid = req.query.uid;
		  const responseData = await client.query("SELECT * FROM study_log");
		  const filteredData = responseData.rows.filter(
			  (data) => data.uid === uid
			);
		res.json(filteredData);
	}catch(error){
		console.log(error);
		res.status(500).send("Error");
	}
  })

  app.get("/searchLogbyUid&Course",async (req,res)=>{
	try{
		const uid = req.query.uid;
		const courseid = req.query.courseid;
		  const responseData = await client.query("SELECT * FROM study_log");
		  const filteredData = responseData.rows.filter(
			  (data) => data.uid === uid && data.courseid===courseid
			);
		res.json(filteredData);
	}catch(error){
		console.log(error);
		res.status(500).send("Error");
	}
  })

  app.post("/createLog", async (req,res)=>{
	try{
		const uid = req.body.uid;
		const status =  req.body.status;
		const courseid = req.body.courseid;
		await client.query("INSERT INTO study_log (uid,courseid,status) VALUES ($1,$2,$3)",[uid,courseid,status]);
		res.send("ok");
	}catch(error){
		console.log(error);
		  res.status(500).send("Error");
	}
  })


app.listen(port, () => {
	console.log(`listening at http://localhost:${port}`);
});

