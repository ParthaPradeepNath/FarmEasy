// DOM Elements
const loginBtn = document.getElementById('loginBtn');
const registerBtn = document.getElementById('registerBtn');
const loginModal = document.getElementById('loginModal');
const registerModal = document.getElementById('registerModal');
const createPostBtn = document.getElementById('createPostBtn');
const createPostModal = document.getElementById('createPostModal');
const userProfile = document.getElementById('userProfile');
const closeModalBtns = document.querySelectorAll('.close-modal');
const showRegisterLink = document.getElementById('showRegister');
const showLoginLink = document.getElementById('showLogin');

// Add Google Auth handlers
const googleLoginBtn = document.getElementById('googleLoginBtn');
const googleRegisterBtn = document.getElementById('googleRegisterBtn');

// State Management
let isAuthenticated = false;
let currentUser = null;

// Event Listeners
loginBtn?.addEventListener('click', () => showModal(loginModal));
registerBtn?.addEventListener('click', () => showModal(registerModal));
createPostBtn?.addEventListener('click', handleCreatePost);
showRegisterLink?.addEventListener('click', (e) => {
    e.preventDefault();
    hideModal(loginModal);
    showModal(registerModal);
});
showLoginLink?.addEventListener('click', (e) => {
    e.preventDefault();
    hideModal(registerModal);
    showModal(loginModal);
});

googleLoginBtn?.addEventListener('click', handleGoogleAuth);
googleRegisterBtn?.addEventListener('click', handleGoogleAuth);

closeModalBtns.forEach(btn => {
    btn.addEventListener('click', () => {
        hideModal(loginModal);
        hideModal(registerModal);
        hideModal(createPostModal);
    });
});

// Handle login form submission
document.querySelector('.login-form')?.addEventListener('submit', async (e) => {
    e.preventDefault();
    const email = e.target.querySelector('input[type="email"]').value;
    const password = e.target.querySelector('input[type="password"]').value;

    try {
        // Simulate API call
        await login(email, password);
        hideModal(loginModal);
        updateUIForAuthenticatedUser();
    } catch (error) {
        alert(error.message);
    }
});

// Handle register form submission
document.querySelector('.register-form')?.addEventListener('submit', async (e) => {
    e.preventDefault();
    const formData = {
        name: e.target.querySelector('input[type="text"]').value,
        email: e.target.querySelector('input[type="email"]').value,
        password: e.target.querySelector('input[type="password"]').value,
        confirmPassword: e.target.querySelectorAll('input[type="password"]')[1].value,
        state: e.target.querySelector('select').value
    };

    try {
        // Simulate API call
        await register(formData);
        hideModal(registerModal);
        updateUIForAuthenticatedUser();
    } catch (error) {
        alert(error.message);
    }
});

// Post interactions
document.querySelectorAll('.post-action-btn').forEach(btn => {
    btn.addEventListener('click', handlePostAction);
});

document.querySelectorAll('.comment-submit').forEach(btn => {
    btn.addEventListener('click', handleCommentSubmit);
});

// Functions
function showModal(modal) {
    if (!modal) return;
    modal.classList.add('active');
    document.body.style.overflow = 'hidden';
}

function hideModal(modal) {
    if (!modal) return;
    modal.classList.remove('active');
    document.body.style.overflow = '';
}

function updateUIForAuthenticatedUser() {
    isAuthenticated = true;
    loginBtn.style.display = 'none';
    registerBtn.style.display = 'none';
    userProfile.classList.remove('hidden');
    
    // Update profile information
    const profileName = userProfile.querySelector('.profile-name');
    const profileEmail = userProfile.querySelector('.profile-email');
    const avatars = userProfile.querySelectorAll('img.avatar, img.dropdown-avatar');
    
    if (currentUser) {
        profileName.textContent = currentUser.name;
        profileEmail.textContent = currentUser.email;
        avatars.forEach(avatar => {
            avatar.src = currentUser.avatar;
            avatar.alt = `${currentUser.name}'s Avatar`;
        });
    }
}

function updateUserStatus(status) {
    const statusIndicator = document.querySelector('.user-status');
    if (statusIndicator) {
        statusIndicator.className = `user-status ${status}`;
    }
}

async function login(email, password) {
    // Simulate API call
    return new Promise((resolve, reject) => {
        setTimeout(() => {
            if (email && password) {
                currentUser = {
                    name: email.split('@')[0].replace(/[^a-zA-Z0-9]/g, ' ').replace(/\b\w/g, l => l.toUpperCase()),
                    email: email,
                    avatar: `https://ui-avatars.com/api/?name=${encodeURIComponent(email.split('@')[0])}&background=2E7D32&color=fff`,
                    isGoogleUser: false
                };
                // Save user to localStorage
                localStorage.setItem('user', JSON.stringify(currentUser));
                updateUserStatus('online');
                resolve(currentUser);
            } else {
                reject(new Error('Invalid credentials'));
            }
        }, 1000);
    });
}

async function register(formData) {
    // Simulate API call
    return new Promise((resolve, reject) => {
        setTimeout(() => {
            if (formData.password !== formData.confirmPassword) {
                reject(new Error('Passwords do not match'));
                return;
            }
            currentUser = {
                name: formData.name,
                email: formData.email,
                avatar: `https://ui-avatars.com/api/?name=${encodeURIComponent(formData.name)}&background=2E7D32&color=fff`,
                isGoogleUser: false
            };
            // Save user to localStorage
            localStorage.setItem('user', JSON.stringify(currentUser));
            updateUserStatus('online');
            resolve(currentUser);
        }, 1000);
    });
}

