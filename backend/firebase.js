// firebase.js

function getRiderData(documentId) {
  const userProfilesRef = db.collection('userProfiles'); // Assuming 'db' is your Firestore instance
  return userProfilesRef.doc(documentId).get()
    .then((doc) => {
      if (doc.exists) {
        return doc.data();
      } else {
        console.log("No such document!");
        return null;
      }
    })
    .catch((error) => {
      console.error("Error getting document:", error);
      return null;
    });
}

function createUserProfile(user) {
  const userProfile = {
    userId: user.uid,
    email: user.email,
    // Add other initial profile data as needed
  };

  const userProfilesRef = firebase.firestore().collection('userProfiles');
  return userProfilesRef.doc(user.uid).set(userProfile);
}

// Make the functions accessible globally
window.getRiderData = getRiderData;
window.createUserProfile = createUserProfile;