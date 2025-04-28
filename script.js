// Simulated data for care plans
const carePlans = {
    dog: "Daily feeding: 2 cups kibble\nTraining: 15-min sessions\nVet visits: Every 6 months",
    cat: "Daily feeding: 1/2 cup kibble\nGrooming: Weekly brushing\nVet visits: Annually"
};

// Veterinary centers data
const vetCenters = [
    {
        id: 1,
        name: "Klinik Haiwan Kampar",
        image: "images/klinik_haiwan_kampar.jpg",
        rating: 4.3,
        hours: "Mon-Fri: 10:30 AM - 6:15 PM\nSat: 10:00 AM - 6:15 PM\nSun: 10 AM - 2.15 PM",
        address: "No. 6 & 7, Jalan Siswa, Taman Kampar Siswa, 31900 Kampar, Perak",
        mapUrl: "https://www.google.com/maps/embed?pb=!1m18!1m12!1m3!1d127309.29691177126!2d101.00275419726559!3d4.332815099999994!2m3!1f0!2f0!3f0!3m2!1i1024!2i768!4f13.1!3m3!1m2!1s0x31cae2b689d62d83%3A0xb643b29432e789f0!2sKlinik%20Haiwan%20Kampar!5e0!3m2!1sen!2smy!4v1745684712451!5m2!1sen!2smy"
    },
    {
        id: 2,
        name: "Pejabat Perkhidmatan Veterinar Daerah Kampar",
        image: "images/Pejabat Perkhidmatan Veterinar Daerah Kampar.jpg",
        rating: 3.8,
        hours: "Mon-Fri: 8:30 AM - 4:00 PM\nSat,Sun: Closed",
        address: "Jalan Iskandar, Perak, 31900 Kampar",
        mapUrl: "https://www.google.com/maps/embed?pb=!1m14!1m8!1m3!1d127314.74422383879!2d101.0064844!3d4.3003366!3m2!1i1024!2i768!4f13.1!3m3!1m2!1s0x31cb1d4c9581a2d3%3A0x71d4ffc8b38cbcc2!2sPejabat%20Perkhidmatan%20Veterinar%20Daerah%20Kampar!5e0!3m2!1sen!2smy!4v1745689583288!5m2!1sen!2smy"
    },
    {
        id: 3,
        name: "Paw Paw Animal Clinic",
        image: "images/Paw Paw Animal Clinic.jpg",
        rating: 3.4,
        hours: "Mon-Fri: 9:00 AM - 4:30 PM\nSat: 9:00 AM - 12:00 PM\nSun: Closed",
        address: "12, Persiaran Orkid 1, Taman Orkid, 31000 Batu Gajah, Perak",
        mapUrl: "https://www.google.com/maps/embed?pb=!1m18!1m12!1m3!1d254570.13300760137!2d100.781932133071!3d4.4744337296730325!2m3!1f0!2f0!3f0!3m2!1i1024!2i768!4f13.1!3m3!1m2!1s0x31cae6219fc509c3%3A0x69af0b4e77604b21!2sPaw%20Paw%20Animal%20Clinic!5e0!3m2!1sen!2smy!4v1745736801205!5m2!1sen!2smy"
    }
];

// Pet care centers data
const petCareCenters = [
    {
        id: 1,
        name: "Wonderful Pet Shop & Care",
        image: "images/Wonderful Pet Shop & Care.jpg",
        rating: 3.8,
        hours: "Mon-Sat: 10:00 AM - 7:00 PM\nSunday: 10.00 AM - 12.00 PM",
        address: "S17, Jalan Kuala Dipang, Taman kampar, 31900 Kampar, Perak",
        mapUrl: "https://www.google.com/maps/embed?pb=!1m18!1m12!1m3!1d127309.66261400863!2d101.06263984069827!3d4.33064228706383!2m3!1f0!2f0!3f0!3m2!1i1024!2i768!4f13.1!3m3!1m2!1s0x31cae2a9237dbcdd%3A0xb732dffabbfa4859!2sWonderful%20Pet%20Shop%20%26%20Care!5e0!3m2!1sen!2smy!4v1745815706521!5m2!1sen!2smy"
    },
    {
        id: 2,
        name: "K Pets Animal Care",
        image: "images/K Pets Animal Care.jpg",
        rating: "5.0",
        hours: "Mon-Tue: 10:30 AM - 6:00 PM\nWed: Closed\nThu-Fri: 10.30 AM - 6.00 PM\nSat-Sun: 10:30 AM - 2:00 PM",
        address: "13, Jalan Medan Ipoh 8, Bandar Baru Medan Ipoh, 31400 Ipoh, Perak",
        mapUrl: "https://www.google.com/maps/embed?pb=!1m18!1m12!1m3!1d127260.15464730783!2d100.9694937972656!3d4.615515999999998!2m3!1f0!2f0!3f0!3m2!1i1024!2i768!4f13.1!3m3!1m2!1s0x31caed0f127c9673%3A0xef38c67384003ea3!2sK%20Pets%20Animal%20Care!5e0!3m2!1sen!2smy!4v1745816006762!5m2!1sen!2smy"
    }
];

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
let vetServiceListings = JSON.parse(localStorage.getItem('vetServiceListings')) || [];
let petCareServiceListings = JSON.parse(localStorage.getItem('petCareServiceListings')) || [];
let vetConsultSchedules = JSON.parse(localStorage.getItem('vetConsultSchedules')) || [];
let petCareInteractionSchedules = JSON.parse(localStorage.getItem('petCareInteractionSchedules')) || [];

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
        vetServiceListings = JSON.parse(localStorage.getItem('vetServiceListings')) || [];
        petCareServiceListings = JSON.parse(localStorage.getItem('petCareServiceListings')) || [];
        vetConsultSchedules = JSON.parse(localStorage.getItem('vetConsultSchedules')) || [];
        petCareInteractionSchedules = JSON.parse(localStorage.getItem('petCareInteractionSchedules')) || [];
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

