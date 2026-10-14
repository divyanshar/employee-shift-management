# Employee Shift Management System

A full-stack web application for managing employee shifts, assignments, availability, and leave requests. The system provides role-based access for Admins, Managers, and Employees, with scheduling validations to help prevent conflicts and ensure fair shift allocation.

## Features

### Authentication & Authorization
- User authentication using JWT.
- Role-based access control for Admin, Manager, and Employee.
- Protected routes and API endpoints.

### Shift Management
- Create, view, and update shifts.
- Assign employees to shifts.
- Publish, complete, and cancel shifts according to role-based permissions.
- Delete eligible shifts.
- Search and filter shifts by title, department, and status.
- View personal shift schedules.

### Scheduling Rules
- Prevent overlapping shifts.
- Enforce a maximum shift duration of 8 hours.
- Enforce daily and weekly working-hour limits.
- Maintain a minimum rest period of 12 hours between shifts.
- Validate employee availability and leave conflicts before assignment.

### Leave Management
- Submit leave requests.
- Edit pending leave requests.
- Approve or reject leave requests.
- Cancel eligible leave requests.
- Validate overlapping leave requests and conflicts with assigned shifts.

### Employee Management
- View employee details.
- Display employee names in shift and leave management tables.
- Restrict access to data according to user roles.

### Frontend
- Responsive interface built with React and TypeScript.
- Redux Toolkit for application state management.
- Axios for API communication and JWT authorization headers.
- Data tables and role-specific actions.
- Toast notifications for success and error feedback.

## Tech Stack

**Frontend**
- React
- TypeScript
- Vite
- Redux Toolkit
- React Router
- Axios
- Material UI DataGrid
- React Toastify
- CSS

**Backend**
- NestJS
- TypeScript
- MongoDB
- Mongoose
- JWT Authentication
- Role-Based Access Control

## Project Structure

```text
employee-shift-management/
├── backend/
│   ├── src/
│   │   ├── auth/
│   │   ├── users/
│   │   ├── shifts/
│   │   ├── assignments/
│   │   ├── leaves/
│   │   ├── availability/
│   │   ├── scheduling-rules/
│   │   ├── locations/
│   │   └── shift-types/
│   ├── .env
│   └── package.json
│
├── frontend/
│   ├── src/
│   │   ├── components/
│   │   ├── pages/
│   │   ├── services/
│   │   ├── store/
│   │   ├── app/
│   │   └── assets/
│   ├── .env
│   └── package.json
│
└── README.md
```

*The directory structure above is illustrative. Adjust the folder names to match your repository.*

## Prerequisites

Ensure the following are installed:

- Node.js and npm
- MongoDB running locally or a MongoDB Atlas connection
- Git

## Installation and Setup

### 1. Clone the repository

```bash
git clone <YOUR_GITHUB_REPOSITORY_URL>
cd employee-shift-management
```

### 2. Configure the backend

Navigate to the backend directory:

```bash
cd backend
npm install
```

Create a `.env` file in the backend directory and configure the required environment variables:

```env
PORT=3000
MONGODB_URI=mongodb://127.0.0.1:27017/employee_shift_management
JWT_SECRET=your_secure_jwt_secret
```

Use the exact environment variable names expected by your backend configuration. Keep real secrets out of version control.

Start the backend in development mode:

```bash
npm run start:dev
```

The backend will typically run at:

```text
http://localhost:3000
```

### 3. Configure the frontend

Open a new terminal and navigate to the frontend directory:

```bash
cd frontend
npm install
```

Create a `.env` file in the frontend directory:

```env
VITE_API_URL=http://localhost:3000
```

Start the frontend:

```bash
npm run dev
```

Open the local URL printed by Vite in your terminal, typically:

```text
http://localhost:5173
```

## User Roles and Permissions

| Feature | Admin | Manager | Employee |
|---|---|---|---|
| View shifts | All shifts | All shifts | Own assigned shifts |
| Create shifts | Yes | Yes | No |
| Edit draft shifts | Yes | Yes | No |
| Assign employees | Yes | Yes | No |
| Cancel draft shifts | Yes | Yes | No |
| Cancel published shifts | Yes | No | No |
| Complete assigned shifts | No | No | Own shifts |
| Manage leave requests | Review requests | Review requests | Submit and manage own eligible requests |
| Access employee records | Yes | Yes | Restricted |

*Permissions are subject to the backend's implemented guards and service-level validation.*

## API Overview

The backend exposes REST APIs for authentication, users, shifts, assignments, and leave management.

| Method | Endpoint | Purpose |
|---|---|---|
| POST | `/auth/login` | Authenticate a user |
| POST | `/auth/signup` | Register an employee |
| GET | `/users/employees` | Retrieve employee records |
| GET | `/users/me` | Retrieve the current user's profile |
| GET | `/shifts` | Retrieve shifts with optional search and status filters |
| GET | `/shifts/my-schedule` | Retrieve the employee's schedule |
| POST | `/shifts` | Create a shift |
| PATCH | `/shifts/:id` | Update a shift |
| PATCH | `/shifts/:id/complete` | Complete a published shift |
| PATCH | `/shifts/:id/cancel` | Cancel an eligible shift |
| POST | `/assignments` | Assign an employee to a shift |
| GET | `/leaves` | Retrieve leave requests |
| POST | `/leaves` | Submit a leave request |
| PATCH | `/leaves/:id/edit` | Edit a pending leave request |

*This is a high-level overview, not a guarantee that every endpoint or HTTP method matches your current implementation. Update it to reflect your actual controllers.*

## Shift Lifecycle

```text
DRAFT
  ├── Assign employee → PUBLISHED
  │                      ├── Complete → COMPLETED
  │                      └── Cancel → CANCELLED (Admin only)
  └── Cancel → CANCELLED (Admin or Manager)
```

Completed and cancelled shifts cannot be reassigned or completed again.

## Security

- JWT-protected API endpoints.
- Role-based authorization.
- Employee ownership checks for personal schedules and leave requests.
- Server-side scheduling and status-transition validation.
- Environment variables for database credentials and JWT secrets.

## Future Improvements

- Automated notifications for shift assignments and changes.
- Calendar-based shift visualization.
- Shift swap requests and approval workflows.
- Detailed scheduling and attendance reports.
- Automated tests and deployment configuration.

## Contributing

1. Fork the repository.
2. Create a feature branch.
3. Commit your changes with descriptive messages.
4. Push the branch and open a pull request.

## License

Add a license if you intend to make the project open source. Until a license is added, reuse and redistribution permissions are not explicitly granted.

---

**Employee Shift Management System** — simplifying shift scheduling, employee assignments, and leave management through role-based workflows and scheduling validations.
