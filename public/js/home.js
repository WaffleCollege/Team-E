import {auth} from "./firebase.js";

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

	let count = 0;
	for(let i=0; i<responseData.length; i++){
		if(responseData[i].courseid.startsWith('3')){
			count++;
			if(responseData[i].courseid == "3-3"){
				const complete = document.getElementById(`course3`);
				complete.classList.toggle('complete');
			
				const active = document.getElementById(`finish`);
				active.classList.toggle('active');
			}
		}else{
			const pie = document.getElementById(`course${responseData[i].courseid}_pie`);
			pie.textContent = "100%";
			pie.style.backgroundImage =  "radial-gradient(#f2f2f2 60%, transparent 61%), conic-gradient(#eb8686 100% 0%, #d9d9d9 100% 100%)";
			const complete = document.getElementById(`course${responseData[i].courseid}`);
			complete.classList.toggle('complete');
		
			const active = document.getElementById(`course${Number(responseData[i].courseid) + 1}`);
			active.classList.toggle('active');
		}
	
	}

	const pie = document.getElementById(`course3_pie`);
	const rate_3 = Math.floor(count / 3 * 100);
	pie.textContent = `${rate_3}%`;
	pie.style.backgroundImage =  `radial-gradient(#f2f2f2 60%, transparent 61%), conic-gradient(#eb8686 ${rate_3}% 0%, #d9d9d9 ${rate_3}% 100%)`; //1st & 3rd
	

	const all_rate = Math.floor(responseData.length / 5 * 100);
	const all_pie = document.getElementById('all_pie');
	all_pie.textContent = all_rate + '%';
	all_pie.style.backgroundImage = `radial-gradient(#f2f2f2 60%, transparent 61%), conic-gradient(#eb8686 ${all_rate}% 0%, #d9d9d9 ${all_rate}% 100%)`;

	
  };