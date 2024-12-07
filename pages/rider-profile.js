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

    console.log("Language Dropdown 1 element:", languageDropdown1);
    console.log("Language Dropdown 2 element:", languageDropdown2);
    console.log("Language Dropdown 3 element:", languageDropdown3);
    console.log("Countries Dropdown element:", countriesDropdown);
    console.log("Timezones Dropdown element:", timezonesDropdown);
    console.log("Power Source 1 Dropdown element:", powerSourcesDropdown1);
    console.log("Power Source 2 Dropdown element:", powerSourcesDropdown2);
    console.log("Riding Hour 1 Dropdown element:", ridingHourDropdown1);
    console.log("Riding Hour 2 Dropdown element:", ridingHourDropdown2);

    // Fetch data for language dropdowns
    fetch(languagesSheetUrl)
        .then(response => response.text())
        .then(csvData => {
            console.log("CSV Data for language dropdowns:", csvData);
            const rows = csvData.split('\n');

            const addOptionsToDropdown = (dropdown) => {
                rows.forEach(row => {
                    const values = row.split(',');
                    const optionValue = values[0];
                    console.log("Option Value:", optionValue);
                    const optionElement = document.createElement('option');
                    optionElement.value = optionValue;
                    optionElement.text = optionValue;
                    dropdown.add(optionElement);
                });
            }

            addOptionsToDropdown(languageDropdown1);
            addOptionsToDropdown(languageDropdown2);
            addOptionsToDropdown(languageDropdown3);
        })
        .catch(error => {
            console.error('Error fetching Google Sheet data for language dropdowns:', error);
        });

    // Fetch data for the countries dropdown
    fetch(countriesSheetUrl)
        .then(response => response.text())
        .then(csvData => {
            console.log("CSV Data for countries dropdown:", csvData);
            const rows = csvData.split('\n');

            rows.forEach(row => {
                const values = row.split(',');
                const optionValue = values[0];
                console.log("Option Value:", optionValue);
                const optionElement = document.createElement('option');
                optionElement.value = optionValue;
                optionElement.text = optionValue;
                countriesDropdown.add(optionElement);
            });
        })
        .catch(error => {
            console.error('Error fetching Google Sheet data for countries dropdown:', error);
        });

    // Fetch data for the timezones dropdown 
    fetch(timezonesSheetUrl)
        .then(response => response.text())
        .then(csvData => {
            console.log("CSV Data for timezones dropdown:", csvData);
            const rows = csvData.split('\n');

            const addOptionsToDropdown = (dropdown) => {
                rows.forEach(row => {
                    const values = row.split(',');
                    const optionValue = values[0];
                    console.log("Option Value:", optionValue);
                    const optionElement = document.createElement('option');
                    optionElement.value = optionValue;
                    optionElement.text = optionValue;
                    dropdown.add(optionElement);
                });
            }

            addOptionsToDropdown(timezonesDropdown);
            addOptionsToDropdown(ridingHourDropdown1);
            addOptionsToDropdown(ridingHourDropdown2);
        })
        .catch(error => {
            console.error('Error fetching Google Sheet data for timezones dropdown:', error);
        });

    // Fetch data for the powerSources dropdown
    fetch(powerSourcesSheetUrl)
        .then(response => response.text())
        .then(csvData => {
            console.log("CSV Data for powerSources dropdown:", csvData);
            const rows = csvData.split('\n');

            const addOptionsToDropdown = (dropdown) => {
                rows.forEach(row => {
                    const values = row.split(',');
                    const optionValue = values[0];
                    console.log("Option Value:", optionValue);
                    const optionElement = document.createElement('option');
                    optionElement.value = optionValue;
                    optionElement.text = optionValue;
                    dropdown.add(optionElement);
                });
            }

            addOptionsToDropdown(powerSourcesDropdown1);
            addOptionsToDropdown(powerSourcesDropdown2);
        })
        .catch(error => {
            console.error('Error fetching Google Sheet data for powerSources dropdown:', error);
        });
});