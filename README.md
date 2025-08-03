# Task Manager

A full-stack task management application built with Spring Boot backend and modern web technologies. This application provides a Kanban-style board interface for organizing tasks and projects.

## 🚀 Features

- **User Authentication & Authorization**
  - User registration and login
  - Secure password encryption with BCrypt
  - Session-based authentication

- **Board Management**
  - Create, update, and delete boards
  - User-specific board ownership
  - Board listing and organization

- **Task Lists & Tasks**
  - Create multiple task lists per board
  - Add, edit, and delete tasks within lists
  - Task positioning and organization
  - Task descriptions

- **Security**
  - CORS configuration for frontend integration
  - CSRF protection
  - Secure API endpoints
  - H2 console access for development

## 🛠️ Tech Stack

### Backend
- **Java 21**
- **Spring Boot 3.5.3**
- **Spring Security 6** - Authentication & Authorization
- **Spring Data JPA** - Data persistence
- **H2 Database** - In-memory database for development
- **Lombok** - Reduce boilerplate code
- **Maven** - Dependency management

### Frontend
- **React**
- **Vite** - Development server (runs on port 5173)
- **HTTP Client** - For API communication

### Database Schema
- **Users** - User accounts and authentication
- **Boards** - Project boards owned by users
- **Task Lists** - Columns within boards
- **Tasks** - Individual tasks within lists

## 📁 Project Structure

```
backend/
├── src/main/java/com/example/taskmanager/
│   ├── config/
│   │   └── SecurityConfig.java          # Security configuration
│   ├── controller/
│   │   ├── AuthController.java          # Authentication endpoints
│   │   ├── BoardController.java         # Board management
│   │   ├── TaskController.java          # Task operations
│   │   └── TaskListController.java      # Task list management
│   ├── model/
│   │   ├── User.java                    # User entity
│   │   ├── Board.java                   # Board entity
│   │   ├── TaskList.java               # Task list entity
│   │   └── Task.java                    # Task entity
│   ├── repository/
│   │   ├── UserRepository.java          # User data access
│   │   ├── BoardRepository.java         # Board data access
│   │   ├── TaskListRepository.java      # Task list data access
│   │   └── TaskRepository.java          # Task data access
│   ├── service/
│   │   └── UserDetailsServiceImpl.java  # User details service
│   └── TaskmanagerApplication.java      # Main application class
├── src/main/resources/
│   └── application.properties           # Application configuration
└── pom.xml                             # Maven dependencies
```

## 🚦 Getting Started

### Prerequisites
- Java 21 or higher
- Maven 3.6+
- IDE (IntelliJ IDEA, Eclipse, VS Code)

### Installation

1. **Clone the repository**
   ```bash
   git clone https://github.com/yourusername/taskmanager.git
   cd taskmanager
   ```

2. **Start the backend**
   ```bash
   cd backend
   mvn clean install
   mvn spring-boot:run
   ```

3. **Start the frontend** (in a new terminal)
   ```bash
   cd frontend  # or your frontend directory
   npm install
   npm run dev
   ```

4. **Access the application**
   - **Frontend Application**: `http://localhost:5173`
   - **Backend API**: `http://localhost:8080/api`
   - **H2 Console**: `http://localhost:8080/h2-console`
     - JDBC URL: `jdbc:h2:mem:testdb`
     - Username: `sa`
     - Password: (empty)

## 🔧 Configuration

### Application Properties
The application uses the following key configurations:

- **Database**: H2 in-memory database
- **JPA**: Hibernate with automatic DDL updates
- **Security**: Debug logging enabled
- **CORS**: Configured for `http://localhost:5173` (typical Vite dev server)

### Security Configuration
- Form-based login with custom success/failure handlers
- HTTP Basic authentication for API testing
- CSRF disabled for API endpoints
- Session-based authentication

## 🔒 Security Features

- **Password Encryption**: BCrypt hashing
- **Authentication**: Form-based and HTTP Basic
- **Authorization**: Role-based access control
- **CORS**: Configured for cross-origin requests
- **Session Management**: Secure session handling

## 🚀 Deployment

### Development
The application is configured for development with:
- H2 in-memory database
- Debug logging
- H2 console enabled

### Production Considerations
For production deployment, consider:
- Switching to a persistent database (PostgreSQL, MySQL)
- Updating CORS configuration
- Disabling H2 console
- Adding proper logging configuration
- Setting up environment-specific profiles

---

**Note**: This application is currently configured for development purposes with an in-memory H2 database. Data will not persist between application restarts.
