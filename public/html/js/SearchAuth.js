// JavaScript Document
(function() {
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

// firebase.initializeApp(config);
	
	//Get elements
	const btnSignOut = document.getElementById('btnLogOut');

	if (btnSignOut){
		btnSignOut.addEventListener('click', function() {

			console.log('In SignOUT');

			//Get Email and Pass
			const auth = firebase.auth();
			
			const promise = auth.signOut();
			
			promise.catch(e => console.log(e.message));

		});
	}

	firebase.auth().onAuthStateChanged(firebaseUser => {

		console.log('In AuthChanged');

		if(firebaseUser)
		{
			
		} else {
            window.location.href = 'LoginUI.html';
        } 
	});
	
}());