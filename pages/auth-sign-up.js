document.addEventListener('DOMContentLoaded', (event) => {

    // --- Email/Password Sign Up ---

    const signupForm = document.getElementById('sign-up-form');
    const errorMessage = document.getElementById('error-message');

    signupForm.addEventListener('submit', (event) => {
        event.preventDefault();              // Prevent default form submission
        event.stopImmediatePropagation();    // Prevent Webflow interference
        errorMessage.textContent = '';       // Clear any previous error messages

        const email = document.getElementById('email').value;
        const password = document.getElementById('password').value;

        // Create user with email and password using Firebase
        auth.createUserWithEmailAndPassword(email, password)
            .then((userCredential) => {
                const user = userCredential.user;
                console.log('User signed up:', user);
                // Redirect to the onboarding page
                window.location.href = 'https://ecro.webflow.io/rider/onboarding';
            })
            .catch((error) => {
                const errorCode = error.code;
                const errorMessage = error.message;
                console.error('Sign up error:', errorCode, errorMessage);
                // Display error message to the user
                document.getElementById('error-message').textContent = errorMessage;
            });
    });

    // --- Google Sign-In ---

    const googleSignInButton = document.getElementById('google-signin-button');

    googleSignInButton.addEventListener('click', () => {
        const provider = new firebase.auth.GoogleAuthProvider();

        auth.signInWithPopup(provider)
            .then((result) => {
                const credential = result.credential;
                const token = credential.accessToken;
                const user = result.user;
                console.log('User signed in with Google:', user);
                // Redirect to the onboarding page
                window.location.href = 'https://ecro.webflow.io/rider/onboarding';
            })
            .catch((error) => {
                const errorCode = error.code;
                const errorMessage = error.message;
                console.error('Google Sign-In error:', errorCode, errorMessage);
                // Display the error message to the user (if an error message element exists)
            });
    });

});