if (window.location.pathname.includes('veterinary.html')) {
    const vetContent = document.getElementById('vetContent');
    const vetLoginPrompt = document.getElementById('vetLoginPrompt');
    if (vetContent && vetLoginPrompt && user.type === 'normal') {
        vetContent.style.display = 'block';
        vetLoginPrompt.style.display = 'none';
        renderVetCenters();
        populateAppointmentTimes();
        populateVetCenters();
        renderAppointments();
    }
}

if (window.location.pathname.includes('petcare.html')) {
        renderPetCareCenters();
        const petcareContent = document.getElementById('petcareContent');
        const petcareLoginPrompt = document.getElementById('petcareLoginPrompt');
        if (petcareContent && petcareLoginPrompt && user.type === 'normal') {
                petcareContent.style.display = 'block';
                petcareLoginPrompt.style.display = 'none';
                renderPetCareCenters(); // Added
                populatePetCareCenters(); // Added
                renderPetCarePage();
        }
    
}

// Initialize page
document.addEventListener('DOMContentLoaded', () => {
    loadData(); // Ensure data is loaded on page load
    updateLoginStatus();

    if (window.location.pathname.includes('index.html') || window.location.pathname === '/') {
        initializeBanner();
    } else if (window.location.pathname.includes('community.html')) {
        if (user) {
            document.getElementById('communityContent').style.display = 'block';
            document.getElementById('communityLoginPrompt').style.display = 'none';
            renderCommunityPosts();
        }
    } else if (window.location.pathname.includes('veterinary.html')) {
        renderVetCenters();
        const vetContent = document.getElementById('vetContent');
        const vetLoginPrompt = document.getElementById('vetLoginPrompt');
        if (vetContent && vetLoginPrompt) {
            if (user && user.type === 'normal') {
                vetContent.style.display = 'block';
                vetLoginPrompt.style.display = 'none';
                populateAppointmentTimes();
                populateVetCenters();
                renderAppointments();
            } else {
                vetContent.style.display = 'none';
                vetLoginPrompt.style.display = 'block';
                if (!user) {
                    vetLoginPrompt.innerHTML = '<p>Please log in to book an appointment.</p><button onclick="showLoginModal()">Login/Register</button>';
                } else {
                    vetLoginPrompt.innerHTML = '<p>Only normal users can book veterinary appointments.</p>';
                }
            }
        } else {
            console.error('vetContent or vetLoginPrompt not found');
        }
    } else if (window.location.pathname.includes('donate.html')) {
        updateDonationProgress();
    } else if (window.location.pathname.includes('profile.html')) {
        if (user) {
            document.getElementById('profileContent').style.display = 'block';
            document.getElementById('profileLoginPrompt').style.display = 'none';
            renderProfile();
        }
    } else if (window.location.pathname.includes('adopt.html')) {
        const adoptionContent = document.getElementById('adoptionContent');
        const adoptionLoginPrompt = document.getElementById('adoptionLoginPrompt');
        const adoptionRequestSection = document.getElementById('adoptionRequestSection');

        if (!adoptionContent || !adoptionLoginPrompt) {
            console.error('Required elements not found in adopt.html');
            return;
        }

        const availablePets = Array.isArray(shelterListings)
            ? shelterListings.filter(pet => pet.status && pet.status.toLowerCase() === 'available')
            : [];
        
        if (availablePets.length === 0) {
            adoptionContent.style.display = 'none';
            adoptionLoginPrompt.style.display = 'block';
            adoptionLoginPrompt.innerHTML = '<p>There are no pet listings.</p>';
            if (!user) {
                showLoginModal();
            } else {
                hideLoginModal();
            }
        } else {
            adoptionContent.style.display = 'block';
            adoptionLoginPrompt.style.display = 'none';
            renderAdoptionPage();
            renderUserAdoptionRequests();
            if (adoptionRequestSection) {
                adoptionRequestSection.style.display = user && user.type === 'normal' ? 'block' : 'none';
            }
        }
    } else if (window.location.pathname.includes('petcare.html')) {
        if (!user) {
            alert('Please log in to access the pet care booking page.');
            window.location.href = 'index.html';
        } else {
            const petcareContent = document.getElementById('petcareContent');
            const petcareLoginPrompt = document.getElementById('petcareLoginPrompt');
            if (petcareContent && petcareLoginPrompt) {
                if (user && user.type === 'normal') {
                    petcareContent.style.display = 'block';
                    petcareLoginPrompt.style.display = 'none';
                    renderPetCareCenters(); // Added
                    populatePetCareCenters(); // Added
                    renderPetCarePage();
                } else {
                    petcareContent.style.display = 'none';
                    petcareLoginPrompt.style.display = 'block';
                    if (!user) {
                        petcareLoginPrompt.innerHTML = '<p>Please log in to book pet care.</p><button onclick="showLoginModal()">Login/Register</button>';
                    } else {
                        petcareLoginPrompt.innerHTML = '<p>Only normal users can book pet care appointments.</p>';
                    }
                }
            }
        }
    }else if (window.location.pathname.includes('veterinary_dashboard.html')) {
        if (!user || user.type !== 'veterinary') {
            alert('Please log in as a veterinary user to access the veterinary dashboard.');
            window.location.href = 'index.html';
        } else {
            renderVeterinaryDashboard();
        }
    } else if (window.location.pathname.includes('petcare_dashboard.html')) {
        if (!user || user.type !== 'petcare') {
            alert('Please log in as a pet care user to access the pet care dashboard.');
            window.location.href = 'index.html';
        } else {
            renderPetCareDashboard();
        }
    }
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
        document.body.classList.add('modal-open');
    } else {
        console.error('Login modal not found');
    }
}

function hideLoginModal() {
    const loginModal = document.getElementById('loginModal');
    if (loginModal) {
        loginModal.style.display = 'none';
        document.body.classList.remove('modal-open');
    } else {
        console.error('Login modal not found');
    }
}

