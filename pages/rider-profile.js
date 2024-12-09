// pages/rider-profile.js

import { 
  getRiderData, 
  updateUserProfile 
} from '../backend/riderFunctions.js';

document.addEventListener('DOMContentLoaded', (event) => {
  const languageDropdown1 = document.getElementById('language-1-dropdown');
  const languageDropdown2 = document.getElementById('language-2-dropdown');
  const languageDropdown3 = document.getElementById('language-3-dropdown');
  const countriesDropdown = document.getElementById('countries-dropdown');
  const timezonesDropdown = document.getElementById('time-zones-dropdown');
  const powerSourcesDropdown1 = document.getElementById('power-source-1-dropdown');
  const powerSourcesDropdown2 = document.getElementById('power-source-2-dropdown');
  const ridingHourDropdown1 = document.getElementById('riding-hour-1-dropdown');
  const ridingHourDropdown2 = document.getElementById('riding-hour-2-dropdown');

  const languagesSheetUrl = 'https://docs.google.com/spreadsheets/d/e/2PACX-1vTq6WvfcHP8QwclDBpzZuSUrbkkQHQjUrZlAcOH4mDOtrSyZaid-WCjZZCTEaVCPmJQIxwxIsElb5zU/pub?gid=697633175&single=true&output=csv';
  const countriesSheetUrl = 'https://docs.google.com/spreadsheets/d/e/2PACX-1vTq6WvfcHP8QwclDBpzZuSUrbkkQHQjUrZlAcOH4mDOtrSyZaid-WCjZZCTEaVCPmJQIxwxIsElb5zU/pub?gid=0&single=true&output=csv';
  const timezonesSheetUrl = 'https://docs.google.com/spreadsheets/d/e/2PACX-1vTq6WvfcHP8QwclDBpzZuSUrbkkQHQjUrZlAcOH4mDOtrSyZaid-WCjZZCTEaVCPmJQIxwxIsElb5zU/pub?gid=2048207698&single=true&output=csv';
  const powerSourcesSheetUrl = 'https://docs.google.com/spreadsheets/d/e/2PACX-1vTq6WvfcHP8QwclDBpzZuSUrbkkQHQjUrZlAcOH4mDOtrSyZaid-WCjZZCTEaVCPmJQIxwxIsElb5zU/pub?gid=1885059559&single=true&output=csv';

  // Function to add options to a dropdown
  const addOptionsToDropdown = (dropdown, sheetUrl) => {
    fetch(sheetUrl)
      .then(response => response.text())
      .then(csvData => {
        const rows = csvData.split('\n');
        rows.forEach(row => {
          const values = row.split(',');
          const optionValue = values[0];
          const optionElement = document.createElement('option');
          optionElement.value = optionValue;
          optionElement.text = optionValue;
          dropdown.add(optionElement);
        });
      })
      .catch(error => {
        console.error(`Error fetching Google Sheet data for ${dropdown.id}:`, error);
      });
  }

  // Add options to all dropdowns
  addOptionsToDropdown(languageDropdown1, languagesSheetUrl);
  addOptionsToDropdown(languageDropdown2, languagesSheetUrl);
  addOptionsToDropdown(languageDropdown3, languagesSheetUrl);
  addOptionsToDropdown(countriesDropdown, countriesSheetUrl);
  addOptionsToDropdown(timezonesDropdown, timezonesSheetUrl);
  addOptionsToDropdown(ridingHourDropdown1, timezonesSheetUrl);
  addOptionsToDropdown(ridingHourDropdown2, timezonesSheetUrl);
  addOptionsToDropdown(powerSourcesDropdown1, powerSourcesSheetUrl);
  addOptionsToDropdown(powerSourcesDropdown2, powerSourcesSheetUrl);

  // --- Code to populate form fields with user profile data ---
  firebase.auth().onAuthStateChanged((user) => {
    if (user) {
      const userId = user.uid;
      getRiderData(userId)
        .then(userProfile => {

          setTimeout(() => {
            // Fade out the loader
            const loader = document.querySelector('.loader');
            loader.style.opacity = 0;
            loader.style.transition = 'opacity 0.5s ease-in-out';

            setTimeout(() => {
              loader.style.display = 'none';
              document.body.style.overflow = 'auto';

              // Fade in the page content
              const pageContent = document.querySelector('.page-content');
              pageContent.style.opacity = 0;
              pageContent.style.display = 'block';
              setTimeout(() => {
                pageContent.style.opacity = 1;
                pageContent.style.transition = 'opacity 0.5s ease-in-out';
              }, 10);
            }, 500);

            // Populate form fields
            document.getElementById('first-name-input').value = userProfile.firstName || "";
            document.getElementById('last-name-input').value = userProfile.lastName || "";
            document.getElementById('countries-dropdown').value = userProfile.countrResidence || "";
            document.getElementById('time-zones-dropdown').value = userProfile.timezone || "";
            document.getElementById('language-1-dropdown').value = userProfile.language1 || "";
            document.getElementById('language-2-dropdown').value = userProfile.language2 || "";
            document.getElementById('language-3-dropdown').value = userProfile.language3 || "";
            document.getElementById('riding-hour-1-dropdown').value = userProfile.ridingHour1 || "";
            document.getElementById('riding-hour-2-dropdown').value = userProfile.ridingHour2 || "";
            document.getElementById('power-source-1-dropdown').value = userProfile.powerSource1 || "";
            document.getElementById('power-source-2-dropdown').value = userProfile.powerSource2 || "";
            document.getElementById('racing-platform-dropdown').value = userProfile.racingPlatform || "";
            document.getElementById('discord-name-input').value = userProfile.discordName || "";
          }, 1000); // Adjust delay as needed

        })
        .catch(error => {
          console.error("Error fetching rider data:", error);
        });
    } else {
      // Redirect to login or handle unauthenticated users
      window.location.href = '/login';
    }
  });

  // Assuming you have a form with the ID "rider-profile-form"
  const riderProfileForm = document.getElementById('rider-profile-form');

  if (riderProfileForm) {
    riderProfileForm.addEventListener('submit', (event) => {
      event.preventDefault();

      const userId = firebase.auth().currentUser.uid;

      // Gather data from the form fields
      const updatedProfileData = {
        firstName: document.getElementById('first-name-input').value,
        lastName: document.getElementById('last-name-input').value,
        countrResidence: document.getElementById('countries-dropdown').value,
        timezone: document.getElementById('time-zones-dropdown').value,
        language1: document.getElementById('language-1-dropdown').value,
        language2: document.getElementById('language-2-dropdown').value,
        language3: document.getElementById('language-3-dropdown').value,
        ridingHour1: document.getElementById('riding-hour-1-dropdown').value,
        ridingHour2: document.getElementById('riding-hour-2-dropdown').value,
        powerSource1: document.getElementById('power-source-1-dropdown').value,
        powerSource2: document.getElementById('power-source-2-dropdown').value,
        racingPlatform: document.getElementById('racing-platform-dropdown').value,
        discordName: document.getElementById('discord-name-input').value,
        updatedDate: firebase.firestore.FieldValue.serverTimestamp()
      };

      // Update the user profile using the function from riderFunctions.js
      updateUserProfile(userId, updatedProfileData)
        .then(() => {
          console.log('User profile updated successfully!');
        })
        .catch(error => {
          console.error('Error updating user profile:', error);
        });
    });
  }
});