// Base URL for PHP scripts
const BASE_URL = 'php/';

// DOM elements
const userForm = document.getElementById('userForm');
const userTableBody = document.getElementById('userTableBody');

// Initialize the application
document.addEventListener('DOMContentLoaded', function() {
    loadUsers();
    
    // Form submission handler
    userForm.addEventListener('submit', function(e) {
        e.preventDefault();
        addUser();
    });
});

// Function to add a new user
async function addUser() {
    const name = document.getElementById('name').value.trim();
    const age = parseInt(document.getElementById('age').value);
    
    if (!name || !age || age <= 0) {
        alert('Please enter valid name and age');
        return;
    }
    
    try {
        const response = await fetch(BASE_URL + 'insert.php', {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
            },
            body: JSON.stringify({
                name: name,
                age: age
            })
        });
        
        const result = await response.json();
        
        if (result.success) {
            // Clear form
            userForm.reset();
            // Reload users table
            loadUsers();
            alert('User added successfully!');
        } else {
            alert('Error: ' + result.message);
        }
    } catch (error) {
        console.error('Error:', error);
        alert('An error occurred while adding the user');
    }
}

// Function to load and display users
async function loadUsers() {
    try {
        const response = await fetch(BASE_URL + 'fetch.php');
        const result = await response.json();
        
        if (result.success) {
            displayUsers(result.data);
        } else {
            console.error('Error loading users:', result.message);
            userTableBody.innerHTML = '<tr><td colspan="5">Error loading users</td></tr>';
        }
    } catch (error) {
        console.error('Error:', error);
        userTableBody.innerHTML = '<tr><td colspan="5">Error loading users</td></tr>';
    }
}

// Function to display users in the table
function displayUsers(users) {
    if (users.length === 0) {
        userTableBody.innerHTML = '<tr><td colspan="5" style="text-align: center; color: #666;">No users found</td></tr>';
        return;
    }
    
    userTableBody.innerHTML = users.map(user => `
        <tr>
            <td>${user.id}</td>
            <td>${escapeHtml(user.name)}</td>
            <td>${user.age}</td>
            <td class="${user.status == 1 ? 'status-active' : 'status-inactive'}">
                ${user.status == 1 ? '1' : '0'}
            </td>
            <td>
                <button class="toggle-btn ${user.status == 1 ? '' : 'inactive'}" 
                        onclick="toggleStatus(${user.id})">
                    Toggle
                </button>
            </td>
        </tr>
    `).join('');
}

// Function to toggle user status
async function toggleStatus(userId) {
    try {
        const response = await fetch(BASE_URL + 'toggle.php', {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
            },
            body: JSON.stringify({
                id: userId
            })
        });
        
        const result = await response.json();
        
        if (result.success) {
            // Reload users table to reflect the change immediately
            loadUsers();
        } else {
            alert('Error: ' + result.message);
        }
    } catch (error) {
        console.error('Error:', error);
        alert('An error occurred while toggling status');
    }
}

// Utility function to escape HTML
function escapeHtml(text) {
    const map = {
        '&': '&amp;',
        '<': '&lt;',
        '>': '&gt;',
        '"': '&quot;',
        "'": '&#039;'
    };
    return text.replace(/[&<>"']/g, function(m) { return map[m]; });
}

// Auto-refresh users every 30 seconds to keep data current
setInterval(loadUsers, 30000);

