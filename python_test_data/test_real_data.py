import requests
import json
from datetime import datetime

# Load real data
try:
    from employees import employees
    print(f"âœ… Loaded {len(employees)} employees from database")
    if len(employees) > 0:
        test_emp = employees[0]
        print(f"   Using: {test_emp.get('fullName', 'Unknown')} (ID: {test_emp.get('employeeId', test_emp.get('id'))})")
except ImportError:
    print("âš ï¸  No employees.py found")
    employees = []

try:
    from attendance import attendance_data
    print(f"âœ… Loaded {len(attendance_data)} attendance records")
except ImportError:
    print("âš ï¸  No attendance.py found")
    attendance_data = []

try:
    from stats import attendance_stats
    print(f"âœ… Loaded stats: {attendance_stats}")
except ImportError:
    print("âš ï¸  No stats.py found")
    attendance_stats = {}

# API endpoints
BASE_URL = "http://localhost:8085"

def test_recognition_success():
    \"\"\"Test vá»›i employee thá»±c tá»« database\"\"\"
    if not employees:
        print("âŒ No employees data to test")
        return
    
    emp = employees[0]
    url = f"{BASE_URL}/api/attendance/face-recognition/recognition-success"
    payload = {
        'id': str(emp.get('employeeId') or emp.get('id')),
        'name': emp.get('fullName', 'Test User'),
        'timestamp': datetime.now().strftime('%Y-%m-%d %H:%M:%S'),
        'confidence': 'High',
        'type': 'default'
    }
    
    print(f"\nðŸ“¤ POST {url}")
    print(f"   Payload: {json.dumps(payload, indent=2)}")
    try:
        response = requests.post(url, json=payload, timeout=10)
        print(f"   Status: {response.status_code}")
        print(f"   Response: {json.dumps(response.json(), indent=2)}")
        return response.status_code == 200
    except Exception as e:
        print(f"   âŒ Error: {e}")
        return False

def test_attendance_daily():
    \"\"\"Test daily attendance\"\"\"
    url = f"{BASE_URL}/api/attendance/daily"
    today = datetime.now().strftime('%Y-%m-%d')
    params = {'date': today}
    
    print(f"\nðŸ“¤ GET {url}")
    print(f"   Params: {params}")
    try:
        response = requests.get(url, params=params, timeout=10)
        print(f"   Status: {response.status_code}")
        data = response.json()
        print(f"   Records: {len(data)}")
        if len(data) > 0:
            print(f"   First: {json.dumps(data[0], indent=2)}")
        return response.status_code == 200
    except Exception as e:
        print(f"   âŒ Error: {e}")
        return False

def test_attendance_stats():
    \"\"\"Test stats\"\"\"
    url = f"{BASE_URL}/api/attendance/stats"
    
    print(f"\nðŸ“¤ GET {url}")
    try:
        response = requests.get(url, timeout=10)
        print(f"   Status: {response.status_code}")
        data = response.json()
        print(f"   Stats: {json.dumps(data, indent=2)}")
        return response.status_code == 200
    except Exception as e:
        print(f"   âŒ Error: {e}")
        return False

if __name__ == '__main__':
    print("=" * 60)
    print("Testing Java API vá»›i REAL DATA tá»« database")
    print("=" * 60)
    
    results = []
    results.append(("Recognition Success", test_recognition_success()))
    results.append(("Daily Attendance", test_attendance_daily()))
    results.append(("Attendance Stats", test_attendance_stats()))
    
    print("\n" + "=" * 60)
    print("Results:")
    for name, success in results:
        status = "âœ… PASS" if success else "âŒ FAIL"
        print(f"  {status} - {name}")
    print("=" * 60)
