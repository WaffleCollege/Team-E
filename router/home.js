const express = require("express");
const router = express.Router();

app.use(express.static('public'));



const auth = require( "/public/js/firebase.js");

let idToken="";

let user;
let uid;

auth.onAuthStateChanged(async (user) =>{
	if(user){
		idToken = await user.getIdToken();
		user = firebase.auth().currentUser;
		uid = user.uid;
		await getStudyStatus();		
		await getUsername();
	}else{
		location.href = "/login";
	}
});


router.get('/', (req, res) => {
	res.render('home.ejs');
});

router.get("/searchUser",async (req,res)=>{
	try{
		const uid = req.query.uid;
		const responseData = await client.query("SELECT * FROM user_info where uid = $1",[uid]);
		res.json(responseData.rows);
	}catch(error){
		console.log(error);
		res.status(500).send("Error");
	}
});

const getUsername = async(req,res) =>{
	const response = await fetch(`/searchUser?uid=${uid}`, {
		method: "GET",
		headers: {
		"Content-Type": "application/json",
		Authorization: `Bearer ${idToken}`,
		},
	});

	const responseData = await response.json();
	// データベースに情報がない場合は何もしない
	if (responseData.length == 0) {
		return;
	}

	const name = document.getElementById('name');
	name.textContent = responseData[0].user_name;
}

module.exports = router;