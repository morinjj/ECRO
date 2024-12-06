function getRiderData(documentId) {
  const userProfilesRef = db.collection('userProfiles');
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

function createUserProfile(user, firstName = null, lastName = null, profilePhotoUrl = null) {
  const userProfile = {
    userId: user.uid,
    email: user.email,
    firstName: firstName,
    lastName: lastName,
    profilePhotoUrl: profilePhotoUrl,
    createDate: firebase.firestore.FieldValue.serverTimestamp(),
    updatedDate: firebase.firestore.FieldValue.serverTimestamp(),
    zwiftId: null 
  };

  const userProfilesRef = firebase.firestore().collection('userProfiles');
  return userProfilesRef.doc(user.uid).set(userProfile);
}

// Make the functions accessible globally
window.getRiderData = getRiderData;
window.createUserProfile = createUserProfile;