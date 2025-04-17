// Simulated data for care plans
const carePlans = {
    dog: "Daily feeding: 2 cups kibble\nTraining: 15-min sessions\nVet visits: Every 6 months",
    cat: "Daily feeding: 1/2 cup kibble\nGrooming: Weekly brushing\nVet visits: Annually"
};

// Initialize global variables
let user = null;
let registeredUsers = [];
let favorites = [];
let communityPosts = [];
let appointments = [];
let shelterListings = [];
let adoptionRequests = [];
let petCareAppointments = [];
let liveSchedules = [];
let donations = {};

// Load data from localStorage
function loadData() {
    try {
        user = JSON.parse(localStorage.getItem('user')) || null;
        registeredUsers = JSON.parse(localStorage.getItem('registeredUsers')) || [];
        favorites = JSON.parse(localStorage.getItem('favorites')) || [];
        communityPosts = JSON.parse(localStorage.getItem('communityPosts')) || [
            { 
                id: 1,
                title: "Training Tips", 
                content: "My puppy finally learned to sit! Here's how...", 
                author: "Sarah M.", 
                date: new Date(Date.now() - 2 * 24 * 60 * 60 * 1000), 
                likes: [], 
                comments: [
                    { user: "John D.", text: "Great tips! Thanks for sharing.", date: new Date(Date.now() - 1 * 24 * 60 * 60 * 1000) }
                ]
            },
            { 
                id: 2,
                title: "Cat Care", 
                content: "Best grooming tools for long-haired cats", 
                author: "John D.", 
                date: new Date(Date.now() - 1 * 24 * 60 * 60 * 1000), 
                likes: [], 
                comments: []
            }
        ];
        appointments = JSON.parse(localStorage.getItem('appointments')) || [];
        shelterListings = JSON.parse(localStorage.getItem('shelterListings')) || [];
        adoptionRequests = JSON.parse(localStorage.getItem('adoptionRequests')) || [];
        petCareAppointments = JSON.parse(localStorage.getItem('petCareAppointments')) || [];
        liveSchedules = JSON.parse(localStorage.getItem('liveSchedules')) || [];
        donations = JSON.parse(localStorage.getItem('donations')) || { medical: 600, renovation: 1500 };
        console.log('Data loaded:', { user, adoptionRequests });
    } catch (e) {
        console.error('Error loading data from localStorage:', e);
    }
}

// Load data initially
loadData();

// Immediate check for restricted pages
if (window.location.pathname.includes('shelter.html')) {
    if (!user || user.type !== 'shelter') {
        alert('Please log in as a shelter to access the shelter dashboard.');
        window.location.href = 'index.html';
    } else {
        updateLoginStatus();
        const shelterContent = document.getElementById('shelterContent');
        if (shelterContent) {
            shelterContent.style.display = 'block';
            renderShelterDashboard();
        }
    }
}

if (window.location.pathname.includes('profile.html')) {
    if (!user) {
        alert('Please log in to access your profile.');
        window.location.href = 'index.html';
    }
}

document.addEventListener('DOMContentLoaded', () => {
    // Load data from localStorage
    loadData();
    updateLoginStatus();

    if (window.location.pathname.includes('adopt.html')) {
        const adoptionContent = document.getElementById('adoptionContent');
        const adoptionLoginPrompt = document.getElementById('adoptionLoginPrompt');
        const adoptionRequestSection = document.getElementById('adoptionRequestSection');

        if (!adoptionContent || !adoptionLoginPrompt) {
            console.error('Required elements not found in adopt.html');
            return;
        }

        // Check if there are any available pets
        const availablePets = Array.isArray(shelterListings)
            ? shelterListings.filter(pet => pet.status && pet.status.toLowerCase() === 'available')
            : [];
        
        if (availablePets.length === 0) {
            // No pets available: show "no listings" message
            adoptionContent.style.display = 'none';
            adoptionLoginPrompt.style.display = 'block';
            adoptionLoginPrompt.innerHTML = '<p>There are no pet listings.</p>';
            // Show login modal only if user is not logged in
            if (!user) {
                showLoginModal();
            } else {
                // Ensure the login modal is hidden if user is logged in
                hideLoginModal();
            }
        } else {
            // Pets are available: show adoption content, hide login prompt
            adoptionContent.style.display = 'block';
            adoptionLoginPrompt.style.display = 'none';
            renderAdoptionPage();
            renderUserAdoptionRequests();
            if (adoptionRequestSection) {
                adoptionRequestSection.style.display = user && user.type === 'normal' ? 'block' : 'none';
            }
        }
    }
});

