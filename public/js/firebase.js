const firebaseConfig = {
	apiKey: "AIzaSyDgyl0Y8NECUJEZbM6J_uMaf8PuQmkNQZs",
	authDomain: "moneyvate-fd891.firebaseapp.com",
	projectId: "moneyvate-fd891",
	storageBucket: "moneyvate-fd891.appspot.com",
	messagingSenderId: "676815011587",
	appId: "1:676815011587:web:5fac350ff7c47c5b2ab336",
	measurementId: "G-G7ZC3CPG71"
};
firebase.initializeApp(firebaseConfig);

export const auth = firebase.auth();