# Human Resource Management System

A comprehensive HR management system with **Face Recognition Attendance** built with React and Python.

## 🚀 Features

### Core HR Features
- **Employee Management** - Add, edit, and manage employee information
- **Attendance Tracking** - Track employee attendance with face recognition
- **Payroll Management** - Handle salary calculations and policies
- **User Management** - Admin and user role management
- **Reports & Analytics** - Generate attendance and payroll reports
- **Document Management** - Store and manage HR documents
- **Task Management** - Assign and track employee tasks
- **Internal Chat** - Communication system for employees

### Face Recognition System
- **Biometric Attendance** - Check in/out using face recognition
- **User Registration** - Register employees with face photos
- **Real-time Recognition** - Live face detection and recognition
- **Attendance Recording** - Automatic attendance logging
- **Confidence Scoring** - Accuracy measurement for recognition

## 🛠️ Technology Stack

### Frontend
- **React 19** - Latest React with concurrent features
- **Vite** - Lightning-fast build tool
- **TailwindCSS** - Utility-first CSS framework
- **React Router** - Client-side routing
- **Lucide React** - Beautiful icons
- **Framer Motion** - Smooth animations

### Backend
- **Python Flask** - Web framework
- **OpenCV** - Computer vision library
- **face_recognition** - Face detection and recognition
- **NumPy** - Numerical computing
- **Pillow** - Image processing

## 📋 Prerequisites

- **Node.js** (v16.x or higher)
- **Python 3.8+**
- **npm** or **yarn**
- **pip** (Python package manager)

## 🚀 Quick Start

### 1. Frontend Setup

```bash
# Install dependencies
npm install

# Start development server
npm run dev
```

The frontend will be available at `http://localhost:5173`

### 2. Backend Setup

```bash
# Navigate to backend directory
cd backend

# Install Python dependencies
pip install -r requirements.txt

# Start the Flask API
python app.py
```

The backend API will be available at `http://localhost:5000`

### 3. Alternative Backend Startup

**Windows:**
```bash
cd backend
start.bat
```

**Linux/Mac:**
```bash
cd backend
chmod +x start.sh
./start.sh
```

## 📁 Project Structure

```
manager-employer/
├── src/
│   ├── components/          # Reusable UI components
│   │   ├── ui/             # Basic UI components
│   │   └── layout/         # Layout components
│   ├── pages/              # Page components
│   │   ├── FaceRecognition.jsx  # Face recognition system
│   │   ├── Dashboard.jsx       # Main dashboard
│   │   ├── EmployeeList.jsx    # Employee management
│   │   └── ...               # Other pages
│   ├── services/           # API services
│   ├── styles/             # Global styles
│   └── utils/              # Utility functions
├── backend/                 # Python Flask API
│   ├── app.py              # Main Flask application
│   ├── requirements.txt    # Python dependencies
│   ├── start.sh            # Linux/Mac startup script
│   └── start.bat           # Windows startup script
├── public/                 # Static assets
└── dist/                   # Built application
```

## 🎯 Face Recognition System

### How It Works

1. **User Registration**
   - Enter User ID and Full Name
   - Take multiple photos from different angles
   - Press 's' key to capture photos
   - Register user with face encodings

2. **Face Recognition**
   - Start camera for live recognition
   - System detects and recognizes faces
   - Records attendance automatically
   - Shows confidence score

3. **Attendance Management**
   - Automatic check-in/out recording
   - Real-time recognition results
   - Attendance history tracking

### API Endpoints

- `GET /api/status` - Check API status
- `POST /api/register` - Register new user
- `POST /api/recognize` - Recognize face
- `POST /api/attendance` - Record attendance
- `GET /api/users` - Get registered users

## 🎨 UI Features

- **Modern Design** - Clean and professional interface
- **Responsive Layout** - Works on desktop and mobile
- **Dark/Light Theme** - Customizable appearance
- **Real-time Updates** - Live data synchronization
- **Interactive Components** - Smooth user interactions

## 📱 Usage

### For Administrators
1. Access the dashboard to view system overview
2. Manage employees and their information
3. Configure face recognition settings
4. Generate reports and analytics
5. Monitor attendance patterns

### For Employees
1. Register with face recognition system
2. Check in/out using face recognition
3. View personal attendance records
4. Access internal chat and tasks
5. Update personal information

## 🔧 Configuration

### Environment Variables
Create a `.env` file in the root directory:

```env
VITE_API_URL=http://localhost:5000
VITE_APP_NAME=HR Management System
```

### Face Recognition Settings
- Adjust confidence threshold in backend
- Configure camera resolution
- Set recognition accuracy parameters

## 📦 Deployment

### Frontend Deployment
```bash
npm run build
```

### Backend Deployment
```bash
# Install production dependencies
pip install gunicorn

# Run with Gunicorn
gunicorn -w 4 -b 0.0.0.0:5000 app:app
```

## 🤝 Contributing

1. Fork the repository
2. Create a feature branch
3. Make your changes
4. Test thoroughly
5. Submit a pull request

## 📄 License

This project is licensed under the MIT License.

## 🙏 Acknowledgments

- Built with React and Python
- Face recognition powered by OpenCV and face_recognition
- UI components with TailwindCSS
- Icons by Lucide React

---

**Built with ❤️ for modern HR management**
