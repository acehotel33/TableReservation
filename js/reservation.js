// js/reservation.js
document.addEventListener('DOMContentLoaded', function() {
    document.getElementById('reservationForm').addEventListener('submit', function(e) {
        e.preventDefault(); // Prevent the default form submission

        // Gather form data
        const reservationData = {
            name: document.getElementById('name').value,
            date: document.getElementById('date').value,
            time: document.getElementById('time').value,
            guests: document.getElementById('guests').value
        };

        console.log('Reservation Details:', reservationData);

        // Send a POST request to the backend
        fetch('http://localhost:3000/api/reservations', {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
            },
            body: JSON.stringify(reservationData),
        })
        .then(response => response.json())
        .then(data => {
            console.log('Success:', data);
            alert('Reservation successful!');
        })
        .catch((error) => {
            console.error('Error:', error);
            alert('An error occurred while submitting the reservation.');
        });
    });
});
