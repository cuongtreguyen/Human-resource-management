# Components Structure

Cấu trúc components được tổ chức để dễ tìm kiếm và quản lý.

## 📁 Cấu trúc thư mục

```
components/
├── common/           # Components dùng chung
│   ├── ProtectedRoute.jsx
│   └── index.js
│
├── ui/              # UI components cơ bản (reusable)
│   ├── Button.jsx
│   ├── Card.jsx
│   ├── Input.jsx
│   ├── Modal.jsx
│   ├── Select.jsx
│   └── index.js
│
├── layout/          # Layout components
│   ├── Layout.jsx
│   ├── Header.jsx
│   ├── Sidebar.jsx
│   ├── EmployeeLayout.jsx
│   └── index.js
│
├── features/        # Feature-specific components
│   ├── FaceRecognitionWidget.jsx
│   ├── DelegationDetailModal.jsx
│   ├── DelegationGuide.jsx
│   ├── SimpleFaceRecognition.jsx
│   └── index.js
│
└── index.js         # Barrel export cho tất cả components
```

## 📦 Cách sử dụng

### Import từ common
```jsx
import { ProtectedRoute } from '../components/common';
```

### Import từ ui
```jsx
import { Button, Card, Input, Modal, Select } from '../components/ui';
// hoặc
import Button from '../components/ui/Button';
```

### Import từ layout
```jsx
import { Layout, Header, Sidebar, EmployeeLayout } from '../components/layout';
// hoặc
import Layout from '../components/layout/Layout';
```

### Import từ features
```jsx
import { FaceRecognitionWidget, DelegationDetailModal } from '../components/features';
```

### Import tất cả (không khuyến khích, chỉ dùng khi cần nhiều components)
```jsx
import { Button, Card, Layout, ProtectedRoute } from '../components';
```

## 🎯 Quy tắc tổ chức

### Common (`components/common/`)
- Components dùng chung cho toàn bộ app
- Không phụ thuộc vào business logic cụ thể
- Ví dụ: ProtectedRoute, ErrorBoundary, LoadingSpinner

### UI (`components/ui/`)
- UI components cơ bản, có thể tái sử dụng
- Không có business logic
- Ví dụ: Button, Card, Input, Modal, Select

### Layout (`components/layout/`)
- Components cho layout/structure
- Ví dụ: Layout, Header, Sidebar, Footer

### Features (`components/features/`)
- Components dành cho feature cụ thể
- Có business logic liên quan đến feature
- Ví dụ: FaceRecognitionWidget, DelegationDetailModal

## ✅ Best Practices

1. **Sử dụng named export** thông qua index.js
2. **Import từ đúng category** để dễ tìm
3. **Không import trực tiếp từ thư mục con** nếu có index.js
4. **Đặt tên component theo PascalCase**
5. **Một component một file**

