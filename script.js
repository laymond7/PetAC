// Simulated data
const carePlans = {
    dog: "Daily feeding: 2 cups kibble\nTraining: 15-min sessions\nVet visits: Every 6 months",
    cat: "Daily feeding: 1/2 cup kibble\nGrooming: Weekly brushing\nVet visits: Annually"
};

// Load user and other data from localStorage
let user = JSON.parse(localStorage.getItem('user')) || null;
let registeredUsers = JSON.parse(localStorage.getItem('registeredUsers')) || [];
let favorites = JSON.parse(localStorage.getItem('favorites')) || [];
let communityPosts = JSON.parse(localStorage.getItem('communityPosts')) || [
    { title: "Training Tips", content: "My puppy finally learned to sit! Here's how...", author: "Sarah M.", date: new Date(Date.now() - 2 * 24 * 60 * 60 * 1000) },
    { title: "Cat Care", content: "Best grooming tools for long-haired cats", author: "John D.", date: new Date(Date.now() - 1 * 24 * 60 * 60 * 1000) }
];
let appointments = JSON.parse(localStorage.getItem('appointments')) || [];
let shelterListings = JSON.parse(localStorage.getItem('shelterListings')) || [];
let adoptionRequests = JSON.parse(localStorage.getItem('adoptionRequests')) || [];
let liveSchedules = JSON.parse(localStorage.getItem('liveSchedules')) || [];
let donations = JSON.parse(localStorage.getItem('donations')) || { medical: 600, renovation: 1500 };

// Immediate check for restricted pages
if (window.location.pathname.includes('shelter.html')) {
    if (!user || user.type !== 'shelter') {
        alert('Please log in as a shelter to access this page.');
        window.location.href = '../index.html';
    } else {
        const shelterContent = document.getElementById('shelterContent');
        if (shelterContent) {
            shelterContent.style.display = 'block';
        }
    }
}

if (window.location.pathname.includes('profile.html')) {
    if (!user) {
        alert('Please log in to access your profile.');
        window.location.href = '../index.html';
    }
}

// Initialize page
document.addEventListener('DOMContentLoaded', () => {
    if (window.location.pathname.includes('index.html') || window.location.pathname === '/') {
        initializeBanner();
    } else if (window.location.pathname.includes('community.html')) {
        if (user) {
            document.getElementById('communityContent').style.display = 'block';
            document.getElementById('communityLoginPrompt').style.display = 'none';
            renderCommunityPosts();
        }
    } else if (window.location.pathname.includes('veterinary.html')) {
        renderAppointments();
    } else if (window.location.pathname.includes('donate.html')) {
        updateDonationProgress();
    } else if (window.location.pathname.includes('profile.html')) {
        if (user) {
            document.getElementById('profileContent').style.display = 'block';
            document.getElementById('profileLoginPrompt').style.display = 'none';
            renderProfile();
        }
    }
    updateLoginStatus();
});

// Services Banner Carousel
let slideIndex = 0;
let autoSlideInterval;

function initializeBanner() {
    showSlide(slideIndex);
    startAutoSlide();

    // Pause auto-slide on hover
    const bannerContainer = document.querySelector('.banner-container');
    bannerContainer.addEventListener('mouseenter', stopAutoSlide);
    bannerContainer.addEventListener('mouseleave', startAutoSlide);
}

function showSlide(index) {
    const slides = document.querySelectorAll('.banner-slide');
    const dots = document.querySelectorAll('.dot');

    // Loop around if index is out of bounds
    if (index >= slides.length) slideIndex = 0;
    if (index < 0) slideIndex = slides.length - 1;

    // Update slide position
    const slidesContainer = document.querySelector('.banner-slides');
    slidesContainer.style.transform = `translateX(-${slideIndex * 100}%)`;

    // Update active dot
    dots.forEach(dot => dot.classList.remove('active'));
    dots[slideIndex].classList.add('active');
}

function changeSlide(n) {
    slideIndex += n;
    showSlide(slideIndex);
}

function currentSlide(n) {
    slideIndex = n;
    showSlide(slideIndex);
}

function startAutoSlide() {
    autoSlideInterval = setInterval(() => {
        slideIndex++;
        showSlide(slideIndex);
    }, 5000); // Swap every 5 seconds
}

function stopAutoSlide() {
    clearInterval(autoSlideInterval);
}

