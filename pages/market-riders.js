document.addEventListener('DOMContentLoaded', (event) => {
  console.log("DOMContentLoaded event fired");

  // Fetch rider data (assuming Firebase is already initialized)
  db.collection('userProfiles').get().then((querySnapshot) => {
    const riders = [];
    querySnapshot.forEach((doc) => {
      riders.push(doc.data());
    });

    console.log("Rider data fetched:", riders);

    // Get the Webflow Collection List and its items (add a delay)
    setTimeout(() => {
      const riderList = document.getElementById('rider-list');
      const riderItems = riderList.querySelectorAll('.w-dyn-item');

      console.log("riderList:", riderList);
      console.log("riderItems:", riderItems);

      // Make sure there are enough rider items to hold the data
      if (riderItems.length >= riders.length) {
        riders.forEach((rider, index) => {
          const firstNameElement = riderItems[index].querySelector('#first-name');
          const lastNameElement = riderItems[index].querySelector('#last-name');

          if (firstNameElement) {
            firstNameElement.textContent = rider.firstName;
            console.log("Setting rider first name:", rider.firstName);
          }

          if (lastNameElement) {
            lastNameElement.textContent = rider.lastName;
            console.log("Setting rider last name:", rider.lastName);
          }

          // Set the data-riderUserId attribute on the rider element
          const riderElement = riderItems[index];
          console.log("Setting data-riderUserId to:", rider.userId);
          riderElement.setAttribute('data-rideruserid', rider.userId);
        });

        // Force Webflow to re-render the dynamic list
        const collectionWrapper = riderList.closest('.w-dyn-list');
        if (collectionWrapper) {
          collectionWrapper.classList.add('force-update');
          setTimeout(() => {
            collectionWrapper.classList.remove('force-update');
          }, 100);
        }
      } else {
        console.error("Not enough rider items to display the data.");
      }

      // Get all rider cards (after setting data-riderUserId)
      const riderCards = document.querySelectorAll('.w-dyn-item');

      // Add click event listener to each rider card
      riderCards.forEach(riderCard => {
        riderCard.addEventListener('click', () => {
          const riderUserId = riderCard.dataset.rideruserid;
          console.log("Clicked rider ID:", riderUserId);

          // Assuming your modal has the ID 'contract-modal'
          const contractModal = document.getElementById('contract-modal');
          if (contractModal) {
            // Set the rider ID on the modal
            contractModal.setAttribute('data-rideruserid', riderUserId);
            console.log("Modal 'data-rideruserid' set to:", riderUserId);
          } else {
            console.error("Error: Could not find the contract modal.");
          }

          // Fetch user profile data from Firebase
          db.collection('userProfiles').doc(riderUserId).get()
            .then(doc => {
              if (doc.exists) {
                const userData = doc.data();
                console.log("Fetched user data:", userData);

                // Calculate contract value (average and scaled)
                const ratingMax30 = userData.ratingMax30 || 0;
                const compoundScore = userData.compoundScore || 0;
                const contractValue = (((ratingMax30 + compoundScore) / 2) / 1000).toFixed(3);

                // Format contract value with $ and 'm'
                const formattedContractValue = `$${contractValue}m`;

                // Populate modal fields directly
                document.getElementById('rider-name').textContent = `${userData.firstName} ${userData.lastName}` || "";
                document.getElementById('contract-value').textContent = formattedContractValue;
              } else {
                console.log("No such user!");
              }
            })
            .catch(error => {
              console.error("Error getting user data:", error);
            });
        });
      });
    }, 500); // Wait before getting elements
  }).catch((error) => {
    console.error("Error getting riders: ", error);
  });

  // Add event listener for form submission to the "offer-contract-button"
  const offerContractButton = document.getElementById('offer-contract-button');
  offerContractButton.addEventListener('click', (event) => {
    event.preventDefault();

    // Get the currently selected rider's ID from the modal
    const modal = document.getElementById('contract-modal');
    const riderUserId = modal.dataset.rideruserid;

    console.log("Rider User ID:", riderUserId); // Log the riderUserId

    // Fetch user profile data for the selected rider
    db.collection('userProfiles').doc(riderUserId).get()
      .then(doc => {
        if (doc.exists) {
          const userData = doc.data();

          // 1. Gather data (including userId from userData)
          const riderId = userData.userId;
          const teamId = "ABC123"; // Hardcoded team ID
          const prizeSharing = document.getElementById('prize-sharing-dropdown').value;
          const additionalTerms = document.getElementById('additional-terms-input').value;

          // Get the date from the date selector
          const dateSelector = document.querySelector('#contract-form input[type="date"]');
          const contractEndDate = dateSelector ? dateSelector.value : null;

          // 2. Create contract object
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

          // 3. Save to Firebase
          db.collection('contracts').add(contractData)
            .then((docRef) => {
              // Get the auto-generated ID
              const contractId = docRef.id;

              // Update the contract with the ID and return the updated data
              return docRef.update({ contractId: contractId })
                .then(() => {
                  // Fetch the updated contract data
                  return docRef.get();
                })
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