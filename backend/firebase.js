// firebase.js

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

function createUserProfile(user) {
  const userProfile = {
    userId: user.uid,
    email: user.email,
    createDate: firebase.firestore.FieldValue.serverTimestamp(),
    updatedDate: firebase.firestore.FieldValue.serverTimestamp()
  };

  const userProfilesRef = firebase.firestore().collection('userProfiles');
  return userProfilesRef.doc(user.uid).set(userProfile);
}

function updateUserProfileWithZrappData(userId, zrappData) {
  const userProfilesRef = firebase.firestore().collection('userProfiles');

  const updatedData = {
    zwiftId: zrappData.riderId,
    name: zrappData.name,
    country: zrappData.country,
    // ... other fields from zrappData ...
    updatedDate: firebase.firestore.FieldValue.serverTimestamp(),
    rappDataDate: firebase.firestore.FieldValue.serverTimestamp()
  };

  return userProfilesRef.doc(userId).update(updatedData);
}

// Make the functions accessible globally
window.getRiderData = getRiderData;
window.createUserProfile = createUserProfile;
window.updateUserProfileWithZrappData = updateUserProfileWithZrappData;