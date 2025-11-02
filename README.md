# Human Resource Management System

A comprehensive HR management system with **Face Recognition Attendance** built with React.

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

## 📋 Prerequisites

- **Node.js** (v16.x or higher)
- **npm** or **yarn**

## 🚀 Quick Start

### Frontend Setup

```bash
# Install dependencies
npm install

# Start development server
npm run dev
```

The frontend will be available at `http://localhost:5173`

<<<<<<< HEAD
=======
### 2. Backend Setup

The backend is now in a separate `backend/` directory and can run independently.

**Option 1: Using startup scripts (Recommended)**

**Windows:**
```bash
start-face-recognition-backend.bat
```

**Linux/Mac:**
```bash
chmod +x start-face-recognition-backend.sh
./start-face-recognition-backend.sh
```

**Option 2: Manual setup**

```bash
# Navigate to backend directory
cd backend

# Install Python dependencies
pip install -r requirements.txt

# Start the Flask API
python face_recognition_api.py
```

**Option 3: Using Docker**

```bash
docker-compose up
```

The backend API will be available at `http://localhost:5000`

>>>>>>> ccac82d (feat: Add Face Recognition features and Simple Face Recognition component)
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
<<<<<<< HEAD
=======
├── backend/                 # Python Flask Backend (chạy độc lập)
│   ├── face_recognition_api.py  # Main Flask application
│   ├── face_recognition.py      # Face recognition script
│   ├── take_photo.py            # Photo capture script
│   ├── train_model.py           # Model training script
│   ├── requirements.txt        # Python dependencies
│   ├── Dockerfile              # Docker configuration
│   ├── README.md               # Backend documentation
│   ├── datasets/               # Training datasets
│   ├── trainer/                # Trained models
│   ├── attendance/             # Attendance records
│   └── logs/                   # Application logs
>>>>>>> ccac82d (feat: Add Face Recognition features and Simple Face Recognition component)
├── public/                 # Static assets
└── dist/                   # Built application
```

## 🎯 Face Recognition System

### How It Works

1. **User Registration**
   - Enter User ID and Full Name
   - Take multiple photos from different angles
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
VITE_API_URL=http://localhost:8080
VITE_APP_NAME=HR Management System
```

## 📦 Deployment

### Frontend Deployment
```bash
npm run build
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

- UI components with TailwindCSS
- Icons by Lucide React

---

**Built with ❤️ for modern HR management**
