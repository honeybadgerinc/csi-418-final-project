import firebase from './public/html/js/firebase_init'

// JavaScript Document
(function() {
	
	//Get elements
	const txtEmail = document.getElementById('email');
	const txtPass = document.getElementById('password');
	const btnSignIn = document.getElementById('btnSignIn');
	const btnSignUp = document.getElementById('btnSignUp');
	const btnSignOut = document.getElementById('btnLogOut');
	
	if(btnSignIn){
		btnSignIn.addEventListener('click', function(){

			console.log('In SignIn');
	
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
			}).then(user => window.location.href = 'SearchUI.html');
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
			
			promise.catch(e => console.log(e.message));
			promise.then(user => window.location.href = 'SearchUI.html');
			
		});
	}	

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
			window.location.href = 'SearchUI.html';
		} 
	});
	
}());