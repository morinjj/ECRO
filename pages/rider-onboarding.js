document.addEventListener('DOMContentLoaded', (event) => {

  // --- Get references to the sections ---
  const section1 = document.getElementById('zwift-id-lookup-section');
  const section2 = document.getElementById('zrapp-results-section');
  const section3 = document.getElementById('results-confirmation-section');

  // --- Hide sections 2 and 3 initially ---
  if (section2) {
    section2.style.display = 'none';
  }
  if (section3) {
    section3.style.display = 'none';
  }

  // --- Function to transition between sections ---
  function transitionToSection(currentSection, nextSection, duration = 500) {
    if (currentSection && nextSection) {
      currentSection.style.opacity = 1;
      fadeOut(currentSection, duration);

      nextSection.style.opacity = 0;
      nextSection.style.display = 'block';
      setTimeout(() => {
        fadeIn(nextSection, duration);
      }, duration / 2);
    } else {
      console.error("One or both sections not found for transition!");
    }
  }

  // --- API call and transition logic ---
  const zwiftIdInput = document.getElementById('zwift-id-input');
  const form = document.getElementById('zwift-id-lookup-form');

  if (form) {
    form.addEventListener('submit', (event) => {
      event.preventDefault();

      const zwiftId = zwiftIdInput.value;

      if (isNaN(zwiftId)) {
        console.log("Please enter a valid Zwift ID (number).");
        return;
      }

      console.log("Fetching data...");

      // Call the API function from the separate file
      getZrappRiderData(zwiftId)
        .then(result => {
          console.log('API Response:', result);

          // --- Update fields in the page ---
          const riderNameElement = document.getElementById('rider-name-text');
          const riderCountryElement = document.getElementById('rider-country-text');
          const riderHeightElement = document.getElementById('rider-height-text');
          const riderWeightElement = document.getElementById('rider-weight-text');
          const riderZPCategoryElement = document.getElementById('rider-zp-category-text');

          if (riderNameElement) {
            riderNameElement.textContent = result.name.toUpperCase();
          }
          if (riderCountryElement) {
            riderCountryElement.textContent = result.country.toUpperCase();
          }
          if (riderHeightElement) {
            riderHeightElement.textContent = result.height + "cm";
          }
          if (riderWeightElement) {
            riderWeightElement.textContent = result.weight + "kg";
          }
          if (riderZPCategoryElement) {
            riderZPCategoryElement.textContent = result.zpCategory;
          }

          // --- Transition to section 2 after API call ---
          transitionToSection(section1, section2);

        })
        .catch(error => {
          console.error('API Error:', error);
          // Handle the error (e.g., display an error message)
        });
    });
  } else {
    console.error("Form element not found!");
  }

  // --- Get references to the buttons ---
  const declineButton = document.getElementById('decline-results-button');
  const confirmButton = document.getElementById('confirm-results-button');

  // --- Decline button logic ---
  if (declineButton) {
    declineButton.addEventListener('click', () => {
      // Add your logic here for what happens when the user clicks "Decline"
      console.log("Decline button clicked!");
    });
  } else {
    console.error("Decline button not found!");
  }

  // --- Confirm button logic ---
  if (confirmButton) {
    confirmButton.addEventListener('click', () => {

      // Get the current user's ID
      const userId = firebase.auth().currentUser.uid;

      // Use the stored zrappRiderData to update the user profile
      if (zrappRiderData) {
        updateUserProfileWithZrappRiderData(userId, zrappRiderData)
          .then(() => {
            console.log('User profile updated with Zrapp data!');
          })
          .catch(error => {
            console.error('Error updating user profile:', error);
            // Handle the error (e.g., display an error message)
          });
      } else {
        console.error("Zrapp rider data not found!");
        // Handle the case where zrappRiderData is not available
      }

      // Existing transition logic (keep this as it is)
      transitionToSection(section2, section3);
    });
  } else {
    console.error("Confirm button not found!");
  }

});

// --- Fade In/Out Functions ---
function fadeIn(element, duration) {
  let opacity = 0;
  const interval = setInterval(() => {
    opacity += 50 / duration;
    if (opacity >= 1) {
      clearInterval(interval);
      opacity = 1;
    }
    element.style.opacity = opacity;
  }, 50);
}

function fadeOut(element, duration) {
  let opacity = 1;
  const interval = setInterval(() => {
    opacity -= 50 / duration;
    if (opacity <= 0) {
      clearInterval(interval);
      opacity = 0;
      element.style.display = 'none';
    }
    element.style.opacity = opacity;
  }, 50);
}
// --- End Fade In/Out Functions ---
