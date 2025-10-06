from flask import Flask, jsonify
from flask_cors import CORS
from datetime import datetime

app = Flask(__name__)
CORS(app, origins=['http://localhost:5173', 'http://127.0.0.1:5173'])

@app.route('/api/status', methods=['GET'])
def get_status():
    """Check API status"""
    return jsonify({
        'status': 'connected',
        'message': 'Face Recognition API is running',
        'timestamp': datetime.now().isoformat()
    })

@app.route('/api/test', methods=['GET'])
def test():
    """Test endpoint"""
    return jsonify({
        'success': True,
        'message': 'API is working!'
    })

if __name__ == '__main__':
    print("Starting Face Recognition API...")
    print("Available endpoints:")
    print("- GET  /api/status")
    print("- GET  /api/test")
    print("API will be available at: http://localhost:5000")
    
    app.run(host='0.0.0.0', port=5000, debug=True)
