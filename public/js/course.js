import {auth} from "./firebase.js";

let idToken="";


const addStudyStatus = async(req,res) =>{
	const user = firebase.auth().currentUser;
	const uid = user.uid;
	const title = document.getElementById('title');
	const courseid = title.textContent;
	idToken = await user.getIdToken();

	
	// データベースに情報があるかどうかを確認するためのGETリクエスト
	const response = await fetch(`/searchLogbyUid&Course?uid=${uid}&courseid=${courseid}`, {
		method: "GET",
		headers: {
		"Content-Type": "application/json",
		Authorization: `Bearer ${idToken}`,
		},
	});
	
	const responseData = await response.json();
	// データベースに既に情報がある場合は何もしない
	if (responseData.length > 0) {
		return;
	}

	await fetch("/createLog",{
		method:"POST",
		headers:{
			"Content-Type":"application/json",
			Authorization: `Bearer ${idToken}`,
		},
		body:JSON.stringify({uid:uid,courseid:courseid,status:1})
	});
  };


const button = document.getElementById('course_complete');
button.addEventListener('click', async() =>{
  await addStudyStatus();
});