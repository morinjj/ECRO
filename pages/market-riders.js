// pages/market-riders.js

// Import functions for rider data handling from an external JavaScript file.
import {
    readAllRiderData,
    populateRiderList,
    handleRiderCardClick
} from 'https://cdn.jsdelivr.net/gh/morinjj/ECRO@refs/tags/1.0.16/backend/riderFunctions.js';

// Wait for the entire page to load before executing the script.
document.addEventListener('DOMContentLoaded', (event) => {
    console.log("DOMContentLoaded event fired");

    // Fetch all rider data from Firestore.
    readAllRiderData()
        .then(riders => {
            // Populate the rider list on the page with the fetched data.
            populateRiderList(riders);

            // Get all rider card elements on the page.
            const riderCards = document.querySelectorAll('.w-dyn-item');
            // Add click event listeners to each rider card to handle card clicks.
            riderCards.forEach(riderCard => {
                handleRiderCardClick(riderCard);
            });
        })
        .catch(error => {
            console.error("Error getting riders: ", error);
        });

    // Add an event listener for form submission to the "offer-contract-button".
    const offerContractButton = document.getElementById('offer-contract-button');
    offerContractButton.addEventListener('click', (event) => {
        event.preventDefault(); // Prevent default form submission behavior.

        // Get the currently selected rider's ID from the modal's data attribute.
        const modal = document.getElementById('contract-modal');
        const riderUserId = modal.dataset.rideruserid;

        console.log("Rider User ID:", riderUserId);

        // Fetch user profile data for the selected rider from Firestore.
        db.collection('userProfiles').doc(riderUserId).get()
            .then(doc => {
                if (doc.exists) {
                    const userData = doc.data();

                    const riderId = userData.userId;
                    const teamId = "FNBIInL2lPqVBufQ5ALt"; // Hardcoded team ID (replace with actual team selection logic).

                    // Set default prize sharing to "50-50" (assuming it's the third option in the dropdown).
                    const prizeSharingDropdown = document.getElementById('prize-sharing-dropdown');
                    prizeSharingDropdown.selectedIndex = 2;
                    const prizeSharing = prizeSharingDropdown.value;

                    // Get additional terms from the input field.
                    const additionalTerms = document.getElementById('additional-terms-input').value;

                    // Get the contract end date from the date input field.
                    const dateSelector = document.querySelector('#contract-form input[type="date"]');
                    let contractEndDate = dateSelector ? dateSelector.value : null;

                    // Validate that a contract end date has been selected.
                    if (!contractEndDate) {
                        alert("Please select a contract end date.");
                        return;
                    }

                    // Convert contractEndDate to a Firestore Timestamp object.
                    contractEndDate = new Date(contractEndDate);
                    contractEndDate = firebase.firestore.Timestamp.fromDate(contractEndDate);

                    // Create a contract data object with the collected information.
                    const contractData = {
                        userId: riderId,
                        teamId: teamId,
                        prizeSharing: prizeSharing,
                        additionalTerms: additionalTerms,
                        contractEndDate: contractEndDate,
                        status: "offered",
                        contractCreatedDate: firebase.firestore.FieldValue.serverTimestamp(), // Use server timestamp for creation date.
                        contractStatusDate: firebase.firestore.FieldValue.serverTimestamp() // Use server timestamp for status date.
                    };

                    // Save the contract data to Firestore.
                    db.collection('contracts').add(contractData)
                        .then((docRef) => {
                            // Get the auto-generated ID of the new contract document.
                            const contractId = docRef.id;
                            // Update the contract document with its own ID.
                            return docRef.update({ contractId: contractId })
                                .then(() => docRef.get()) // Fetch the updated contract document.
                                .then((doc) => {
                                    const updatedContractData = doc.data();
                                    console.log("Contract added and updated with ID:", updatedContractData.contractId);
                                });
                        })
                        .catch((error) => {
                            console.error("Error adding or updating contract:", error);
                        });
                } else {
                    console.log("No such user!");
                }
            })
            .catch(error => {
                console.error("Error getting user data:", error);
            });
    });
});