// 1. Paste your Supabase Keys here
const SUPABASE_URL = 'https://hvyfubrydjktcakttmgo.supabase.co';
const SUPABASE_KEY = 'sb_publishable_RKNAIW9hMe2nffSFUtGdGQ_Jmm2vshX';

// 2. Initialize Supabase
const supabaseClient = supabase.createClient(SUPABASE_URL, SUPABASE_KEY);

// 3. Login Function
function checkAccess() {
    console.log("Login button clicked!"); 
    const passInput = document.getElementById('adminPass');
    const loginScreen = document.getElementById('login-screen');
    const dashboard = document.getElementById('dashboard');

    if (passInput.value === "Nikita123") {
        loginScreen.style.display = 'none';
        dashboard.style.display = 'block';
        fetchLeads();
    } else {
        alert("Wrong Password! Try Nikita123");
    }
}

// 4. Database Fetching Function

async function fetchLeads() {
    // 1. Get data from Supabase
    const { data, error } = await supabaseClient.from('leads').select('*');
    
    if (error) {
        console.error("Database Error:", error);
    } else {
        // 2. Update the "Total Leads" number on your screen
        // data.length counts how many rows are in the database
        document.getElementById('count').innerText = data.length; 

        // 3. Clear the table before adding new rows
        const tableBody = document.getElementById('leadData');
        tableBody.innerHTML = '';
        
        // 4. Loop through the data and add it to the table
        data.forEach(lead => {
            tableBody.innerHTML += `
                <tr>
                    <td>${lead.name}</td>
                    <td>${lead.email}</td>
                    <td><span class="status-pill">${lead.status}</span></td>
                    <td>
                        <button class="delete-btn" onclick="deleteLead(${lead.id})">Delete</button>
                    </td>
                </tr>`;
        });
    }
}
async function addLead() {
    const name = document.getElementById('newName').value;
    const email = document.getElementById('newEmail').value;

    if (!name || !email) return alert("Please fill all fields");

    const { error } = await supabaseClient
        .from('leads')
        .insert([{ name, email, status: 'New' }]);

    if (error) {
        alert("Error adding lead: " + error.message);
    } else {
        // Clear inputs and refresh table
        document.getElementById('newName').value = '';
        document.getElementById('newEmail').value = '';
        fetchLeads(); 
    }
}
async function deleteLead(id) {
    const confirmed = confirm("Are you sure you want to delete this lead?");
    if (confirmed) {
        const { error } = await supabaseClient
            .from('leads')
            .delete()
            .eq('id', id);

        if (error) {
            alert("Error: " + error.message);
        } else {
            fetchLeads(); // This reloads the table automatically after deleting
        }
    }
}
// 5. Logout Function (Added back in!)
function logout() {
    // Hide the dashboard and show the login screen again
    document.getElementById('dashboard').style.display = 'none';
    document.getElementById('login-screen').style.display = 'block';
    // Clear the password field for security
    document.getElementById('adminPass').value = '';
}