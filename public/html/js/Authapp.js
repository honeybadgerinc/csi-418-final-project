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
	firebase.initializeApp(config);
	
	//Get elements
	const txtEmail = document.getElementById('email');
	const txtPass = document.getElementById('password');
	const btnSignIn = document.getElementById('btnSignIn');
	const btnSignUp = document.getElementById('btnSignUp');
	
	if(btnSignIn){
		btnSignIn.addEventListener('click', function(){

			console.log('In SignIn');
	
			//Get Email and Pass
			const email = txtEmail.value;
			const pass = txtPass.value;
			const auth = firebase.auth();
			
			const promise = auth.signInWithEmailAndPassword(email, pass);
			promise.catch(e => alert(e.message));
		});
	}

	if (btnSignUp){
		btnSignUp.addEventListener('click', function() {

			console.log('In SignUP');

			//Get Email and Pass
			const email = txtEmail.value;
			const pass = txtPass.value;
			const auth = firebase.auth();
			
			const promise = auth.createUserWithEmailAndPassword(email, pass);
			promise.catch(e => alert(e.message));
		});
	}	

	firebase.auth().onAuthStateChanged(firebaseUser => {

		console.log('In AuthChanged');

		if(firebaseUser)
		{
			window.location.href = 'SearchUI.html';
		} 
	});
	
}());