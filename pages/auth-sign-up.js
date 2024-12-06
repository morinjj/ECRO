document.addEventListener('DOMContentLoaded', (event) => {

    // --- Email/Password Sign Up ---
    const signupForm = document.getElementById('sign-up-form');
    const errorMessage = document.getElementById('error-message');
  
    if (signupForm) {
      signupForm.addEventListener('submit', (event) => {
        event.preventDefault();
        event.stopImmediatePropagation();
        errorMessage.textContent = '';
  
        const email = document.getElementById('email').value;
        const password = document.getElementById('password').value;
  
        auth.createUserWithEmailAndPassword(email, password)
          .then((userCredential) => {
            // No need to create a profile here, it will be handled in onAuthStateChanged
            console.log('User signed up:', userCredential.user);          
          })
          .catch((error) => {
            console.error('Sign up error:', error.code, error.message);
            errorMessage.textContent = error.message;
          });
      });
    }
  
    // --- Google Sign-In ---
    const googleSignInButton = document.getElementById('google-signin-button');
  
    if (googleSignInButton) {
      googleSignInButton.addEventListener('click', () => {
        const provider = new firebase.auth.GoogleAuthProvider();
  
        auth.signInWithPopup(provider)
          .then((result) => {
            // No need to create a profile here, it will be handled in onAuthStateChanged
            console.log('User signed in with Google:', result.user);          
          })
          .catch((error) => {
            console.error('Google Sign-In error:', error.code, error.message);
            // Handle error (e.g., display an error message)
          });
      });
    }
  
    // --- Protect member-only pages and create user profile if needed ---
    firebase.auth().onAuthStateChanged((user) => {
  
      if (window.location.pathname !== '/auth/sign-up') { 
        if (user) {
          console.log("User is signed in:", user.uid);
  
          // --- Check if user profile exists ---
          const userProfilesRef = firebase.firestore().collection('userProfiles');
          userProfilesRef.doc(user.uid).get()
            .then((doc) => {
              if (!doc.exists) {
                createUserProfile(user)
                  .then(() => {
                    console.log('User profile created successfully!');
                  })
                  .catch((error) => {
                    console.error('Error creating user profile:', error);
                    // Handle the error 
                  });
              } else {
                console.log('User profile already exists');
              }
            })
            .catch((error) => {
              console.error('Error checking for user profile:', error);
              // Handle the error
            });
  
        } else {
          console.log("User is signed out, redirecting to login");
          window.location.href = "/auth/sign-up"; 
        }
      }
    });
  
  });