if (window.location.pathname.includes('petcare.html')) {
    if (!user) {
        alert('Please log in to access the pet care booking page.');
        window.location.href = 'index.html';
    } else {
        const petcareContent = document.getElementById('petcareContent');
        const petcareLoginPrompt = document.getElementById('petcareLoginPrompt');
        if (petcareContent && petcareLoginPrompt) {
            petcareContent.style.display = 'block';
            petcareLoginPrompt.style.display = 'none';
        }
    }
}

// Initialize page
document.addEventListener('DOMContentLoaded', () => {
    loadData(); // Ensure data is loaded on page load
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
    } else if (window.location.pathname.includes('adopt.html') && user) {
        renderAdoptionPage();
    } else if (window.location.pathname.includes('petcare.html') && user) {
        renderPetCarePage();
    }
    updateLoginStatus();
});

// Services Banner Carousel
let slideIndex = 0;
let autoSlideInterval;

function initializeBanner() {
    showSlide(slideIndex);
    startAutoSlide();

    const bannerContainer = document.querySelector('.banner-container');
    bannerContainer.addEventListener('mouseenter', stopAutoSlide);
    bannerContainer.addEventListener('mouseleave', startAutoSlide);
}

function showSlide(index) {
    const slides = document.querySelectorAll('.banner-slide');
    const dots = document.querySelectorAll('.dot');

    if (index >= slides.length) slideIndex = 0;
    if (index < 0) slideIndex = slides.length - 1;

    const slidesContainer = document.querySelector('.banner-slides');
    slidesContainer.style.transform = `translateX(-${slideIndex * 100}%)`;

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
    }, 5000);
}

function stopAutoSlide() {
    clearInterval(autoSlideInterval);
}

// User functions
function showLoginModal() {
    const loginModal = document.getElementById('loginModal');
    if (loginModal) {
        loginModal.style.display = 'block';
    } else {
        console.error('Login modal not found');
    }
}

function hideLoginModal() {
    const loginModal = document.getElementById('loginModal');
    if (loginModal) {
        loginModal.style.display = 'none';
    } else {
        console.error('Login modal not found');
    }
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
    loadData();
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
    loadData();
    updateLoginStatus();
    hideLoginModal();
    window.location.reload();
}