function toggleExtraFields() {
    const userType = document.getElementById('userType').value;
    const extraFields = document.getElementById('extraFields');
    if (userType === 'shelter' || userType === 'veterinary' || userType === 'petcare') {
        extraFields.style.display = 'block';
    } else {
        extraFields.style.display = 'none';
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
    if (window.location.pathname.includes('veterinary.html')) {
        const vetContent = document.getElementById('vetContent');
        const vetLoginPrompt = document.getElementById('vetLoginPrompt');
        if (vetContent && vetLoginPrompt && user.type === 'normal') {
            vetContent.style.display = 'block';
            vetLoginPrompt.style.display = 'none';
            renderVetCenters();
            populateAppointmentTimes();
            populateVetCenters();
            renderAppointments();
        }
    }
}

function register() {
    const username = document.getElementById('username').value.trim();
    const password = document.getElementById('password').value.trim();
    const userType = document.getElementById('userType').value;

    if (!username || !password || !userType) {
        alert('Please fill in all required fields.');
        return;
    }

    if (registeredUsers.some(u => u.username === username)) {
        alert('Username already exists. Please choose a different username.');
        return;
    }

    let newUser = { username, password, type: userType };

    if (userType === 'shelter' || userType === 'veterinary' || userType === 'petcare') {
        const centerName = document.getElementById('centerName').value.trim();
        const centerLocation = document.getElementById('centerLocation').value.trim();
        const centerPictureInput = document.getElementById('centerPicture');
        const centerPictureFile = centerPictureInput.files[0];

        if (!centerName || !centerLocation) {
            alert('Please provide all information for your center.');
            return;
        }

        newUser.centerName = centerName;
        newUser.centerLocation = centerLocation;

        if (centerPictureFile) {
            const reader = new FileReader();
            reader.onload = function (e) {
                newUser.centerPicture = e.target.result;
                completeRegistration(newUser);
            };
            reader.readAsDataURL(centerPictureFile);
            return;
        } else {
            newUser.centerPicture = '';
        }
    }

    completeRegistration(newUser);
}

function completeRegistration(newUser) {
    registeredUsers.push(newUser);
    localStorage.setItem('registeredUsers', JSON.stringify(registeredUsers));

    user = { ...newUser };
    localStorage.setItem('user', JSON.stringify(user));
    loadData();
    updateLoginStatus();
    hideLoginModal();

    // Redirect after registration
    if (user.type === 'shelter') {
        window.location.href = 'shelter.html';
    } else if (user.type === 'veterinary') {
        window.location.href = 'veterinary_dashboard.html';
    } else if (user.type === 'petcare') {
        window.location.href = 'petcare_dashboard.html';
    } else {
        window.location.href = 'profile.html';
    }
}


function updateLoginStatus() {
    const loginLink = document.getElementById('loginLink');
    const shelterLink = document.getElementById('shelterLink');
    const profileLink = document.getElementById('profileLink');
    const vetLink = document.getElementById('vetLink');
    const petcareLink = document.getElementById('petcareLink');

    if (user) {
        loginLink.style.display = 'none';
        if (profileLink) {
            profileLink.style.display = 'block';
        }
        if (shelterLink && user.type === 'shelter') {
            shelterLink.style.display = 'block';
        }
        if (vetLink && user.type === 'veterinary') {
            vetLink.style.display = 'block';
        }
        if (petcareLink && user.type === 'petcare') {
            petcareLink.style.display = 'block';
        }
    } else {
        loginLink.style.display = 'block';
        loginLink.textContent = 'Login/Register';
        loginLink.onclick = showLoginModal;
        if (shelterLink) shelterLink.style.display = 'none';
        if (vetLink) vetLink.style.display = 'none';
        if (petcareLink) petcareLink.style.display = 'none';
        if (profileLink) profileLink.style.display = 'none';
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
    document.body.classList.add('modal-open');
}

function hideEditProfileModal() {
    document.getElementById('editProfileModal').style.display = 'none';
    document.body.classList.remove('modal-open');
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
    document.body.classList.add('modal-open');
}

function hideAddPetModal() {
    document.getElementById('addPetModal').style.display = 'none';
    document.body.classList.remove('modal-open');
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
        const userTypeMap = {
            normal: 'Normal User',
            shelter: 'Shelter',
            veterinary: 'Veterinary',
            petcare: 'Pet Care'
        };
        document.getElementById('profileUserType').textContent = userTypeMap[user.type] || 'Unknown';

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
            const apptDateTime = new Date(`${appt.date}T${appt.time}`);
            userAppointments.innerHTML += `
                <p>
                    ${appt.pet} at ${appt.center} - ${apptDateTime.toLocaleString()}
                    <button class="cancel-button" onclick="cancelAppointment(${appt.id})">Cancel</button>
                </p>
            `;
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
        renderProfile();
    }
}

// Care plans
function viewCarePlan(type) {
    const details = document.getElementById('carePlanDetails');
    if (details) {
        details.innerHTML = `<h3>${type.charAt(0).toUpperCase() + type.slice(1)} Care Plan</h3><pre>${carePlans[type]}</pre>`;
    }
}

// Veterinary Dashboard Functions
function renderVeterinaryDashboard() {
    renderVetServiceListings();
    renderVetAppointmentRequests();
    renderVetConsultSchedule();
}

function renderVetServiceListings() {
    const listings = document.getElementById('vetServiceListings');
    listings.innerHTML = '';
    const vetServices = vetServiceListings.filter(service => service.veterinary === user.username);
    if (vetServices.length === 0) {
        listings.innerHTML = '<p>No active service listings.</p>';
    } else {
        vetServices.forEach((service, index) => {
            const globalIndex = vetServiceListings.findIndex(s => s === service);
            listings.innerHTML += `
                <div class="pet-listing-card">
                    <div class="pet-photo" style="background-image: url(${service.photo || ''})"></div>
                    <h4>${service.name}</h4>
                    <p><strong>Description:</strong> ${service.description}</p>
                    <p><strong>Price:</strong> RM ${service.price || 'N/A'}</p>
                    <p><strong>Veterinary:</strong> ${service.veterinary}</p>
                    <div class="pet-actions">
                        <button onclick="editVetService(${globalIndex})" class="edit-button">Edit</button>
                        <button onclick="deleteVetService(${globalIndex})" class="delete-button">Delete</button>
                    </div>
                </div>
            `;
        });
    }
}

function addVeterinaryService() {
    if (!user || user.type !== 'veterinary') {
        alert('Please log in as a veterinary user to add a service.');
        showLoginModal();
        return;
    }

    const name = document.getElementById('serviceName').value;
    const description = document.getElementById('serviceDescription').value;
    const price = document.getElementById('servicePrice').value;
    const fileInput = document.getElementById('servicePhoto');
    const file = fileInput.files[0];

    if (!name) {
        alert('Please fill in the service name.');
        return;
    }

    const newService = {
        name,
        description: description || '',
        price: price || 'N/A',
        veterinary: user.username,
        photo: ''
    };

    if (file) {
        const reader = new FileReader();
        reader.onload = function(e) {
            newService.photo = e.target.result;
            vetServiceListings.push(newService);
            localStorage.setItem('vetServiceListings', JSON.stringify(vetServiceListings));
            loadData();
            renderVetServiceListings();
            document.getElementById('addServiceForm').reset();
            alert('Service added successfully!');
        };
        reader.readAsDataURL(file);
    } else {
        vetServiceListings.push(newService);
        localStorage.setItem('vetServiceListings', JSON.stringify(vetServiceListings));
        loadData();
        renderVetServiceListings();
        document.getElementById('addServiceForm').reset();
        alert('Service added successfully!');
    }
}

function editVetService(index) {
    const service = vetServiceListings[index];
    if (service.veterinary !== user.username) {
        alert('You can only edit your own service listings.');
        return;
    }
    document.getElementById('serviceName').value = service.name;
    document.getElementById('serviceDescription').value = service.description;
    document.getElementById('servicePrice').value = service.price;
    vetServiceListings.splice(index, 1);
    localStorage.setItem('vetServiceListings', JSON.stringify(vetServiceListings));
    loadData();
    renderVetServiceListings();
}

function deleteVetService(index) {
    const service = vetServiceListings[index];
    if (service.veterinary !== user.username) {
        alert('You can only delete your own service listings.');
        return;
    }
    if (confirm('Are you sure you want to delete this service listing?')) {
        vetServiceListings.splice(index, 1);
        localStorage.setItem('vetServiceListings', JSON.stringify(vetServiceListings));
        loadData();
        renderVetServiceListings();
        alert('Service listing deleted successfully!');
    }
}

function renderVetAppointmentRequests() {
    const vetAppointmentRequests = document.getElementById('vetAppointmentRequests');
    if (!vetAppointmentRequests) {
        console.error("Element with ID 'vetAppointmentRequests' not found.");
        return;
    }

    vetAppointmentRequests.innerHTML = '';

    if (!user || user.type !== 'veterinary') {
        vetAppointmentRequests.innerHTML = '<p>Please log in as a veterinary user to view appointment requests.</p>';
        return;
    }

    const vetAppointments = appointments.filter(appt => appt.center === user.centerName && appt.status !== 'completed');
    if (vetAppointments.length === 0) {
        vetAppointmentRequests.innerHTML = '<p>No pending appointment requests.</p>';
        return;
    }

    vetAppointments.forEach(appt => {
        const apptDateTime = new Date(`${appt.date}T${appt.time}`);
        const requestCard = document.createElement('div');
        requestCard.classList.add('request-card');
        requestCard.innerHTML = `
            <p><strong>Pet:</strong> ${appt.pet}</p>
            <p><strong>User:</strong> ${appt.user}</p>
            <p><strong>Time:</strong> ${apptDateTime.toLocaleString()}</p>
            <p><strong>Status:</strong> ${appt.status || 'Pending'}</p>
            <button class="approve-button" onclick="updateVetAppointmentStatus(${appt.id}, 'approved')">Approve</button>
            <button class="reject-button" onclick="updateVetAppointmentStatus(${appt.id}, 'rejected')">Reject</button>
        `;
        vetAppointmentRequests.appendChild(requestCard);
    });
}

function updateVetAppointmentStatus(appointmentId, newStatus) {
    const apptIndex = appointments.findIndex(appt => appt.id === appointmentId && appt.center === user.centerName);
    if (apptIndex === -1) {
        console.error('Appointment not found:', appointmentId);
        return;
    }

    appointments[apptIndex].status = newStatus;
    localStorage.setItem('appointments', JSON.stringify(appointments));
    loadData();
    renderVetAppointmentRequests();
}

function scheduleVetConsultation() {
    if (!user || user.type !== 'veterinary') {
        alert('Please log in as a veterinary user to schedule consultations.');
        showLoginModal();
        return;
    }
    const consultName = document.getElementById('liveConsultName').value;
    const time = document.getElementById('liveConsultTime').value;
    if (consultName && time) {
        vetConsultSchedules.push({ title: consultName, time, veterinary: user.username });
        localStorage.setItem('vetConsultSchedules', JSON.stringify(vetConsultSchedules));
        loadData();
        renderVetConsultSchedule();
        document.getElementById('liveConsultName').value = '';
        document.getElementById('liveConsultTime').value = '';
        alert('Consultation scheduled successfully!');
    } else {
        alert('Please provide a title and time for the consultation.');
    }
}

function renderVetConsultSchedule() {
    const schedule = document.getElementById('vetConsultSchedule');
    schedule.innerHTML = '<h4>Scheduled Consultations</h4>';
    const vetSchedules = vetConsultSchedules.filter(s => s.veterinary === user.username);
    if (vetSchedules.length === 0) {
        schedule.innerHTML += '<p>No scheduled consultations.</p>';
    } else {
        vetSchedules.forEach(s => {
            schedule.innerHTML += `<p>${s.title} - ${new Date(s.time).toLocaleString()} (by ${s.veterinary})</p>`;
        });
    }
}

// Pet Care Dashboard Functions
function renderPetCareDashboard() {
    renderPetCareServiceListings();
    renderPetCareBookingRequests();
    renderPetCareInteractionSchedule();
}

function renderPetCareServiceListings() {
    const listings = document.getElementById('petCareServiceListings');
    listings.innerHTML = '';
    const careServices = petCareServiceListings.filter(service => service.petcare === user.username);
    if (careServices.length === 0) {
        listings.innerHTML = '<p>No active service listings.</p>';
    } else {
        careServices.forEach((service, index) => {
            const globalIndex = petCareServiceListings.findIndex(s => s === service);
            listings.innerHTML += `
                <div class="pet-listing-card">
                    <div class="pet-photo" style="background-image: url(${service.photo || ''})"></div>
                    <h4>${service.name}</h4>
                    <p><strong>Description:</strong> ${service.description}</p>
                    <p><strong>Price:</strong> RM ${service.price || 'N/A'}</p>
                    <p><strong>Pet Care Center:</strong> ${service.petcare}</p>
                    <div class="pet-actions">
                        <button onclick="editPetCareService(${globalIndex})" class="edit-button">Edit</button>
                        <button onclick="deletePetCareService(${globalIndex})" class="delete-button">Delete</button>
                    </div>
                </div>
            `;
        });
    }
}

function addPetCareService() {
    if (!user || user.type !== 'petcare') {
        alert('Please log in as a pet care user to add a service.');
        showLoginModal();
        return;
    }

    const name = document.getElementById('careServiceName').value;
    const description = document.getElementById('careServiceDescription').value;
    const price = document.getElementById('careServicePrice').value;
    const fileInput = document.getElementById('careServicePhoto');
    const file = fileInput.files[0];

    if (!name) {
        alert('Please fill in the service name.');
        return;
    }

    const newService = {
        name,
        description: description || '',
        price: price || 'N/A',
        petcare: user.username,
        photo: ''
    };

    if (file) {
        const reader = new FileReader();
        reader.onload = function(e) {
            newService.photo = e.target.result;
            petCareServiceListings.push(newService);
            localStorage.setItem('petCareServiceListings', JSON.stringify(petCareServiceListings));
            loadData();
            renderPetCareServiceListings();
            document.getElementById('addCareServiceForm').reset();
            alert('Service added successfully!');
        };
        reader.readAsDataURL(file);
    } else {
        petCareServiceListings.push(newService);
        localStorage.setItem('petCareServiceListings', JSON.stringify(petCareServiceListings));
        loadData();
        renderPetCareServiceListings();
        document.getElementById('addCareServiceForm').reset();
        alert('Service added successfully!');
    }
}

function editPetCareService(index) {
    const service = petCareServiceListings[index];
    if (service.petcare !== user.username) {
        alert('You can only edit your own service listings.');
        return;
    }
    document.getElementById('careServiceName').value = service.name;
    document.getElementById('careServiceDescription').value = service.description;
    document.getElementById('careServicePrice').value = service.price;
    petCareServiceListings.splice(index, 1);
    localStorage.setItem('petCareServiceListings', JSON.stringify(petCareServiceListings));
    loadData();
    renderPetCareServiceListings();
}

function deletePetCareService(index) {
    const service = petCareServiceListings[index];
    if (service.petcare !== user.username) {
        alert('You can only delete your own service listings.');
        return;
    }
    if (confirm('Are you sure you want to delete this service listing?')) {
        petCareServiceListings.splice(index, 1);
        localStorage.setItem('petCareServiceListings', JSON.stringify(petCareServiceListings));
        loadData();
        renderPetCareServiceListings();
        alert('Service listing deleted successfully!');
    }
}

function renderPetCareBookingRequests() {
    const petCareBookingRequests = document.getElementById('petCareBookingRequests');
    if (!petCareBookingRequests) {
        console.error("Element with ID 'petCareBookingRequests' not found.");
        return;
    }

    petCareBookingRequests.innerHTML = '';

    if (!user || user.type !== 'petcare') {
        petCareBookingRequests.innerHTML = '<p>Please log in as a pet care user to view booking requests.</p>';
        return;
    }

    const careAppointments = petCareAppointments.filter(appt => appt.center === user.centerName && appt.status !== 'completed');
    if (careAppointments.length === 0) {
        petCareBookingRequests.innerHTML = '<p>No pending booking requests.</p>';
        return;
    }

    careAppointments.forEach(appt => {
        const startDateTime = new Date(appt.startDate);
        const endDateTime = new Date(appt.endDate);
        const requestCard = document.createElement('div');
        requestCard.classList.add('request-card');
        requestCard.innerHTML = `
            <p><strong>Pet:</strong> ${appt.pet}</p>
            <p><strong>User:</strong> ${appt.user}</p>
            <p><strong>Service:</strong> ${appt.service}</p>
            <p><strong>Period:</strong> ${startDateTime.toLocaleDateString()} to ${endDateTime.toLocaleDateString()}</p>
            <p><strong>Notes:</strong> ${appt.notes || 'None'}</p>
            <p><strong>Status:</strong> ${appt.status || 'Pending'}</p>
            <button class="approve-button" onclick="updatePetCareBookingStatus(${appt.id}, 'approved')">Approve</button>
            <button class="reject-button" onclick="updatePetCareBookingStatus(${appt.id}, 'rejected')">Reject</button>
        `;
        petCareBookingRequests.appendChild(requestCard);
    });
}

function updatePetCareBookingStatus(appointmentId, newStatus) {
    const apptIndex = petCareAppointments.findIndex(appt => appt.id === appointmentId && appt.center === user.centerName);
    if (apptIndex === -1) {
        console.error('Booking not found:', appointmentId);
        return;
    }

    petCareAppointments[apptIndex].status = newStatus;
    localStorage.setItem('petCareAppointments', JSON.stringify(petCareAppointments));
    loadData();
    renderPetCareBookingRequests();
}

function schedulePetCareInteraction() {
    if (!user || user.type !== 'petcare') {
        alert('Please log in as a pet care user to schedule interactions.');
        showLoginModal();
        return;
    }
    const interactionName = document.getElementById('liveCareName').value;
    const time = document.getElementById('liveCareTime').value;
    if (interactionName && time) {
        petCareInteractionSchedules.push({ title: interactionName, time, petcare: user.username });
        localStorage.setItem('petCareInteractionSchedules', JSON.stringify(petCareInteractionSchedules));
        loadData();
        renderPetCareInteractionSchedule();
        document.getElementById('liveCareName').value = '';
        document.getElementById('liveCareTime').value = '';
        alert('Interaction scheduled successfully!');
    } else {
        alert('Please provide a title and time for the interaction.');
    }
}

function renderPetCareInteractionSchedule() {
    const schedule = document.getElementById('petCareInteractionSchedule');
    schedule.innerHTML = '<h4>Scheduled Interactions</h4>';
    const careSchedules = petCareInteractionSchedules.filter(s => s.petcare === user.username);
    if (careSchedules.length === 0) {
        schedule.innerHTML += '<p>No scheduled interactions.</p>';
    } else {
        careSchedules.forEach(s => {
            schedule.innerHTML += `<p>${s.title} - ${new Date(s.time).toLocaleString()} (by ${s.petcare})</p>`;
        });
    }
}

// Veterinary Centers
function renderVetCenters() {
    const vetCentersList = document.getElementById('vetCentersList');
    if (!vetCentersList) {
        console.error('vetCentersList element not found in DOM');
        return;
    }
    vetCentersList.innerHTML = '';
    if (vetCenters.length === 0) {
        vetCentersList.innerHTML = '<p>No veterinary centers available.</p>';
        return;
    }
    vetCenters.forEach(center => {
        const card = document.createElement('div');
        card.className = 'vet-center-card';
        card.innerHTML = `
            <img src="${center.image}" alt="${center.name}" style="width: 100%; height: 150px; object-fit: cover;">
            <h3>${center.name}</h3>
            <p>Rating: ${center.rating} / 5.0</p>
        `;
        card.addEventListener('click', () => showVetCenterModal(center.id));
        vetCentersList.appendChild(card);
    });
}

function showVetCenterModal(centerId) {
    const center = vetCenters.find(c => c.id === centerId);
    if (!center) {
        console.error('Veterinary center not found:', centerId);
        return;
    }
    document.getElementById('vetCenterName').textContent = center.name;
    document.getElementById('vetCenterImage').src = center.image;
    document.getElementById('vetCenterRating').textContent = `${center.rating} / 5.0`;
    document.getElementById('vetCenterHours').innerHTML = center.hours.replace(/\n/g, '<br>');
    document.getElementById('vetCenterAddress').textContent = center.address;
    document.getElementById('vetCenterMap').innerHTML = `<iframe src="${center.mapUrl}" width="100%" height="100%" style="border:0;" allowfullscreen="" loading="lazy"></iframe>`;
    
    const modal = document.getElementById('vetCenterModal');
    modal.style.display = 'block';
    document.body.classList.add('modal-open');

    // Dynamically adjust modal content height
    const modalContent = modal.querySelector('.modal-content');
    const windowHeight = window.innerHeight;
    modalContent.style.maxHeight = `${windowHeight * 0.9}px`;
}

function hideVetCenterModal() {
    document.getElementById('vetCenterModal').style.display = 'none';
    document.body.classList.remove('modal-open');
}

function populateAppointmentTimes() {
    const timeSelect = document.getElementById('appointmentTime');
    if (!timeSelect) {
        console.error('appointmentTime element not found');
        return;
    }
    const times = [];
    for (let hour = 8; hour <= 17; hour++) {
        times.push(`${hour}:00`);
        if (hour < 17) times.push(`${hour}:30`);
    }
    timeSelect.innerHTML = '<option value="">Select a time...</option>';
    times.forEach(time => {
        timeSelect.innerHTML += `<option value="${time}">${time}</option>`;
    });
}

function populateVetCenters() {
    const vetSelect = document.getElementById('vetCenter');
    if (!vetSelect) {
        console.error('vetCenter element not found');
        return;
    }
    vetSelect.innerHTML = '<option value="">Select a veterinary center...</option>';
    vetCenters.forEach(center => {
        vetSelect.innerHTML += `<option value="${center.name}">${center.name}</option>`;
    });
}

// Veterinary Appointments
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
    const time = document.getElementById('appointmentTime').value;
    const center = document.getElementById('vetCenter').value;

    if (!petName || !date || !time || !center) {
        alert('Please fill in all required fields.');
        return;
    }

    const apptDateTime = new Date(`${date}T${time}:00`);
    const now = new Date();
    if (apptDateTime <= now) {
        alert('Please select a future date and time.');
        return;
    }

    const newAppointment = {
        id: appointments.length ? Math.max(...appointments.map(a => a.id || 0)) + 1 : 1,
        pet: petName,
        date,
        time,
        center,
        user: user.username
    };

    appointments.push(newAppointment);
    localStorage.setItem('appointments', JSON.stringify(appointments));
    loadData();
    renderAppointments();
    document.getElementById('petName').value = '';
    document.getElementById('appointmentDate').value = '';
    document.getElementById('appointmentTime').value = '';
    document.getElementById('vetCenter').value = '';
    alert('Appointment booked successfully!');
}

