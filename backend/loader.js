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
