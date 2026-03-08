🛠️ LocalHub: On-Demand Service Marketplace
LocalHub is a full-stack MERN-like application (using MySQL instead of MongoDB) designed to connect local service providers (electricians, plumbers, cleaners) with customers in their area. It features a robust booking system, real-time job tracking, and a verified review ecosystem.

🚀 Core Features
👤 For Customers
Explore Services: Browse approved and available professionals filtered by category.

Transparent Pricing: View standard base fees and final estimates before confirming a booking.

Smart Bookings: Request services with specific dates, addresses, and custom notes.

Reschedule System: Flexibility to change appointment dates directly from the dashboard.

Verified Reviews: Leave ratings and feedback only after a job is marked as "Completed."

🛠️ For Service Providers
Profile Management: Set up a professional bio and select a service category for admin approval.

Availability Toggle: Switch between "Available" and "Unavailable" to manage your workload.

Job Lifecycle: Manage requests through a state-machine (Requested → Confirmed → In-progress → Completed).

Dynamic Pricing: Update the final service fee based on on-site assessments.

Visual Evidence: Upload "Before" and "After" photos using Cloudinary integration to verify work completion.

🏗️ Tech Stack
Frontend
React & Vite: Fast, modern UI development.

Redux Toolkit: Centralized state management for bookings, auth, and reviews.

Tailwind CSS: Responsive and sleek utility-first styling.

Lucide React: Premium iconography.

Backend
Node.js & Express: Scalable server architecture.

MySQL: Relational database for complex data integrity (using mysql2 pool).

JWT & Cookies: Secure, HTTP-only cookie-based authentication.

Cloudinary: Cloud storage for job completion images.

Express Rate Limit: Security middleware to prevent brute-force attacks on auth routes.

🛠️ Installation & Setup
1. Clone the Repository
Bash
git clone https://github.com/YourUsername/LocalHub.git
cd LocalHub
2. Backend Configuration
Create a .env file in the backend/ directory:

Code snippet
PORT=5000
DB_HOST=your_aiven_mysql_host
DB_USER=your_user
DB_PASSWORD=your_password
DB_NAME=defaultdb
DB_PORT=your_port
JWT_SECRET=your_super_secret_key
FRONTEND_URL=http://localhost:5173
CLOUDINARY_CLOUD_NAME=your_name
CLOUDINARY_API_KEY=your_key
CLOUDINARY_API_SECRET=your_secret
3. Frontend Configuration
Create a .env file in the Frontend/ directory:

Code snippet
VITE_API_URL=http://localhost:5000/api
4. Install Dependencies & Run
In Backend:

Bash
npm install
node server.js
In Frontend:

Bash
npm install
npm run dev
🗄️ Database Schema Summary
The project utilizes a relational structure to ensure data consistency:

Users: Stores credentials and roles (Customer/Provider/Admin).

Provider_Profiles: Linked to Users; stores bios, categories, and approval status.

Bookings: The heart of the app; tracks IDs, status, dates, and final pricing.

Reviews: Stores customer feedback linked to specific providers and bookings.

🛡️ Security Playbook
The project follows strict security guidelines:

SQL Injection Prevention: All queries use parameterized inputs.

XSS Protection: JWTs are stored in HTTP-only cookies.

Brute Force Protection: Rate limiting applied to login and registration.

IPv6 Security: Uses ipKeyGenerator to prevent limit bypasses.

📄 License
This project is for educational purposes as part of the Cohort Project.