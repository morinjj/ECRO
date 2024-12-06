document.addEventListener('DOMContentLoaded', (event) => {
    const zwiftIdInput = document.getElementById('zwift-id-input');
    const form = document.getElementById('zwift-id-lookup-form');

    if (form) { // Check if the form element is found
        form.addEventListener('submit', (event) => {
            event.preventDefault();

            const zwiftId = zwiftIdInput.value;

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

            console.log("Fetching data...");

            fetch(`https://zwift-ranking.herokuapp.com/public/riders/${zwiftId}`, requestOptions)
                .then(response => response.json())
                .then(result => {
                    console.log('API Response:', result);
                })
                .catch(error => {
                    console.error('API Error:', error);
                });
        });
    } else {
        console.error("Form element not found!");
    }
});