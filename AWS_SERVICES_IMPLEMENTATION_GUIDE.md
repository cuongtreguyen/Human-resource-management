# AWS Services Implementation Guide
## HR Management System with Face Recognition

## 🎯 Tổng quan triển khai

Dự án HR Management System của bạn sẽ được triển khai trên AWS với kiến trúc serverless, tận dụng các dịch vụ AWS để tối ưu hóa chi phí và hiệu suất.

## 📋 Danh sách AWS Services cần thiết

### 1. Frontend Hosting
**Amazon S3 + CloudFront**
- **Lý do sử dụng**: Host static React application với CDN global
- **Chi phí**: ~$5-20/tháng (tùy traffic)
- **Cấu hình**:
  ```bash
  # Build React app
  npm run build
  # Upload to S3
  aws s3 sync dist/ s3://hr-frontend-bucket --delete
  # Invalidate CloudFront cache
  aws cloudfront create-invalidation --distribution-id E1234567890 --paths "/*"
  ```

### 2. API Backend
**AWS Lambda + API Gateway**
- **Lý do sử dụng**: Serverless, tự động scale, pay-per-use
- **Chi phí**: ~$10-50/tháng (tùy số lượng requests)
- **Migration từ Flask**:
  ```python
  # Thay vì Flask app
  from flask import Flask
  app = Flask(__name__)
  
  # Sử dụng Lambda handler
  def lambda_handler(event, context):
      # Process API Gateway event
      return {
          'statusCode': 200,
          'body': json.dumps(response)
      }
  ```

### 3. Face Recognition Engine
**Amazon Rekognition + Lambda**
- **Lý do sử dụng**: AWS managed AI service, không cần maintain OpenCV
- **Chi phí**: ~$1-5/tháng (tùy số lượng ảnh xử lý)
- **Thay thế OpenCV**:
  ```python
  # Thay vì OpenCV + face_recognition
  import boto3
  rekognition = boto3.client('rekognition')
  
  # Face detection
  response = rekognition.detect_faces(
      Image={'Bytes': image_bytes},
      Attributes=['ALL']
  )
  
  # Face comparison
  response = rekognition.compare_faces(
      SourceImage={'Bytes': source_image},
      TargetImage={'Bytes': target_image}
  )
  ```

### 4. Database
**Amazon RDS (PostgreSQL) + DynamoDB**
- **RDS**: HR data, employee records, payroll
- **DynamoDB**: Real-time attendance logs, session data
- **Chi phí**: ~$20-100/tháng (tùy instance size)
- **Migration từ JSON files**:
  ```sql
  -- Tạo bảng employees
  CREATE TABLE employees (
      id SERIAL PRIMARY KEY,
      employee_code VARCHAR(50) UNIQUE,
      full_name VARCHAR(255),
      department VARCHAR(100),
      position VARCHAR(100),
      face_image_url TEXT,
      created_at TIMESTAMP DEFAULT NOW()
  );
  
  -- Tạo bảng attendance
  CREATE TABLE attendance (
      id SERIAL PRIMARY KEY,
      employee_id INTEGER REFERENCES employees(id),
      date DATE,
      check_in_time TIMESTAMP,
      check_out_time TIMESTAMP,
      face_recognition_confidence DECIMAL(5,4)
  );
  ```

### 5. File Storage
**Amazon S3**
- **Lý do sử dụng**: Scalable, durable, cost-effective
- **Chi phí**: ~$5-15/tháng (tùy storage size)
- **Buckets cần tạo**:
  - `hr-documents-bucket`: HR documents
  - `hr-face-images-bucket`: Employee photos
  - `hr-models-bucket`: Face recognition models

### 6. Real-time Communication
**WebSocket API + DynamoDB**
- **Lý do sử dụng**: Real-time updates cho attendance
- **Chi phí**: ~$5-20/tháng (tùy connections)
- **Implementation**:
  ```javascript
  // Frontend WebSocket connection
  const ws = new WebSocket('wss://api.hr-system.com/ws');
  ws.onmessage = (event) => {
      const data = JSON.parse(event.data);
      if (data.type === 'attendance_update') {
          updateAttendanceDisplay(data.employee);
      }
  };
  ```