// User functions
function showLoginModal() {
    document.getElementById('loginModal').style.display = 'block';
}

function hideLoginModal() {
    document.getElementById('loginModal').style.display = 'none';
}

function login() {
    const username = document.getElementById('username').value;
    const password = document.getElementById('password').value;
    const userType = document.getElementById('userType').value;

    if (!username || !password) {
        alert('Please enter both username and password.');
        return;
    }

    const existingUser = registeredUsers.find(u => u.username === username);
    if (!existingUser) {
        alert('User not found. Please register first.');
        return;
    }

    if (existingUser.password !== password) {
        alert('Incorrect password. Please try again.');
        return;
    }

    if (existingUser.type !== userType) {
        alert(`This account is registered as a ${existingUser.type}, not a ${userType}. Please select the correct user type.`);
        return;
    }

    user = { ...existingUser, username, type: userType };
    localStorage.setItem('user', JSON.stringify(user));
    updateLoginStatus();
    hideLoginModal();
    window.location.reload();
}

function register() {
    const username = document.getElementById('username').value;
    const password = document.getElementById('password').value;
    const userType = document.getElementById('userType').value;

    if (!username || !password) {
        alert('Please enter both username and password.');
        return;
    }

    if (registeredUsers.some(u => u.username === username)) {
        alert('Username already exists. Please choose a different username.');
        return;
    }

    const newUser = { username, password, type: userType, avatar: '', pets: [] };
    registeredUsers.push(newUser);
    localStorage.setItem('registeredUsers', JSON.stringify(registeredUsers));

    user = { ...newUser };
    localStorage.setItem('user', JSON.stringify(user));
    updateLoginStatus();
    hideLoginModal();
    window.location.reload();
}

function updateLoginStatus() {
    const loginLink = document.getElementById('loginLink');
    const shelterLink = document.getElementById('shelterLink');
    const profileLink = document.getElementById('profileLink');

    if (user) {
        // Hide the login link when user is logged in
        loginLink.style.display = 'none';

        // Show Profile link for all logged-in users
        if (profileLink) {
            profileLink.style.display = 'block';
        }

        // Show Shelter Dashboard link only for shelter users
        if (shelterLink && user.type === 'shelter') {
            shelterLink.style.display = 'block';
        }
    } else {
        // Show the login link when user is not logged in
        loginLink.style.display = 'block';
        loginLink.textContent = 'Login/Register';
        loginLink.onclick = showLoginModal;

        if (shelterLink) {
            shelterLink.style.display = 'none';
        }
        if (profileLink) {
            profileLink.style.display = 'none';
        }
    }
}

function logout() {
    user = null;
    localStorage.removeItem('user');
    updateLoginStatus();
    window.location.href = '../index.html';
}

// Edit Profile functions
function showEditProfileModal() {
    document.getElementById('editUsername').value = user.username;
    document.getElementById('editUserType').value = user.type === 'normal' ? 'Normal User' : 'Shelter';
    document.getElementById('editPassword').value = ''; // Leave password blank for user to fill
    document.getElementById('editProfileModal').style.display = 'block';
}

function hideEditProfileModal() {
    document.getElementById('editProfileModal').style.display = 'none';
}

function saveProfile() {
    const newUsername = document.getElementById('editUsername').value;
    const newPassword = document.getElementById('editPassword').value;

    if (!newUsername) {
        alert('Username cannot be empty.');
        return;
    }

    // Check if the new username is already taken (excluding the current user)
    const existingUser = registeredUsers.find(u => u.username === newUsername && u.username !== user.username);
    if (existingUser) {
        alert('Username already exists. Please choose a different username.');
        return;
    }

    // Update the user in registeredUsers
    const userIndex = registeredUsers.findIndex(u => u.username === user.username);
    if (userIndex !== -1) {
        registeredUsers[userIndex].username = newUsername;
        if (newPassword) {
            registeredUsers[userIndex].password = newPassword;
        }
        localStorage.setItem('registeredUsers', JSON.stringify(registeredUsers));
    }

    // Update community posts with the new username
    communityPosts.forEach(post => {
        if (post.author === user.username) {
            post.author = newUsername;
        }
    });
    localStorage.setItem('communityPosts', JSON.stringify(communityPosts));

    // Update appointments with the new username
    appointments.forEach(appt => {
        if (appt.user === user.username) {
            appt.user = newUsername;
        }
    });
    localStorage.setItem('appointments', JSON.stringify(appointments));

    // Update the current user session
    user.username = newUsername;
    localStorage.setItem('user', JSON.stringify(user));

    hideEditProfileModal();
    renderProfile();
    alert('Profile updated successfully!');
}

