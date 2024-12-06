function getZrappRiderData(zwiftId) {
  const myHeaders = new Headers();
  myHeaders.append("Authorization", "63c596999fdebac2cbeab9eb");

  const requestOptions = {
    method: "GET",
    headers: myHeaders,
    redirect: "follow"
  };

  return fetch(`https://zwift-ranking.herokuapp.com/public/riders/${zwiftId}`, requestOptions)
    .then(response => response.json());
}

function updateUserProfileWithZrappRiderData(userId, zrappRiderData) {
  const userProfilesRef = firebase.firestore().collection('userProfiles');

  const updatedData = {
    zwiftId: zrappRiderData.riderId,
    name: zrappRiderData.name,
    country: zrappRiderData.country,
    gender: zrappRiderData.gender,
    height: zrappRiderData.height,
    weight: zrappRiderData.weight,
    zpCategory: zrappRiderData.zpCategory,
    compoundScore: zrappRiderData.power.compoundScore,
    ratingCurrent: zrappRiderData.race.current.rating,
    ratingMax30: zrappRiderData.race.max30.rating,
    ratingMax90: zrappRiderData.race.max90.rating,
    wkg15: zrappRiderData.power.wkg15,
    wkg60: zrappRiderData.power.wkg60,
    wkg300: zrappRiderData.power.wkg300,
    wkg1200: zrappRiderData.power.wkg1200,
    updatedDate: firebase.firestore.FieldValue.serverTimestamp(),
    zrappUpdatedDate: firebase.firestore.FieldValue.serverTimestamp()
  };

  return userProfilesRef.doc(userId).update(updatedData);
}

// Make the functions accessible globally (if needed)
window.getZrappRiderData = getZrappRiderData;
window.updateUserProfileWithZrappRiderData = updateUserProfileWithZrappRiderData;