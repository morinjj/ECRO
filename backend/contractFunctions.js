// contractFunctions.js

/**
 * Opens the contract creation modal and populates it with user data.
 * @param {string} userId - The ID of the user for whom to create a contract.
 */
function openContractCreationModal(userId) {
  const modal = document.getElementById('contract-modal');
  modal.style.display = 'block';
  populateContractCreationModal(userId);
  modal.dataset.userId = userId;
}

/**
 * Populates the contract creation modal with user data fetched from Firestore.
 * @param {string} userId - The ID of the user for whom to create a contract.
 */
async function populateContractCreationModal(userId) {
  try {
    console.log("populateContractCreationModal function called with userId:", userId);
    const doc = await db.collection('userProfiles').doc(userId).get();
    if (doc.exists) {
      const userData = doc.data();

      // Set rider name in the modal
      document.getElementById('rider-name').textContent = userData.firstName + " " + userData.lastName;

      const contractValueElement = document.getElementById('contract-value');
      if (contractValueElement) {
        // Format the baseMarketValue
        const formattedValue = formatBaseMarketValue(userData.baseMarketValue);
        contractValueElement.textContent = formattedValue;

        // Store the original baseMarketValue in a data attribute 
        contractValueElement.dataset.baseMarketValue = userData.baseMarketValue;

      } else {
        console.error("Contract value element not found!");
      }
      createContract();
    } else {
      console.log("No such user!");
    }
  } catch (error) {
    console.error("Error fetching user profile:", error);
  }
}

/**
 * Formats the baseMarketValue to display with a $, divided by 1,000,000, 
 * rounded to 3 decimals, and with an "m" suffix.
 * @param {number} baseMarketValue - The baseMarketValue to format.
 * @returns {string} The formatted baseMarketValue string.
 */
function formatBaseMarketValue(baseMarketValue) {
  const valueInMillions = baseMarketValue / 1000000;
  const roundedValue = valueInMillions.toFixed(3);
  return "$" + roundedValue + "m";
}

/**
 * Handles the contract creation form submission.
 * Collects form data, creates a new contract in Firestore, and updates 
 * the contract with its generated ID.
 */
function createContract() {
  const contractForm = document.getElementById('contract-form');

  if (contractForm) {
    contractForm.addEventListener('submit', (event) => {
      event.preventDefault();

      // Get the userId from the modal's data attribute
      const userId = document.getElementById('contract-modal').dataset.userId;

      // Get form field values
      const teamId = "your-team-id"; // Replace with your actual team ID
      const prizeSharing = document.getElementById('prize-sharing-dropdown').value;
      const additionalTerms = document.getElementById('additional-terms-input').value;
      const dateSelector = document.querySelector('#contract-form input[type="date"]');
      let contractEndDate = dateSelector ? dateSelector.value : null;

      if (!contractEndDate) {
        alert("Please select a contract end date.");
        return;
      }

      contractEndDate = firebase.firestore.Timestamp.fromDate(new Date(contractEndDate));

      // Get the baseMarketValue from the data attribute
      const contractValue = document.getElementById('contract-value').dataset.baseMarketValue;

      // Create the contract data object
      const contractData = {
        userId: userId,
        teamId: teamId,
        prizeSharing: prizeSharing,
        additionalTerms: additionalTerms,
        contractEndDate: contractEndDate,
        contractValue: contractValue, 
        status: "offered",
        contractCreatedDate: firebase.firestore.FieldValue.serverTimestamp(),
        contractStatusDate: firebase.firestore.FieldValue.serverTimestamp()
      };

      let contractId;

      // Add the contract to Firestore and update with the generated ID
      db.collection('contracts').add(contractData)
        .then((docRef) => {
          contractId = docRef.id;
          return docRef.update({contractId: contractId});
        })
        .then(() => {
          console.log("Contract added and updated with ID: ", contractId);

          // Reset and close the modal
          resetContractModal();
          closeModal(); 
        })
        .catch(error => {
          console.error("Error adding or updating contract:", error);
        });
    });
  } else {
    console.error("Contract Form not found!");
  }
}

/**
 * Resets the contract creation modal to its initial state.
 */
function resetContractModal() {
  // 1. Clear form fields
  const contractForm = document.getElementById('contract-form');

  // Check if contractForm is a valid form element before calling reset
  if (contractForm && contractForm instanceof HTMLFormElement) {
    contractForm.reset();
  } else {
    console.error("Form element not found or is not a valid form!");
  }

  // 2. Hide any success messages (if you have any)
  // const successMessage = document.getElementById('success-message');
  // if (successMessage) {
  //   successMessage.style.display = 'none';
  // }

  // 3. Show the form fields (if you were hiding them)
  // const formFields = document.getElementById('form-fields');
  // if (formFields) {
  //   formFields.style.display = 'block';
  // }

  // 4. Optionally, reset other modal content (e.g., headings, descriptions)
  // document.getElementById('modal-title').textContent = "Create New Contract"; 
}

/**
 * Closes the contract creation modal.
 */
function closeModal() {
  const modal = document.getElementById('contract-modal');
  if (modal) {
    modal.style.display = 'none';
  }
}

// Make the functions accessible globally (if needed)
window.openContractCreationModal = openContractCreationModal;
window.populateContractCreationModal = populateContractCreationModal;
window.createContract = createContract;