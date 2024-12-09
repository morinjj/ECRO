/**
 * Retrieves all rider data from Firestore.
 *
 * @returns {Promise<Array>} A promise that resolves with an array of rider data objects.
 */
export function readAllRiderData() {
    return db.collection('userProfiles').get().then((querySnapshot) => {
      const riders = [];
      querySnapshot.forEach((doc) => {
        riders.push(doc.data());
      });
      return riders;
    });
  }
  
  /**
   * Populates the Webflow Collection List with rider data.
   *
   * @param {Array} riders - An array of rider data objects.
   */
  export function populateRiderList(riders) {
    setTimeout(() => {
      const riderList = document.getElementById('rider-list');
      const riderItems = riderList.querySelectorAll('.w-dyn-item');
  
      if (riderItems.length >= riders.length) {
        riders.forEach((rider, index) => {
          const firstNameElement = riderItems[index].querySelector('#first-name');
          const lastNameElement = riderItems[index].querySelector('#last-name');
  
          if (firstNameElement) {
            firstNameElement.textContent = rider.firstName;
          }
  
          if (lastNameElement) {
            lastNameElement.textContent = rider.lastName;
          }
  
          const riderElement = riderItems[index];
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
    }, 500);
  }
  
  /**
   * Handles the click event on a rider card to open the contract modal.
   *
   * @param {HTMLElement} riderCard - The rider card element.
   */
  export function handleRiderCardClick(riderCard) {
    riderCard.addEventListener('click', () => {
      const riderUserId = riderCard.dataset.rideruserid;
  
      const contractModal = document.getElementById('contract-modal');
      if (contractModal) {
        contractModal.setAttribute('data-rideruserid', riderUserId);
      } else {
        console.error("Error: Could not find the contract modal.");
      }
  
      // Fetch user profile data from Firebase 
      db.collection('userProfiles').doc(riderUserId).get()
        .then(doc => {
          if (doc.exists) {
            const userData = doc.data();
  
            // Calculate contract value (average and scaled)
            const ratingMax30 = userData.ratingMax30 || 0;
            const compoundScore = userData.compoundScore || 0;
            const contractValue = (((ratingMax30 + compoundScore) / 2) / 1000).toFixed(3);
            const formattedContractValue = `$${contractValue}m`;
  
            // Populate modal fields 
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
  }
  
  /**
   * Retrieves rider data from Firestore.
   *
   * @param {string} userId - The ID of the rider.
   * @returns {Promise<object|null>} A promise that resolves with the rider data 
   *                                 or null if the rider is not found.
   */
  export function getRiderData(userId) {
    const userProfilesRef = db.collection('userProfiles');
    return userProfilesRef.doc(userId).get()
      .then((doc) => {
        if (doc.exists) {
          return doc.data();
        } else {
          console.log("No such document!");
          return null;
        }
      })
      .catch((error) => {
        console.error("Error getting document:", error);
        return null;
      });
  }
  
  /**
   * Creates a new user profile in Firestore.
   *
   * @param {object} user - The Firebase user object.
   * @param {string} [firstName=null] - The first name of the user.
   * @param {string} [lastName=null] - The last name of the user.
   * @param {string} [profilePhotoUrl=null] - The URL of the user's profile photo.
   * @returns {Promise} A promise that resolves when the profile is created.
   */
  export function createUserProfile(user, firstName = null, lastName = null, profilePhotoUrl = null) {
    const userProfile = {
      userId: user.uid,
      email: user.email,
      firstName: firstName,
      lastName: lastName,
      profilePhotoUrl: profilePhotoUrl,
      createDate: firebase.firestore.FieldValue.serverTimestamp(),
      updatedDate: firebase.firestore.FieldValue.serverTimestamp(),
      zwiftId: null
    };
  
    const userProfilesRef = firebase.firestore().collection('userProfiles');
    return userProfilesRef.doc(user.uid).set(userProfile)
      .catch((error) => {
        console.error("Error creating user profile:", error);
      });
  }
  
  /**
   * Updates a user profile in Firestore.
   *
   * @param {string} userId - The ID of the user.
   * @param {object} updatedProfileData - The data to update the profile with.
   * @returns {Promise} A promise that resolves when the profile is updated.
   */
  export function updateUserProfile(userId, updatedProfileData) {
    const userProfilesRef = firebase.firestore().collection('userProfiles');
    return userProfilesRef.doc(userId).set(updatedProfileData, { merge: true });
  }