function renderAppointments() {
    const list = document.getElementById('appointmentList');
    if (!list) {
        console.error('appointmentList element not found');
        return;
    }
    list.innerHTML = '<h4>Your Appointments</h4>';
    const userAppts = appointments.filter(appt => appt.user === user.username);
    if (userAppts.length === 0) {
        list.innerHTML += '<p>No appointments yet.</p>';
    } else {
        userAppts.forEach(appt => {
            const apptDateTime = new Date(`${appt.date}T${appt.time}:00`);
            const now = new Date();
            const canCancel = apptDateTime > now;
            list.innerHTML += `
                <p>
                    ${appt.pet} at ${appt.center} - ${apptDateTime.toLocaleString()}
                    ${canCancel ? `<button class="cancel-button" onclick="cancelAppointment(${appt.id})">Cancel</button>` : ''}
                </p>
            `;
        });
    }
}

function cancelAppointment(appointmentId) {
    if (!user) {
        alert('Please log in to cancel an appointment.');
        showLoginModal();
        return;
    }

    const apptIndex = appointments.findIndex(appt => appt.id === appointmentId && appt.user === user.username);
    if (apptIndex === -1) {
        alert('Appointment not found or you do not have permission to cancel it.');
        return;
    }

    const appt = appointments[apptIndex];
    const apptDateTime = new Date(`${appt.date}T${appt.time}:00`);
    if (apptDateTime <= new Date()) {
        alert('Past appointments cannot be canceled.');
        return;
    }

    if (!confirm('Are you sure you want to cancel this appointment?')) {
        return;
    }

    appointments.splice(apptIndex, 1);
    localStorage.setItem('appointments', JSON.stringify(appointments));
    loadData();
    renderAppointments();
    alert('Appointment canceled successfully!');
}

