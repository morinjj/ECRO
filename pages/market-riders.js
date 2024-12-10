document.addEventListener('DOMContentLoaded', (event) => {
  console.log("DOMContentLoaded event fired");

  const db = firebase.firestore();

  // Function to display user profiles
  function displayUserProfiles() {
    fetch('https://docs.google.com/spreadsheets/d/e/2PACX-1vTq6WvfcHP8QwclDBpzZuSUrbkkQHQjUrZlAcOH4mDOtrSyZaid-WCjZZCTEaVCPmJQIxwxIsElb5zU/pub?gid=0&single=true&output=csv')
      .then(response => response.text())
      .then(csvData => {
        const countryCodeMap = {};
        const rows = csvData.split('\n');
        rows.forEach(row => {
          const [countryName, countryCode] = row.split(',');
          countryCodeMap[countryCode] = countryName;
        });

        db.collection("userProfiles")
          .where("firstName", "!=", null)
          .get()
          .then((querySnapshot) => {
            const profilesContainer = document.getElementById('riders-container');
            const templateProfile = document.getElementById('rider-template');

            querySnapshot.forEach((profileDoc) => {
              const profileData = profileDoc.data();

              const profileElement = templateProfile.cloneNode(true);

              profileElement.querySelector('#first-name').textContent = profileData.firstName.toUpperCase();
              profileElement.querySelector('#last-name').textContent = profileData.lastName.toUpperCase();

              profileElement.setAttribute('userId', profileData.userId);

              const riderPhotoElement = profileElement.querySelector('#rider-photo');
              if (riderPhotoElement && profileData.profilePhotoUrl) {
                riderPhotoElement.src = profileData.profilePhotoUrl;
              } 

              const countryCode = profileData.country.toUpperCase();
              const flagImageUrl = `https://hatscripts.github.io/circle-flags/flags/${countryCode.toLowerCase()}.svg`;
              const flagImageElement = profileElement.querySelector('#flag-image');
              if (flagImageElement) {
                flagImageElement.src = flagImageUrl;
              } 

              const countryName = countryCodeMap[countryCode] || "Unknown Country";
              const countryTextElement = profileElement.querySelector('#country-text');
              if (countryTextElement) {
                countryTextElement.textContent = countryName;
              } 

              const catImageElement = profileElement.querySelector('#cat-image');
              if (catImageElement) {
                catImageElement.src = "https://cdn.prod.website-files.com/673bf5b704cb435e9b0db200/6757f54f25bfb94fb1e1e3ac_Group%201.svg";
              } 

              // Add event listener to the rider card
              profileElement.addEventListener('click', function() {
                const userId = this.getAttribute('userId'); 
                openModalWithUserId(userId);
              });

              profilesContainer.appendChild(profileElement);
            });

            templateProfile.remove();
          })
          .catch((error) => {
            console.error("Error fetching user profiles: ", error);
          });
      })
      .catch(error => {
        console.error("Error fetching country code mappings:", error);
      });
  }

  // Function to open the modal and populate it with user data
  function openModalWithUserId(userId) {
    // Show the modal
    const modal = document.getElementById('contract-modal'); 
    modal.style.display = 'block'; 

    // Populate the modal with user data
    populateModal(userId);
  }

  async function populateModal(userId) {
    try {
      console.log("populateModal function called with userId:", userId); 

      const doc = await db.collection('userProfiles').doc(userId).get();
      if (doc.exists) {
        const userData = doc.data();

        document.getElementById('rider-name').textContent = userData.firstName + " " + userData.lastName;

        const contractValueElement = document.getElementById('contract-value');
        if (contractValueElement) {
          contractValueElement.textContent = userData.baseMarketValue;
        } else {
          console.error("Contract value element not found!");
        }

        // ... (Populate other modal fields with userData here) ...

        attachModalListener(); 
      } else {
        console.log("No such user!");
      }
    } catch (error) {
      console.error("Error fetching user profile:", error);
    }
  }

  function attachModalListener() {
    const offerContractButton = document.getElementById('offer-contract-button');
    if (offerContractButton) {
      offerContractButton.addEventListener('click', (event) => {
        event.preventDefault(); 

        // You can access the userId from the modal's data attribute if needed
        // const userId = document.getElementById('contract-modal').dataset.userId;
        // Or since you have it in the outer scope, you can just use it here

        const teamId = "your-team-id"; // Replace with your team ID
        const prizeSharing = document.getElementById('prize-sharing-dropdown').value;
        const additionalTerms = document.getElementById('additional-terms-input').value;
        const dateSelector = document.querySelector('#contract-form input[type="date"]');
        let contractEndDate = dateSelector ? dateSelector.value : null;

        if (!contractEndDate) {
          alert("Please select a contract end date.");
          return;
        }

        contractEndDate = firebase.firestore.Timestamp.fromDate(new Date(contractEndDate));

        const contractData = {
          userId: userId, // Or just 'userId'
          teamId: teamId,
          prizeSharing: prizeSharing,
          additionalTerms: additionalTerms,
          contractEndDate: contractEndDate,
          // ... other contract data ...
        };

        db.collection('contracts').add(contractData)
          .then(docRef => {
            // ... (Your success handling code) ...
          })
          .catch(error => {
            console.error("Error adding contract:", error);
          });
      });
    } else {
      console.error("Offer Contract Button not found!");
    }
  }

  displayUserProfiles();
});