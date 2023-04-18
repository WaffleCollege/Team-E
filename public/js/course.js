let idToken="";

window.onload=function(){
    let Animation = function() {
    //アイコン位置取得
    let pageTop =  document.getElementById('page_top');
    // console.log('hhh');

    //要素の位置座標を取得
    let rect = pageTop.getBoundingClientRect();
    //topからの距離
    let scrollTop = rect.top + window.pageYOffset;

    if(scrollTop > 900){
      pageTop.classList.add('show');
     }  else {
      pageTop.classList.remove('show');
     }
   }
   window.addEventListener('scroll', Animation);
}

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


// /** コメント表示 **/
// const getAllComment = async(req,res) =>{
	
// 		const title = document.getElementById('title');
// 		const courseid = title.textContent;
// 		// データベースに情報があるかどうかを確認するためのGETリクエスト
// 		const response = await fetch(`/searchComment?courseid=${courseid}`, {
// 			method: "GET",
// 			headers: {
// 			"Content-Type": "application/json",
// 			Authorization: `Bearer ${idToken}`,
// 			},
// 		});

// 		const responseData = await response.json();
// 		console.log(responseData);
// 		// データベースに情報がない場合は何もしない
// 		if (responseData.length == 0) {
// 			return;
// 		}
// 		await fetch(`/course1`, {
// 			method: "POST",
// 			headers: {
// 			"Content-Type": "application/json",
// 			Authorization: `Bearer ${idToken}`,
// 			},
// 			body:responseData
// 		});
// }



/** コメント残す **/

let username;
let link;
let comment="";

const addComment = async(req,res)=>{
	const user = firebase.auth().currentUser;
	const uid = user.uid;
	const title = document.getElementById('title');
	const courseid = title.textContent;

	await fetch("/addComment",{
		method:"POST",
		headers:{
			"Content-Type":"application/json",
			Authorization: `Bearer ${idToken}`,
		},
		body:JSON.stringify({uid:uid,username:username.value,url:link.value,comment:comment.value,courseid:courseid})
	});
}


const submit = document.getElementById('share');
submit.addEventListener('click', function(e){
	e.preventDefault();
	username = document.querySelector('input[name=username]');
	link = document.querySelector('input[name=link]');
	comment = document.querySelector('textarea[name=comment]');
	addComment();
	window.location.reload();
});