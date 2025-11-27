import requests
import json
from datetime import datetime, timedelta

# Load test data
try:
    from test_data import test_employee, test_attendance, api_endpoints
except ImportError:
    # Fallback if test_data.py doesn't exist
    api_endpoints = {
        'java_base': 'http://localhost:8085',
        'flask_base': 'http://localhost:5000',
        'recognition_success': 'http://localhost:8085/api/attendance/face-recognition/recognition-success',
        'attendance_daily': 'http://localhost:8085/api/attendance/daily',
        'attendance_range': 'http://localhost:8085/api/attendance/range',
        'attendance_stats': 'http://localhost:8085/api/attendance/stats'
    }
    test_attendance = {
        'id': '101',
        'name': 'Test User',
        'date': datetime.now().strftime('%Y-%m-%d'),
        'check_in': '09:00:00',
        'check_out': '18:00:00',
        'confidence': 'High',
        'type': 'default'
    }

def test_recognition_success():
    \"\"\"Test face recognition success endpoint\"\"\"
    url = api_endpoints['recognition_success']
    payload = {
        'id': test_attendance['id'],
        'name': test_attendance['name'],
        'timestamp': datetime.now().strftime('%Y-%m-%d %H:%M:%S'),
        'confidence': test_attendance['confidence'],
        'type': test_attendance['type']
    }
    response = requests.post(url, json=payload)
    print(f\"Recognition Success: {response.status_code}\")
    print(f\"Response: {response.json()}\")
    return response.json()

def test_attendance_daily(date=None):
    \"\"\"Test daily attendance endpoint\"\"\"
    url = api_endpoints['attendance_daily']
    params = {'date': date} if date else {}
    response = requests.get(url, params=params)
    print(f\"Daily Attendance: {response.status_code}\")
    print(f\"Records: {len(response.json())}\")
    return response.json()

def test_attendance_range(start_date, end_date):
    \"\"\"Test attendance range endpoint\"\"\"
    url = api_endpoints['attendance_range']
    params = {'startDate': start_date, 'endDate': end_date}
    response = requests.get(url, params=params)
    print(f\"Attendance Range: {response.status_code}\")
    print(f\"Records: {len(response.json())}\")
    return response.json()

def test_attendance_stats(date=None):
    \"\"\"Test attendance stats endpoint\"\"\"
    url = api_endpoints['attendance_stats']
    params = {'date': date} if date else {}
    response = requests.get(url, params=params)
    print(f\"Attendance Stats: {response.status_code}\")
    print(f\"Stats: {response.json()}\")
    return response.json()

if __name__ == '__main__':
    print('Testing Java API endpoints...')
    print('=' * 50)
    
    # Test recognition success
    print('\n1. Testing Recognition Success:')
    test_recognition_success()
    
    # Test daily attendance
    print('\n2. Testing Daily Attendance:')
    today = datetime.now().strftime('%Y-%m-%d')
    test_attendance_daily(today)
    
    # Test attendance range
    print('\n3. Testing Attendance Range:')
    start_date = (datetime.now() - timedelta(days=7)).strftime('%Y-%m-%d')
    end_date = datetime.now().strftime('%Y-%m-%d')
    test_attendance_range(start_date, end_date)
    
    # Test stats
    print('\n4. Testing Attendance Stats:')
    test_attendance_stats()
    
    print('\nâœ… All tests completed!')
