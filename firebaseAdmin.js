// const admin = require("firebase-admin");
// require("firebase/auth");

import admin from 'firebase-admin';
import {getAuth} from 'firebase-admin/auth';

import serviceAccount from './serviceAccountKey.json' assert { type: "json" }; 

admin.initializeApp({
  credential: admin.credential.cert(serviceAccount)
});


const IdToken = async (req,_,next)=>{
	const authHeader = req.headers.authorization;
	let token = null;
	if (authHeader && authHeader.startsWith('Bearer ')) {
	token = authHeader.split(' ')[1];
	}
	if(token){
		try{
			const user = await getAuth().verifyIdToken(token);
			req.uid = user.uid;
			req.email = user.email;
			// console.log(req.uid);
			// console.log(user.email);
		}catch (error) {
			console.error('Token Verification Error:', error);
			return res.status(401).send('Unauthorized'); 
		  }
	}
	next();
};

export const verifyIdToken = IdToken;