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
	const btnSignOut = document.getElementById('btnSignOut');
	
	btnSignIn.addEventListener('click', e => {
		//Get Email and Pass
		const email = txtEmail.value;
		const pass = txtPass.value;
		const auth = firebase.auth();
		
		const promise = auth.signInWithEmailAndPassword(email, pass);
		
		promise.catch(function(error)
		{
			var errorCode = error.code;
			var errorMessage = error.message;
			
			console.log(errorCode);
			console.log(errorMessage);
			
			if(errorCode =='auth/wrong-password')
			{
				alert('There seems to be something wrong with your email or password');
			}
		});
	});
	
	btnSignUp.addEventListener('click', e => {
		//Get Email and Pass
		const email = txtEmail.value;
		const pass = txtPass.value;
		const auth = firebase.auth();
		
		const promise = auth.createUserWithEmailAndPassword(email, pass);
		promise.catch(e => console.log(e.message));
	});
	
	firebase.auth().onAuthStateChanged(firebaseUser => {
		if(firebaseUser)
		{
			window.location.href = 'index.html';
		} else
		{
			alert('not logged in');	
		}
	});
	
}());