function logout() {
    isAuthenticated = false;
    currentUser = null;
    localStorage.removeItem('user');
    loginBtn.style.display = 'block';
    registerBtn.style.display = 'block';
    userProfile.classList.add('hidden');
    updateUserStatus('offline');
}

function handleCreatePost() {
    if (!isAuthenticated) {
        showModal(loginModal);
        return;
    }
    showModal(createPostModal);
}

function handlePostAction(e) {
    if (!isAuthenticated) {
        showModal(loginModal);
        return;
    }

    const action = e.target.closest('.post-action-btn');
    if (!action) return;

    const post = action.closest('.post-card');
    const actionType = action.textContent.trim().toLowerCase();

    switch (actionType) {
        case 'like':
            toggleLike(post);
            break;
        case 'comment':
            focusCommentInput(post);
            break;
        case 'share':
            sharePost(post);
            break;
    }
}

function toggleLike(post) {
    const likeBtn = post.querySelector('.post-action-btn:first-child');
    const likeCount = post.querySelector('.post-stats span:first-child');
    const isLiked = likeBtn.classList.contains('active');
    const count = parseInt(likeCount.textContent.match(/\d+/)[0]);

    likeBtn.classList.toggle('active');
    likeCount.innerHTML = `<i class="fas fa-thumbs-up"></i> ${isLiked ? count - 1 : count + 1} likes`;
}

function focusCommentInput(post) {
    const commentInput = post.querySelector('.comment-input');
    if (commentInput) {
        commentInput.focus();
    }
}

function sharePost(post) {
    // Implement sharing functionality
    alert('Sharing functionality will be implemented soon!');
}

function handleCommentSubmit(e) {
    if (!isAuthenticated) {
        showModal(loginModal);
        return;
    }

    const commentSection = e.target.closest('.comments-section');
    const input = commentSection.querySelector('.comment-input');
    const comment = input.value.trim();

    if (!comment) return;

    addComment(commentSection, comment);
    input.value = '';
}

function addComment(commentSection, content) {
    const comment = document.createElement('div');
    comment.className = 'comment';
    comment.innerHTML = `
        <img src="${currentUser.avatar}" alt="User Avatar" class="comment-avatar">
        <div class="comment-content">
            <h5>${currentUser.name}</h5>
            <p>${content}</p>
            <div class="comment-actions">
                <button>Like</button>
                <button>Reply</button>
                <span>Just now</span>
            </div>
        </div>
    `;

    const addCommentDiv = commentSection.querySelector('.add-comment');
    commentSection.insertBefore(comment, addCommentDiv);

    // Update comment count
    const post = commentSection.closest('.post-card');
    const commentCount = post.querySelector('.post-stats span:nth-child(2)');
    const count = parseInt(commentCount.textContent.match(/\d+/)[0]);
    commentCount.innerHTML = `<i class="fas fa-comment"></i> ${count + 1} comments`;
}

// Initialize
document.addEventListener('DOMContentLoaded', () => {
    // Check for existing session
    const savedUser = localStorage.getItem('user');
    if (savedUser) {
        currentUser = JSON.parse(savedUser);
        updateUIForAuthenticatedUser();
        updateUserStatus('online');
    }

    // Handle file uploads
    const uploadArea = document.querySelector('.upload-area');
    const fileInput = uploadArea?.querySelector('input[type="file"]');

    uploadArea?.addEventListener('click', () => fileInput.click());
    uploadArea?.addEventListener('dragover', (e) => {
        e.preventDefault();
        uploadArea.classList.add('dragover');
    });
    uploadArea?.addEventListener('dragleave', () => {
        uploadArea.classList.remove('dragover');
    });
    uploadArea?.addEventListener('drop', (e) => {
        e.preventDefault();
        uploadArea.classList.remove('dragover');
        const files = e.dataTransfer.files;
        handleFiles(files);
    });
    fileInput?.addEventListener('change', (e) => {
        handleFiles(e.target.files);
    });
});

function handleFiles(files) {
    // Implement file upload logic
    console.log('Files to upload:', files);
    // You would typically upload these to your server
    alert('File upload functionality will be implemented soon!');
}

// Add event listener for logout
document.querySelector('.logout')?.addEventListener('click', (e) => {
    e.preventDefault();
    logout();
});

async function handleGoogleAuth() {
    try {
        // Simulate Google OAuth flow
        const googleUser = await simulateGoogleAuth();
        currentUser = {
            name: googleUser.name,
            email: googleUser.email,
            avatar: googleUser.picture,
            isGoogleUser: true
        };
        
        // Save user to localStorage
        localStorage.setItem('user', JSON.stringify(currentUser));
        
        // Update UI
        hideModal(loginModal);
        hideModal(registerModal);
        updateUIForAuthenticatedUser();
        updateUserStatus('online');
    } catch (error) {
        alert(error.message);
    }
}

function simulateGoogleAuth() {
    // This is a mock function to simulate Google OAuth
    return new Promise((resolve) => {
        setTimeout(() => {
            resolve({
                name: 'Google User',
                email: 'user@gmail.com',
                picture: 'https://lh3.googleusercontent.com/a/default-user',
                sub: 'google-oauth2|123456789'
            });
        }, 1000);
    });
} 