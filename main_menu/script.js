// Get the modal, close button, and form elements
let modal = document.getElementById('loginModal');
let closeBtn = document.querySelector('.close-btn');
let loginForm = document.getElementById('loginForm');

// Open the modal when the "Log In" link is clicked
document.getElementById('loginLink').addEventListener('click', function(event){
    event.preventDefault();
    modal.style.display = "block";
});

// Close the modal when the close button (x) is clicked
closeBtn.addEventListener('click', function(){
    modal.style.display = "none";
});

// Handle form submission
loginForm.addEventListener('submit', function(event){
    event.preventDefault();
    let username = document.getElementById('username').value;
    localStorage.setItem('gameUsername', username);
    alert('Username saved!');
    modal.style.display = "none";
});
