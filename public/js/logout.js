import {auth} from "./firebase.js";

const logoutButtonRef = document.querySelector("#logout");

auth.onAuthStateChanged(async (user) =>{
	if(!user){
		location.href = "/login";
	}
});

logoutButtonRef.addEventListener("click",() => auth.signOut());