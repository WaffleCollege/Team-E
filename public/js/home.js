import {auth} from "./firebase.js";

let idToken="";
const NUM_COURSES = 5;

let uid;

auth.onAuthStateChanged(async (user) =>{
	if(user){
		idToken = await user.getIdToken();
		// user = firebase.auth().currentUser;
		uid = user.uid;
		// console.log(uid);
		await getInprogress();
		await getStudyStatus();
	}else{
		location.href = "/login";
	}
});

const getInprogress = async () => {
	try {
	  const response = await fetch(`/getInprogress`, {
		method: "GET",
		headers: {
		  "Content-Type": "application/json",
		  Authorization: `Bearer ${idToken}`,
		},
	  });
  
		let htmlContent;
		const responseData = await response.json();
		if (responseData.length == 0) {
			console.log("error");
			return;
		}

		htmlContent = generateHtmlContent(responseData);
  
		const inprogressContainer = document.querySelector(".in_progress"); ;
		inprogressContainer.innerHTML = '';
		inprogressContainer.innerHTML = htmlContent; // Update the element's content
	} catch (error) {
	  console.error("Fetch error:", error);
	}
  };
  

  

// Function to generate HTML content based on inprogress data
function generateHtmlContent(inprogressData) {
	let html = '<h3>In Progress</h3>';
	
	if (inprogressData.length > 0) {
	  html += '<div class="row row-cols-1 row-cols-md-3 g-4">';
	  for (let i = 0; i < inprogressData.length; i++) {
		const item = inprogressData[i];
		html += '<div class="col">';
		html += '<div class="card h-100">';
		html += `<a href="/${item.course_path}">`;
		html += `<img src="images/course/${item.course_picture_path}" class="card-img-top" alt="...">`;
		html += '<div class="card-body">';
		html += `<h5 class="card-title">${item.course_name}</h5>`;
		html += `<p class="card-text">${item.course_detail}</p>`;
		html += '</div>';
		html += '</a>';
		html += '</div>';
		html += '</div>';
	  }
	  html += '</div>';
	}
	return html;
  }
  

// const getUsername = async(req,res) =>{
// 	const response = await fetch(`/getUser?uid=${uid}`, {
// 		method: "GET",
// 		headers: {
// 		"Content-Type": "application/json",
// 		Authorization: `Bearer ${idToken}`,
// 		},
// 	});

// 	const responseData = await response.json();
// 	// データベースに情報がない場合は何もしない
// 	if (responseData.length == 0) {
// 		return;
// 	}

// 	const name = document.getElementById('name');
// 	name.textContent = responseData[0].user_name;
// }


const getStudyStatus = async(req,res) =>{
	const response = await fetch(`/searchCompleteCourse`, {
		method: "GET",
		headers: {
		"Content-Type": "application/json",
		Authorization: `Bearer ${idToken}`,  //これがないとミドルウェア通らない
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
	all_pie.style.backgroundImage = `radial-gradient(#ffffff 60%, transparent 61%), conic-gradient(#FF6600 ${all_rate}% 0%, #F9B590 ${all_rate}% 100%)`;
};
