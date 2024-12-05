const zwiftIdInput = document.getElementById('zwift-id-input');
const form = document.querySelector('form');

form.addEventListener('submit', (event) => {
    event.preventDefault();

    const zwiftId = zwiftIdInput.value;

    // Basic input validation (optional, but recommended)
    if (isNaN(zwiftId)) {
        console.log("Please enter a valid Zwift ID (number).");
        return;
    }

    const myHeaders = new Headers();
    myHeaders.append("Authorization", "63c596999fdebac2cbeab9eb");

    const requestOptions = {
        method: "GET",
        headers: myHeaders,
        redirect: "follow"
    };

    console.log("Fetching data..."); // Indicate that the API call is starting

    fetch(`https://zwift-ranking.herokuapp.com/public/riders/${zwiftId}`, requestOptions)
        .then(response => response.json())
        .then(result => {
            console.log('API Response:', result); // Log the complete API response object
        })
        .catch(error => {
            console.error('API Error:', error);
        });
});