// Pet Care Booking functions
function renderPetCarePage() {
    const userPetCareAppointments = document.getElementById('userPetCareAppointments');
    if (!userPetCareAppointments) {
        console.error('userPetCareAppointments element not found');
        return;
    }
    userPetCareAppointments.innerHTML = '<h4>Your Pet Care Appointments</h4>';
    const userCareAppts = petCareAppointments.filter(appt => appt.user === user.username);
    if (userCareAppts.length === 0) {
        userPetCareAppointments.innerHTML += '<p>No pet care appointments yet.</p>';
    } else {
        userCareAppts.forEach(appt => {
            const apptDateTime = new Date(`${appt.date}T${appt.time}:00`);
            const now = new Date();
            const canCancel = apptDateTime > now;
            userPetCareAppointments.innerHTML += `
                <p>
                    ${appt.pet} - ${appt.service} on ${apptDateTime.toLocaleString()}
                    ${canCancel ? `<button class="cancel-button" onclick="cancelPetCareAppointment(${appt.id})">Cancel</button>` : ''}
                </p>
            `;
        });
    }
}

function renderPetCareCenters() {
    const petCareCentersList = document.getElementById('petCareCentersList');
    if (!petCareCentersList) {
        console.error('petCareCentersList element not found in DOM');
        return;
    }
    petCareCentersList.innerHTML = '';
    if (petCareCenters.length === 0) {
        petCareCentersList.innerHTML = '<p>No pet care centers available.</p>';
        return;
    }
    petCareCenters.forEach(center => {
        const card = document.createElement('div');
        card.className = 'petcare-center-card';
        card.innerHTML = `
            <img src="${center.image}" alt="${center.name}" style="width: 100%; height: 150px; object-fit: cover;">
            <h3>${center.name}</h3>
            <p>Rating: ${center.rating} / 5.0</p>
        `;
        card.addEventListener('click', () => showPetCareCenterModal(center.id));
        petCareCentersList.appendChild(card);
    });
}

