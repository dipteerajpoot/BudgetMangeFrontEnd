# Finance Management App - Frontend

A professional, user-friendly React frontend for the Finance Management application built with Material-UI.

## Features

- **Authentication**: Login, Signup, and Account Verification
- **Dashboard**: Overview with charts and statistics
- **Budget Management**: Create, edit, and delete budgets
- **Expense Management**: Track expenses with categories
- **Profile Management**: User profile and statistics
- **Responsive Design**: Works on desktop and mobile devices

## Setup Instructions

### 1. Environment Configuration

Create a `.env` file in the root directory with the following content:

```env
# API Configuration
REACT_APP_API_URL=http://localhost:3000

# For production, change to your actual API URL
# REACT_APP_API_URL=https://your-api-domain.com
```

### 2. Install Dependencies

```bash
npm install
```

### 3. Start Development Server

```bash
npm start
```

The app will open at `http://localhost:3000`

### 4. Build for Production

```bash
npm run build
```

## Project Structure

```
src/
├── components/
│   ├── auth/
│   │   ├── Login.js
│   │   ├── Signup.js
│   │   └── ProtectedRoute.js
│   ├── budget/
│   │   └── BudgetManagement.js
│   ├── dashboard/
│   │   └── Dashboard.js
│   ├── expense/
│   │   └── ExpenseManagement.js
│   ├── layout/
│   │   └── Layout.js
│   └── profile/
│       └── Profile.js
├── contexts/
│   └── AuthContext.js
├── services/
│   └── api.js
├── App.js
├── App.css
└── index.js
```

## Key Features

### Authentication
- Secure login/signup with validation
- Account verification system
- Protected routes
- JWT token management

### Dashboard
- Financial overview with key metrics
- Interactive charts (Pie chart for expenses by category, Bar chart for monthly expenses)
- Recent activity feed
- Responsive design

### Budget Management
- Create monthly/yearly budgets
- Edit and delete budgets
- Budget status tracking
- Summary statistics

### Expense Management
- Add expenses with categories
- Edit and delete expenses
- Category-based organization
- Budget association
- Date tracking

### Profile
- User information display
- Account statistics
- Financial summary
- Logout functionality

## Technologies Used

- **React 19.1.1**: Frontend framework
- **Material-UI 7.3.2**: UI component library
- **React Router DOM 7.9.3**: Routing
- **Recharts 3.2.1**: Charts and graphs
- **Axios 1.12.2**: HTTP client
- **React Hook Form**: Form management

## API Integration

The frontend integrates with the following backend endpoints:

- `POST /user/login` - User login
- `POST /user/signup` - User registration
- `GET /user/profile` - Get user profile
- `POST /user/verify` - Account verification
- `GET /budget` - Get all budgets
- `POST /budget` - Create budget
- `PUT /budget/:id` - Update budget
- `DELETE /budget/:id` - Delete budget
- `GET /expense` - Get all expenses
- `POST /expense` - Add expense
- `PUT /expense/:id` - Update expense
- `DELETE /expense/:id` - Delete expense

## Responsive Design

The application is fully responsive and works on:
- Desktop computers
- Tablets
- Mobile phones

## Browser Support

- Chrome (latest)
- Firefox (latest)
- Safari (latest)
- Edge (latest)

## Development

### Available Scripts

- `npm start` - Start development server
- `npm run build` - Build for production
- `npm test` - Run tests
- `npm run eject` - Eject from Create React App

### Code Style

The project follows React best practices:
- Functional components with hooks
- Context API for state management
- Material-UI design system
- Responsive design principles
- Clean component structure

## Contributing

1. Fork the repository
2. Create a feature branch
3. Make your changes
4. Test thoroughly
5. Submit a pull request

## License

This project is licensed under the MIT License.