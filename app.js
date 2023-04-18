// const { Timestamp } = require("@google-cloud/firestore");
// const { response } = require("express");
let express = require("express");
let app  = express();
const port = 3000;
const {Client} = require("pg");

app.use(express.static('public'));

app.use(express.json())
app.use(express.urlencoded({ extended: true}));


// // ルーティング処理をしたファイルをモジュールとして読み込む
// const homerouter = require('./router/home.js');
// const study1router = require('./router/study1');
// const study2router = require('./router/study2');
// const study3router = require('./router/study3');
// // ルーティング処理
// app.use('/', homerouter);
// app.use('/', study1router);
// app.use('/', study2router);
// app.use('/', study3router);

app.get('/', (req, res) => {
	res.render('home.ejs');
});
app.get('/login', (req, res) => {
	res.render('login.ejs');
});
app.get('/course-1', async (req, res) => {
	try{
		const responseData = await client.query("SELECT * FROM comment_log where courseid = $1",["1"]);
		const comments = responseData.rows;
		res.render('studypage.ejs',{comments});
	}catch(error){
		console.log(error);
		res.status(500).send("Error");
	}
});

app.get('/course-2', async (req, res) => {
	try{
		const responseData = await client.query("SELECT * FROM comment_log where courseid = $1",["2"]);
		const comments = responseData.rows;
		res.render('course-2.ejs',{comments});
	}catch(error){
		console.log(error);
		res.status(500).send("Error");
	}
});

app.get('/course-3-1', async (req, res) => {
	try{
		const responseData = await client.query("SELECT * FROM comment_log where courseid = $1",["3-1"]);
		const comments = responseData.rows;
		res.render('course-3-1.ejs',{comments});
	}catch(error){
		console.log(error);
		res.status(500).send("Error");
	}
});


require("dotenv").config();

const {verifyIdToken} = require("./firebaseAdmin");
app.use(verifyIdToken);

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
	  const uid = req.uid; //req.body.uidだと上手くいかない
	  const results = await client.query("SELECT * FROM user_info WHERE uid = $1", [uid]);
	  if (results.rows.length == 0) {
		const email = req.email;
		const userName = email.slice(0, email.indexOf('@'));
		await client.query("INSERT INTO user_info (uid,user_name, user_email) VALUES ($1,$2,$3)", [uid, userName, email]);
		res.send("User created");
	  }

	  //Login情報の追加
	 	// Dateオブジェクトを作成
		const date = new Date() ;

		// UNIXタイムスタンプを取得する (ミリ秒単位)
		const a = date.getTime() ;

		// UNIXタイムスタンプを取得する (秒単位 - PHPのtime()と同じ)
		const timestamp = Math.floor( a / 1000 ) ;
		console.log( "hi, " + uid);
		await client.query("INSERT INTO login_log (uid,timestamp) VALUES ($1,$2)", [uid, timestamp]);

	} catch (error) {
	  console.log(error);
	  res.status(500).send("Error");
	}
  });


  app.get("/searchUser",async (req,res)=>{
	try{
		const uid = req.query.uid;
		const responseData = await client.query("SELECT * FROM user_info where uid = $1",[uid]);
		res.json(responseData.rows);
	}catch(error){
		console.log(error);
		res.status(500).send("Error");
	}
  });

  app.get("/searchLogin",async (req,res)=>{
	try{
		const uid = req.query.uid;
		const responseData = await client.query("SELECT * FROM login_log where uid = $1",[uid]);
		res.json(responseData.rows);
	}catch(error){
		console.log(error);
		res.status(500).send("Error");
	}
  });


  app.get("/searchLogbyUid",async (req,res)=>{
	try{
		const uid = req.query.uid;
		  const responseData = await client.query("SELECT * FROM study_log where uid = $1",[uid]);
		res.json(responseData.rows);
	}catch(error){
		console.log(error);
		res.status(500).send("Error");
	}
  })

  app.get("/searchLogbyUid&Course",async (req,res)=>{
	try{
		const uid = req.query.uid;
		const courseid = req.query.courseid;
		const responseData = await client.query("SELECT * FROM study_log where uid = $1 AND courseid = $2",[uid,courseid]);
		res.json(responseData.rows);
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

  app.post("/addComment", async (req,res)=>{
	try{
		const uid = req.body.uid;
		const name =  req.body.username;
		const url = req.body.url;
		const comment =req.body.comment;
		const courseid = req.body.courseid;
		await client.query("INSERT INTO comment_log (uid,name,url,comment,courseid) VALUES ($1,$2,$3,$4,$5)",[uid,name,url,comment,courseid]);
		res.send("ok");
	}catch(error){
		console.log(error);
		  res.status(500).send("Error");
	}
  })


app.listen(port, () => {
	console.log(`listening at http://localhost:${port}`);
});

