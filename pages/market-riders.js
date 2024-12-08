document.addEventListener('DOMContentLoaded', (event) => {
  // Fetch rider data (assuming Firebase is already initialized)
  db.collection('userProfiles').get().then((querySnapshot) => {
    const riders = [];
    querySnapshot.forEach((doc) => {
      riders.push(doc.data());
    });

    // Get the Webflow Collection List and its items (add a delay)
    setTimeout(() => {
      const riderList = document.getElementById('rider-list');
      const riderItems = riderList.querySelectorAll('.w-dyn-item');

      // Log the value of riderList and riderItems to the console
      console.log("riderList:", riderList);
      console.log("riderItems:", riderItems);

      // Make sure there are enough rider items to hold the data
      if (riderItems.length >= riders.length) {
        riders.forEach((rider, index) => {
          const firstNameElement = riderItems[index].querySelector('#first-name');
          const lastNameElement = riderItems[index].querySelector('#last-name'); // Select last name element

          if (firstNameElement) {
            firstNameElement.textContent = rider.firstName;
            console.log("Setting rider first name:", rider.firstName);
          }

          if (lastNameElement) {
            lastNameElement.textContent = rider.lastName; // Set last name
            console.log("Setting rider last name:", rider.lastName);
          }
        });

        // Force Webflow to re-render the dynamic list
        const collectionWrapper = riderList.closest('.w-dyn-list');
        if (collectionWrapper) {
          collectionWrapper.classList.add('force-update');
          setTimeout(() => {
            collectionWrapper.classList.remove('force-update');
          }, 100); // Adjust timeout if needed
        }
      } else {
        console.error("Not enough rider items to display the data.");
      }
    }, 500); // Wait 500 milliseconds before getting the elements
  }).catch((error) => {
    console.error("Error getting riders: ", error);
  });
});