### 7. Notifications
**Amazon SNS + SQS**
- **Lý do sử dụng**: Reliable message delivery
- **Chi phí**: ~$1-5/tháng (tùy số lượng messages)
- **Use cases**:
  - Attendance notifications
  - Payroll alerts
  - System status updates

### 8. Security & Monitoring
**AWS IAM + CloudWatch + Secrets Manager**
- **IAM**: Access control và permissions
- **CloudWatch**: Logging và monitoring
- **Secrets Manager**: API keys và credentials
- **Chi phí**: ~$5-15/tháng

## 🚀 Step-by-Step Implementation

### Phase 1: Infrastructure Setup
```bash
# 1. Tạo S3 buckets
aws s3 mb s3://hr-frontend-bucket
aws s3 mb s3://hr-documents-bucket
aws s3 mb s3://hr-face-images-bucket

# 2. Tạo RDS instance
aws rds create-db-instance \
    --db-instance-identifier hr-postgres \
    --db-instance-class db.t3.micro \
    --engine postgres \
    --master-username admin \
    --master-user-password YourPassword123 \
    --allocated-storage 20

# 3. Tạo DynamoDB tables
aws dynamodb create-table \
    --table-name attendance-logs \
    --attribute-definitions \
        AttributeName=employee_id,AttributeType=S \
        AttributeName=timestamp,AttributeType=S \
    --key-schema \
        AttributeName=employee_id,KeyType=HASH \
        AttributeName=timestamp,KeyType=RANGE \
    --billing-mode PAY_PER_REQUEST
```

### Phase 2: Lambda Functions
```python
# hr-api-function.py
import json
import boto3
import psycopg2
from datetime import datetime

def lambda_handler(event, context):
    # Connect to RDS
    conn = psycopg2.connect(
        host='hr-postgres.xxx.rds.amazonaws.com',
        database='hr_management',
        user='admin',
        password='YourPassword123'
    )
    
    # Process API request
    if event['httpMethod'] == 'GET':
        if event['path'] == '/employees':
            return get_employees(conn)
        elif event['path'] == '/attendance':
            return get_attendance(conn, event['queryStringParameters'])
    
    elif event['httpMethod'] == 'POST':
        if event['path'] == '/employees':
            return create_employee(conn, json.loads(event['body']))
        elif event['path'] == '/attendance':
            return record_attendance(conn, json.loads(event['body']))
    
    return {
        'statusCode': 404,
        'body': json.dumps({'error': 'Not found'})
    }

def get_employees(conn):
    cursor = conn.cursor()
    cursor.execute("SELECT * FROM employees")
    employees = cursor.fetchall()
    return {
        'statusCode': 200,
        'body': json.dumps(employees, default=str)
    }
```

