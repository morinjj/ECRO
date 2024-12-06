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
                    const user = userCredential.user;
                    console.log('User signed up:', user);

                    // --- Call the function to create user profile ---
                    createUserProfile(user)
                        .then(() => {
                            console.log('User profile created successfully!');
                            window.location.href = 'https://ecro.webflow.io/rider/onboarding';
                        })
                        .catch((error) => {
                            console.error('Error creating user profile:', error);
                            // Handle the error (e.g., display an error message)
                        });

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
                    console.log('User signed in with Google:', result.user);
                    window.location.href = 'https://ecro.webflow.io/rider/onboarding';
                })
                .catch((error) => {
                    console.error('Google Sign-In error:', error.code, error.message);
                    // Handle error (e.g., display an error message)
                });
        });
    }

    // --- Protect member-only pages ---
    firebase.auth().onAuthStateChanged((user) => {
        // Check if the current page is NOT the login page
        if (window.location.pathname !== '/auth/sign-up') {
            if (user) {
                // User is signed in, allow access to the page
                console.log("User is signed in:", user.uid);

                // Optionally, you can perform actions for signed-in users here:
                // 1. Show personalized content or elements
                // 2. Hide login/signup elements
                // 3. Fetch user-specific data from Firebase

            } else {
                // User is signed out, redirect to login page
                console.log("User is signed out, redirecting to login");
                window.location.href = "/auth/sign-up";
            }
        }
    });

});