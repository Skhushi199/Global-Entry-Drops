// Fetch the list of open interviews at a location in a given date period
export const fetchOpenSlots = (result) => {
    // https://ttp.cbp.dhs.gov/schedulerui/schedule-interview/location?lang=en&vo=true&returnUrl=ttp-external&service=up
    const { locationID, startDate, endDate } = result;
    const appointmentUrl = 'https://ttp.cbp.dhs.gov/schedulerapi/locations/${locationID}/slots?startTimestamp=${startDate}T00%3A00%3A00&endTimestamp=${endDate}T00%3A00%3A00';
    fetch(appointmentUrl)
        .then(response => response.json())
        .then(data => data.filter(slot => slot.active > 0))
        .then(data => console.log(data))
        .catch(error => console.error('Error:', error))
}