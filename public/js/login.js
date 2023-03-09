import {auth} from "./firebase.js";

const ui = new firebaseui.auth.AuthUI(auth);
const uiConfig={
	callbacks: {
		signInSuccessWithAuthResult: (authResult,redirectUrl) =>{
			return true;
		},
	},
	signInFlow:"popup",
	signInSuccessUrl:"/",
	signInOptions:[
		firebase.auth.EmailAuthProvider.PROVIDER_ID,
		firebase.auth.GoogleAuthProvider.PROVIDER_ID,
	],
};

ui.start('#firebaseui-auth-container', uiConfig);

auth.onAuthStateChanged(async (user) =>{
	if(user){
	  const idToken = await user.getIdToken();
	  await fetch("/createUser",{
		method:"POST",
		headers:{
		  "Content-Type":"application/json",
		  Authorization: `Bearer ${idToken}`,
		},
	  });
	}else{
	  if(location.pathname !== "/login"){
		location.href="/login";
	  }
	}
  });
  