### Phase 3: Face Recognition Integration
```python
# face-recognition-function.py
import json
import boto3
import base64
from datetime import datetime

rekognition = boto3.client('rekognition')
s3 = boto3.client('s3')
dynamodb = boto3.resource('dynamodb')

def lambda_handler(event, context):
    if event['path'] == '/face-recognition/register':
        return register_face(event)
    elif event['path'] == '/face-recognition/recognize':
        return recognize_face(event)
    elif event['path'] == '/face-recognition/train':
        return train_model(event)

def register_face(event):
    body = json.loads(event['body'])
    employee_id = body['employee_id']
    image_data = body['image_data']  # Base64 encoded
    
    # Decode image
    image_bytes = base64.b64decode(image_data)
    
    # Store in S3
    s3.put_object(
        Bucket='hr-face-images-bucket',
        Key=f'employees/{employee_id}/face.jpg',
        Body=image_bytes,
        ContentType='image/jpeg'
    )
    
    # Analyze face with Rekognition
    response = rekognition.detect_faces(
        Image={'Bytes': image_bytes},
        Attributes=['ALL']
    )
    
    # Store face data in DynamoDB
    table = dynamodb.Table('face-encodings')
    table.put_item(
        Item={
            'employee_id': employee_id,
            'face_data': response['FaceDetails'][0],
            'created_at': datetime.now().isoformat()
        }
    )
    
    return {
        'statusCode': 200,
        'body': json.dumps({
            'success': True,
            'message': 'Face registered successfully'
        })
    }

def recognize_face(event):
    body = json.loads(event['body'])
    image_data = body['image_data']
    image_bytes = base64.b64decode(image_data)
    
    # Get all registered faces from S3
    s3_objects = s3.list_objects_v2(
        Bucket='hr-face-images-bucket',
        Prefix='employees/'
    )
    
    best_match = None
    best_confidence = 0
    
    for obj in s3_objects['Contents']:
        if obj['Key'].endswith('/face.jpg'):
            # Get stored face image
            stored_image = s3.get_object(
                Bucket='hr-face-images-bucket',
                Key=obj['Key']
            )['Body'].read()
            
            # Compare faces
            response = rekognition.compare_faces(
                SourceImage={'Bytes': stored_image},
                TargetImage={'Bytes': image_bytes},
                SimilarityThreshold=70
            )
            
            if response['FaceMatches']:
                confidence = response['FaceMatches'][0]['Similarity']
                if confidence > best_confidence:
                    best_confidence = confidence
                    employee_id = obj['Key'].split('/')[1]
                    best_match = {
                        'employee_id': employee_id,
                        'confidence': confidence
                    }
    
    if best_match:
        # Record attendance
        record_attendance(best_match['employee_id'])
        
        return {
            'statusCode': 200,
            'body': json.dumps({
                'success': True,
                'employee_id': best_match['employee_id'],
                'confidence': best_match['confidence']
            })
        }
    else:
        return {
            'statusCode': 404,
            'body': json.dumps({
                'success': False,
                'message': 'No matching face found'
            })
        }
```

### Phase 4: Frontend Deployment
```bash
# Build React app
npm run build

# Upload to S3
aws s3 sync dist/ s3://hr-frontend-bucket --delete

# Configure S3 for static website hosting
aws s3 website s3://hr-frontend-bucket --index-document index.html --error-document index.html

# Create CloudFront distribution
aws cloudfront create-distribution --distribution-config file://cloudfront-config.json
```

### Phase 5: API Gateway Configuration
```json
{
  "swagger": "2.0",
  "info": {
    "title": "HR Management API",
    "version": "1.0.0"
  },
  "paths": {
    "/employees": {
      "get": {
        "x-amazon-apigateway-integration": {
          "type": "aws_proxy",
          "httpMethod": "POST",
          "uri": "arn:aws:apigateway:us-east-1:lambda:path/2015-03-31/functions/arn:aws:lambda:us-east-1:123456789012:function:hr-api-function/invocations"
        }
      },
      "post": {
        "x-amazon-apigateway-integration": {
          "type": "aws_proxy",
          "httpMethod": "POST",
          "uri": "arn:aws:apigateway:us-east-1:lambda:path/2015-03-31/functions/arn:aws:lambda:us-east-1:123456789012:function:hr-api-function/invocations"
        }
      }
    },
    "/face-recognition/register": {
      "post": {
        "x-amazon-apigateway-integration": {
          "type": "aws_proxy",
          "httpMethod": "POST",
          "uri": "arn:aws:apigateway:us-east-1:lambda:path/2015-03-31/functions/arn:aws:lambda:us-east-1:123456789012:function:face-recognition-function/invocations"
        }
      }
    }
  }
}
```

## 💰 Cost Estimation

### Monthly Costs (USD)
- **S3 Storage**: $5-15 (tùy data size)
- **CloudFront**: $5-20 (tùy traffic)
- **Lambda**: $10-50 (tùy requests)
- **API Gateway**: $5-25 (tùy API calls)
- **RDS**: $20-100 (tùy instance size)
- **DynamoDB**: $5-20 (tùy read/write capacity)
- **Rekognition**: $1-5 (tùy số lượng ảnh)
- **SNS/SQS**: $1-5 (tùy messages)
- **CloudWatch**: $5-15 (tùy logs)
- **Total**: ~$57-255/tháng

### Cost Optimization Tips
1. **S3 Lifecycle**: Tự động archive old data
2. **Lambda Reserved Concurrency**: Giảm cold start
3. **RDS Reserved Instances**: Tiết kiệm 30-60%
4. **CloudFront**: Giảm data transfer costs
5. **DynamoDB On-Demand**: Pay per request

## 🔒 Security Best Practices

