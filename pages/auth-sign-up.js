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
                    console.log('User signed in with Google:', result.user);
                })
                .catch((error) => {
                    console.error('Google Sign-In error:', error.code, error.message);
                    // Handle the error, e.g., display an error message
                });
        });
    }

    // --- Protect member-only pages and create/update user profile if needed ---
    firebase.auth().onAuthStateChanged((user) => {

        if (window.location.pathname !== '/auth/sign-up') {
            if (user) {
                console.log("User is signed in:", user.uid);

                const userProfilesRef = firebase.firestore().collection('userProfiles');
                userProfilesRef.doc(user.uid).get()
                    .then((doc) => {
                        if (!doc.exists) {
                            console.log("User profile does not exist, creating...");
                            createUserProfile(user)
                                .then(() => {
                                    console.log('User profile created successfully!');
                                })
                                .catch((error) => {
                                    console.error('Error creating user profile:', error);
                                    // Handle the error, e.g., display an error message
                                });
                        } else {
                            const profileData = doc.data();

                            // Check if zrappDataDate does NOT exist OR is older than 24 hours
                            if (!profileData.zrappDataDate ||
                                (new Date() - profileData.zrappDataDate.toDate()) > (24 * 60 * 60 * 1000)) {

                                console.log("ZRApp data needs to be fetched (either it doesn't exist or is older than 24 hours)...");

                                // Fetch data from ZRApp API (make sure to pass the zwiftId if needed)
                                getZRAppRiderData( /* ... pass any necessary arguments ... */)
                                    .then((zrappData) => {
                                        // Update user profile with new ZRApp data
                                        updateUserProfileWithZrappData(user.uid, zrappData)
                                            .then(() => {
                                                console.log('User profile updated with new ZRApp data!');
                                            })
                                            .catch((error) => {
                                                console.error('Error updating user profile:', error);
                                                // Handle the error, e.g., display an error message
                                            });
                                    })
                                    .catch((error) => {
                                        console.error('Error fetching ZRApp data:', error);
                                        // Handle the error, e.g., display an error message
                                    });

                            } else {
                                console.log('ZRApp data is up-to-date.');
                            }
                        }
                    })
                    .catch((error) => {
                        console.error('Error checking for user profile:', error);
                        // Handle the error, e.g., display an error message
                    });

            } else {
                console.log("User is signed out, redirecting to login");
                window.location.href = "/auth/sign-up";
            }
        }
    });
});