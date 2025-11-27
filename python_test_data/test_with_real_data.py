import requests
import json
from datetime import datetime, timedelta

# API Endpoints
API_BASE = "http://localhost:8085"
ENDPOINTS = {
    'recognition_success': f'{API_BASE}/api/attendance/face-recognition/recognition-success',
    'attendance_daily': f'{API_BASE}/api/attendance/daily',
    'attendance_range': f'{API_BASE}/api/attendance/range',
    'attendance_stats': f'{API_BASE}/api/attendance/stats',
    'attendance_employee': f'{API_BASE}/api/attendance/employee/flask',
}

# Load real data if available
try:
    from employees import employees
    print(f"Loaded {len(employees)} employees from database")
    if len(employees) > 0:
        test_employee = employees[0]
        print(f"Using employee: {test_employee.get('fullName', 'Unknown')} (ID: {test_employee.get('id')})")
except ImportError:
    print("No employees.py found, using sample data")
    test_employee = {'id': 1, 'employeeId': '101', 'fullName': 'Test User'}

try:
    from attendance import attendance_data
    print(f"Loaded {len(attendance_data)} attendance records from database")
except ImportError:
    print("No attendance.py found")
    attendance_data = []

try:
    from stats import attendance_stats
    print(f"Loaded stats: {attendance_stats}")
except ImportError:
    print("No stats.py found")
    attendance_stats = {}

def test_recognition_success(employee_id=None, name=None):
    \"\"\"Test face recognition success endpoint vá»›i data thá»±c\"\"\"
    url = ENDPOINTS['recognition_success']
    payload = {
        'id': str(employee_id) if employee_id else test_employee.get('employeeId', '101'),
        'name': name if name else test_employee.get('fullName', 'Test User'),
        'timestamp': datetime.now().strftime('%Y-%m-%d %H:%M:%S'),
        'confidence': 'High',
        'type': 'default'
    }
    print(f"\n1. Testing Recognition Success:")
    print(f"   URL: {url}")
    print(f"   Payload: {json.dumps(payload, indent=2)}")
    try:
        response = requests.post(url, json=payload, timeout=10)
        print(f"   Status: {response.status_code}")
        print(f"   Response: {json.dumps(response.json(), indent=2)}")
        return response.json()
    except Exception as e:
        print(f"   Error: {e}")
        return None

def test_attendance_daily(date=None):
    \"\"\"Test daily attendance vá»›i data thá»±c\"\"\"
    url = ENDPOINTS['attendance_daily']
    params = {'date': date} if date else {}
    print(f"\n2. Testing Daily Attendance:")
    print(f"   URL: {url}")
    print(f"   Params: {params}")
    try:
        response = requests.get(url, params=params, timeout=10)
        print(f"   Status: {response.status_code}")
        data = response.json()
        print(f"   Records: {len(data)}")
        if len(data) > 0:
            print(f"   First record: {json.dumps(data[0], indent=2)}")
        return data
    except Exception as e:
        print(f"   Error: {e}")
        return []

def test_attendance_range(start_date, end_date):
    \"\"\"Test attendance range vá»›i data thá»±c\"\"\"
    url = ENDPOINTS['attendance_range']
    params = {'startDate': start_date, 'endDate': end_date}
    print(f"\n3. Testing Attendance Range:")
    print(f"   URL: {url}")
    print(f"   Params: {params}")
    try:
        response = requests.get(url, params=params, timeout=10)
        print(f"   Status: {response.status_code}")
        data = response.json()
        print(f"   Records: {len(data)}")
        return data
    except Exception as e:
        print(f"   Error: {e}")
        return []

def test_attendance_stats(date=None):
    \"\"\"Test attendance stats vá»›i data thá»±c\"\"\"
    url = ENDPOINTS['attendance_stats']
    params = {'date': date} if date else {}
    print(f"\n4. Testing Attendance Stats:")
    print(f"   URL: {url}")
    print(f"   Params: {params}")
    try:
        response = requests.get(url, params=params, timeout=10)
        print(f"   Status: {response.status_code}")
        data = response.json()
        print(f"   Stats: {json.dumps(data, indent=2)}")
        return data
    except Exception as e:
        print(f"   Error: {e}")
        return {}

if __name__ == '__main__':
    print("=" * 60)
    print("Testing Java API vá»›i REAL DATA tá»« database")
    print("=" * 60)
    
    # Test vá»›i employee thá»±c náº¿u cÃ³
    employee_id = test_employee.get('employeeId') or test_employee.get('id')
    employee_name = test_employee.get('fullName', 'Test User')
    
    # Test 1: Recognition Success
    test_recognition_success(employee_id, employee_name)
    
    # Test 2: Daily Attendance
    today = datetime.now().strftime('%Y-%m-%d')
    test_attendance_daily(today)
    
    # Test 3: Attendance Range
    start_date = (datetime.now() - timedelta(days=7)).strftime('%Y-%m-%d')
    end_date = datetime.now().strftime('%Y-%m-%d')
    test_attendance_range(start_date, end_date)
    
    # Test 4: Stats
    test_attendance_stats()
    
    print("\n" + "=" * 60)
    print("âœ… All tests completed!")
    print("=" * 60)
