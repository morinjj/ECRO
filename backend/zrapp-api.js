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

  // Calculate baseMarketValue, handling null values
  const ratingMax30 = zrappRiderData.race.max30.rating;
  const compoundScore = zrappRiderData.power.compoundScore;

  let baseMarketValue;
  if (ratingMax30 === null && compoundScore === null) {
    baseMarketValue = 0;
  } else if (ratingMax30 === null) {
    baseMarketValue = compoundScore * 1000;
  } else if (compoundScore === null) {
    baseMarketValue = ratingMax30 * 1000;
  } else {
    baseMarketValue = ((ratingMax30 + compoundScore) / 2) * 1000;
  }

  updatedData.baseMarketValue = baseMarketValue;

  return userProfilesRef.doc(userId).update(updatedData);
}

// Make the functions accessible globally
window.getZrappRiderData = getZrappRiderData;
window.updateUserProfileWithZrappRiderData = updateUserProfileWithZrappRiderData;