function showPetCareCenterModal(centerId) {
    const center = petCareCenters.find(c => c.id === centerId);
    if (!center) {
        console.error('Pet care center not found:', centerId);
        return;
    }
    document.getElementById('petCareCenterName').textContent = center.name;
    document.getElementById('petCareCenterImage').src = center.image;
    document.getElementById('petCareCenterRating').textContent = `${center.rating} / 5.0`;
    document.getElementById('petCareCenterHours').innerHTML = center.hours.replace(/\n/g, '<br>');
    document.getElementById('petCareCenterAddress').textContent = center.address;
    document.getElementById('petCareCenterMap').innerHTML = `<iframe src="${center.mapUrl}" width="100%" height="100%" style="border:0;" allowfullscreen="" loading="lazy"></iframe>`;
    
    const modal = document.getElementById('petCareCenterModal');
    modal.style.display = 'block';
    document.body.classList.add('modal-open');

    const modalContent = modal.querySelector('.modal-content');
    const windowHeight = window.innerHeight;
    modalContent.style.maxHeight = `${windowHeight * 0.9}px`;
}

function hidePetCareCenterModal() {
    document.getElementById('petCareCenterModal').style.display = 'none';
    document.body.classList.remove('modal-open');
}

function populatePetCareCenters() {
    const careCenterSelect = document.getElementById('careCenter');
    if (!careCenterSelect) {
        console.error('careCenter element not found');
        return;
    }
    careCenterSelect.innerHTML = '<option value="">Select a pet care center...</option>';
    petCareCenters.forEach(center => {
        careCenterSelect.innerHTML += `<option value="${center.name}">${center.name}</option>`;
    });
}

