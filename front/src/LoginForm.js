import { initializeApp } from 'firebase/app';
import { getAuth, signInWithRedirect, GoogleAuthProvider } from 'firebase/auth';
import React, {  useState, useEffect } from 'react';

// LoginSuccessful is a function sent in by parent componentonSuccess
function LoginForm({LoginEvent}) {
    const firebaseConfig = {
		apiKey: "AIzaSyAiiIFGKInGBEjqphGCn67xdtiX4WRC1UA",
		authDomain: "wheeloffortune-bank-end.firebaseapp.com",
		projectId: "wheeloffortune-bank-end",
		storageBucket: "wheeloffortune-bank-end.appspot.com",
		messagingSenderId: "75196970673",
		appId: "1:75196970673:web:c4451f9f213f9c77d21490",
		measurementId: "G-5732CPLTQW"
	};

	initializeApp(firebaseConfig);
	
	const [loggedUser, setLoggedUser] = useState('');

	// function to sign in with Google's page
	const signInWithGoogle = () => {
  	
  		const provider = new GoogleAuthProvider();
  		const auth = getAuth();
  		signInWithRedirect(auth, provider)
    	.then((result) => {
      		// User signed in
      		console.log(result.user);
      		setLoggedUser(result.user);
    	}).catch((error) => {
      	// Handle Errors here.
      		console.error(error);
    	});
	};
	
	// function to sign out
	function logoutGoogle () {
		const auth=getAuth();
		auth.signOut();
		setLoggedUser(null)
	}

	// we put the onAuthStateChanged in useEffect so this is only called when 
	// this component mounts  
	useEffect(() => {
		const auth = getAuth();
		auth.onAuthStateChanged(user => {
			if (user) {
    			// User is signed in.
    			console.log("User is signed in:", user);
    			setLoggedUser(user);
  			} else {
    		// No user is signed in.
    			console.log("No user is signed in.");
  			}
  			LoginEvent(user);
  		});
	}, []);
	// note the ? to show either login or logout button
	return (
    <div >
    { loggedUser?
      <><p>user: {loggedUser.uid}</p> <button onClick={logoutGoogle}>Log out</button> </>
      :<button onClick={signInWithGoogle}>Sign in with Google</button>
    } 
     
    </div>
  );

}
export default LoginForm;