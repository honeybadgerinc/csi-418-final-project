
// Initialize Firebase
	var config = {
		apiKey: "AIzaSyA2pM55uTodnnX1wHcKBcYrQQByDSup-rU",
		authDomain: "finalproject-37ce0.firebaseapp.com",
		databaseURL: "https://finalproject-37ce0.firebaseio.com",
		projectId: "finalproject-37ce0",
		storageBucket: "finalproject-37ce0.appspot.com",
		messagingSenderId: "260652345298"
	};
    export default !firebase.apps.length ? firebase.initializeApp(config) : firebase.app();