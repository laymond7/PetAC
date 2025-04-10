// Simulated data
const pets = [
    { name: "Max", breed: "golden-retriever", age: "young", size: "large", description: "Friendly and energetic", health: "Vaccinated, neutered", status: "Available" },
    { name: "Luna", breed: "tabby", age: "young", size: "small", description: "Playful and curious", health: "Vaccinated, spayed", status: "Available" }
];

const carePlans = {
    dog: "Daily feeding: 2 cups kibble\nTraining: 15-min sessions\nVet visits: Every 6 months",
    cat: "Daily feeding: 1/2 cup kibble\nGrooming: Weekly brushing\nVet visits: Annually"
};

let user = null;
let favorites = JSON.parse(localStorage.getItem('favorites')) || [];
let communityPosts = JSON.parse(localStorage.getItem('communityPosts')) || [
    { title: "Training Tips", content: "My puppy finally learned to sit! Here's how...", author: "Sarah M.", date: new Date(Date.now() - 2 * 24 * 60 * 60 * 1000) },
    { title: "Cat Care", content: "Best grooming tools for long-haired cats", author: "John D.", date: new Date(Date.now() - 1 * 24 * 60 * 60 * 1000) }
];
let appointments = JSON.parse(localStorage.getItem('appointments')) || [];
let shelterListings = JSON.parse(localStorage.getItem('shelterListings')) || pets.slice();
let adoptionRequests = JSON.parse(localStorage.getItem('adoptionRequests')) || [];
let liveSchedules = JSON.parse(localStorage.getItem('liveSchedules')) || [];
let donations = JSON.parse(localStorage.getItem('donations')) || { medical: 600, renovation: 1500 };

// Initialize page
document.addEventListener('DOMContentLoaded', () => {
    if (window.location.pathname.includes('index.html') || window.location.pathname === '/') {
        renderPets();
    } else if (window.location.pathname.includes('community.html')) {
        renderCommunityPosts();
    } else if (window.location.pathname.includes('shelter.html')) {
        renderShelterDashboard();
    } else if (window.location.pathname.includes('veterinary.html')) {
        renderAppointments();
    } else if (window.location.pathname.includes('donate.html')) {
        updateDonationProgress();
    }
    updateLoginStatus();
});

// Pet functions
function renderPets() {
    const petGrid = document.getElementById('petGrid');
    petGrid.innerHTML = '';
    pets.forEach(pet => {
        const card = document.createElement('div');
        card.className = 'pet-card';
        card.dataset.breed = pet.breed;
        card.dataset.age = pet.age;
        card.dataset.size = pet.size;
        card.innerHTML = `
            <div class="pet-image" style="background-color: ${pet.breed === 'golden-retriever' ? '#f0d4d4' : '#d4f0e6'};"></div>
            <h4>${pet.name}</h4>
            <p>${pet.age === 'young' ? '2-year-old' : '5-year-old'} ${pet.breed.replace('-', ' ')}</p>
            <button onclick="viewPetProfile('${pet.name}')">View Profile</button>
            <button onclick="scheduleMeeting('${pet.name}')">Schedule Meeting</button>
            <button onclick="toggleFavorite('${pet.name}')">${favorites.includes(pet.name) ? 'Remove Favorite' : 'Add Favorite'}</button>
        `;
        petGrid.appendChild(card);
    });
}

function searchPets() {
    const searchTerm = document.getElementById('searchInput').value.toLowerCase();
    applyFilters(searchTerm);
}

function applyFilters(searchTerm = '') {
    const breed = document.getElementById('breedFilter').value;
    const age = document.getElementById('ageFilter').value;
    const size = document.getElementById('sizeFilter').value;
    
    const pets = document.querySelectorAll('.pet-card');
    pets.forEach(pet => {
        const petBreed = pet.dataset.breed;
        const petAge = pet.dataset.age;
        const petSize = pet.dataset.size;
        const name = pet.querySelector('h4').textContent.toLowerCase();
        
        const breedMatch = !breed || petBreed === breed;
        const ageMatch = !age || petAge === age;
        const sizeMatch = !size || petSize === size;
        const nameMatch = !searchTerm || name.includes(searchTerm);
        
        pet.style.display = (breedMatch && ageMatch && sizeMatch && nameMatch) ? 'block' : 'none';
    });
}

function viewPetProfile(petName) {
    const pet = pets.find(p => p.name === petName);
    const modal = document.getElementById('petProfileModal');
    const content = document.getElementById('petProfileContent');
    content.innerHTML = `
        <h2>${pet.name}</h2>
        <p><strong>Breed:</strong> ${pet.breed.replace('-', ' ')}</p>
        <p><strong>Age:</strong> ${pet.age}</p>
        <p><strong>Size:</strong> ${pet.size}</p>
        <p><strong>Description:</strong> ${pet.description}</p>
        <p><strong>Health:</strong> ${pet.health}</p>
        <p><strong>Status:</strong> ${pet.status}</p>
    `;
    modal.style.display = 'block';
}

function hidePetProfileModal() {
    document.getElementById('petProfileModal').style.display = 'none';
}

function scheduleMeeting(petName) {
    if (!user) {
        alert('Please log in to schedule a meeting.');
        showLoginModal();
        return;
    }
    adoptionRequests.push({ pet: petName, user: user.username, status: 'Pending' });
    localStorage.setItem('adoptionRequests', JSON.stringify(adoptionRequests));
    alert(`Meeting scheduled for ${petName}. Check Shelter Dashboard for updates.`);
}

function toggleFavorite(petName) {
    if (!user) {
        alert('Please log in to add favorites.');
        showLoginModal();
        return;
    }
    const index = favorites.indexOf(petName);
    if (index > -1) {
        favorites.splice(index, 1);
    } else {
        favorites.push(petName);
    }
    localStorage.setItem('favorites', JSON.stringify(favorites));
    renderPets();
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
    if (username && password) {
        user = { username };
        updateLoginStatus();
        hideLoginModal();
    }
}

function register() {
    const username = document.getElementById('username').value;
    const password = document.getElementById('password').value;
    if (username && password) {
        user = { username };
        updateLoginStatus();
        hideLoginModal();
    }
}

function updateLoginStatus() {
    const loginLink = document.getElementById('loginLink');
    if (user) {
        loginLink.textContent = `Welcome, ${user.username} (Logout)`;
        loginLink.onclick = logout;
    } else {
        loginLink.textContent = 'Login/Register';
        loginLink.onclick = showLoginModal;
    }
}

function logout() {
    user = null;
    updateLoginStatus();
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
    if (!user) {
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
    if (!user) {
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