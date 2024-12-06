function getRiderData(documentId) {
    const userProfilesRef = db.collection('userProfiles');
    return userProfilesRef.doc(documentId).get().then((doc) => {
      if (doc.exists) {
        return doc.data();
      } else {
        console.log("No such document!");
        return null; 
      }
    }).catch((error) => {
      console.error("Error getting document:", error);
      return null; 
    });
  }
  
  // Make the function accessible globally
  window.getRiderData = getRiderData; 