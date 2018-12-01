import firebase from './public/html/js/firebase_init.js'

// JavaScript Document
(function() {
	
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