// Avatar Update
function updateAvatar() {
    const fileInput = document.getElementById('avatarUpload');
    const file = fileInput.files[0];
    if (file) {
        const reader = new FileReader();
        reader.onload = function(e) {
            user.avatar = e.target.result; // Store Base64 string
            const userIndex = registeredUsers.findIndex(u => u.username === user.username);
            if (userIndex !== -1) {
                registeredUsers[userIndex].avatar = user.avatar;
                localStorage.setItem('registeredUsers', JSON.stringify(registeredUsers));
            }
            localStorage.setItem('user', JSON.stringify(user));
            renderProfile();
        };
        reader.readAsDataURL(file);
    }
}

// Pet Profile functions
function showAddPetModal(index = -1) {
    document.getElementById('petIndex').value = index;
    if (index !== -1) {
        const pet = user.pets[index];
        document.getElementById('petName').value = pet.name || '';
        document.getElementById('petBreed').value = pet.breed || '';
        document.getElementById('petAge').value = pet.age || '';
        document.getElementById('petDescription').value = pet.description || '';
    } else {
        document.getElementById('petName').value = '';
        document.getElementById('petBreed').value = '';
        document.getElementById('petAge').value = '';
        document.getElementById('petDescription').value = '';
        document.getElementById('petPicture').value = '';
    }
    document.getElementById('addPetModal').style.display = 'block';
}

function hideAddPetModal() {
    document.getElementById('addPetModal').style.display = 'none';
}

function savePet() {
    const index = parseInt(document.getElementById('petIndex').value);
    const name = document.getElementById('petName').value;
    const breed = document.getElementById('petBreed').value;
    const age = document.getElementById('petAge').value;
    const description = document.getElementById('petDescription').value;
    const fileInput = document.getElementById('petPicture');
    const file = fileInput.files[0];

    if (!name) {
        alert('Pet name is required.');
        return;
    }

    const pet = { name, breed, age, description, picture: '' };

    if (file) {
        const reader = new FileReader();
        reader.onload = function(e) {
            pet.picture = e.target.result;
            savePetToUser(pet, index);
        };
        reader.readAsDataURL(file);
    } else if (index !== -1 && user.pets[index].picture) {
        pet.picture = user.pets[index].picture;
        savePetToUser(pet, index);
    } else {
        savePetToUser(pet, index);
    }
}

function savePetToUser(pet, index) {
    if (!user.pets) user.pets = [];
    if (index === -1) {
        user.pets.push(pet);
    } else {
        user.pets[index] = pet;
    }

    const userIndex = registeredUsers.findIndex(u => u.username === user.username);
    if (userIndex !== -1) {
        registeredUsers[userIndex].pets = user.pets;
        localStorage.setItem('registeredUsers', JSON.stringify(registeredUsers));
    }
    localStorage.setItem('user', JSON.stringify(user));
    hideAddPetModal();
    renderProfile();
}

function deletePet(index) {
    if (confirm('Are you sure you want to delete this pet?')) {
        user.pets.splice(index, 1);
        const userIndex = registeredUsers.findIndex(u => u.username === user.username);
        if (userIndex !== -1) {
            registeredUsers[userIndex].pets = user.pets;
            localStorage.setItem('registeredUsers', JSON.stringify(registeredUsers));
        }
        localStorage.setItem('user', JSON.stringify(user));
        renderProfile();
    }
}

