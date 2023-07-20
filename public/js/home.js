import {auth} from "./firebase.js";

let idToken="";
const NUM_COURSES = 5;

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


const getStudyStatus = async(req,res) =>{
	// データベースに情報があるかどうかを確認するためのGETリクエスト
	const response = await fetch(`/searchLogbyUid?uid=${uid}`, {
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

	const all_rate = Math.floor(responseData.length / NUM_COURSES * 100);
	const all_pie = document.getElementById('all_pie');
	all_pie.textContent = all_rate + '%';
	all_pie.style.backgroundImage = `radial-gradient(#f2f2f2 60%, transparent 61%), conic-gradient(#eb8686 ${all_rate}% 0%, #d9d9d9 ${all_rate}% 100%)`;

	
  };