document.addEventListener('DOMContentLoaded', () => {
    fetchReservations();
    // Show/hide functionality for adding a new reservation
    document.getElementById('showAddFormBtn').addEventListener('click', () => {
        const form = document.getElementById('addReservationForm');
        form.style.display = form.style.display === 'block' ? 'none' : 'block';
    });
});

function fetchReservations() {
    fetch('http://localhost:3000/api/reservations', {
        headers: {
            'Content-Type': 'application/json',
            // Add any required headers, like authorization tokens
        },
    })
    .then(response => response.json())
    .then(data => displayReservations(data))
    .catch(error => console.error('Error:', error));
}

// Code for displaying reservations
function displayReservations(reservations) {
    const listElement = document.getElementById('reservationsList');
    listElement.innerHTML = ''; // Clear existing entries

    reservations.forEach(reservation => {
        const reservationDiv = document.createElement('div');
        reservationDiv.classList.add('mb-4', 'p-4', 'bg-white', 'rounded', 'shadow');
        
        reservationDiv.innerHTML = `
            <p><strong>Name:</strong> ${reservation.name}</p>
            <p><strong>Date:</strong> ${new Date(reservation.date).toLocaleDateString()}</p>
            <p><strong>Time:</strong> ${reservation.time}</p>
            <p><strong>Guests:</strong> ${reservation.guests}</p>
            <button onclick="openEditModal('${reservation._id}')" class="edit-btn bg-blue-500 hover:bg-blue-700 text-white font-bold py-2 px-4 rounded">Edit</button>
            <button onclick="confirmAndDeleteReservation('${reservation._id}')" class="delete-btn bg-red-500 hover:bg-red-700 text-white font-bold py-2 px-4 rounded">Delete</button>
        `;

        listElement.appendChild(reservationDiv);
    });
}

// Code to open the edit modal and populate it with reservation data
function openEditModal(reservationId) {
    // Fetch reservation data from the backend
    fetch(`http://localhost:3000/api/reservations/${reservationId}`)
        .then(response => response.json())
        .then(reservation => {
            // Populate the form in the modal
            document.getElementById('editName').value = reservation.name;
            document.getElementById('editDate').value = reservation.date.slice(0, 10); // Format YYYY-MM-DD
            document.getElementById('editTime').value = reservation.time;
            document.getElementById('editGuests').value = reservation.guests;

            // Save the current reservation ID to use when submitting the form
            document.getElementById('editReservationForm').setAttribute('data-id', reservationId);

            // Show the modal
            document.getElementById('editModal').style.display = 'block';
        })
        .catch(error => console.error('Error fetching reservation details:', error));
}

// Close the modal when the close button is clicked
document.querySelector('.close-btn').addEventListener('click', () => {
    document.getElementById('editModal').style.display = 'none';
});

// Code to handle editing a reservation
document.getElementById('editReservationForm').addEventListener('submit', function(e) {
    e.preventDefault();
    
    const reservationId = this.getAttribute('data-id');
    const updatedReservation = {
        name: document.getElementById('editName').value,
        date: document.getElementById('editDate').value,
        time: document.getElementById('editTime').value,
        guests: document.getElementById('editGuests').value,
    };

    // Send the updated reservation data to the backend
    fetch(`http://localhost:3000/api/reservations/${reservationId}`, {
        method: 'PATCH',
        headers: {
            'Content-Type': 'application/json',
        },
        body: JSON.stringify(updatedReservation),
    })
    .then(response => response.json())
    .then(data => {
        alert('Reservation updated successfully!');
        // Hide the modal
        document.getElementById('editModal').style.display = 'none';
        // Optionally, refresh the reservations list to show the updated data
        fetchReservations();
    })
    .catch(error => console.error('Error updating reservation:', error));
});


// Code to confirm and handle deletion of a reservation
function confirmAndDeleteReservation(reservationId) {
    if (confirm('Are you sure you want to delete this reservation? This action cannot be undone.')) {
        fetch(`http://localhost:3000/api/reservations/${reservationId}`, {
            method: 'DELETE',
            headers: {
                'Content-Type': 'application/json',
                // Include authorization header if needed
            }
        })
        .then(response => {
            if (response.ok) {
                alert('Reservation deleted successfully!');
                fetchReservations(); // Refresh the list to reflect the deletion
            } else {
                alert('Failed to delete the reservation.');
            }
        })
        .catch(error => console.error('Error:', error));
    }
}


// Handle the submission of the new reservation form
document.getElementById('newReservationForm').addEventListener('submit', function(e) {
    e.preventDefault();

    const reservationData = {
        name: document.getElementById('newName').value,
        date: document.getElementById('newDate').value,
        time: document.getElementById('newTime').value,
        guests: document.getElementById('newGuests').value,
    };

    fetch('http://localhost:3000/api/reservations', {
        method: 'POST',
        headers: {
            'Content-Type': 'application/json',
        },
        body: JSON.stringify(reservationData),
    })
    .then(response => response.json())
    .then(data => {
        alert('Reservation added successfully!');
        document.getElementById('newReservationForm').reset(); // Reset the form fields
        fetchReservations(); // Refresh the list of reservations
    })
    .catch(error => console.error('Error:', error));
});