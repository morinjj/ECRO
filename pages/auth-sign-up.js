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
          window.location.href = '/rider/onboarding';
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
      provider.addScope('profile');

      auth.signInWithPopup(provider)
        .then((result) => {
          const user = result.user;
          console.log('User signed in with Google:', user);

          const names = user.displayName.split(" ");
          const firstName = names[0];
          const lastName = names.slice(1).join(" ");
          const profilePhotoUrl = user.photoURL;

          const userProfilesRef = firebase.firestore().collection('userProfiles');
          userProfilesRef.doc(user.uid).get()
            .then((doc) => {
              if (!doc.exists) {
                console.log("User profile does not exist, creating...");
                createUserProfile(user, firstName, lastName, profilePhotoUrl)
                  .then(() => {
                    console.log('User profile created successfully!');
                  })
                  .catch((error) => {
                    console.error('Error creating user profile:', error);
                  });
              } else {
                console.log('User profile already exists');
              }
              window.location.href = '/rider/onboarding';
            })
            .catch((error) => {
              console.error('Error checking for user profile:', error);
            });
        })
        .catch((error) => {
          console.error('Google Sign-In error:', error.code, error.message);
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

              let firstName = null;
              let lastName = null;
              let profilePhotoUrl = null;
              if (user.displayName) {
                const names = user.displayName.split(" ");
                firstName = names[0];
                lastName = names.slice(1).join(" ");
                profilePhotoUrl = user.photoURL;
              }

              createUserProfile(user, firstName, lastName, profilePhotoUrl)
                .then(() => {
                  console.log('User profile created successfully!');
                })
                .catch((error) => {
                  console.error('Error creating user profile:', error);
                });
            } else {
              const profileData = doc.data();

              if (profileData.zwiftId) {

                if (profileData.zrappUpdatedDate &&
                  (new Date() - profileData.zrappUpdatedDate.toDate()) <= (24 * 60 * 60 * 1000)) {

                  console.log("ZRApp data is up-to-date.");

                } else {
                  console.log("Fetching ZRApp data...");

                  getZrappRiderData(profileData.zwiftId)
                    .then((zrappData) => {
                      updateUserProfileWithZrappRiderData(user.uid, zrappData)
                        .then(() => {
                          console.log('User profile updated with new ZRApp data!');
                        })
                        .catch((error) => {
                          console.error('Error updating user profile:', error);
                        });
                    })
                    .catch((error) => {
                      console.error('Error fetching ZRApp data:', error);
                    });
                }

              } else {
                console.log("zwiftId not found in user profile.");
              }
            }
          })
          .catch((error) => {
            console.error('Error checking for user profile:', error);
          });

      } else {
        console.log("User is signed out, redirecting to login");
        window.location.href = "/auth/sign-up";
      }
    }
  });
});