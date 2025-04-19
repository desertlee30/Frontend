/**
 * Authentication Debug Helper
 * This file helps diagnose authentication-related UI issues
 */

document.addEventListener('DOMContentLoaded', function() {
    console.log('Auth Debug Helper initialized');
    
    // Check authentication status
    const authToken = localStorage.getItem('authToken');
    const currentUser = localStorage.getItem('currentUser');
    
    console.log('Auth Debug: Auth Token exists?', !!authToken);
    console.log('Auth Debug: Current User exists?', !!currentUser);
    
    // Find all logout buttons
    const logoutButtons = document.querySelectorAll('.logout-btn');
    console.log('Auth Debug: Found', logoutButtons.length, 'logout buttons');
    
    // Ensure logout buttons are visible when user is logged in
    if (authToken && currentUser) {
        console.log('Auth Debug: User appears to be logged in, showing logout buttons');
        
        logoutButtons.forEach(btn => {
            // Make sure logout buttons are visible
            btn.style.display = 'inline-block';
            btn.classList.remove('hidden');
            
            console.log('Auth Debug: Enabled logout button:', btn);
        });
        
        try {
            // Update login link text
            const userData = JSON.parse(currentUser);
            const loginLinks = document.querySelectorAll('.login-link');
            
            loginLinks.forEach(link => {
                if (userData && userData.lastName) {
                    link.textContent = userData.lastName;
                    link.href = '#';
                    console.log('Auth Debug: Updated login link to show:', userData.lastName);
                }
            });
        } catch (e) {
            console.error('Auth Debug: Error parsing current user:', e);
        }
    } else {
        console.log('Auth Debug: User not logged in, hiding logout buttons');
        
        logoutButtons.forEach(btn => {
            btn.style.display = 'none';
            btn.classList.add('hidden');
        });
    }
    
    // Add debug button
    const debugButton = document.createElement('button');
    debugButton.textContent = 'Auth Debug';
    debugButton.style.position = 'fixed';
    debugButton.style.bottom = '10px';
    debugButton.style.right = '10px';
    debugButton.style.zIndex = '9999';
    debugButton.style.padding = '5px 10px';
    debugButton.style.backgroundColor = '#f5bc00';
    debugButton.style.color = '#000';
    debugButton.style.border = 'none';
    debugButton.style.borderRadius = '4px';
    debugButton.style.cursor = 'pointer';
    
    debugButton.addEventListener('click', function() {
        // Show auth status
        const authInfo = {
            authToken: localStorage.getItem('authToken') ? '✓ Present' : '✗ Missing',
            currentUser: localStorage.getItem('currentUser') ? '✓ Present' : '✗ Missing',
            logoutButtons: document.querySelectorAll('.logout-btn').length,
            loginLinks: document.querySelectorAll('.login-link').length
        };
        
        alert('Authentication Debug Info:\n' + 
              '------------------------\n' +
              'Auth Token: ' + authInfo.authToken + '\n' +
              'Current User: ' + authInfo.currentUser + '\n' +
              'Logout Buttons: ' + authInfo.logoutButtons + '\n' +
              'Login Links: ' + authInfo.loginLinks + '\n\n' +
              'To manually fix logout button visibility, run in console:\n' +
              'document.querySelectorAll(".logout-btn").forEach(b => { b.style.display = "inline-block"; b.classList.remove("hidden"); });');
    });
    
    document.body.appendChild(debugButton);
}); 