// backend/zrapp-api.js)

function getZRAppRiderData(zwiftId) {
    const myHeaders = new Headers();
    myHeaders.append("Authorization", "63c596999fdebac2cbeab9eb"); // Replace with your actual API key
  
    const requestOptions = {
      method: "GET",
      headers: myHeaders,
      redirect: "follow"
    };
  
    return fetch(`https://zwift-ranking.herokuapp.com/public/riders/${zwiftId}`, requestOptions)
      .then(response => response.json()); 
  }