### IAM Roles
```json
{
  "Version": "2012-10-17",
  "Statement": [
    {
      "Effect": "Allow",
      "Action": [
        "rekognition:DetectFaces",
        "rekognition:CompareFaces"
      ],
      "Resource": "*"
    },
    {
      "Effect": "Allow",
      "Action": [
        "s3:GetObject",
        "s3:PutObject"
      ],
      "Resource": "arn:aws:s3:::hr-face-images-bucket/*"
    }
  ]
}
```

### VPC Configuration
```bash
# Create VPC
aws ec2 create-vpc --cidr-block 10.0.0.0/16

# Create private subnets
aws ec2 create-subnet --vpc-id vpc-12345678 --cidr-block 10.0.1.0/24
aws ec2 create-subnet --vpc-id vpc-12345678 --cidr-block 10.0.2.0/24

# Create security groups
aws ec2 create-security-group --group-name rds-sg --description "RDS Security Group"
```

## 📊 Monitoring & Alerting

### CloudWatch Metrics
```python
import boto3
cloudwatch = boto3.client('cloudwatch')

# Custom metric for face recognition accuracy
cloudwatch.put_metric_data(
    Namespace='HRSystem/FaceRecognition',
    MetricData=[
        {
            'MetricName': 'RecognitionAccuracy',
            'Value': 95.5,
            'Unit': 'Percent'
        }
    ]
)
```

### CloudWatch Alarms
```bash
# Create alarm for high error rate
aws cloudwatch put-metric-alarm \
    --alarm-name "HR-API-High-Error-Rate" \
    --alarm-description "Alarm when error rate exceeds 5%" \
    --metric-name "4XXError" \
    --namespace "AWS/ApiGateway" \
    --statistic "Sum" \
    --period 300 \
    --threshold 10 \
    --comparison-operator "GreaterThanThreshold"
```

## 🚀 Deployment Automation

### GitHub Actions CI/CD
```yaml
# .github/workflows/deploy.yml
name: Deploy to AWS

on:
  push:
    branches: [ main ]

jobs:
  deploy:
    runs-on: ubuntu-latest
    steps:
    - uses: actions/checkout@v2
    
    - name: Configure AWS credentials
      uses: aws-actions/configure-aws-credentials@v1
      with:
        aws-access-key-id: ${{ secrets.AWS_ACCESS_KEY_ID }}
        aws-secret-access-key: ${{ secrets.AWS_SECRET_ACCESS_KEY }}
        aws-region: us-east-1
    
    - name: Build React app
      run: |
        npm install
        npm run build
    
    - name: Deploy to S3
      run: |
        aws s3 sync dist/ s3://hr-frontend-bucket --delete
    
    - name: Deploy Lambda functions
      run: |
        cd lambda
        zip -r hr-api-function.zip .
        aws lambda update-function-code \
          --function-name hr-api-function \
          --zip-file fileb://hr-api-function.zip
```

## 🎯 Migration Timeline

### Week 1-2: Infrastructure Setup
- Tạo AWS accounts và services
- Setup VPC, security groups
- Tạo RDS và DynamoDB

### Week 3-4: Backend Migration
- Convert Flask API to Lambda functions
- Setup API Gateway
- Test API endpoints

### Week 5-6: Face Recognition Migration
- Replace OpenCV with Amazon Rekognition
- Test face registration and recognition
- Optimize recognition accuracy

### Week 7-8: Frontend Deployment
- Deploy React app to S3/CloudFront
- Update API endpoints
- Test end-to-end functionality

### Week 9-10: Testing & Optimization
- Load testing
- Security testing
- Cost optimization
- Performance tuning

## 📝 Next Steps

1. **Create AWS Account** và setup billing alerts
2. **Review Architecture** và adjust theo requirements
3. **Start with Phase 1** - Infrastructure setup
4. **Gradual Migration** từ local development
5. **Monitor Costs** và optimize continuously

## 🆘 Support & Resources

- **AWS Documentation**: https://docs.aws.amazon.com/
- **AWS Free Tier**: https://aws.amazon.com/free/
- **AWS Well-Architected Framework**: https://aws.amazon.com/architecture/well-architected/
- **AWS Cost Calculator**: https://calculator.aws/
