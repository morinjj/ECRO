document.addEventListener('DOMContentLoaded', (event) => {
  console.log("DOMContentLoaded event fired");

  const db = firebase.firestore();

  // Function to display user profiles
  function displayUserProfiles() {

    // Fetch user profiles from Firestore
    db.collection("userProfiles")
      .where("firstName", "!=", null)
      .get()
      .then((querySnapshot) => {
        const profilesContainer = document.getElementById('riders-container');
        const templateProfile = document.getElementById('rider-template');

        querySnapshot.forEach((profileDoc) => {
          const profileData = profileDoc.data();

          // Clone the rider profile template
          const profileElement = templateProfile.cloneNode(true);

          // Populate the profile elements with data

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

          const countryName = profileData.countryName || "Unknown Country";
          const countryTextElement = profileElement.querySelector('#country-text');
          if (countryTextElement) {
            countryTextElement.textContent = countryName;
          }

          const catImageElement = profileElement.querySelector('#cat-image');
          if (catImageElement) {
            catImageElement.src = "https://cdn.prod.website-files.com/673bf5b704cb435e9b0db200/6757f54f25bfb94fb1e1e3ac_Group%201.svg";
          }

          // Add event listener to open the contract creation modal
          profileElement.addEventListener('click', function () {
            const userId = this.getAttribute('userId');
            openContractCreationModal(userId);
          });

          profilesContainer.appendChild(profileElement);
        });

        // Remove the template element after cloning
        templateProfile.remove();
      })
      .catch((error) => {
        console.error("Error fetching user profiles: ", error);
      });
  }

  // Initialize the user profile display
  displayUserProfiles();
});