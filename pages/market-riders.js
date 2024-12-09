// pages/market-riders.js

import { 
  readAllRiderData, 
  populateRiderList, 
  handleRiderCardClick 
} from '../backend/riderFunctions.js';

document.addEventListener('DOMContentLoaded', (event) => {
  console.log("DOMContentLoaded event fired");

  readAllRiderData()
    .then(riders => {
      populateRiderList(riders);

      const riderCards = document.querySelectorAll('.w-dyn-item');
      riderCards.forEach(riderCard => {
        handleRiderCardClick(riderCard);
      });
    })
    .catch(error => {
      console.error("Error getting riders: ", error);
    });

  // Add event listener for form submission to the "offer-contract-button"
  const offerContractButton = document.getElementById('offer-contract-button');
  offerContractButton.addEventListener('click', (event) => {
    event.preventDefault();

    // Get the currently selected rider's ID from the modal
    const modal = document.getElementById('contract-modal');
    const riderUserId = modal.dataset.rideruserid;

    console.log("Rider User ID:", riderUserId); 

    // Fetch user profile data for the selected rider
    db.collection('userProfiles').doc(riderUserId).get()
      .then(doc => {
        if (doc.exists) {
          const userData = doc.data();

          const riderId = userData.userId;
          const teamId = "FNBIInL2lPqVBufQ5ALt"; // Hardcoded team ID

          const prizeSharingDropdown = document.getElementById('prize-sharing-dropdown');
          prizeSharingDropdown.selectedIndex = 2; // Assuming "50-50" is the third option
          const prizeSharing = prizeSharingDropdown.value;

          const additionalTerms = document.getElementById('additional-terms-input').value;

          const dateSelector = document.querySelector('#contract-form input[type="date"]');
          let contractEndDate = dateSelector ? dateSelector.value : null;

          if (!contractEndDate) {
            alert("Please select a contract end date.");
            return;
          }

          const contractData = {
            userId: riderId,
            teamId: teamId,
            prizeSharing: prizeSharing,
            additionalTerms: additionalTerms,
            contractEndDate: contractEndDate,
            status: "offered",
            contractCreatedDate: firebase.firestore.FieldValue.serverTimestamp(),
            contractStatusDate: firebase.firestore.FieldValue.serverTimestamp()
          };

          // Save to Firebase (You'll likely move this to contractFunctions.js)
          db.collection('contracts').add(contractData)
            .then((docRef) => {
              const contractId = docRef.id;
              return docRef.update({ contractId: contractId })
                .then(() => docRef.get())
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