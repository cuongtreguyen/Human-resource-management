# Sample test data for Python
test_employee = {
    'id': 1,
    'name': 'Test Employee',
    'email': 'test@company.com',
    'employeeId': 'EMP001'
}

test_attendance = {
    'id': '101',
    'name': 'Test User',
    'date': '2025-11-27',
    'check_in': '09:00:00',
    'check_out': '18:00:00',
    'confidence': 'High',
    'type': 'default'
}

api_endpoints = {
    'java_base': 'http://localhost:8085',
    'flask_base': 'http://localhost:5000',
    'recognition_success': 'http://localhost:8085/api/attendance/face-recognition/recognition-success',
    'attendance_daily': 'http://localhost:8085/api/attendance/daily',
    'attendance_range': 'http://localhost:8085/api/attendance/range',
    'attendance_stats': 'http://localhost:8085/api/attendance/stats'
}
