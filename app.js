// Simulated database (using local storage)
let usersDb = JSON.parse(localStorage.getItem('users')) || [];
let videosDb = JSON.parse(localStorage.getItem('videos')) || [];
let currentUser = JSON.parse(localStorage.getItem('currentUser')) || null;

const authContainer = document.getElementById('auth-container');
const channelContainer = document.getElementById('channel-container');
const createVideoContainer = document.getElementById('create-video-container');
const userVideos = document.getElementById('user-videos');
const trendingVideos = document.getElementById('trending-videos');
const searchResults = document.getElementById('search-results');
const trendingChannels = document.getElementById('trending-channels');

// Show login form or channel depending on authentication state
if (currentUser) {
    showChannel();
} else {
    authContainer.style.display = 'block';
    channelContainer.style.display = 'none';
    createVideoContainer.style.display = 'none';
}

// Handle login or sign up
document.getElementById('login-btn').addEventListener('click', handleLogin);
document.getElementById('signup-btn').addEventListener('click', handleSignUp);

function handleLogin() {
    const username = document.getElementById('username').value;
    const password = document.getElementById('password').value;

    const user = usersDb.find(u => u.username === username && u.password === password);
    if (user) {
        currentUser = user;
        localStorage.setItem('currentUser', JSON.stringify(user));
        showChannel();
    } else {
        alert('Invalid credentials');
    }
}

function handleSignUp() {
    const username = document.getElementById('username').value;
    const password = document.getElementById('password').value;

    if (usersDb.some(u => u.username === username)) {
        alert('Username already taken');
    } else {
        const newUser = { username, password };
        usersDb.push(newUser);
        localStorage.setItem('users', JSON.stringify(usersDb));
        alert('Sign-up successful! You can now log in.');
    }
}

function showChannel() {
    authContainer.style.display = 'none';
    channelContainer.style.display = 'block';

    document.getElementById('logout-btn').addEventListener('click', handleLogout);
    document.getElementById('create-video-btn').addEventListener('click', showCreateVideoForm);
    loadUserVideos();
    loadTrendingVideos();
    loadTrendingChannels();
}

function handleLogout() {
    currentUser = null;
    localStorage.removeItem('currentUser');
    authContainer.style.display = 'block';
    channelContainer.style.display = 'none';
}

function loadUserVideos() {
    userVideos.innerHTML = '';
    const userVideosList = videosDb.filter(video => video.user === currentUser.username);
    userVideosList.forEach(video => {
        const li = document.createElement('li');
        li.textContent = video.title;
        userVideos.appendChild(li);
    });
}

function loadTrendingVideos() {
    trendingVideos.innerHTML = '';
    const trendingList = videosDb.slice(0, 5); // Get top 5 trending videos
    trendingList.forEach(video => {
        const li = document.createElement('li');
        li.textContent = video.title;
        trendingVideos.appendChild(li);
    });
}

function loadTrendingChannels() {
    trendingChannels.innerHTML = '';
    const channels = [...new Set(videosDb.map(video => video.user))]; // Get unique users
    channels.forEach(channel => {
        const li = document.createElement('li');
        li.textContent = channel;
        trendingChannels.appendChild(li);
    });
}

function showCreateVideoForm() {
    channelContainer.style.display = 'none';
    createVideoContainer.style.display = 'block';
    document.getElementById('submit-video-btn').addEventListener('click', submitVideo);
}

function submitVideo() {
    const title = document.getElementById('video-title').value;
    const description = document.getElementById('video-description').value;
    const file = document.getElementById('video-file').files[0];

    if (title && description && file) {
        const newVideo = {
            user: currentUser.username,
            title,
            description,
            file: file.name // Store file name as placeholder
        };
        videosDb.push(newVideo);
        localStorage.setItem('videos', JSON.stringify(videosDb));
        alert('Video submitted successfully!');
        loadUserVideos();
        loadTrendingVideos();
        createVideoContainer.style.display = 'none';
        channelContainer.style.display = 'block';
    } else {
        alert('Please fill in all fields');
    }
}

// Search Functionality
document.getElementById('search-btn').addEventListener('click', searchVideos);

function searchVideos() {
    const keyword = document.getElementById('search-input').value.toLowerCase();
    searchResults.innerHTML = '';
    const results = videosDb.filter(video => video.title.toLowerCase().includes(keyword));
    results.forEach(video => {
        const li = document.createElement('li');
        li.textContent = video.title;
        searchResults.appendChild(li);
    });
}
