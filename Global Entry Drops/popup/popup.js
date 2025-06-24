// Elements
const locationIDElement = document.getElementById('locationID')
const startDateElement = document.getElementById('startDate')
const endDateElement = document.getElementById('endDate')

// Button Elements
const startButton = document.getElementById('startButton')
const stopButton = document.getElementById('stopButton')

// Span Listeners
const runningSpan = document.getElementById('runningSpan')
const stoppedSpan = document.getElementById('stoppedSpan')

// Error Message
const locationIDError = document.getElementById('locationIDError')
const startDateError = document.getElementById('startDateError')
const endDateError = document.getElementById('endDateError')

const hideElement = (elem) => {
    elem.style.display = 'none'
}

const showElement = (elem) => {
    elem.style.display = ''
}

const disableElement = (elem) => {
    elem.disabled = true
}

const enableElement = (elem) => {
    elem.disabled = false
}

const handleOnStartState = () => {
    //spans
    hideElement(stoppedSpan)
    showElement(runningSpan)

    //buttons
    disableElement(startButton)
    enableElement(stopButton)

    //inputs
    disableElement(locationIDElement)
    disableElement(startDateElement)
    disableElement(endDateElement)
}

const handleOnStoppedState = () => {
    //spans
    hideElement(runningSpan)
    showElement(stoppedSpan)
    //buttons
    disableElement(stopButton)
    enableElement(startButton)
    //inputs
    enableElement(locationIDElement)
    enableElement(startDateElement)
    enableElement(endDateElement)
}

const performOnStartValidations = () => {
    if(!locationIDElement.value) {
        showElement(locationIDError);
    }else {
        hideElement(locationIDError);
    }

    if(!startDateElement.value) {
        showElement(startDateError);
    }else {
        hideElement(startDateError);
    }

    if(!endDateElement.value) {
        showElement(endDateError);
    }else {
        hideElement(endDateError);
    }

    return locationIDElement.value && startDateElement.value && endDateElement.value
}

startButton.onclick = () => {
    const allFieldsValid = performOnStartValidations();
    
    if(allFieldsValid) {
        handleOnStartState();
        const prefs = {
            locationID: locationIDElement.value,
            startDate: startDateElement.value,
            endDate: endDateElement.value,
            tzData: locationIDElement.options[locationIDElement.selectedIndex].getAttribute('data-tz')
        }
        chrome.runtime.sendMessage({ event: 'onStart', prefs})
    }
}

stopButton.onclick = () => {
    handleOnStoppedState();
    chrome.runtime.sendMessage({ event: 'onStop'})
}

chrome.storage.local.get(["locationID", "startDate", "endDate", "locations", "isRunning"], (result) => {
    const { locationID, startDate, endDate, locations, isRunning } = result;

    setLocations(locations);

    if (locationID) {
        locationIDElement.value = locationID
    }

    if (startDate) {
        startDateElement.value = startDate
    }

    if (endDate) {
        endDateElement.value = endDate
    }

    if (isRunning) {
        handleOnStartState();
    }
    else {
        handleOnStoppedState();
    }

});

const setLocations = (locations) => {
    locations.forEach(location => {
        let optionElement = document.createElement('option');
        optionElement.value = location.id;
        optionElement.innerHTML = location.name

        optionElement.setAttribute('data-tz', location.tzData);
        locationIDElement.appendChild(optionElement);
    })
};
