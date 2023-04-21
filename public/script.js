// This function deletes a record with the given id from the database
function deleteName(id) {
  // Show confirmation dialog to user before deleting the record
  if (confirm('Are you sure you want to delete this record?')) {
    // Send DELETE request to server to delete the record with given id
    fetch(`/delete/${id}`, {
      method: 'DELETE'
    })
      .then(response => response.json())
      .then(data => {
        console.log(data);
        // Reload the page to update the list of records displayed
        location.reload();
      });
  }
}

// This event listener is attached to the "insertForm" element and is triggered when the user submits the form
document.getElementById('insertForm').addEventListener('submit', (event) => {
  event.preventDefault();
  const form = event.target;
  const formData = new FormData(form);

  // Send POST request to server to insert a new record into the database
  fetch('/insert', {
    method: 'POST',
    body: formData
  })
    .then(response => response.json())
    .then(data => {
      console.log(data);
      // Reload the page to update the list of records displayed
      location.reload();
    });
});

// This event listener is attached to the "updateForm" element and is triggered when the user submits the form
document.getElementById('updateForm').addEventListener('submit', (event) => {
  event.preventDefault();
  const form = event.target;
  const formData = new FormData(form);

  // Send PATCH request to server to update an existing record in the database
  fetch('/update', {
    method: 'PATCH',
    body: formData
  })
    .then(response => response.json())
    .then(data => {
      console.log(data);
      // Redirect to the homepage to view the updated list of records
      location.href = '/';
    });
});