function populatePetCareTimes() {
    const timeSelect = document.getElementById('careTime');
    if (!timeSelect) {
        console.error('careTime element not found');
        return;
    }
    const times = [];
    for (let hour = 8; hour <= 17; hour++) {
        times.push(`${hour}:00`);
        if (hour < 17) times.push(`${hour}:30`);
    }
    timeSelect.innerHTML = '<option value="">Select a time...</option>';
    times.forEach(time => {
        timeSelect.innerHTML += `<option value="${time}">${time}</option>`;
    });
}

function bookPetCare() {
    if (!user) {
        alert('Please log in to book a pet care appointment.');
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
    const service = document.getElementById('careType').value;
    const center = document.getElementById('careCenter').value;
    const notes = document.getElementById('careNotes').value;

    if (!petName || !startDate || !endDate || !service || !center) {
        alert('Please fill in all required fields.');
        return;
    }

    const startDateTime = new Date(startDate);
    const endDateTime = new Date(endDate);
    const now = new Date();
    if (startDateTime <= now) {
        alert('Please select a future start date and time.');
        return;
    }
    if (endDateTime <= startDateTime) {
        alert('End date and time must be after start date and time.');
        return;
    }

    const newAppointment = {
        id: petCareAppointments.length ? Math.max(...petCareAppointments.map(a => a.id || 0)) + 1 : 1,
        pet: petName,
        service,
        startDate,
        endDate,
        center, // Ensured center is included
        notes,
        user: user.username
    };

    petCareAppointments.push(newAppointment);
    localStorage.setItem('petCareAppointments', JSON.stringify(petCareAppointments));
    loadData();
    renderPetCarePage();
    document.getElementById('carePetName').value = '';
    document.getElementById('careStartDate').value = '';
    document.getElementById('careEndDate').value = '';
    document.getElementById('careType').value = 'boarding';
    document.getElementById('careCenter').value = '';
    document.getElementById('careNotes').value = '';
    alert('Pet care appointment booked successfully!');
}

function cancelPetCareAppointment(appointmentId) {
    if (!user) {
        alert('Please log in to cancel a pet care appointment.');
        showLoginModal();
        return;
    }

    const apptIndex = petCareAppointments.findIndex(appt => appt.id === appointmentId && appt.user === user.username);
    if (apptIndex === -1) {
        alert('Appointment not found or you do not have permission to cancel it.');
        return;
    }

    const appt = petCareAppointments[apptIndex];
    const apptDateTime = new Date(`${appt.date}T${appt.time}:00`);
    if (apptDateTime <= new Date()) {
        alert('Past appointments cannot be canceled.');
        return;
    }

    if (!confirm('Are you sure you want to cancel this pet care appointment?')) {
        return;
    }

    petCareAppointments.splice(apptIndex, 1);
    localStorage.setItem('petCareAppointments', JSON.stringify(petCareAppointments));
    loadData();
    renderPetCarePage();
    alert('Pet care appointment canceled successfully!');
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
    const shelterPets = shelterListings.filter(pet => pet.shelter === user.username);
    if (shelterPets.length === 0) {
        listings.innerHTML = '<p>No active listings.</p>';
    } else {
        shelterPets.forEach((pet, index) => {
            const globalIndex = shelterListings.findIndex(p => p === pet);
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
        shelter: user.username,
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
    const requestsDiv = document.getElementById('userAdoptionRequests');
    if (!requestsDiv) {
        console.error('userAdoptionRequests div not found in the DOM');
        return;
    }

    if (!user) {
        requestsDiv.innerHTML = '<p>Please log in to view your adoption requests.</p>';
        return;
    }

    const userRequests = adoptionRequests.filter(request => 
        String(request.user).toLowerCase() === String(user.username).toLowerCase()
    );
    requestsDiv.innerHTML = '';

    if (userRequests.length === 0) {
        requestsDiv.innerHTML = '<p>You have no adoption requests.</p>';
        return;
    }

    userRequests.forEach(request => {
        const pet = shelterListings[request.petId];
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

    shelterAdoptionRequests.innerHTML = '';

    if (!user || user.type !== 'shelter') {
        shelterAdoptionRequests.innerHTML = '<p>Please log in as a shelter to view adoption requests.</p>';
        return;
    }

    const adoptionRequests = JSON.parse(localStorage.getItem('adoptionRequests')) || [];
    const pets = shelterListings;

    const shelterRequests = adoptionRequests.filter(request => {
        const pet = pets[request.petId];
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
    let pets = shelterListings;

    const requestIndex = adoptionRequests.findIndex(r => r.id === requestId);
    if (requestIndex === -1) {
        console.error('Request not found:', requestId);
        return;
    }

    const request = adoptionRequests[requestIndex];
    adoptionRequests[requestIndex].status = newStatus;

    if (newStatus === 'approved') {
        const pet = pets[request.petId];
        if (pet) {
            pet.status = 'Adopted';
            shelterListings[request.petId] = pet;
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

function showDonateModal(campaign) {
    if (!user) {
        alert('Please log in to donate.');
        showLoginModal();
        return;
    }
    document.getElementById('campaignName').textContent = campaign.charAt(0).toUpperCase() + campaign.slice(1);
    document.getElementById('donateAmount').value = '';
    document.getElementById('donateModal').style.display = 'block';
    document.body.classList.add('modal-open');
}

function hideDonateModal() {
    document.getElementById('donateModal').style.display = 'none';
    document.body.classList.remove('modal-open');
}

function confirmDonation() {
    const campaign = document.getElementById('campaignName').textContent.toLowerCase();
    const amount = parseInt(document.getElementById('donateAmount').value);
    if (!amount || amount <= 0) {
        alert('Please enter a valid donation amount.');
        return;
    }
    donations[campaign] = (donations[campaign] || 0) + amount;
    localStorage.setItem('donations', JSON.stringify(donations));
    loadData();
    updateDonationProgress();
    hideDonateModal();
    alert(`Thank you for donating $${amount} to ${campaign}!`);
}

function donateToCampaign(campaign) {
    showDonateModal(campaign);
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
    const donationRecord = {
        amount: parseInt(amount),
        donor: donorName,
        date: new Date().toLocaleString(),
        purpose: 'Shelter operations'
    };
    const donationHistory = JSON.parse(localStorage.getItem('donationHistory')) || [];
    donationHistory.push(donationRecord);
    localStorage.setItem('donationHistory', JSON.stringify(donationHistory));
    const tracking = document.getElementById('donationTracking');
    tracking.innerHTML += `<p>$${donationRecord.amount} donated by ${donationRecord.donor} on ${donationRecord.date} - Funds will support ${donationRecord.purpose}.</p>`;
    document.getElementById('customAmount').value = '';
    document.getElementById('donorName').value = '';
    donationAmount = 0;
    alert(`Thank you for donating $${amount}!`);
}

function updateDonationProgress() {
    document.getElementById('medicalRaised').textContent = `$${donations.medical}`;
    document.getElementById('renovationRaised').textContent = `$${donations.renovation}`;
    document.getElementById('medicalProgress').style.width = `${(donations.medical / 1000) * 100}%`;
    document.getElementById('renovationProgress').style.width = `${(donations.renovation / 5000) * 100}%`;
    const tracking = document.getElementById('donationTracking');
    const donationHistory = JSON.parse(localStorage.getItem('donationHistory')) || [];
    tracking.innerHTML = donationHistory.map(d => `<p>$${d.amount} donated by ${d.donor} on ${d.date} - Funds will support ${d.purpose}.</p>`).join('');
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

// Adoption functions
function renderAdoptionPage() {
    const petListings = document.getElementById('petListings');
    const petNameSelect = document.getElementById('petName');
    
    petListings.innerHTML = '';
    petNameSelect.innerHTML = '<option value="">Select a pet...</option>';
    
    const availablePets = shelterListings.filter(pet => pet.status === 'Available');
    
    if (availablePets.length === 0) {
        petListings.innerHTML = '<p>No pets available for adoption.</p>';
    } else {
        availablePets.forEach((pet, index) => {
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
    const petId = parseInt(document.getElementById('petName').value);
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
        petId: petId,
        user: user.username,
        status: 'pending',
        message: reason || ''
    };
    adoptionRequests.push(newRequest);
    localStorage.setItem('adoptionRequests', JSON.stringify(adoptionRequests));
    loadData();
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
    if (request.status !== 'pending') {
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
