
document.getElementById('bookingForm').addEventListener('submit', function(event) {
    const inputs = this.querySelectorAll('input, select');
    for (let input of inputs) {
        if (!input.value) {
            alert('Please fill out all fields.');
            input.focus();
            event.preventDefault();
            return;
        }
    }
    alert('Form submitted successfully!');
});
