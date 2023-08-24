import {auth} from "./firebase.js";
let idToken="";

auth.onAuthStateChanged(async (user) =>{
	if(user){
		idToken = await user.getIdToken();
	}else{
		location.href = "/login";
	}
});

// window.onload=function(){
//     let Animation = function() {
//     //アイコン位置取得
//     let pageTop =  document.getElementById('page_top');
//     // console.log('hhh');

//     //要素の位置座標を取得
//     let rect = pageTop.getBoundingClientRect();
//     //topからの距離
//     let scrollTop = rect.top + window.pageYOffset;

//     if(scrollTop > 900){
//       pageTop.classList.add('show');
//      }  else {
//       pageTop.classList.remove('show');
//      }
//    }
//    window.addEventListener('scroll', Animation);
// }


const updateCourseStatus = async(courseid, stepid, status) =>{
	//timestampを取得
	const date = new Date() ;// Dateオブジェクトを作成
	const a = date.getTime() ;// UNIXタイムスタンプ取得する (ミリ秒単位)
	const timestamp = Math.floor( a / 1000 ) ;// UNIXタイムスタンプを取得する (秒単位 - PHPのtime()と同じ)

	//couse statusを更新
	const response = await fetch(`/updateCourseStatus`, {
		method: "POST",
		headers: {
		"Content-Type": "application/json",
		Authorization: `Bearer ${idToken}`,
		},
		body:JSON.stringify({courseid:courseid,stepid:stepid,timestamp:timestamp,status:status})
	});
};


const button1 = document.getElementById('step_complete')
if(button1){
	button1.addEventListener('click', async(event) => {
		const courseNumber = event.target.dataset.courseNumber.split('-');
		const courseId = parseInt(courseNumber[0],10);
		const stepId = parseInt(courseNumber[1],10);
		const status = 0; 
		await updateCourseStatus(courseId, stepId, status);
	});
}

const button2 = document.getElementById('course_complete')
if(button2){
	button2.addEventListener('click', async(event) => {
		const courseNumber = event.target.dataset.courseNumber.split('-');
		const courseId = parseInt(courseNumber[0],10);
		const stepId = parseInt(courseNumber[1],10);
		const status = 1; 
		await updateCourseStatus(courseId, stepId, status);
	});
}

