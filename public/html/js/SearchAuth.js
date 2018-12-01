import firebase from './public/html/js/firebase_init'

// JavaScript Document
(function() {	
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