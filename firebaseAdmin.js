// const admin = require("firebase-admin");
// require("firebase/auth");

const {initializeApp, cert} = require("firebase-admin/app");
const {getAuth} = require("firebase-admin/auth");
const serviceAccount = require("./serviceAccountKey.json");


initializeApp({
credential:cert(serviceAccount),
});

const verifyIdToken = async (req,_,next)=>{
	const authHeader = req.headers.authorization;
	let token = null;

	if (authHeader && authHeader.startsWith('Bearer ')) {
	token = authHeader.split(' ')[1];
	}
	if(token){
		const user = await getAuth().verifyIdToken(token);
		req.uid = user.uid;
		req.email = user.email;
		// console.log(user.uid);
		// console.log(user.email);
	}
	next();
};

exports.verifyIdToken = verifyIdToken;