import express from "express";
const app = express();
const port = 3000;
import pg from "pg";
const { Client } = pg;

app.use(express.static('public'));

app.use(express.json());
app.use(express.urlencoded({ extended: true }));


import {verifyIdToken} from "./firebaseAdmin.js";
app.use(verifyIdToken);

import { config } from "dotenv"; //環境変数を使うためのモジュール
config();

const client =  new Client({
	connectionString: process.env.DATABASE_URL,
	ssl: {
		rejectUnauthorized: false,
	},
})

client.connect((err)=>{
	if(err){
		console.log("error connecting" + err.stack);
		return;
	}
	console.log("success");
})	

app.get('/', async (req, res) => {
	try{
		const courseData = await client.query("SELECT * FROM course_info ORDER BY id"); //all courses
		const courses = courseData.rows;
		res.render('home.ejs',{courses});
	}catch(error){
		console.log(error);
		res.status(500).send("Error");
	}
});

app.get('/1/1', (req, res) => {
	res.render('course1/course-1-①.ejs');
});
app.get('/1/2', (req, res) => {
	res.render('course1/course-1-②.ejs');
});
app.get('/1/3', (req, res) => {
	res.render('course1/course-1-③.ejs');
});
app.get('/1/4', (req, res) => {
	res.render('course1/course-1-④.ejs');
});
app.get('/1/5', (req, res) => {
	res.render('course1/course-1-⑤.ejs');
});

app.get('/2/1', (req, res) => {
	res.render('course2/course-2-①.ejs');
});
app.get('/2/2', (req, res) => {
	res.render('course2/course-2-②.ejs');
});
app.get('/2/3', (req, res) => {
	res.render('course2/course-2-③.ejs');
});
app.get('/2/4', (req, res) => {
	res.render('course2/course-2-④.ejs');
});
app.get('/2/5', (req, res) => {
	res.render('course2/course-2-⑤.ejs');
});

app.get('/login', (req, res) => {
	res.render('login.ejs');
});
//app.get('/course-1', async (req, res) => {
//	try{
//		const responseData = await client.query("SELECT * FROM comment_log where courseid = $1",["1"]);
//		const comments = responseData.rows;
//		res.render('course-1.ejs',{comments});
//	}catch(error){
//		console.log(error);
//		res.status(500).send("Error");
//	}
//});

app.get('/course-1', async (req, res) => {
	try{
		const responseData = await client.query("SELECT * FROM comment_log where courseid = $1",["1"]);
		const comments = responseData.rows;
		res.render('course-1-①.ejs',{comments});
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

app.get("/getInprogress",async (req,res)=>{
	try{
		const uid = req.uid;
		const inprogressCourseIdData = await client.query("SELECT courseid,stepid FROM course_status WHERE uid = $1 and status = 0 ORDER BY timestamp DESC LIMIT 3",[uid]);
		const inprogressCourseIds = [];
		for(let i = 0; i < inprogressCourseIdData.rows.length; i++){
			inprogressCourseIds.push(inprogressCourseIdData.rows[i].courseid);
		}
		//array_positionで最新のid順を保持したまま取得
		const inprogressCourseData = await client.query('SELECT * FROM course_info WHERE id = ANY($1) ORDER BY array_position($1, id)',[inprogressCourseIds]); 
		const inprogress = inprogressCourseData.rows;
		res.json(inprogress);
	}catch(error){
		console.log(error);
		res.status(500).send("Error");
	}	
});


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

	//   //Login情報の追加
	//  	// Dateオブジェクトを作成
	// 	const date = new Date() ;

	// 	// UNIXタイムスタンプを取得する (ミリ秒単位)
	// 	const a = date.getTime() ;

	// 	// UNIXタイムスタンプを取得する (秒単位 - PHPのtime()と同じ)
	// 	const timestamp = Math.floor( a / 1000 ) ;
	// 	console.log("Login success");
	// 	await client.query("INSERT INTO login_log (uid,timestamp) VALUES ($1,$2)", [uid, timestamp]);

	} catch (error) {
	  console.log(error);
	  res.status(500).send("Error");
	}
  });


  app.get("/getUser",async (req,res)=>{
	try{
		const uid = req.query.uid;
		const responseData = await client.query("SELECT * FROM user_info where uid = $1",[uid]);
		res.json(responseData.rows);
	}catch(error){
		console.log(error);
		res.status(500).send("Error");
	}
  });


  app.get("/getStudyLog",async (req,res)=>{
	try{
		const uid = req.query.uid;
		const responseData = await client.query("SELECT timestamp FROM study_log where uid = $1",[uid]);
		res.json(responseData.rows);
	}catch(error){
		console.log(error);
		res.status(500).send("Error");
	}
  })

  app.get("/searchCompleteCourse",async (req,res)=>{
	try{
		const uid = req.uid;
		const responseData = await client.query("SELECT courseid FROM course_status where uid = $1 and status = 1",[uid]);
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

