window.onload = function () {
    document.getElementById('btnSignIn').addEventListener('click', signIn, true);
    document.getElementById('btnSignUp').addEventListener('click', signUp, true);
  };

  function signUp() {

    console.log('In SignUP');
    //Get elements
    const txtEmail = document.getElementById('email');
    const txtPass = document.getElementById('password');
    //Get Email and Pass
    const email = txtEmail.value;
    const pass = txtPass.value;
    const auth = firebase.auth();

    const promise = auth.createUserWithEmailAndPassword(email, pass);
    promise.catch(e => alert(e.message));
  }
  
  function signIn() {

    //Get elements
    const txtEmail = document.getElementById('email');
    const txtPass = document.getElementById('password');
    const btnSignIn = document.getElementById('btnSignIn');
    const btnSignUp = document.getElementById('btnSignUp');

    console.log('In SignIn');

    //Get Email and Pass
    const email = txtEmail.value;
    const pass = txtPass.value;
    const auth = firebase.auth();

    const promise = auth.signInWithEmailAndPassword(email, pass);
    promise.catch(e => alert(e.message));

    firebase.auth().onAuthStateChanged(firebaseUser => {

      console.log('In AuthChanged');

      if (firebaseUser) {
        window.location.href = './SearchUI.html';
      }
    });
  };