function updateLoginStatus() {
    const loginLink = document.getElementById('loginLink');
    const shelterLink = document.getElementById('shelterLink');
    const profileLink = document.getElementById('profileLink');

    if (user) {
        loginLink.style.display = 'none';
        if (profileLink) {
            profileLink.style.display = 'block';
        }
        if (shelterLink && user.type === 'shelter') {
            shelterLink.style.display = 'block';
        }
    } else {
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
    loadData();
    updateLoginStatus();
    window.location.href = 'index.html';
}

// Edit Profile functions
function showEditProfileModal() {
    document.getElementById('editUsername').value = user.username;
    document.getElementById('editUserType').value = user.type === 'normal' ? 'Normal User' : 'Shelter';
    document.getElementById('editPassword').value = '';
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

    const existingUser = registeredUsers.find(u => u.username === newUsername && u.username !== user.username);
    if (existingUser) {
        alert('Username already exists. Please choose a different username.');
        return;
    }

    const userIndex = registeredUsers.findIndex(u => u.username === user.username);
    if (userIndex !== -1) {
        registeredUsers[userIndex].username = newUsername;
        if (newPassword) {
            registeredUsers[userIndex].password = newPassword;
        }
        localStorage.setItem('registeredUsers', JSON.stringify(registeredUsers));
    }

    communityPosts.forEach(post => {
        if (post.author === user.username) {
            post.author = newUsername;
        }
        post.comments.forEach(comment => {
            if (comment.user === user.username) {
                comment.user = newUsername;
            }
        });
        post.likes = post.likes.map(like => like === user.username ? newUsername : like);
    });
    localStorage.setItem('communityPosts', JSON.stringify(communityPosts));

    appointments.forEach(appt => {
        if (appt.user === user.username) {
            appt.user = newUsername;
        }
    });
    localStorage.setItem('appointments', JSON.stringify(appointments));

    user.username = newUsername;
    localStorage.setItem('user', JSON.stringify(user));
    loadData();

    hideEditProfileModal();
    renderProfile();
    if (window.location.pathname.includes('community.html')) {
        renderCommunityPosts();
    }
    alert('Profile updated successfully!');
}

// Avatar Update
function updateAvatar() {
    const fileInput = document.getElementById('avatarUpload');
    const file = fileInput.files[0];
    if (file) {
        const reader = new FileReader();
        reader.onload = function(e) {
            user.avatar = e.target.result;
            const userIndex = registeredUsers.findIndex(u => u.username === user.username);
            if (userIndex !== -1) {
                registeredUsers[userIndex].avatar = user.avatar;
                localStorage.setItem('registeredUsers', JSON.stringify(registeredUsers));
            }
            localStorage.setItem('user', JSON.stringify(user));
            loadData();
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
    loadData();
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
        loadData();
        renderProfile();
    }
}

// Profile functions
function renderProfile() {
    document.getElementById('profileUsername').textContent = user.username;
    document.getElementById('profileUserType').textContent = user.type === 'normal' ? 'Normal User' : 'Shelter';

    const avatarImage = document.getElementById('avatarImage');
    if (user.avatar) {
        avatarImage.style.backgroundImage = `url(${user.avatar})`;
        avatarImage.style.backgroundColor = 'transparent';
    } else {
        avatarImage.style.backgroundImage = 'none';
        avatarImage.style.backgroundColor = '#ccc';
    }

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
    communityPosts.sort((a, b) => new Date(b.date) - new Date(a.date));
    communityPosts.forEach(post => {
        const hasLiked = post.likes.includes(user?.username || '');
        const card = document.createElement('div');
        card.className = 'post-card';
        card.innerHTML = `
            <h3>${post.title}</h3>
            <p>${post.content}</p>
            <span class="post-author">${post.author} - ${new Date(post.date).toLocaleDateString()}</span>
            <div class="post-interactions">
                <button class="like-button ${hasLiked ? 'liked' : ''}" onclick="toggleLike(${post.id})">
                    ❤️ ${post.likes.length} Like${post.likes.length === 1 ? '' : 's'}
                </button>
                ${user && post.author === user.username ? `
                    <button class="delete-button" onclick="deletePost(${post.id})">
                        Delete
                    </button>
                ` : ''}
            </div>
            <div class="comment-section">
                <div class="comment-list" id="comments-${post.id}">
                    ${post.comments.map(comment => `
                        <div class="comment">
                            <span>${comment.user}</span>: ${comment.text} (${new Date(comment.date).toLocaleDateString()})
                        </div>
                    `).join('')}
                </div>
                <div class="comment-input">
                    <input type="text" id="comment-input-${post.id}" placeholder="Add a comment...">
                    <button onclick="addComment(${post.id})">Comment</button>
                </div>
            </div>
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
        const newPost = {
            id: communityPosts.length ? Math.max(...communityPosts.map(p => p.id)) + 1 : 1,
            title,
            content,
            author: user.username,
            date: new Date(),
            likes: [],
            comments: []
        };
        communityPosts.push(newPost);
        localStorage.setItem('communityPosts', JSON.stringify(communityPosts));
        loadData();
        renderCommunityPosts();
        document.getElementById('postTitle').value = '';
        document.getElementById('postContent').value = '';
        alert('Thanks for sharing! Your post is now live in the community.');
    } else {
        alert('Please enter both a title and content for your post.');
    }
}

function toggleLike(postId) {
    if (!user) {
        alert('Please log in to like a post.');
        showLoginModal();
        return;
    }
    const post = communityPosts.find(p => p.id === postId);
    if (!post) return;

    const userIndex = post.likes.indexOf(user.username);
    if (userIndex === -1) {
        post.likes.push(user.username);
    } else {
        post.likes.splice(userIndex, 1);
    }
    localStorage.setItem('communityPosts', JSON.stringify(communityPosts));
    loadData();
    renderCommunityPosts();
}

function addComment(postId) {
    if (!user) {
        alert('Please log in to comment on a post.');
        showLoginModal();
        return;
    }
    const post = communityPosts.find(p => p.id === postId);
    if (!post) return;

    const commentInput = document.getElementById(`comment-input-${postId}`);
    const commentText = commentInput.value.trim();
    if (!commentText) {
        alert('Please enter a comment.');
        return;
    }

    post.comments.push({
        user: user.username,
        text: commentText,
        date: new Date()
    });
    localStorage.setItem('communityPosts', JSON.stringify(communityPosts));
    loadData();
    commentInput.value = '';
    renderCommunityPosts();
}

function deletePost(postId) {
    if (!user) {
        alert('Please log in to delete a post.');
        showLoginModal();
        return;
    }

    const id = Number(postId);
    const postIndex = communityPosts.findIndex(p => p.id === id);
    if (postIndex === -1) {
        console.error(`Post not found: ID ${id}`, communityPosts);
        alert('Post not found.');
        return;
    }

    const post = communityPosts[postIndex];
    if (post.author !== user.username) {
        console.error(`Unauthorized delete attempt: ${user.username} tried to delete post by ${post.author}`);
        alert('You can only delete your own posts.');
        return;
    }

    if (!confirm('Are you sure you want to delete this post?')) {
        return;
    }

    communityPosts.splice(postIndex, 1);
    localStorage.setItem('communityPosts', JSON.stringify(communityPosts));
    loadData();
    console.log('Post deleted:', id);

    if (window.location.pathname.includes('community.html')) {
        renderCommunityPosts();
    } else if (window.location.pathname.includes('profile.html')) {
        renderProfilePosts();
    }
}

function renderProfilePosts() {
    if (!user) {
        alert('Please log in to view your posts.');
        showLoginModal();
        return;
    }

    const postsDiv = document.getElementById('userPosts');
    postsDiv.innerHTML = '';
    const userPosts = communityPosts.filter(post => post.author === user.username);
    userPosts.sort((a, b) => new Date(b.date) - new Date(a.date));
    userPosts.forEach(post => {
        const hasLiked = post.likes.includes(user.username);
        const card = document.createElement('div');
        card.className = 'post-card';
        card.innerHTML = `
            <h3>${post.title}</h3>
            <p>${post.content}</p>
            <span class="post-author">${post.author} - ${new Date(post.date).toLocaleDateString()}</span>
            <div class="post-interactions">
                <button class="like-button ${hasLiked ? 'liked' : ''}" onclick="toggleLike(${post.id})">
                    ❤️ ${post.likes.length} Like${post.likes.length === 1 ? '' : 's'}
                </button>
                ${user && post.author === user.username ? `
                    <button class="delete-button" onclick="deletePost(${Number(post.id)})">
                        Delete
                    </button>
                ` : ''}
            </div>
            <div class="comment-section">
                <div class="comment-list" id="comments-${post.id}">
                    ${post.comments.map(comment => `
                        <div class="comment">
                            <span>${comment.user}</span>: ${comment.text} (${new Date(comment.date).toLocaleDateString()})
                        </div>
                    `).join('')}
                </div>
                <div class="comment-input">
                    <input type="text" id="comment-input-${post.id}" placeholder="Add a comment...">
                    <button onclick="addComment(${post.id})">Comment</button>
                </div>
            </div>
        `;
        postsDiv.appendChild(card);
    });
}

// Care plans
function viewCarePlan(type) {
    const details = document.getElementById('carePlanDetails');
    if (details) {
        details.innerHTML = `<h3>${type.charAt(0).toUpperCase() + type.slice(1)} Care Plan</h3><pre>${carePlans[type]}</pre>`;
    }
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
        loadData();
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
    renderShelterAdoptionRequests();
    renderLiveSchedule();
}

function renderPetListings() {
    const listings = document.getElementById('petListings');
    listings.innerHTML = '';
    const shelterPets = shelterListings.filter(pet => pet.shelter === user.username); // Filter by shelter
    if (shelterPets.length === 0) {
        listings.innerHTML = '<p>No active listings.</p>';
    } else {
        shelterPets.forEach((pet, index) => {
            const globalIndex = shelterListings.findIndex(p => p === pet); // Get the global index for editing/deleting
            listings.innerHTML += `
                <div class="pet-listing-card">
                    <div class="pet-photo" style="background-image: url(${pet.photo || ''})"></div>
                    <h4>${pet.name}</h4>
                    <p><strong>Breed:</strong> ${pet.breed}</p>
                    <p><strong>Age:</strong> ${pet.age}</p>
                    <p><strong>Size:</strong> ${pet.size}</p>
                    <p><strong>Description:</strong> ${pet.description}</p>
                    <p><strong>Health:</strong> ${pet.health}</p>
                    <p><strong>Status:</strong> ${pet.status}</p>
                    <p><strong>Shelter:</strong> ${pet.shelter}</p>
                    <div class="pet-actions">
                        <button onclick="editPet(${globalIndex})" class="edit-button">Edit</button>
                        <button onclick="deletePet(${globalIndex})" class="delete-button">Delete</button>
                    </div>
                </div>
            `;
        });
    }
}

function editPet(index) {
    const pet = shelterListings[index];
    if (pet.shelter !== user.username) {
        alert('You can only edit your own pet listings.');
        return;
    }
    document.getElementById('newPetName').value = pet.name;
    document.getElementById('newPetBreed').value = pet.breed;
    document.getElementById('newPetAge').value = pet.age;
    document.getElementById('newPetSize').value = pet.size;
    document.getElementById('newPetDescription').value = pet.description;
    document.getElementById('newPetHealth').value = pet.health;
    document.getElementById('newPetShelter').value = pet.shelter;
    shelterListings.splice(index, 1);
    localStorage.setItem('shelterListings', JSON.stringify(shelterListings));
    loadData();
    renderPetListings();
}

function deletePet(index) {
    const pet = shelterListings[index];
    if (pet.shelter !== user.username) {
        alert('You can only delete your own pet listings.');
        return;
    }
    if (confirm('Are you sure you want to delete this pet listing?')) {
        shelterListings.splice(index, 1);
        localStorage.setItem('shelterListings', JSON.stringify(shelterListings));
        loadData();
        renderPetListings();
        alert('Pet listing deleted successfully!');
    }
}

function addPetForAdoption() {
    console.log('addPetForAdoption called');
    if (!user) {
        alert('Please log in to add a pet.');
        showLoginModal();
        return;
    }
    if (user.type !== 'shelter') {
        alert('Only shelter users can add pets for adoption.');
        return;
    }

    const name = document.getElementById('newPetName').value;
    const breed = document.getElementById('newPetBreed').value;
    const age = document.getElementById('newPetAge').value;
    const size = document.getElementById('newPetSize').value;
    const description = document.getElementById('newPetDescription').value;
    const health = document.getElementById('newPetHealth').value;
    const fileInput = document.getElementById('newPetPhoto');
    const file = fileInput.files[0];

    console.log('Form values:', { name, breed, age, size, description, health, file });
    
    if (!name || !breed) {
        alert('Please fill in all required fields (Pet Name, Breed).');
        return;
    }

    const newPet = {
        name,
        breed,
        age: age || 'Unknown',
        size: size || 'Medium',
        description: description || '',
        health: health || 'Good',
        status: 'Available',
        shelter: user.username, // Automatically set to the logged-in shelter
        photo: ''
    };

    if (file) {
        const reader = new FileReader();
        reader.onload = function(e) {
            newPet.photo = e.target.result;
            shelterListings.push(newPet);
            localStorage.setItem('shelterListings', JSON.stringify(shelterListings));
            loadData();
            renderPetListings();
            document.getElementById('addPetForm').reset();
            alert('Pet added successfully!');
        };
        reader.readAsDataURL(file);
    } else {
        shelterListings.push(newPet);
        localStorage.setItem('shelterListings', JSON.stringify(shelterListings));
        loadData();
        renderPetListings();
        document.getElementById('addPetForm').reset();
        alert('Pet added successfully!');
    }
}

function renderUserAdoptionRequests() {
    console.log('renderUserAdoptionRequests called. User:', user);
    const requestsDiv = document.getElementById('userAdoptionRequests');
    if (!requestsDiv) {
        console.error('userAdoptionRequests div not found in the DOM');
        return;
    }

    if (!user) {
        console.log('No user logged in');
        requestsDiv.innerHTML = '<p>Please log in to view your adoption requests.</p>';
        return;
    }

    console.log('adoptionRequests before filter:', adoptionRequests);
    const userRequests = adoptionRequests.filter(request => {
        const matches = String(request.user).toLowerCase() === String(user.username).toLowerCase();
        console.log(`Comparing request.user (${request.user}) with user.username (${user.username}): ${matches}`);
        return matches;
    });
    console.log('userRequests after filter:', userRequests);
    requestsDiv.innerHTML = '';

    if (userRequests.length === 0) {
        console.log('No user requests found');
        requestsDiv.innerHTML = '<p>You have no adoption requests.</p>';
        return;
    }

    userRequests.forEach(request => {
        console.log('Rendering request:', request);
        const pet = shelterListings[request.petId]; // Look up pet by petId
        const petName = pet ? pet.name : 'Unknown Pet';
        const requestCard = document.createElement('div');
        requestCard.className = 'request-card';
        requestCard.innerHTML = `
            <p><strong>Pet:</strong> ${petName}</p>
            <p><strong>Reason:</strong> ${request.message || 'No reason provided'}</p>
            <p><strong>Status:</strong> ${request.status}</p>
            ${request.status === 'pending' ? `
                <button class="cancel-button" onclick="cancelAdoptionRequest(${request.id})">
                    Cancel Request
                </button>
            ` : ''}
        `;
        requestsDiv.appendChild(requestCard);
    });
}

function renderShelterAdoptionRequests() {
    const shelterAdoptionRequests = document.getElementById('shelterAdoptionRequests');
    if (!shelterAdoptionRequests) {
        console.error("Element with ID 'shelterAdoptionRequests' not found.");
        return;
    }

    shelterAdoptionRequests.innerHTML = ''; // Clear existing content

    if (!user || user.type !== 'shelter') { // Use 'user' instead of 'currentUser'
        shelterAdoptionRequests.innerHTML = '<p>Please log in as a shelter to view adoption requests.</p>';
        return;
    }

    const adoptionRequests = JSON.parse(localStorage.getItem('adoptionRequests')) || [];
    const pets = shelterListings; // Use shelterListings instead of a separate pets array

    // Filter requests for pets belonging to the current shelter and with "pending" status
    const shelterRequests = adoptionRequests.filter(request => {
        const pet = pets[request.petId]; // Access by index (petId corresponds to index in shelterListings)
        return pet && pet.shelter === user.username && request.status === 'pending';
    });

    if (shelterRequests.length === 0) {
        shelterAdoptionRequests.innerHTML = '<p>No pending adoption requests.</p>';
        return;
    }

    shelterRequests.forEach(request => {
        const pet = pets[request.petId];
        const requestCard = document.createElement('div');
        requestCard.classList.add('request-card');
        requestCard.innerHTML = `
            <p><strong>Pet:</strong> ${pet.name}</p>
            <p><strong>User:</strong> ${request.user}</p>
            <p><strong>Message:</strong> ${request.message || 'No message provided'}</p>
            <p><strong>Status:</strong> ${request.status}</p>
            <button class="approve-button" onclick="updateRequestStatus(${request.id}, 'approved')">Approve</button>
            <button class="reject-button" onclick="updateRequestStatus(${request.id}, 'rejected')">Reject</button>
        `;
        shelterAdoptionRequests.appendChild(requestCard);
    });
}

function updateRequestStatus(requestId, newStatus) {
    let adoptionRequests = JSON.parse(localStorage.getItem('adoptionRequests')) || [];
    let pets = shelterListings; // Use shelterListings

    const requestIndex = adoptionRequests.findIndex(r => r.id === requestId);
    if (requestIndex === -1) {
        console.error('Request not found:', requestId);
        return;
    }

    const request = adoptionRequests[requestIndex];
    adoptionRequests[requestIndex].status = newStatus;

    // Update the pet's status if approved
    if (newStatus === 'approved') {
        const pet = pets[request.petId];
        if (pet) {
            pet.status = 'Adopted';
            shelterListings[request.petId] = pet; // Update the listing
            localStorage.setItem('shelterListings', JSON.stringify(shelterListings));
        }
    }

    localStorage.setItem('adoptionRequests', JSON.stringify(adoptionRequests));
    renderShelterAdoptionRequests();
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
        loadData();
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
        loadData();
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

// Adoption functions (for adopt.html)
function renderAdoptionPage() {
    const petListings = document.getElementById('petListings');
    const petNameSelect = document.getElementById('petName');
    
    petListings.innerHTML = '';
    petNameSelect.innerHTML = '<option value="">Select a pet...</option>';
    
    // Filter shelterListings to only include pets with status "Available"
    const availablePets = shelterListings.filter(pet => pet.status === 'Available');
    
    if (availablePets.length === 0) {
        petListings.innerHTML = '<p>No pets available for adoption.</p>';
    } else {
        availablePets.forEach((pet, index) => {
            // Use the original index in shelterListings for petId
            const globalIndex = shelterListings.indexOf(pet);
            petListings.innerHTML += `
                <div class="adoption-card">
                    <div class="pet-photo" style="background-image: url(${pet.photo || ''})"></div>
                    <h4>${pet.name}</h4>
                    <p><strong>Breed:</strong> ${pet.breed}</p>
                    <p><strong>Age:</strong> ${pet.age}</p>
                    <p><strong>Size:</strong> ${pet.size}</p>
                    <p><strong>Description:</strong> ${pet.description}</p>
                    <p><strong>Health:</strong> ${pet.health}</p>
                    <p><strong>Status:</strong> ${pet.status}</p>
                    <p><strong>Shelter:</strong> ${pet.shelter}</p>
                </div>
            `;
            petNameSelect.innerHTML += `<option value="${globalIndex}">${pet.name}</option>`;
        });
    }

    renderUserAdoptionRequests();
}

function submitAdoptionRequest() {
    if (!user) {
        alert('Please log in to submit an adoption request.');
        showLoginModal();
        return;
    }
    if (user.type !== 'normal') {
        alert('Only normal users can submit adoption requests.');
        return;
    }
    const petId = parseInt(document.getElementById('petName').value); // Get petId (index in shelterListings)
    const reason = document.getElementById('requestReason').value;
    if (isNaN(petId)) {
        alert('Please select a pet to adopt.');
        return;
    }
    const pet = shelterListings[petId];
    const existingRequest = adoptionRequests.find(req => req.petId === petId && req.user === user.username && req.status === 'pending');
    if (existingRequest) {
        alert('You have already submitted a request for this pet.');
        return;
    }
    const newRequest = {
        id: adoptionRequests.length ? Math.max(...adoptionRequests.map(r => r.id || 0)) + 1 : 1,
        petId: petId, // Store petId instead of pet name
        user: user.username,
        status: 'pending', // Use lowercase to match renderShelterAdoptionRequests
        message: reason || ''
    };
    adoptionRequests.push(newRequest);
    localStorage.setItem('adoptionRequests', JSON.stringify(adoptionRequests));
    loadData();
    console.log('adoptionRequests after submission:', adoptionRequests);
    renderAdoptionPage();
    document.getElementById('petName').value = '';
    document.getElementById('requestReason').value = '';
    alert('Adoption request submitted successfully! The shelter will review your request.');
}

function cancelAdoptionRequest(requestId) {
    if (!user) {
        alert('Please log in to cancel a request.');
        showLoginModal();
        return;
    }

    const requestIndex = adoptionRequests.findIndex(request => request.id === requestId && request.user === user.username);
    if (requestIndex === -1) {
        alert('Request not found or you do not have permission to cancel it.');
        return;
    }

    const request = adoptionRequests[requestIndex];
    if (request.status !== 'Pending') {
        alert('Only pending requests can be canceled.');
        return;
    }

    if (!confirm('Are you sure you want to cancel this adoption request?')) {
        return;
    }

    adoptionRequests.splice(requestIndex, 1);
    localStorage.setItem('adoptionRequests', JSON.stringify(adoptionRequests));
    loadData();
    if (window.location.pathname.includes('adopt.html')) {
        renderAdoptionPage();
    } else if (window.location.pathname.includes('shelter.html')) {
        renderShelterDashboard();
    }
    alert('Adoption request canceled successfully!');
}

// Pet Care Booking functions (for petcare.html)
function renderPetCarePage() {
    const userPetCareAppointments = document.getElementById('userPetCareAppointments');
    userPetCareAppointments.innerHTML = '';
    const userCareAppts = petCareAppointments.filter(appt => appt.user === user.username);
    if (userCareAppts.length === 0) {
        userPetCareAppointments.innerHTML = '<p>No pet care appointments yet.</p>';
    } else {
        userCareAppts.forEach(appt => {
            userPetCareAppointments.innerHTML += `
                <p>${appt.pet} - ${appt.type.charAt(0).toUpperCase() + appt.type.slice(1)} 
                from ${new Date(appt.startDate).toLocaleString()} 
                to ${new Date(appt.endDate).toLocaleString()} 
                (${appt.notes ? 'Notes: ' + appt.notes : 'No notes'})</p>
            `;
        });
    }

    const carePlanDetails = document.getElementById('carePlanDetails');
    if (carePlanDetails) {
        carePlanDetails.innerHTML = '';
        const petName = document.getElementById('carePetName')?.value.toLowerCase() || '';
        if (petName.includes('dog') || petName.includes('puppy')) {
            viewCarePlan('dog');
        } else if (petName.includes('cat') || petName.includes('kitten')) {
            viewCarePlan('cat');
        }
    }
}

function bookPetCare() {
    if (!user) {
        alert('Please log in to book pet care.');
        showLoginModal();
        return;
    }
    if (user.type !== 'normal') {
        alert('Only normal users can book pet care appointments.');
        return;
    }
    const petName = document.getElementById('carePetName').value;
    const startDate = document.getElementById('careStartDate').value;
    const endDate = document.getElementById('careEndDate').value;
    const careType = document.getElementById('careType').value;
    const notes = document.getElementById('careNotes').value;

    if (!petName || !startDate || !endDate) {
        alert('Please fill in all required fields (Pet Name, Start Date, End Date).');
        return;
    }

    const start = new Date(startDate);
    const end = new Date(endDate);
    const now = new Date();

    if (start < now) {
        alert('Start date must be in the future.');
        return;
    }
    if (end <= start) {
        alert('End date must be after the start date.');
        return;
    }

    petCareAppointments.push({
        pet: petName,
        startDate,
        endDate,
        type: careType,
        notes: notes || '',
        user: user.username
    });
    localStorage.setItem('petCareAppointments', JSON.stringify(petCareAppointments));
    loadData();
    renderPetCarePage();
    document.getElementById('carePetName').value = '';
    document.getElementById('careStartDate').value = '';
    document.getElementById('careEndDate').value = '';
    document.getElementById('careType').value = 'boarding';
    document.getElementById('careNotes').value = '';
    alert('Pet care appointment booked successfully!');
}