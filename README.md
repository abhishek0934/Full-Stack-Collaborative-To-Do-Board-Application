# Collaborative To-Do Board Application

A full-stack real-time collaborative task management application built with React, Node.js, and Socket.IO.

## 🚀 Tech Stack

### Frontend
- **React.js** - Modern UI framework
- **TypeScript** - Type safety and better development experience
- **Tailwind CSS** - Utility-first CSS framework for custom styling
- **React Beautiful DnD** - Drag and drop functionality
- **Lucide React** - Beautiful icons

### Backend (Production Ready)
- **Node.js** - JavaScript runtime
- **Express.js** - Web framework
- **MongoDB** - NoSQL database
- **Mongoose** - MongoDB object modeling
- **Socket.IO** - Real-time communication
- **JWT** - JSON Web Tokens for authentication
- **bcrypt** - Password hashing

## ✨ Features

### Core Functionality
- **User Authentication** - Secure login/register with JWT and bcrypt
- **Kanban Board** - Visual task management with Todo, In Progress, Done columns
- **Drag & Drop** - Intuitive task movement between columns
- **Real-time Updates** - Live synchronization across all connected users
- **Smart Assignment** - Auto-assign tasks to users with the fewest active tasks
- **Activity Logging** - Track all user actions with timestamps
- **Conflict Detection** - Handle simultaneous editing conflicts

### UI/UX Features
- **Responsive Design** - Works perfectly on desktop and mobile
- **Custom Animations** - Smooth transitions and hover effects
- **Glassmorphism Design** - Modern transparent card design
- **Priority System** - Visual priority indicators (High, Medium, Low)
- **User Avatars** - Personalized user identification
- **Real-time Activity Feed** - Live updates of all user actions

## 🔧 Setup Instructions

### Prerequisites
- Node.js (v16 or higher)
- MongoDB (local or cloud instance)
- npm or yarn

### Installation

1. **Clone the repository**
```bash
git clone <repository-url>
cd collaborative-todo-board
```

2. **Install dependencies**
```bash
# Install frontend dependencies
npm install

# Install backend dependencies
cd backend
npm install
```

3. **Environment Configuration**
Create a `.env` file in the backend directory:
```env
PORT=5000
MONGODB_URI=mongodb://localhost:27017/collaborative-todo
JWT_SECRET=your-super-secret-jwt-key
NODE_ENV=development
```

4. **Start the application**
```bash
# Start backend server
cd backend
npm run dev

# Start frontend (in new terminal)
cd frontend
npm run dev
```

## 🏗️ Architecture & Logic

### Frontend Architecture
- **Component-based structure** with clear separation of concerns
- **Custom hooks** for state management and real-time updates
- **Type-safe** development with TypeScript interfaces
- **Responsive design** with mobile-first approach

### Backend Architecture
- **RESTful API** for CRUD operations
- **WebSocket connections** for real-time updates
- **JWT middleware** for route protection
- **Error handling** and validation middleware

### Key Logic Components

#### Smart Assignment Algorithm
```typescript
const getSmartAssignUser = (users: User[], tasks: Task[]): User | null => {
  const userTaskCounts = users.map(user => ({
    user,
    activeTasks: tasks.filter(task => 
      task.assignedUser?.id === user.id && task.status !== 'Done'
    ).length
  }));
  
  userTaskCounts.sort((a, b) => a.activeTasks - b.activeTasks);
  return userTaskCounts[0].user;
};
```

#### Conflict Detection
- Tracks when multiple users edit the same task
- Provides merge/overwrite options
- Real-time notifications for editing conflicts

#### Real-time Synchronization
- Socket.IO events for task updates
- Automatic conflict resolution
- Live activity feed updates

## 🔐 Security Features

- **Password hashing** with bcrypt
- **JWT authentication** for API protection
- **Input validation** and sanitization
- **CORS configuration** for secure cross-origin requests
- **Rate limiting** to prevent abuse

## 📱 Responsive Design

- **Mobile-first approach** with touch-friendly interactions
- **Adaptive layouts** for different screen sizes
- **Optimized performance** for mobile devices
- **Touch gestures** for drag and drop on mobile

## 🎨 Custom Styling

- **No third-party UI libraries** - fully custom components
- **Gradient backgrounds** and glassmorphism effects
- **Smooth animations** and micro-interactions
- **Consistent color system** with status-based color coding
- **Professional typography** and spacing

## 📊 Performance Optimizations

- **Efficient state management** with React hooks
- **Optimized re-renders** with React.memo and useMemo
- **Lazy loading** for better initial load times
- **Debounced API calls** for better user experience

## 🚀 Deployment

### Frontend (Vercel/Netlify)
1. Build the application: `npm run build`
2. Deploy to Vercel or Netlify
3. Configure environment variables

### Backend (Render/Railway)
1. Push to GitHub repository
2. Connect to Render/Railway
3. Set environment variables
4. Deploy with automatic builds

## 🧪 Testing

```bash
# Run frontend tests
npm test

# Run backend tests
cd backend
npm test
```

## 📝 API Documentation

### Authentication Endpoints
- `POST /api/auth/register` - User registration
- `POST /api/auth/login` - User login
- `GET /api/auth/me` - Get current user

### Task Management Endpoints
- `GET /api/tasks` - Get all tasks
- `POST /api/tasks` - Create new task
- `PUT /api/tasks/:id` - Update task
- `DELETE /api/tasks/:id` - Delete task

### Activity Endpoints
- `GET /api/actions` - Get last 20 actions

## 🔄 Real-time Events

- `task:created` - New task created
- `task:updated` - Task modified
- `task:deleted` - Task removed
- `task:moved` - Task status changed
- `user:editing` - User started editing
- `user:stopped_editing` - User stopped editing

## 🤝 Contributing

1. Fork the repository
2. Create a feature branch
3. Commit your changes
4. Push to the branch
5. Create a Pull Request

## 📄 License

This project is licensed under the MIT License.

## 🎯 Future Enhancements

- **File attachments** for tasks
- **Task templates** and recurring tasks
- **Advanced filtering** and search
- **Team workspaces** and permissions
- **Integration** with external tools (Slack, Trello)
- **Mobile app** with React Native
- **Offline support** with service workers

## 🐛 Known Issues

- None currently reported

## 📞 Support

For support, please open an issue in the GitHub repository or contact the development team.

---

Built with ❤️ by the CollaborativeTask team

This Website is live at - https://cosmic-parfait-10059d.netlify.app/
