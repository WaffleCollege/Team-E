import {auth} from "./firebase.js";

let idToken = "";

auth.onAuthStateChanged(async (user) =>{
	if(user){
		idToken = await user.getIdToken();
		await handleGetItems();
	}else{
		location.href = "/login";
	}
});
