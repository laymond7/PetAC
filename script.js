console.log('script.js loaded');

const { createClient } = supabase;
const supabaseClient = createClient('https://xxvqiqcwrnhgyadnxhpm.supabase.co', 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6Inh4dnFpcWN3cm5oZ3lhZG54aHBtIiwicm9sZSI6ImFub24iLCJpYXQiOjE3NDYwMjY2MDksImV4cCI6MjA2MTYwMjYwOX0.rOhup1tm5LH4uG3gApNHAb698VgTDMKSVaMR4d8Qkf0');
const GOOGLE_API_KEY = 'AIzaSyAHT0JawE_3UosXx8BBGkCwxAddVMqtl6c';

let user = null;
let shelterListings = [];
let adoptionRequests = [];
let communityPosts = [];
let donations = { medical: 0, renovation: 0, general: 0 };
let donationHistory = [];
let favorites = [];

async function loadData() {
    try {
        user = JSON.parse(localStorage.getItem('user')) || null;
        console.log('loadData: user from localStorage:', user);
        const { data: listings } = await supabaseClient.from('shelter_listings').select('*');
        shelterListings = listings || [];
        const { data: requests } = await supabaseClient.from('adoption_requests').select('*');
        adoptionRequests = requests || [];
        const { data: posts } = await supabaseClient.from('community_posts').select('*');
        communityPosts = posts || [];
        const { data: donationData } = await supabaseClient.from('donations').select('*');
        donations = donationData.reduce((acc, d) => ({ ...acc, [d.type]: (acc[d.type] || 0) + d.amount }), { medical: 0, renovation: 0, general: 0 });
    } catch (e) {
        console.error('Error loading data from Supabase:', e);
    }
}

async function saveData(table, data) {
    try {
        const { error } = await supabaseClient.from(table).insert(data);
        if (error) throw error;
    } catch (e) {
        console.error(`Error saving data to ${table}:`, e);
    }
}

async function login() {
    const usernameInput = document.getElementById('username');
    const passwordInput = document.getElementById('password');
    const username = usernameInput?.value?.trim();
    const password = passwordInput?.value;
    console.log('Login inputs:', { username, password });
    if (!username || !password) {
        alert('Please fill in all fields.');
        return;
    }
    try {
        const { data: userData, error } = await supabaseClient
            .from('users')
            .select('*')
            .eq('username', username)
            .single();
        if (error || !userData) {
            alert('Invalid username or password.');
            return;
        }
        if (userData.password !== password) {
            alert('Invalid username or password.');
            return;
        }
        user = { username };
        localStorage.setItem('user', JSON.stringify(user));
        console.log('Login: user set:', user);
        alert('Login successful!');
        hideLoginModal();
        updateNav();
        window.location.href = 'profile.html';
    } catch (e) {
        alert('Login failed: ' + e.message);
        console.error('Login error:', e);
    }
}

async function register() {
    const usernameInput = document.getElementById('username');
    const passwordInput = document.getElementById('password');
    const username = usernameInput?.value?.trim();
    const password = passwordInput?.value;
    console.log('Register inputs:', { username, password });
    if (!username || !password) {
        alert('Please fill in all fields.');
        return;
    }
    if (!/^[a-zA-Z0-9_]{3,20}$/.test(username)) {
        alert('Username must be 3-20 characters, alphanumeric or underscore only.');
        return;
    }
    try {
        const { data: existing, error: queryError } = await supabaseClient
            .from('users')
            .select('*')
            .eq('username', username);
        if (queryError) {
            throw new Error('Error checking username: ' + queryError.message);
        }
        if (existing && existing.length > 0) {
            alert('Username already exists.');
            return;
        }
        await supabaseClient.from('users').insert({ username, password });
        user = { username };
        localStorage.setItem('user', JSON.stringify(user));
        console.log('Register: user set:', user);
        alert('Registration successful! Warning: Passwords are stored in plain text for testing. Do not use real passwords.');
        hideLoginModal();
        updateNav();
        window.location.href = 'profile.html';
    } catch (e) {
        alert('Registration failed: ' + e.message);
        console.error('Register error:', e);
    }
}

function logout() {
    console.log('Logout: user cleared');
    user = null;
    localStorage.removeItem('user');
    updateNav();
    window.location.href = 'index.html';
}

function showLoginModal(event) {
    if (event) event.preventDefault();
    console.log('showLoginModal called');
    const modal = document.getElementById('loginModal');
    if (!modal) {
        console.error('Login modal not found');
        alert('Error: Login modal not found. Please check HTML.');
        return;
    }
    console.log('Modal found, setting display to block');
    modal.style.display = 'block';
}

function hideLoginModal() {
    console.log('hideLoginModal called');
    const modal = document.getElementById('loginModal');
    if (!modal) return;
    modal.style.display = 'none';
    const usernameInput = document.getElementById('username');
    const passwordInput = document.getElementById('password');
    if (usernameInput) usernameInput.value = '';
    if (passwordInput) passwordInput.value = '';
}

function updateNav() {
    console.log('updateNav called, user:', user);
    const loginLink = document.getElementById('loginLink');
    const profileLink = document.getElementById('profileLink');
    const shelterLink = document.getElementById('shelterLink');
    if (!loginLink || !profileLink || !shelterLink) {
        console.error('Navigation elements not found:', { loginLink, profileLink, shelterLink });
        return;
    }
    if (user) {
        loginLink.style.display = 'none';
        profileLink.style.display = 'block';
        shelterLink.style.display = 'block';
    } else {
        loginLink.style.display = 'block';
        profileLink.style.display = 'none';
        shelterLink.style.display = 'none';
    }
}

async function getUserLocation() {
    return new Promise((resolve) => {
        navigator.geolocation.getCurrentPosition(
            (position) => resolve({ lat: position.coords.latitude, lng: position.coords.longitude, city: 'Current Location' }),
            () => resolve({ lat: 4.2105, lng: 101.9758, city: 'Malaysia' }) // Fallback
        );
    });
}

async function fetchVetCenters(userLocation) {
    try {
        // Check Supabase cache first (cached within last 24 hours)
        const { data: cachedCenters } = await supabaseClient
            .from('vet_centers')
            .select('*')
            .gte('created_at', new Date(Date.now() - 24 * 60 * 60 * 1000).toISOString())
            .ilike('city', `%${userLocation.city}%`);
        if (cachedCenters?.length) {
            console.log('Using cached vet centers:', cachedCenters);
            return cachedCenters;
        }

        return new Promise((resolve) => {
            const service = new google.maps.places.PlacesService(document.createElement('div'));
            service.nearbySearch(
                {
                    location: { lat: userLocation.lat, lng: userLocation.lng },
                    radius: 50000,
                    type: 'veterinary_care'
                },
                async (results, status) => {
                    if (status !== google.maps.places.PlacesServiceStatus.OK) {
                        console.error('Places API nearbySearch error:', status);
                        resolve([]);
                        return;
                    }
                    const centers = [];
                    for (const place of results) {
                        const details = await new Promise((resolveDetails) => {
                            service.getDetails(
                                {
                                    placeId: place.place_id,
                                    fields: ['name', 'vicinity', 'formatted_phone_number', 'website', 'geometry.location', 'plus_code', 'opening_hours']
                                },
                                (detailResult, detailStatus) => {
                                    if (detailStatus !== google.maps.places.PlacesServiceStatus.OK) {
                                        console.warn('Places API getDetails error for place_id:', place.place_id, detailStatus);
                                        resolveDetails(null);
                                        return;
                                    }
                                    resolveDetails(detailResult);
                                }
                            );
                        });
                        centers.push({
                            name: details?.name || place.name || 'Veterinary Clinic',
                            location: details?.vicinity || place.vicinity || 'Unknown address',
                            contact: details?.formatted_phone_number || details?.website || 'No contact available',
                            lat: (details?.geometry?.location?.lat() || place.geometry.location.lat()),
                            lng: (details?.geometry?.location?.lng() || place.geometry.location.lng()),
                            services: 'General care, surgery, vaccinations',
                            city: details?.plus_code?.compound_code || place.plus_code?.compound_code || userLocation.city,
                            place_id: place.place_id,
                            operating_hours: details?.opening_hours?.weekday_text || ['Operating hours not available']
                        });
                    }
                    if (centers.length) {
                        await supabaseClient.from('vet_centers').upsert(centers, {
                            onConflict: 'place_id',
                            ignoreDuplicates: false
                        }).then(() => {
                            console.log('Upserted vet centers in Supabase');
                        }).catch((error) => {
                            console.error('Error upserting vet centers:', error);
                        });
                    }
                    resolve(centers);
                }
            );
        });
    } catch (e) {
        console.error('Error fetching vet centers:', e);
        return [];
    }
}

async function fetchPetCareCenters(userLocation) {
    try {
        // Check Supabase cache first
        const { data: cachedCenters } = await supabaseClient
            .from('petcare_centers')
            .select('*')
            .gte('created_at', new Date(Date.now() - 24 * 60 * 60 * 1000).toISOString())
            .ilike('city', `%${userLocation.city}%`);
        if (cachedCenters?.length) {
            console.log('Using cached pet care centers:', cachedCenters);
            return cachedCenters;
        }

        return new Promise((resolve) => {
            const service = new google.maps.places.PlacesService(document.createElement('div'));
            service.nearbySearch(
                {
                    location: { lat: userLocation.lat, lng: userLocation.lng },
                    radius: 50000,
                    keyword: 'pet grooming|pet boarding|pet daycare'
                },
                async (results, status) => {
                    if (status !== google.maps.places.PlacesServiceStatus.OK) {
                        console.error('Places API nearbySearch error:', status);
                        resolve([]);
                        return;
                    }
                    const centers = [];
                    for (const place of results) {
                        const details = await new Promise((resolveDetails) => {
                            service.getDetails(
                                {
                                    placeId: place.place_id,
                                    fields: ['name', 'vicinity', 'formatted_phone_number', 'website', 'geometry.location', 'plus_code', 'opening_hours']
                                },
                                (detailResult, detailStatus) => {
                                    if (detailStatus !== google.maps.places.PlacesServiceStatus.OK) {
                                        console.warn('Places API getDetails error for place_id:', place.place_id, detailStatus);
                                        resolveDetails(null);
                                        return;
                                    }
                                    resolveDetails(detailResult);
                                }
                            );
                        });
                        centers.push({
                            name: details?.name || place.name || 'Pet Care Center',
                            location: details?.vicinity || place.vicinity || 'Unknown address',
                            contact: details?.formatted_phone_number || details?.website || 'No contact available',
                            lat: (details?.geometry?.location?.lat() || place.geometry.location.lat()),
                            lng: (details?.geometry?.location?.lng() || place.geometry.location.lng()),
                            services: 'Grooming, boarding, daycare',
                            city: details?.plus_code?.compound_code || place.plus_code?.compound_code || userLocation.city,
                            place_id: place.place_id,
                            operating_hours: details?.opening_hours?.weekday_text || ['Operating hours not available']
                        });
                    }
                    if (centers.length) {
                        await supabaseClient.from('petcare_centers').upsert(centers, {
                            onConflict: 'place_id',
                            ignoreDuplicates: false
                        }).then(() => {
                            console.log('Upserted pet care centers in Supabase');
                        }).catch((error) => {
                            console.error('Error upserting pet care centers:', error);
                        });
                    }
                    resolve(centers);
                }
            );
        });
    } catch (e) {
        console.error('Error fetching pet care centers:', e);
        return [];
    }
}

async function renderVetCenters(userLocation) {
    const vetCentersList = document.getElementById('vetCentersList');
    if (!vetCentersList) return;
    vetCentersList.innerHTML = '<div class="loading">Loading...</div>';
    const centers = await fetchVetCenters(userLocation);
    vetCentersList.innerHTML = '';
    if (centers.length === 0) {
        vetCentersList.innerHTML = '<p>No veterinary centers found near your location.</p>';
        return;
    }
    centers.forEach(center => {
        const centerCard = document.createElement('div');
        centerCard.classList.add('vet-center-card');
        centerCard.innerHTML = `
            <img src="images/placeholder.jpg" alt="${center.name}" onerror="this.src='https://via.placeholder.com/150';">
            <h3>${center.name}</h3>
            <p>${center.location}</p>
            <p>Contact: ${center.contact}</p>
            <p>Hours: ${center.operating_hours.join(', ')}</p>
        `;
        centerCard.onclick = () => showVetCenterModal(center);
        vetCentersList.appendChild(centerCard);
    });
}

function showVetCenterModal(center) {
    const modal = document.getElementById('vetCenterModal');
    if (!modal) return;
    document.getElementById('vetCenterModalTitle').textContent = center.name;
    document.getElementById('vetCenterModalLocation').textContent = center.location;
    document.getElementById('vetCenterModalContact').textContent = center.contact;
    document.getElementById('vetCenterModalServices').textContent = center.services;
    document.getElementById('vetCenterModalHours').textContent = center.operating_hours.join('; ');
    modal.style.display = 'block';
    const map = L.map('vetCenterModalMap').setView([center.lat, center.lng], 15);
    L.tileLayer('https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png', {
        attribution: '© <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors'
    }).addTo(map);
    L.marker([center.lat, center.lng]).addTo(map)
        .bindPopup(center.name)
        .openPopup();
}

async function renderPetCareCenters(userLocation) {
    const petCareCentersList = document.getElementById('petCareCentersList');
    if (!petCareCentersList) return;
    petCareCentersList.innerHTML = '<div class="loading">Loading...</div>';
    const centers = await fetchPetCareCenters(userLocation);
    petCareCentersList.innerHTML = '';
    if (centers.length === 0) {
        petCareCentersList.innerHTML = '<p>No pet care centers found near your location.</p>';
        return;
    }
    centers.forEach(center => {
        const centerCard = document.createElement('div');
        centerCard.classList.add('petcare-center-card');
        centerCard.innerHTML = `
            <img src="images/placeholder.jpg" alt="${center.name}" onerror="this.src='https://via.placeholder.com/150';">
            <h3>${center.name}</h3>
            <p>${center.location}</p>
            <p>Contact: ${center.contact}</p>
            <p>Hours: ${center.operating_hours.join(', ')}</p>
        `;
        centerCard.onclick = () => showPetCareCenterModal(center);
        petCareCentersList.appendChild(centerCard);
    });
}

function showPetCareCenterModal(center) {
    const modal = document.getElementById('petCareCenterModal');
    if (!modal) return;
    document.getElementById('petCareCenterModalTitle').textContent = center.name;
    document.getElementById('petCareCenterModalLocation').textContent = center.location;
    document.getElementById('petCareCenterModalContact').textContent = center.contact;
    document.getElementById('petCareCenterModalServices').textContent = center.services;
    document.getElementById('petCareCenterModalHours').textContent = center.operating_hours.join('; ');
    modal.style.display = 'block';
    const map = L.map('petCareCenterModalMap').setView([center.lat, center.lng], 15);
    L.tileLayer('https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png', {
        attribution: '© <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors'
    }).addTo(map);
    L.marker([center.lat, center.lng]).addTo(map)
        .bindPopup(center.name)
        .openPopup();
}

function hideVetCenterModal() {
    const modal = document.getElementById('vetCenterModal');
    if (modal) modal.style.display = 'none';
}

function hidePetCareCenterModal() {
    const modal = document.getElementById('petCareCenterModal');
    if (modal) modal.style.display = 'none';
}

async function addShelterPet() {
    console.log('addShelterPet called');
    const name = document.getElementById('petName').value;
    const breed = document.getElementById('petBreed').value;
    const age = document.getElementById('petAge').value;
    const description = document.getElementById('petDescription').value;
    const photoInput = document.getElementById('petPhoto');
    let photo = '';
    if (photoInput.files && photoInput.files[0]) {
        const file = photoInput.files[0];
        const fileName = `${user.username}/${file.name}`;
        console.log('Uploading pet photo to:', fileName);
        try {
            const { data, error } = await supabaseClient.storage.from('pet-photos').upload(fileName, file);
            if (error) throw error;
            photo = supabaseClient.storage.from('pet-photos').getPublicUrl(fileName).data.publicUrl;
        } catch (e) {
            console.error('Error uploading pet photo:', e);
            alert('Failed to upload pet photo: ' + e.message);
            return;
        }
    }
    if (!name || !breed || !age) {
        alert('Please fill in all required fields.');
        return;
    }
    const pet = { name, breed, age, description, photo, status: 'pending', user_id: user.username };
    await saveData('shelter_listings', pet);
    shelterListings.push(pet);
    renderPetListings();
    document.getElementById('addPetForm').reset();
    alert('Pet added successfully!');
}

async function editShelterPet(petId) {
    console.log('editShelterPet called, petId:', petId, 'type:', typeof petId);
    // Convert petId to integer for comparison
    const id = parseInt(petId, 10);
    if (isNaN(id)) {
        console.error('Invalid petId:', petId);
        alert('Invalid pet ID!');
        return;
    }
    const pet = shelterListings.find(pet => pet.id === id);
    if (!pet) {
        console.error('Pet not found for ID:', id);
        console.log('Available pet IDs:', shelterListings.map(p => ({ id: p.id, type: typeof p.id, name: p.name })));
        alert('Pet not found!');
        return;
    }
    console.log('Found pet:', pet);
    // Populate form
    document.getElementById('petName').value = pet.name || '';
    document.getElementById('petBreed').value = pet.breed || '';
    document.getElementById('petAge').value = pet.age || '';
    document.getElementById('petDescription').value = pet.description || '';
    document.getElementById('petHealth').value = pet.health || '';
    const sizeInput = document.querySelector(`input[name="petSize"][value="${pet.size}"]`);
    if (sizeInput) sizeInput.checked = true;
    const form = document.getElementById('addPetForm');
    if (!form) {
        console.error('addPetForm not found');
        alert('Error: Form not found');
        return;
    }
    const originalOnSubmit = form.onsubmit;
    form.onsubmit = async function(e) {
        e.preventDefault();
        console.log('Edit form submitted for petId:', id);
        const updatedPet = {
            name: document.getElementById('petName').value,
            breed: document.getElementById('petBreed').value,
            age: document.getElementById('petAge').value,
            description: document.getElementById('petDescription').value,
            size: document.querySelector('input[name="petSize"]:checked')?.value || pet.size,
            health: document.getElementById('petHealth').value || pet.health,
            user_id: user.username || 'anonymous'
        };
        const photoInput = document.getElementById('petPhoto');
        if (photoInput.files && photoInput.files[0]) {
            const file = photoInput.files[0];
            try {
                updatedPet.photo = await new Promise((resolve, reject) => {
                    const reader = new FileReader();
                    reader.onload = () => resolve(reader.result);
                    reader.onerror = reject;
                    reader.readAsDataURL(file);
                });
                console.log('New photo converted to base64:', updatedPet.photo.substring(0, 50) + '...');
            } catch (e) {
                console.error('Error converting photo to base64:', e);
                alert('Failed to process photo: ' + e.message);
                return;
            }
        } else {
            updatedPet.photo = pet.photo;
        }
        if (!updatedPet.name || !updatedPet.breed || !updatedPet.age) {
            alert('Please fill in all required fields.');
            return;
        }
        try {
            console.log('Updating pet in Supabase:', updatedPet);
            const { data, error } = await supabaseClient
                .from('shelter_listings')
                .update(updatedPet)
                .eq('id', id)
                .select();
            if (error) {
                console.error('Supabase update error:', error);
                throw new Error(`Failed to update pet: ${error.message} (Code: ${error.code})`);
            }
            console.log('Updated pet data:', data);
            const index = shelterListings.findIndex(p => p.id === id);
            if (index !== -1) {
                shelterListings[index] = { ...data[0], id };
            } else {
                console.warn('Pet not found in shelterListings:', id);
            }
            renderPetListings();
            form.reset();
            form.onsubmit = originalOnSubmit;
            alert('Pet updated successfully!');
        } catch (e) {
            console.error('Error updating pet:', e);
            alert('Failed to update pet: ' + e.message);
        }
    };
}

async function deleteShelterPet(petId) {
    if (!confirm('Are you sure you want to delete this pet listing?')) {
        return;
    }
    try {
        if (!petId) {
            throw new Error('Invalid pet ID');
        }
        // Delete from Supabase
        const { error } = await supabaseClient.from('shelter_listings').delete().eq('id', petId);
        if (error) {
            console.error('Supabase delete error:', error);
            throw new Error(`Failed to delete pet: ${error.message} (Code: ${error.code})`);
        }
        // Remove from local shelterListings
        const index = shelterListings.findIndex(pet => pet.id === petId);
        if (index === -1) {
            console.warn('Pet not found in shelterListings:', petId);
        } else {
            shelterListings.splice(index, 1);
        }
        renderPetListings();
        alert('Pet deleted successfully!');
    } catch (e) {
        console.error('Error deleting pet:', e);
        alert('Failed to delete pet: ' + e.message);
    }
}

async function renderPetListings() {
    const listings = document.getElementById('petListings');
    if (!listings) return;
    listings.innerHTML = '<div class="loading"></div>';
    setTimeout(() => {
        listings.innerHTML = '';
        const userListings = shelterListings.filter(pet => pet.user_id === user.username);
        if (userListings.length === 0) {
            listings.innerHTML = '<p>No pet listings available.</p>';
            return;
        }
        userListings.forEach((pet) => {
            const petCard = document.createElement('div');
            petCard.classList.add('pet-listing-card');
            petCard.innerHTML = `
                <div class="pet-photo" style="background-image: url('${pet.photo || 'images/placeholder.jpg'}')"></div>
                <h4>${pet.name}</h4>
                <p>Breed: ${pet.breed}</p>
                <p>Age: ${pet.age}</p>
                <p>${pet.description}</p>
                <p>Status: ${pet.status}</p>
                <div class="pet-actions">
                    <button class="edit-button" onclick="editShelterPet('${pet.id}')">Edit</button>
                    <button class="delete-button" onclick="deleteShelterPet('${pet.id}')">Delete</button>
                </div>
            `;
            listings.appendChild(petCard);
        });
    }, 0);
}

async function renderAdoptionRequests() {
    const requests = document.getElementById('adoptionRequests');
    if (!requests) {
        console.error('adoptionRequests div not found');
        return;
    }
    requests.innerHTML = '<div class="loading">Loading...</div>';
    setTimeout(() => {
        requests.innerHTML = '';
        if (!user) {
            requests.innerHTML = '<p>Please log in to view adoption requests.</p>';
            console.log('No user logged in');
            return;
        }
        const userRequests = adoptionRequests.filter(req => {
            const pet = shelterListings.find(p => p.id === req.pet_id && p.user_id === user.username);
            console.log(`Checking request: pet_id=${req.pet_id}, user_id=${req.user_id}, pet:`, pet);
            return !!pet;
        });
        console.log('userRequests after filter:', userRequests);
        if (userRequests.length === 0) {
            requests.innerHTML = '<p>No adoption requests available.</p>';
            console.log('No matching adoption requests found');
            return;
        }
        userRequests.forEach(req => {
            const pet = shelterListings.find(p => p.id === req.pet_id);
            console.log('Rendering request for pet:', pet);
            const requestCard = document.createElement('div');
            requestCard.classList.add('request-card');
            requestCard.innerHTML = `
                <p>Pet: ${pet?.name || 'Unknown'}</p>
                <p>User: ${req.user_id}</p>
                <p>Reason: ${req.reason}</p>
                <p>Status: ${req.status}</p>
                ${req.status === 'pending' ? `
                    <button class="approve-button" onclick="updateAdoptionStatus(${req.pet_id}, '${req.user_id}', 'approved')">Approve</button>
                    <button class="reject-button" onclick="updateAdoptionStatus(${req.pet_id}, '${req.user_id}', 'rejected')">Reject</button>
                ` : ''}
            `;
            requests.appendChild(requestCard);
        });
    }, 0);
}

async function updateAdoptionStatus(petId, userId, status) {
    const request = adoptionRequests.find(req => req.pet_id === petId && req.user_id === userId);
    if (request) {
        await supabaseClient.from('adoption_requests').update({ status }).eq('pet_id', petId).eq('user_id', userId);
        if (status === 'approved') {
            await supabaseClient.from('shelter_listings').update({ status: 'adopted' }).eq('id', petId);
            const pet = shelterListings.find(p => p.id === petId);
            if (pet) {
                pet.status = 'adopted';
            } else {
                console.warn('Pet not found in shelterListings:', petId);
            }
        }
        request.status = status;
        renderAdoptionRequests();
        alert(`Adoption request ${status}!`);
    }
}
async function scheduleLiveInteraction() {
    const petName = document.getElementById('livePetName').value;
    const time = document.getElementById('liveTime').value;
    if (!petName || !time) {
        alert('Please provide pet name and time.');
        return;
    }
    const liveSchedule = document.getElementById('liveSchedule');
    const interaction = document.createElement('p');
    interaction.textContent = `${petName} - ${new Date(time).toLocaleString()}`;
    liveSchedule.appendChild(interaction);
    document.getElementById('livePetName').value = '';
    document.getElementById('liveTime').value = '';
    alert('Live interaction scheduled!');
}

async function renderShelterDashboard() {
    if (!user) {
        window.location.href = 'index.html';
        return;
    }
    await renderPetListings();
    await renderAdoptionRequests();
}

async function submitAdoptionRequest() {
    const petId = document.getElementById('adoptionPetId').value;
    const reason = document.getElementById('adoptionReason').value;
    if (!petId || !reason) {
        alert('Please select a pet and provide a reason.');
        return;
    }
    const pet = shelterListings.find(p => p.id === parseInt(petId));
    if (!pet) {
        alert('Selected pet not found.');
        return;
    }
    if (pet.status !== 'pending') {
        alert('This pet is not available for adoption.');
        return;
    }
    const existingRequest = adoptionRequests.find(req => req.pet_id === parseInt(petId) && req.user_id === user.username);
    if (existingRequest) {
        alert('You have already submitted a request for this pet.');
        return;
    }
    const request = { pet_id: parseInt(petId), user_id: user.username, reason, status: 'pending' };
    await saveData('adoption_requests', request);
    adoptionRequests.push(request);
    renderUserAdoptionRequests();
    document.getElementById('adoptionForm').reset();
    alert('Adoption request submitted!');
}

async function renderUserAdoptionRequests() {
    const userRequests = document.getElementById('userAdoptionRequests');
    if (!userRequests) return;
    userRequests.innerHTML = '<div class="loading"></div>';
    setTimeout(() => {
        userRequests.innerHTML = '';
        const requests = adoptionRequests.filter(req => req.user_id === user.username);
        if (requests.length === 0) {
            userRequests.innerHTML = '<p>No adoption requests submitted.</p>';
            return;
        }
        requests.forEach(req => {
            const pet = shelterListings.find(p => p.id === req.pet_id);
            const requestCard = document.createElement('div');
            requestCard.classList.add('request-card');
            requestCard.innerHTML = `
                <p>Pet: ${pet?.name || 'Unknown'}</p>
                <p>Reason: ${req.reason}</p>
                <p>Status: ${req.status}</p>
            `;
            userRequests.appendChild(requestCard);
        });
    }, 0);
}

async function renderAdoptionPage() {
    console.log('renderAdoptionPage called, user:', user);
    console.log('shelterListings:', shelterListings);
    const adoptionContent = document.getElementById('adoptionContent');
    const adoptionLoginPrompt = document.getElementById('adoptionLoginPrompt');
    const availablePets = document.getElementById('availablePets');
    const petSelect = document.getElementById('adoptionPetId');
    const adoptionForm = document.getElementById('adoptionForm');

    if (!adoptionContent || !adoptionLoginPrompt || !availablePets || !petSelect || !adoptionForm) {
        console.error('Adoption page elements missing:', { adoptionContent, adoptionLoginPrompt, availablePets, petSelect, adoptionForm });
        alert('Error: Required page elements are missing.');
        return;
    }

    if (!user) {
        console.log('No user logged in, showing login prompt');
        adoptionContent.style.display = 'none';
        adoptionLoginPrompt.style.display = 'block';
        availablePets.innerHTML = '<p>Please log in to view available pets.</p>';
        return;
    }

    adoptionContent.style.display = 'block';
    adoptionLoginPrompt.style.display = 'none';

    // Populate pet selection dropdown with only pending pets
    petSelect.innerHTML = '<option value="" disabled selected>Select a pet...</option>';
    const adoptablePets = shelterListings.filter(pet => pet.status === 'pending');
    console.log('adoptablePets (filtered):', adoptablePets);
    adoptablePets.forEach((pet) => {
        const option = document.createElement('option');
        option.value = pet.id;
        option.textContent = `${pet.name} (${pet.breed}, ${pet.age})`;
        petSelect.appendChild(option);
    });

    // Render available pets (only pending)
    availablePets.innerHTML = '<div class="loading">Loading pets...</div>';
    setTimeout(() => {
        availablePets.innerHTML = '';
        if (adoptablePets.length === 0) {
            availablePets.innerHTML = '<p>No pets available for adoption.</p>';
            console.log('No pending pets in shelterListings');
            return;
        }
        adoptablePets.forEach((pet) => {
            console.log('Rendering pet:', pet);
            const petCard = document.createElement('div');
            petCard.classList.add('pet-listing-card');
            petCard.innerHTML = `
                <div class="pet-photo" style="background-image: url('${pet.photo || 'images/placeholder.jpg'}')"></div>
                <h4>${pet.name || 'Unnamed'}</h4>
                <p>Breed: ${pet.breed || 'Unknown'}</p>
                <p>Age: ${pet.age || 'Unknown'}</p>
                <p>${pet.description || 'No description'}</p>
            `;
            availablePets.appendChild(petCard);
        });
    }, 0);

    // Ensure form submission handler
    adoptionForm.onsubmit = function (e) {
        e.preventDefault();
        submitAdoptionRequest();
    };

    await renderUserAdoptionRequests();
}

async function submitPost() {
    console.log('submitPost called, user:', user);
    if (!user) {
        alert('Please log in to post.');
        showLoginModal();
        return;
    }
    console.log('Submitting post with username:', user.username);
    const title = document.getElementById('postTitle').value;
    const content = document.getElementById('postContent').value;
    const mediaInput = document.getElementById('postMedia');
    let media = '';
    if (!title || !content) {
        alert('Please provide a title and content.');
        return;
    }
    if (mediaInput.files && mediaInput.files[0]) {
        const file = mediaInput.files[0];
        const fileName = `${user.username}/post_${Date.now()}_${file.name}`;
        console.log('Uploading post media to:', fileName);
        try {
            const { data, error } = await supabaseClient.storage
                .from('post-media')
                .upload(fileName, file);
            if (error) {
                console.error('Error uploading post media:', error);
                alert('Failed to upload media: ' + error.message);
                return;
            }
            media = supabaseClient.storage.from('post-media').getPublicUrl(fileName).data.publicUrl;
            console.log('Uploaded media URL:', media);
        } catch (e) {
            console.error('Upload exception:', e);
            alert('Failed to upload media.');
            return;
        }
    }
    const post = { title, content, author: user.username, media, likes: 0, liked_by: [], comments: [] };
    try {
        await saveData('community_posts', post);
        communityPosts.push(post);
        await renderCommunityPosts();
        const postForm = document.getElementById('postForm');
        if (postForm) postForm.reset();
        alert('Post submitted successfully!');
    } catch (e) {
        console.error('Error submitting post:', e);
        alert('Failed to submit post: ' + e.message);
    }
}

async function likePost(postId) {
    if (!user) {
        alert('Please log in to like posts.');
        showLoginModal();
        return;
    }
    const post = communityPosts[postId];
    let likedBy = post.liked_by || [];
    if (likedBy.includes(user.username)) {
        likedBy = likedBy.filter(u => u !== user.username);
        post.likes--;
    } else {
        likedBy.push(user.username);
        post.likes++;
    }
    try {
        await supabaseClient.from('community_posts').update({ likes: post.likes, liked_by: likedBy }).eq('id', post.id);
        post.liked_by = likedBy;
        renderCommunityPosts();
    } catch (e) {
        console.error('Error liking post:', e);
        alert('Failed to like post.');
    }
}

async function addComment(postId, parentId = null) {
    if (!user) {
        alert('Please log in to comment.');
        showLoginModal();
        return;
    }
    console.log('Adding comment with username:', user.username);
    const commentInput = document.getElementById(parentId ? `replyInput${parentId}` : `commentInput${postId}`);
    const mediaInput = document.getElementById(parentId ? `replyMedia${parentId}` : `commentMedia${postId}`);
    const content = commentInput.value;
    let media = '';
    if (!content) {
        alert('Please enter a comment.');
        return;
    }
    if (mediaInput.files && mediaInput.files[0]) {
        const file = mediaInput.files[0];
        const fileName = `${user.username}/comment_${Date.now()}_${file.name}`;
        console.log('Uploading comment media to:', fileName);
        try {
            const { data, error } = await supabaseClient.storage
                .from('post-media')
                .upload(fileName, file);
            if (error) {
                console.error('Error uploading comment media:', error);
                alert('Failed to upload media: ' + error.message);
                return;
            }
            media = supabaseClient.storage.from('post-media').getPublicUrl(fileName).data.publicUrl;
            console.log('Uploaded comment media URL:', media);
        } catch (e) {
            console.error('Upload exception:', e);
            alert('Failed to upload media.');
            return;
        }
    }
    const comment = {
        id: `${Date.now()}_${Math.random().toString(36).substr(2, 9)}`,
        author: user.username,
        content,
        media,
        parent_id: parentId,
        created_at: new Date().toISOString()
    };
    const post = communityPosts[postId];
    post.comments.push(comment);
    try {
        await supabaseClient.from('community_posts').update({ comments: post.comments }).eq('id', post.id);
        renderCommunityPosts();
        commentInput.value = '';
        mediaInput.value = '';
    } catch (e) {
        console.error('Error adding comment:', e);
        alert('Failed to add comment.');
    }
}

async function renderCommunityPosts() {
    console.log('renderCommunityPosts called, user:', user);
    const communityContent = document.getElementById('communityContent');
    const communityLoginPrompt = document.getElementById('communityLoginPrompt');
    const communityPostsDiv = document.getElementById('communityPosts');
    console.log('Community DOM elements:', { communityContent, communityLoginPrompt, communityPostsDiv });

    if (!communityPostsDiv) {
        console.error('communityPosts div not found');
        return;
    }

    if (!communityContent || !communityLoginPrompt) {
        console.error('Community content or login prompt not found:', { communityContent, communityLoginPrompt });
        communityPostsDiv.innerHTML = '<p>Error: Page elements missing.</p>';
        return;
    }

    if (!user) {
        console.log('No user, showing login prompt');
        communityContent.style.display = 'none';
        communityLoginPrompt.style.display = 'block';
        communityPostsDiv.innerHTML = '<p>Please log in to view posts.</p>';
        return;
    }

    console.log('User found, rendering community content');
    communityContent.style.display = 'block';
    communityLoginPrompt.style.display = 'none';
    communityPostsDiv.innerHTML = '<div class="loading"></div>';

    try {
        const { data: posts, error } = await supabaseClient.from('community_posts').select('*');
        if (error) throw error;
        communityPosts = posts || [];
        console.log('Fetched community posts:', communityPosts);

        communityPostsDiv.innerHTML = '';
        if (communityPosts.length === 0) {
            communityPostsDiv.innerHTML = '<p>No posts available.</p>';
            return;
        }

        function renderComments(comments, parentId = null, depth = 0, postIndex) {
            return comments
                .filter(c => c.parent_id === parentId)
                .map(c => `
                    <div class="comment" style="margin-left: ${depth * 20}px;">
                        <p><span>${c.author}</span>: ${c.content}</p>
                        ${c.media ? `<img src="${c.media}" alt="Comment media" style="max-width: 200px; margin-top: 5px;">` : ''}
                        <p class="comment-meta">Posted on ${new Date(c.created_at).toLocaleString()}</p>
                        ${user ? `
                            <button onclick="toggleReplyForm('${c.id}')">Reply</button>
                            <div id="replyForm${c.id}" style="display: none; margin-top: 10px;">
                                <input type="text" id="replyInput${c.id}" placeholder="Reply to ${c.author}...">
                                <input type="file" id="replyMedia${c.id}" accept="image/*">
                                <button onclick="addComment(${postIndex}, '${c.id}')">Submit Reply</button>
                            </div>
                        ` : ''}
                        ${renderComments(comments, c.id, depth + 1, postIndex)}
                    </div>
                `).join('');
        }

        communityPosts.forEach((post, index) => {
            const postCard = document.createElement('div');
            postCard.classList.add('post-card');
            postCard.innerHTML = `
                <h3>${post.title}</h3>
                <p>${post.content}</p>
                ${post.media ? `<img src="${post.media}" alt="Post media" style="max-width: 300px; margin-top: 10px;">` : ''}
                <span class="post-author">Posted by ${post.author}</span>
                <div class="post-interactions">
                    <button class="like-button ${post.liked_by?.includes(user?.username) ? 'liked' : ''}" onclick="likePost(${index})">
                        🩷 ${post.likes}
                    </button>
                </div>
                <div class="comment-section">
                    <h4>Comments</h4>
                    <div class="comment-list">
                        ${renderComments(post.comments || [], null, 0, index)}
                    </div>
                    ${user ? `
                        <div class="comment-input">
                            <input type="text" id="commentInput${index}" placeholder="Add a comment...">
                            <input type="file" id="commentMedia${index}" accept="image/*">
                            <button onclick="addComment(${index})">Comment</button>
                        </div>
                    ` : ''}
                </div>
            `;
            communityPostsDiv.appendChild(postCard);
        });
    } catch (e) {
        console.error('Error fetching community posts:', e);
        communityPostsDiv.innerHTML = '<p>Error loading posts.</p>';
    }
}

function toggleReplyForm(commentId) {
    const replyForm = document.getElementById(`replyForm${commentId}`);
    if (replyForm) {
        replyForm.style.display = replyForm.style.display === 'none' ? 'block' : 'none';
    }
}

function showDonationModal(type) {
    const modal = document.getElementById('donationModal');
    const modalType = document.getElementById('donationModalType');
    const modalTypeInput = document.getElementById('modalDonationTypeInput');
    if (!modal || !modalType || !modalTypeInput) {
        console.error('Donation modal elements not found');
        alert('Error: Donation modal not found.');
        return;
    }
    modalType.textContent = type.charAt(0).toUpperCase() + type.slice(1);
    modalTypeInput.value = type;
    document.getElementById('modalDonationAmount').value = '';
    modal.style.display = 'block';
}

function hideDonationModal() {
    const modal = document.getElementById('donationModal');
    if (modal) {
        modal.style.display = 'none';
    }
}

async function submitModalDonation() {
    const amount = parseFloat(document.getElementById('modalDonationAmount').value);
    const type = document.getElementById('modalDonationTypeInput').value;
    if (!amount || amount <= 0 || isNaN(amount)) {
        alert('Please enter a valid donation amount.');
        return;
    }
    if (!type) {
        alert('Donation type not selected.');
        return;
    }
    const donation = {
        amount,
        type,
        user_id: user?.username || 'Anonymous',
        date: new Date().toLocaleString('en-MY', { timeZone: 'Asia/Kuala_Lumpur' })
    };
    try {
        await saveData('donations', donation);
        donations[type] = (donations[type] || 0) + amount;
        donationHistory.push(donation);
        if (document.getElementById('donationForm')) {
            await renderDonationProgress();
            await renderDonationHistory();
        }
        hideDonationModal();
        alert('Thank you for your donation!');
    } catch (e) {
        console.error('Error submitting donation:', e);
        alert('Failed to process donation: ' + e.message);
    }
}

async function donate() {
    const amount = parseFloat(document.getElementById('donationAmount').value);
    const type = document.querySelector('.donation-buttons.type-options button.active')?.dataset.type;
    if (!amount || amount <= 0 || isNaN(amount)) {
        alert('Please enter a valid donation amount.');
        return;
    }
    if (!type) {
        alert('Please select a donation type.');
        return;
    }
    const donation = {
        amount,
        type,
        user_id: user?.username || 'Anonymous',
        date: new Date().toLocaleString('en-MY', { timeZone: 'Asia/Kuala_Lumpur' })
    };
    try {
        await saveData('donations', donation);
        donations[type] = (donations[type] || 0) + amount;
        donationHistory.push(donation);
        if (document.getElementById('donationForm')) {
            await renderDonationProgress();
            await renderDonationHistory();
        }
        document.getElementById('donationAmount').value = '';
        document.querySelectorAll('.donation-buttons.type-options button').forEach(btn => btn.classList.remove('active'));
        alert('Thank you for your donation!');
    } catch (e) {
        console.error('Error submitting donation:', e);
        alert('Failed to process donation: ' + e.message);
    }
}

async function renderDonationProgress() {
    const medicalProgress = document.getElementById('medicalProgress');
    const renovationProgress = document.getElementById('renovationProgress');
    const medicalRaised = document.getElementById('medicalRaised');
    const renovationRaised = document.getElementById('renovationRaised');
    const medicalGoalElement = document.getElementById('medicalGoal');
    const renovationGoalElement = document.getElementById('renovationGoal');

    // Only proceed if all required elements exist
    if (!medicalProgress || !renovationProgress || !medicalRaised || !renovationRaised || !medicalGoalElement || !renovationGoalElement) {
        console.log('Donation progress elements not found, skipping renderDonationProgress');
        return;
    }

    const medicalGoal = parseFloat(medicalGoalElement.textContent);
    const renovationGoal = parseFloat(renovationGoalElement.textContent);

    if (medicalProgress && medicalRaised && !isNaN(medicalGoal)) {
        const percentage = Math.min((donations.medical / medicalGoal) * 100, 100);
        medicalProgress.style.width = `${percentage}%`;
        medicalRaised.textContent = donations.medical.toFixed(2);
    }
    if (renovationProgress && renovationRaised && !isNaN(renovationGoal)) {
        const percentage = Math.min((donations.renovation / renovationGoal) * 100, 100);
        renovationProgress.style.width = `${percentage}%`;
        renovationRaised.textContent = donations.renovation.toFixed(2);
    }
}

async function renderDonationHistory() {
    const donationTracking = document.getElementById('donationTracking');
    if (!donationTracking) {
        console.log('donationTracking element not found, skipping renderDonationHistory');
        return;
    }
    donationTracking.innerHTML = '<h3>Donation History</h3><div class="loading">Loading...</div>';
    try {
        const { data: history, error } = await supabaseClient.from('donations').select('*').order('created_at', { ascending: false });
        if (error) throw error;
        donationHistory = history || [];
        const historyContainer = donationTracking.querySelector('div') || donationTracking;
        historyContainer.innerHTML = '';
        if (donationHistory.length === 0) {
            historyContainer.innerHTML = '<p>No donations yet.</p>';
            return;
        }
        donationHistory.forEach(donation => {
            const donationItem = document.createElement('p');
            donationItem.textContent = `${donation.user_id || 'Anonymous'} donated RM${donation.amount.toFixed(2)} to ${donation.type.charAt(0).toUpperCase() + donation.type.slice(1)} on ${donation.date}`;
            historyContainer.appendChild(donationItem);
        });
    } catch (e) {
        console.error('Error rendering donation history:', e);
        donationTracking.innerHTML = '<h3>Donation History</h3><p>Error loading donation history.</p>';
    }
}

async function toggleFavorite(petId) {
    if (!user) {
        alert('Please log in to add favorites.');
        return;
    }
    const button = document.querySelector(`#pet-${petId} .favorite-button`);
    if (favorites.includes(petId)) {
        await supabaseClient.from('favorites').delete().eq('pet_id', petId).eq('user_id', user.username);
        favorites = favorites.filter(id => id !== petId);
        button.classList.remove('favorited');
    } else {
        await saveData('favorites', { pet_id: petId, user_id: user.username });
        favorites.push(petId);
        button.classList.add('favorited');
    }
}

async function updateAvatar() {
    const avatarUpload = document.getElementById('avatarUpload');
    if (avatarUpload.files && avatarUpload.files[0]) {
        const file = avatarUpload.files[0];
        const fileName = `${user.username}/${file.name}`;
        console.log('Uploading avatar to:', fileName);
        try {
            const { data, error } = await supabaseClient.storage
                .from('avatars')
                .upload(fileName, file, { upsert: true });
            if (error) throw error;
            const avatarUrl = supabaseClient.storage.from('avatars').getPublicUrl(fileName).data.publicUrl;
            document.getElementById('avatarImage').style.backgroundImage = `url(${avatarUrl})`;
            alert('Avatar updated successfully!');
        } catch (e) {
            console.error('Error uploading avatar:', e);
            alert('Failed to upload avatar: ' + e.message);
        }
    }
}

function showEditProfileModal() {
    const modal = document.getElementById('editProfileModal');
    if (!modal) return;
    document.getElementById('editUsername').value = user.username;
    document.getElementById('editUserType').value = 'User';
    modal.style.display = 'block';
}

function hideEditProfileModal() {
    const modal = document.getElementById('editProfileModal');
    if (!modal) return;
    modal.style.display = 'none';
}

async function saveProfile() {
    const newUsername = document.getElementById('editUsername').value.trim();
    const newPassword = document.getElementById('editPassword').value;
    if (!newUsername) {
        alert('Username cannot be empty.');
        return;
    }
    try {
        const updates = { username: newUsername };
        if (newPassword) updates.password = newPassword;
        await supabaseClient.from('users').update(updates).eq('username', user.username);
        user.username = newUsername;
        localStorage.setItem('user', JSON.stringify(user));
        alert('Profile updated successfully!');
        hideEditProfileModal();
        await renderProfile();
    } catch (e) {
        console.error('Error updating profile:', e);
        alert('Failed to update profile.');
    }
}

function showAddPetModal() {
    const modal = document.getElementById('addPetModal');
    if (!modal) return;
    document.getElementById('petIndex').value = '-1';
    document.getElementById('petName').value = '';
    document.getElementById('petBreed').value = '';
    document.getElementById('petAge').value = '';
    document.getElementById('petDescription').value = '';
    modal.style.display = 'block';
}

function hideAddPetModal() {
    const modal = document.getElementById('addPetModal');
    if (!modal) return;
    modal.style.display = 'none';
}

async function savePet() {
    const petIndex = document.getElementById('petIndex').value;
    const name = document.getElementById('petName').value;
    const breed = document.getElementById('petBreed').value;
    const age = document.getElementById('petAge').value;
    const description = document.getElementById('petDescription').value;
    const pictureInput = document.getElementById('petPicture');
    let picture = '';
    if (!name || !breed || !age) {
        alert('Please fill in all required fields.');
        return;
    }
    if (pictureInput.files && pictureInput.files[0]) {
        const file = pictureInput.files[0];
        const fileName = `${user.username}/${file.name}`;
        console.log('Uploading pet picture to:', fileName);
        try {
            const { data, error } = await supabaseClient.storage
                .from('pet-photos')
                .upload(fileName, file, { upsert: true });
            if (error) throw error;
            picture = supabaseClient.storage.from('pet-photos').getPublicUrl(fileName).data.publicUrl;
        } catch (e) {
            console.error('Error uploading pet picture:', e);
            alert('Failed to upload pet picture: ' + e.message);
            return;
        }
    }
    const pet = { name, breed, age, description, picture, user_id: user.username };
    try {
        if (petIndex === '-1') {
            await saveData('pets', pet);
        } else {
            await supabaseClient.from('pets').update(pet).eq('id', petIndex);
        }
        alert('Pet saved successfully!');
        hideAddPetModal();
        await renderProfile();
    } catch (e) {
        console.error('Error saving pet:', e);
        alert('Failed to save pet.');
    }
}

async function renderProfile() {
    console.log('renderProfile called, user:', user);
    const profileContent = document.getElementById('profileContent');
    const profileLoginPrompt = document.getElementById('profileLoginPrompt');
    if (!profileContent || !profileLoginPrompt) {
        console.error('Profile page elements not found:', { profileContent, profileLoginPrompt });
        return;
    }
    if (!user) {
        console.log('No user, showing login prompt');
        profileContent.style.display = 'none';
        profileLoginPrompt.style.display = 'block';
        return;
    }
    console.log('User found, rendering profile');
    profileContent.style.display = 'block';
    profileLoginPrompt.style.display = 'none';

    const profileDetails = document.getElementById('profileDetails');
    const profileUsername = document.getElementById('profileUsername');
    const profileUserType = document.getElementById('profileUserType');
    const userPets = document.getElementById('userPets');
    const userPosts = document.getElementById('userPosts');
    const userAppointments = document.getElementById('userAppointments');
    const userFavorites = document.getElementById('userFavorites');

    if (profileUsername) profileUsername.textContent = user.username;
    if (profileUserType) profileUserType.textContent = 'User';
    if (profileDetails) {
        profileDetails.innerHTML = `
            <h3>${user.username}</h3>
        `;
    }
    if (userPets) {
        userPets.innerHTML = '<div class="loading"></div>';
        try {
            const { data: pets } = await supabaseClient.from('pets').select('*').eq('user_id', user.username);
            userPets.innerHTML = '';
            if (!pets || pets.length === 0) {
                userPets.innerHTML = '<p>No pets added.</p>';
            } else {
                pets.forEach(pet => {
                    const petCard = document.createElement('div');
                    petCard.classList.add('pet-card');
                    petCard.innerHTML = `
                        <img src="${pet.picture || 'images/placeholder.jpg'}" alt="${pet.name}">
                        <h4>${pet.name}</h4>
                        <p>Breed: ${pet.breed}</p>
                        <p>Age: ${pet.age}</p>
                        <p>${pet.description}</p>
                    `;
                    userPets.appendChild(petCard);
                });
            }
        } catch (e) {
            console.error('Error fetching pets:', e);
            userPets.innerHTML = '<p>Error loading pets.</p>';
        }
    }
    if (userPosts) {
        userPosts.innerHTML = '';
        const userCommunityPosts = communityPosts.filter(post => post.author === user.username);
        if (userCommunityPosts.length === 0) {
            userPosts.innerHTML = '<p>No posts created.</p>';
        } else {
            userCommunityPosts.forEach(post => {
                const postCard = document.createElement('div');
                postCard.classList.add('post-card');
                postCard.innerHTML = `
                    <h4>${post.title}</h4>
                    <p>${post.content}</p>
                `;
                userPosts.appendChild(postCard);
            });
        }
    }
    if (userAppointments) {
        userAppointments.innerHTML = '<p>No appointments scheduled.</p>';
    }
    if (userFavorites) {
        userFavorites.innerHTML = '<div class="loading"></div>';
        try {
            const { data: favs } = await supabaseClient.from('favorites').select('*, shelter_listings(*)').eq('user_id', user.username);
            userFavorites.innerHTML = '';
            if (!favs || favs.length === 0) {
                userFavorites.innerHTML = '<p>No favorite pets.</p>';
            } else {
                favs.forEach(fav => {
                    const pet = fav.shelter_listings;
                    const favCard = document.createElement('div');
                    favCard.classList.add('pet-card');
                    favCard.innerHTML = `
                        <img src="${pet.photo || 'images/placeholder-pet.jpg'}" alt="${pet.name}">
                        <h4>${pet.name}</h4>
                        <p>Breed: ${pet.breed}</p>
                        <p>Age: ${pet.age}</p>
                    `;
                    userFavorites.appendChild(favCard);
                });
            }
        } catch (e) {
            console.error('Error fetching favorites:', e);
            userFavorites.innerHTML = '<p>Error loading favorites.</p>';
        }
    }
    await renderUserAdoptionRequests();
}

let slideIndex = 0;
function changeSlide(n) {
    slideIndex += n;
    showSlides();
}

function currentSlide(n) {
    slideIndex = n;
    showSlides();
}

function showSlides() {
    const slides = document.querySelectorAll('.banner-slide');
    const dots = document.querySelectorAll('.dot');
    if (slideIndex >= slides.length) slideIndex = 0;
    if (slideIndex < 0) slideIndex = slides.length - 1;
    slides.forEach((slide, i) => {
        slide.style.display = i === slideIndex ? 'flex' : 'none';
        dots[i].classList.toggle('active', i === slideIndex);
    });
}

// Tutorial Section Functions
function toggleCarePlan(id) {
    const element = document.getElementById(id);
    if (element.style.display === 'none') {
        element.style.display = 'block';
    } else {
        element.style.display = 'none';
    }
}

function filterTutorials() {
    const searchInput = document.getElementById('tutorialSearch').value.toLowerCase();
    const filterSelect = document.getElementById('tutorialFilter').value;
    const cards = document.querySelectorAll('.tutorial-card');

    cards.forEach(card => {
        const petType = card.getAttribute('data-pet');
        const title = card.querySelector('h3').textContent.toLowerCase();
        const description = card.querySelector('p').textContent.toLowerCase();

        const matchesSearch = title.includes(searchInput) || description.includes(searchInput);
        const matchesFilter = filterSelect === 'all' || petType === filterSelect;

        if (matchesSearch && matchesFilter) {
            card.style.display = 'block';
        } else {
            card.style.display = 'none';
        }
    });
}

document.addEventListener('DOMContentLoaded', async () => {
    console.log('DOMContentLoaded fired');
    console.log('supabase available:', typeof supabase !== 'undefined');

    const modal = document.getElementById('loginModal');
    const usernameInput = document.getElementById('username');
    const passwordInput = document.getElementById('password');
    console.log('Initial DOM elements:', { modal, usernameInput, passwordInput });

    const slides = document.querySelectorAll('.banner-slide');
    if (slides.length > 0) {
        slides.forEach(slide => slide.style.display = 'none');
        showSlides();
    }

    await loadData();
    console.log('Post-loadData user:', user);
    updateNav();

    const donationButtons = document.querySelectorAll('.donation-buttons button');
    donationButtons.forEach(button => {
        button.addEventListener('click', () => {
            donationButtons.forEach(btn => btn.classList.remove('active'));
            button.classList.add('active');
        });
    });

    // Tutorial Search and Filter
    const tutorialSearch = document.getElementById('tutorialSearch');
    const tutorialFilter = document.getElementById('tutorialFilter');
    if (tutorialSearch && tutorialFilter) {
        tutorialSearch.addEventListener('input', filterTutorials);
        tutorialFilter.addEventListener('change', filterTutorials);
    }

    // Donation Page Setup
    const donationForm = document.getElementById('donationForm');
    if (donationForm && document.querySelector('.donation-section')) {
        console.log('Donation page detected, initializing donation functionality');
        // Handle donation amount buttons
        const amountButtons = document.querySelectorAll('.donation-buttons.amount-options button');
        amountButtons.forEach(button => {
            button.addEventListener('click', () => {
                const donationAmount = document.getElementById('donationAmount');
                if (donationAmount) {
                    donationAmount.value = button.dataset.amount;
                }
            });
        });

        // Handle donation type buttons
        const typeButtons = document.querySelectorAll('.donation-buttons.type-options button');
        typeButtons.forEach(button => {
            button.addEventListener('click', () => {
                typeButtons.forEach(btn => btn.classList.remove('active'));
                button.classList.add('active');
            });
        });

        // Handle "Donate Now" buttons
        const donateNowButtons = document.querySelectorAll('.donate-now');
        donateNowButtons.forEach(button => {
            button.addEventListener('click', () => {
                const type = button.dataset.type;
                showDonationModal(type);
            });
        });

        await renderDonationProgress();
        await renderDonationHistory();
    } else {
        console.log('Not on donation page, skipping donation initialization');
    }

    if (document.getElementById('communityContent') || document.getElementById('postForm')) {
        console.log('Community page detected, calling renderCommunityPosts');
        await renderCommunityPosts();
    }
    if (document.getElementById('addPetForm')) {
        await renderShelterDashboard();
    }
    if (document.getElementById('adoptionForm')) {
        console.log('Adoption page detected, calling renderAdoptionPage');
        await renderAdoptionPage();
    }
    if (document.getElementById('donationForm')) {
        renderDonationProgress();
        await renderDonationHistory();
    }
    if (document.getElementById('profileDetails') || document.getElementById('profileContent')) {
        await renderProfile();
    }
});