// Profile functions
function renderProfile() {
    document.getElementById('profileUsername').textContent = user.username;
    document.getElementById('profileUserType').textContent = user.type === 'normal' ? 'Normal User' : 'Shelter';

    // Avatar
    const avatarImage = document.getElementById('avatarImage');
    if (user.avatar) {
        avatarImage.style.backgroundImage = `url(${user.avatar})`;
        avatarImage.style.backgroundColor = 'transparent';
    } else {
        avatarImage.style.backgroundImage = 'none';
        avatarImage.style.backgroundColor = '#ccc';
    }

    // Pets
    const userPets = document.getElementById('userPets');
    userPets.innerHTML = '';
    if (!user.pets || user.pets.length === 0) {
        userPets.innerHTML = '<p>No pets added yet.</p>';
    } else {
        user.pets.forEach((pet, index) => {
            userPets.innerHTML += `
                <div class="pet-card">
                    <div class="pet-image" style="background-image: url(${pet.picture || ''})"></div>
                    <div class="pet-details">
                        <h4>${pet.name}</h4>
                        <p><strong>Breed:</strong> ${pet.breed || 'Unknown'}</p>
                        <p><strong>Age:</strong> ${pet.age || 'Unknown'}</p>
                        <p>${pet.description || ''}</p>
                    </div>
                    <div class="pet-actions">
                        <button class="edit-button" onclick="showAddPetModal(${index})">Edit</button>
                        <button class="delete-button" onclick="deletePet(${index})">Delete</button>
                    </div>
                </div>
            `;
        });
    }

    // Community Posts
    const userPosts = document.getElementById('userPosts');
    userPosts.innerHTML = '';
    const posts = communityPosts.filter(post => post.author === user.username);
    if (posts.length === 0) {
        userPosts.innerHTML = '<p>No posts yet.</p>';
    } else {
        posts.forEach(post => {
            userPosts.innerHTML += `
                <div class="post-card">
                    <h3>${post.title}</h3>
                    <p>${post.content}</p>
                    <span class="post-author">${post.author} - ${new Date(post.date).toLocaleDateString()}</span>
                </div>
            `;
        });
    }

    // Favorites (for normal users)
    const userFavorites = document.getElementById('userFavorites');
    userFavorites.innerHTML = '';
    if (user.type === 'normal') {
        if (favorites.length === 0) {
            userFavorites.innerHTML = '<p>No favorites yet.</p>';
        } else {
            favorites.forEach(fav => {
                userFavorites.innerHTML += `<p>${fav}</p>`;
            });
        }
    } else {
        userFavorites.innerHTML = '<p>Not applicable for shelter users.</p>';
    }

    // Appointments
    const userAppointments = document.getElementById('userAppointments');
    userAppointments.innerHTML = '';
    const userAppts = appointments.filter(appt => appt.user === user.username);
    if (userAppts.length === 0) {
        userAppointments.innerHTML = '<p>No appointments yet.</p>';
    } else {
        userAppts.forEach(appt => {
            userAppointments.innerHTML += `<p>${appt.pet} - ${new Date(appt.date).toLocaleString()}</p>`;
        });
    }
}

// Community functions
function renderCommunityPosts() {
    const postsDiv = document.getElementById('communityPosts');
    postsDiv.innerHTML = '';
    communityPosts.forEach(post => {
        const card = document.createElement('div');
        card.className = 'post-card';
        card.innerHTML = `
            <h3>${post.title}</h3>
            <p>${post.content}</p>
            <span class="post-author">${post.author} - ${new Date(post.date).toLocaleDateString()}</span>
        `;
        postsDiv.appendChild(card);
    });
}

function addCommunityPost() {
    if (!user) {
        alert('Please log in to post.');
        showLoginModal();
        return;
    }
    const title = document.getElementById('postTitle').value;
    const content = document.getElementById('postContent').value;
    if (title && content) {
        communityPosts.push({ title, content, author: user.username, date: new Date() });
        localStorage.setItem('communityPosts', JSON.stringify(communityPosts));
        renderCommunityPosts();
        document.getElementById('postTitle').value = '';
        document.getElementById('postContent').value = '';
    } else {
        alert('Please enter both a title and content for your post.');
    }
}

// Care plans
function viewCarePlan(type) {
    const details = document.getElementById('carePlanDetails');
    details.innerHTML = `<h3>${type.charAt(0).toUpperCase() + type.slice(1)} Care Plan</h3><pre>${carePlans[type]}</pre>`;
}

// Veterinary
function bookAppointment() {
    if (!user) {
        alert('Please log in to book an appointment.');
        showLoginModal();
        return;
    }
    if (user.type !== 'normal') {
        alert('Only normal users can book vet appointments.');
        return;
    }
    const petName = document.getElementById('petName').value;
    const date = document.getElementById('appointmentDate').value;
    if (petName && date) {
        appointments.push({ pet: petName, date, user: user.username });
        localStorage.setItem('appointments', JSON.stringify(appointments));
        renderAppointments();
        document.getElementById('petName').value = '';
        document.getElementById('appointmentDate').value = '';
    }
}

