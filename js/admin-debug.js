/**
 * Admin Debug Helper for User Management
 * WARNING: This is for development use only - remove in production
 */

document.addEventListener('DOMContentLoaded', function() {
    console.log('Admin Debug Helper initialized');
    
    // Create admin debug container
    const container = document.createElement('div');
    container.id = 'admin-debug-container';
    container.style.position = 'fixed';
    container.style.bottom = '50px';
    container.style.right = '10px';
    container.style.zIndex = '9999';
    container.style.backgroundColor = '#fff';
    container.style.padding = '10px';
    container.style.border = '1px solid #333';
    container.style.borderRadius = '5px';
    container.style.boxShadow = '0 0 10px rgba(0,0,0,0.2)';
    container.style.maxWidth = '300px';
    container.style.maxHeight = '500px';
    container.style.overflow = 'auto';
    container.style.display = 'none';
    
    // Create toggle button
    const toggleBtn = document.createElement('button');
    toggleBtn.textContent = 'Admin Debug';
    toggleBtn.style.position = 'fixed';
    toggleBtn.style.bottom = '10px';
    toggleBtn.style.right = '100px';
    toggleBtn.style.zIndex = '9999';
    toggleBtn.style.padding = '5px 10px';
    toggleBtn.style.backgroundColor = '#dc3545';
    toggleBtn.style.color = '#fff';
    toggleBtn.style.border = 'none';
    toggleBtn.style.borderRadius = '4px';
    toggleBtn.style.cursor = 'pointer';
    
    // Content for the debug panel
    container.innerHTML = `
        <h3 style="margin-top:0;">Admin Debug Panel</h3>
        <div>
            <button id="admin-check-server">Check Server</button>
            <button id="admin-fetch-users">Fetch Users</button>
            <button id="admin-check-paths">Check Paths</button>
        </div>
        <div id="admin-server-status" style="margin-top:10px;"></div>
        <div id="admin-users-list" style="margin-top:10px;"></div>
        <div id="admin-paths-info" style="margin-top:10px;"></div>
    `;
    
    // Add to DOM
    document.body.appendChild(container);
    document.body.appendChild(toggleBtn);
    
    // Toggle debug panel
    toggleBtn.addEventListener('click', function() {
        container.style.display = container.style.display === 'none' ? 'block' : 'none';
    });
    
    // Initialize functionality
    document.getElementById('admin-check-server').addEventListener('click', checkServerStatus);
    document.getElementById('admin-fetch-users').addEventListener('click', fetchUsers);
    document.getElementById('admin-check-paths').addEventListener('click', checkPaths);
    
    // Check server status
    function checkServerStatus() {
        const statusDiv = document.getElementById('admin-server-status');
        statusDiv.innerHTML = 'Checking server status...';
        
        fetch('http://20.2.210.82:3000/')
            .then(response => response.json())
            .then(data => {
                statusDiv.innerHTML = `
                    <div style="color:green">✓ Server is running</div>
                    <div>Response: ${JSON.stringify(data)}</div>
                `;
            })
            .catch(error => {
                statusDiv.innerHTML = `
                    <div style="color:red">✗ Server error</div>
                    <div>Error: ${error.message}</div>
                `;
            });
    }
    
    // Fetch users
    function fetchUsers() {
        const usersDiv = document.getElementById('admin-users-list');
        usersDiv.innerHTML = 'Fetching users...';
        
        fetch('http://20.2.210.82:3000/api/debug/users')
            .then(response => response.json())
            .then(data => {
                if (data.users && data.users.length > 0) {
                    usersDiv.innerHTML = `
                        <h4>Users (${data.users.length})</h4>
                        <table style="width:100%; border-collapse:collapse;">
                            <tr>
                                <th style="text-align:left; border-bottom:1px solid #ddd;">ID</th>
                                <th style="text-align:left; border-bottom:1px solid #ddd;">Name</th>
                                <th style="text-align:left; border-bottom:1px solid #ddd;">Email</th>
                            </tr>
                            ${data.users.map(user => `
                                <tr>
                                    <td style="border-bottom:1px solid #ddd;">${user.id}</td>
                                    <td style="border-bottom:1px solid #ddd;">${user.firstName} ${user.lastName}</td>
                                    <td style="border-bottom:1px solid #ddd;">${user.email}</td>
                                </tr>
                            `).join('')}
                        </table>
                    `;
                } else {
                    usersDiv.innerHTML = 'No users found';
                }
            })
            .catch(error => {
                usersDiv.innerHTML = `
                    <div style="color:red">Error fetching users</div>
                    <div>${error.message}</div>
                `;
            });
    }
    
    // Check file paths
    function checkPaths() {
        const pathsDiv = document.getElementById('admin-paths-info');
        pathsDiv.innerHTML = 'Checking file paths...';
        
        fetch('http://20.2.210.82:3000/api/debug/paths')
            .then(response => response.json())
            .then(data => {
                pathsDiv.innerHTML = `
                    <h4>Server File Paths</h4>
                    <div><strong>Current Working Directory:</strong> ${data.paths.currentWorkingDirectory}</div>
                    <div><strong>__dirname:</strong> ${data.paths.dirname}</div>
                    <div><strong>Users JSON Path:</strong> ${data.paths.usersJsonAbsolutePath}</div>
                    <div><strong>Data Directory:</strong> ${data.paths.dataDirectoryAbsolutePath}</div>
                    <div><strong>Users JSON Exists:</strong> ${data.fileChecks.usersJsonExists ? 'Yes ✓' : 'No ✗'}</div>
                    <div><strong>Data Directory Exists:</strong> ${data.fileChecks.dataDirectoryExists ? 'Yes ✓' : 'No ✗'}</div>
                    
                    <h4>Data Directory Contents:</h4>
                    <ul>
                        ${data.dataDirectoryContents.map(file => `<li>${file}</li>`).join('')}
                    </ul>
                    
                    <div style="margin-top:10px; font-weight:bold;">
                        If you're not seeing users in the expected file, check these paths!
                    </div>
                `;
            })
            .catch(error => {
                pathsDiv.innerHTML = `
                    <div style="color:red">Error checking paths</div>
                    <div>${error.message}</div>
                `;
            });
    }
}); 