function renderAppointments() {
    const list = document.getElementById('appointmentList');
    list.innerHTML = '<h4>Your Appointments</h4>';
    appointments.forEach(appt => {
        list.innerHTML += `<p>${appt.pet} - ${new Date(appt.date).toLocaleString()} (Booked by ${appt.user})</p>`;
    });
}

// Shelter Dashboard
function renderShelterDashboard() {
    renderPetListings();
    renderAdoptionRequests();
    renderLiveSchedule();
}

function renderPetListings() {
    const listings = document.getElementById('petListings');
    listings.innerHTML = '<p>Active Listings:</p>';
    shelterListings.forEach(pet => {
        listings.innerHTML += `<p>${pet.name} - ${pet.breed}</p>`;
    });
}

function manageListings() {
    if (!user || user.type !== 'shelter') {
        alert('Please log in as a shelter to manage listings.');
        showLoginModal();
        return;
    }
    const newPet = prompt('Enter new pet name:');
    if (newPet) {
        shelterListings.push({ name: newPet, breed: 'unknown', age: 'adult', size: 'medium', description: '', health: '', status: 'Available' });
        localStorage.setItem('shelterListings', JSON.stringify(shelterListings));
        renderPetListings();
    }
}

function renderAdoptionRequests() {
    const requests = document.getElementById('adoptionRequests');
    requests.innerHTML = '<p>Pending Requests:</p>';
    adoptionRequests.forEach(req => {
        requests.innerHTML += `<p>${req.pet} - ${req.user} (${req.status})</p>`;
    });
}

function viewRequests() {
    renderAdoptionRequests();
}

function scheduleLive() {
    if (!user || user.type !== 'shelter') {
        alert('Please log in as a shelter to schedule live interactions.');
        showLoginModal();
        return;
    }
    const petName = document.getElementById('livePetName').value;
    const time = document.getElementById('liveTime').value;
    if (petName && time) {
        liveSchedules.push({ pet: petName, time, shelter: user.username });
        localStorage.setItem('liveSchedules', JSON.stringify(liveSchedules));
        renderLiveSchedule();
        document.getElementById('livePetName').value = '';
        document.getElementById('liveTime').value = '';
    }
}

function renderLiveSchedule() {
    const schedule = document.getElementById('liveSchedule');
    schedule.innerHTML = '<h4>Scheduled Live Interactions</h4>';
    liveSchedules.forEach(s => {
        schedule.innerHTML += `<p>${s.pet} - ${new Date(s.time).toLocaleString()} (by ${s.shelter})</p>`;
    });
}

// Donations
let donationAmount = 0;

function donateToCampaign(campaign) {
    if (!user) {
        alert('Please log in to donate.');
        showLoginModal();
        return;
    }
    const amount = prompt(`Enter donation amount for ${campaign}:`);
    if (amount && !isNaN(amount) && amount > 0) {
        donations[campaign] += parseInt(amount);
        localStorage.setItem('donations', JSON.stringify(donations));
        updateDonationProgress();
    }
}

function setDonationAmount(amount) {
    donationAmount = amount;
}

function submitDonation() {
    if (!user) {
        alert('Please log in to donate.');
        showLoginModal();
        return;
    }
    const amount = donationAmount || document.getElementById('customAmount').value;
    const donorName = document.getElementById('donorName').value || 'Anonymous';
    if (!amount || amount <= 0) {
        alert('Please select or enter a valid donation amount.');
        return;
    }
    const tracking = document.getElementById('donationTracking');
    tracking.innerHTML += `<p>$${amount} donated by ${donorName} on ${new Date().toLocaleString()} - Funds will support shelter operations.</p>`;
    document.getElementById('customAmount').value = '';
    document.getElementById('donorName').value = '';
    donationAmount = 0;
}

function updateDonationProgress() {
    document.getElementById('medicalRaised').textContent = `$${donations.medical}`;
    document.getElementById('renovationRaised').textContent = `$${donations.renovation}`;
    document.getElementById('medicalProgress').style.width = `${(donations.medical / 1000) * 100}%`;
    document.getElementById('renovationProgress').style.width = `${(donations.renovation / 5000) * 100}%`;
}

// Smooth scrolling
document.querySelectorAll('a[href^="#"]').forEach(anchor => {
    anchor.addEventListener('click', function(e) {
        e.preventDefault();
        document.querySelector(this.getAttribute('href')).scrollIntoView({
            behavior: 'smooth'
        });
    });
});