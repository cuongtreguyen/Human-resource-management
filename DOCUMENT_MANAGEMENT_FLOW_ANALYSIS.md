# 📄 PHÂN TÍCH LUỒNG QUẢN LÝ TÀI LIỆU

**Ngày phân tích:** $(date)  
**Mục tiêu:** Kiểm tra luồng tài liệu và đề xuất phân loại theo role

---

## 🔍 PHÂN TÍCH HIỆN TRẠNG

### **1. Cấu trúc hiện tại:**

#### **A. Routes & Permissions:**

| Route | Component | Access | Quyền |
|-------|-----------|--------|------|
| `/documents` | `Documents.jsx` | Manager & Accountant | ✅ Upload, View, Download, Delete |
| `/employee/documents` | `EmployeeDocuments.jsx` | Employee | ✅ View, Download (chỉ) |

#### **B. Access Level trong fakeApi.js:**

```javascript
// Các mức truy cập hiện có:
accessLevel: 'all'                    // Tất cả có thể xem
accessLevel: 'admin,accountant'       // Chỉ Admin và Accountant
accessLevel: 'manager,admin'          // Chỉ Manager và Admin
```

**Ví dụ trong fakeApi.js:**
- `Employee Handbook 2024.pdf` → `accessLevel: 'all'`
- `Payroll Guidelines.docx` → `accessLevel: 'admin,accountant'`
- `Performance Review Template.docx` → `accessLevel: 'manager,admin'`

---

## ❌ VẤN ĐỀ PHÁT HIỆN

### **1. Documents.jsx (Manager/Accountant):**

**Vấn đề:**
- ❌ **Không filter theo `accessLevel`** - Hiển thị tất cả tài liệu
- ❌ **Không kiểm tra quyền khi upload** - Có thể upload tài liệu với accessLevel không phù hợp
- ❌ **Không có field `accessLevel` trong form upload**

**Code hiện tại:**
```javascript
// src/pages/Documents.jsx:113-140
useEffect(() => {
  setDocuments(mockDocuments); // ❌ Dùng mock data, không filter
}, [mockDocuments]);

const handleFileUpload = (e) => {
  // ❌ Không có accessLevel trong form
  const newDocument = {
    id: Date.now(),
    name: uploadFile.name,
    category: 'contracts', // Default category
    // ❌ Thiếu: accessLevel
  };
};
```

### **2. EmployeeDocuments.jsx (Employee):**

**Vấn đề:**
- ❌ **Không filter theo `accessLevel`** - Có thể hiển thị tài liệu không được phép xem
- ❌ **Dùng hardcoded data** - Không gọi API `getDocuments()` và filter

**Code hiện tại:**
```javascript
// src/pages/employee/Documents.jsx:4-11
const docs = [
  // ❌ Hardcoded data, không có accessLevel check
  { id: 1, name: 'Quy chế công ty.pdf', ... },
  // ...
];
```

### **3. fakeApi.js:**

**Vấn đề:**
- ⚠️ **Có `accessLevel` nhưng không được sử dụng** trong frontend
- ⚠️ **Thiếu helper function** để check quyền truy cập

---

## ✅ ĐỀ XUẤT GIẢI PHÁP

### **1. Phân loại tài liệu theo Role:**

#### **A. Tài liệu dành cho Employee:**

| Loại | Ví dụ | Access Level |
|------|-------|--------------|
| **Quy định công ty** | Quy chế công ty, Nội quy lao động | `all` |
| **Biểu mẫu** | Đơn xin nghỉ phép, Đơn đề xuất | `all` |
| **Hướng dẫn** | Hướng dẫn chấm công, Hướng dẫn sử dụng hệ thống | `all` |
| **Tài liệu cá nhân** | Hợp đồng lao động, Bảng lương của mình | `employee` (chỉ nhân viên đó) |
| **Chứng chỉ** | Chứng chỉ đào tạo của mình | `employee` (chỉ nhân viên đó) |

#### **B. Tài liệu dành cho Accountant:**

| Loại | Ví dụ | Access Level |
|------|-------|--------------|
| **Hướng dẫn tính lương** | Payroll Guidelines, Tax Calculation Guide | `admin,accountant` |
| **Báo cáo tài chính** | Financial Reports, Budget Reports | `admin,accountant` |
| **Mẫu kế toán** | Accounting Templates, Invoice Templates | `admin,accountant` |
| **Quy định thuế** | Tax Regulations, Compliance Documents | `admin,accountant` |

#### **C. Tài liệu dành cho Manager:**

| Loại | Ví dụ | Access Level |
|------|-------|--------------|
| **Mẫu đánh giá** | Performance Review Template | `manager,admin` |
| **Hướng dẫn quản lý** | Management Guidelines, Leadership Guide | `manager,admin` |
| **Báo cáo nhân sự** | HR Reports, Department Reports | `manager,admin` |
| **Chính sách nội bộ** | Internal Policies (confidential) | `manager,admin` |

#### **D. Tài liệu dành cho Admin:**

| Loại | Ví dụ | Access Level |
|------|-------|--------------|
| **Tài liệu bảo mật** | Security Policies, System Config | `admin` |
| **Báo cáo tổng hợp** | Company-wide Reports | `admin` |
| **Tài liệu hệ thống** | System Documentation | `admin` |

---

### **2. Cấu trúc Access Level đề xuất:**

```javascript
// Các mức truy cập:
'all'                          // Tất cả nhân viên
'employee'                     // Chỉ nhân viên (xem tài liệu của mình)
'accountant'                   // Chỉ Accountant
'admin,accountant'             // Admin và Accountant
'manager,admin'               // Manager và Admin
'manager'                     // Chỉ Manager
'admin'                       // Chỉ Admin
```

**Lưu ý:** `'employee'` có thể cần thêm logic để chỉ cho phép nhân viên xem tài liệu của chính mình (ví dụ: hợp đồng lao động, bảng lương).

---

### **3. Cải thiện Code:**

#### **A. Tạo Helper Function:**

```javascript
// src/utils/documentPermissions.js
export const canViewDocument = (document, userRole, employeeId = null) => {
  const { accessLevel, uploadedBy, employeeId: docEmployeeId } = document;
  
  // Admin xem được tất cả
  if (userRole === 'admin') return true;
  
  // Tài liệu công khai
  if (accessLevel === 'all') return true;
  
  // Tài liệu dành cho employee (chỉ xem của mình)
  if (accessLevel === 'employee') {
    return userRole === 'employee' && employeeId === docEmployeeId;
  }
  
  // Tài liệu dành cho accountant
  if (accessLevel === 'accountant') {
    return userRole === 'accountant';
  }
  
  // Tài liệu dành cho manager
  if (accessLevel === 'manager') {
    return userRole === 'manager';
  }
  
  // Multiple roles (comma-separated)
  if (accessLevel.includes(',')) {
    const allowedRoles = accessLevel.split(',').map(r => r.trim());
    return allowedRoles.includes(userRole);
  }
  
  return false;
};

export const canUploadDocument = (userRole) => {
  // Chỉ Manager, Accountant, Admin được upload
  return ['manager', 'accountant', 'admin'].includes(userRole);
};

export const canDeleteDocument = (document, userRole, uploadedBy) => {
  // Admin xóa được tất cả
  if (userRole === 'admin') return true;
  
  // User chỉ xóa được tài liệu mình upload
  return userRole === uploadedBy;
};
```

#### **B. Sửa Documents.jsx:**

```javascript
// src/pages/Documents.jsx
import { canViewDocument, canUploadDocument } from '../utils/documentPermissions';
import { getRole } from '../utils/auth';
import fakeApi from '../services/fakeApi';

const Documents = () => {
  const userRole = getRole();
  const [documents, setDocuments] = useState([]);
  
  useEffect(() => {
    loadDocuments();
  }, []);
  
  const loadDocuments = async () => {
    const response = await fakeApi.getDocuments();
    if (response.success) {
      // ✅ Filter theo accessLevel
      const filtered = response.data.filter(doc => 
        canViewDocument(doc, userRole)
      );
      setDocuments(filtered);
    }
  };
  
  const handleFileUpload = async (e) => {
    e.preventDefault();
    if (!uploadFile) return;
    
    // ✅ Thêm accessLevel vào form
    const documentData = {
      name: uploadFile.name,
      category: selectedCategory,
      accessLevel: selectedAccessLevel, // ✅ Mới thêm
      // ...
    };
    
    const response = await fakeApi.uploadDocument(documentData);
    if (response.success) {
      loadDocuments(); // Reload
    }
  };
  
  // ✅ Thêm select cho accessLevel trong form upload
  return (
    // ...
    <select value={selectedAccessLevel} onChange={...}>
      <option value="all">Tất cả nhân viên</option>
      {userRole === 'accountant' && (
        <option value="admin,accountant">Admin & Kế toán</option>
      )}
      {userRole === 'manager' && (
        <option value="manager,admin">Quản lý & Admin</option>
      )}
      {userRole === 'admin' && (
        <>
          <option value="admin">Chỉ Admin</option>
          <option value="manager">Chỉ Quản lý</option>
          <option value="accountant">Chỉ Kế toán</option>
        </>
      )}
    </select>
  );
};
```

#### **C. Sửa EmployeeDocuments.jsx:**

```javascript
// src/pages/employee/Documents.jsx
import { canViewDocument } from '../../utils/documentPermissions';
import { getRole, getCurrentEmployeeId } from '../../utils/auth';
import fakeApi from '../../services/fakeApi';

const EmployeeDocuments = () => {
  const userRole = getRole();
  const employeeId = getCurrentEmployeeId();
  const [documents, setDocuments] = useState([]);
  
  useEffect(() => {
    loadDocuments();
  }, []);
  
  const loadDocuments = async () => {
    const response = await fakeApi.getDocuments();
    if (response.success) {
      // ✅ Filter theo accessLevel
      const filtered = response.data.filter(doc => 
        canViewDocument(doc, userRole, employeeId)
      );
      setDocuments(filtered);
    }
  };
  
  // ✅ Không có nút upload (chỉ xem)
};
```

---

## 📋 PHÂN LOẠI TÀI LIỆU ĐỀ XUẤT

### **1. Theo Category:**

```javascript
const DOCUMENT_CATEGORIES = {
  // Tài liệu công khai (all)
  'policy': { name: 'Chính sách', accessLevel: 'all' },
  'handbook': { name: 'Sổ tay', accessLevel: 'all' },
  'forms': { name: 'Biểu mẫu', accessLevel: 'all' },
  'guide': { name: 'Hướng dẫn', accessLevel: 'all' },
  
  // Tài liệu tài chính (accountant)
  'finance': { name: 'Tài chính', accessLevel: 'admin,accountant' },
  'payroll': { name: 'Lương', accessLevel: 'admin,accountant' },
  'tax': { name: 'Thuế', accessLevel: 'admin,accountant' },
  
  // Tài liệu quản lý (manager)
  'hr': { name: 'Nhân sự', accessLevel: 'manager,admin' },
  'evaluation': { name: 'Đánh giá', accessLevel: 'manager,admin' },
  'report': { name: 'Báo cáo', accessLevel: 'manager,admin' },
  
  // Tài liệu cá nhân (employee)
  'contract': { name: 'Hợp đồng', accessLevel: 'employee' },
  'payslip': { name: 'Bảng lương', accessLevel: 'employee' },
  'certificate': { name: 'Chứng chỉ', accessLevel: 'employee' },
};
```

### **2. Theo Role khi Upload:**

**Khi Manager upload:**
- Có thể chọn: `all`, `manager,admin`, `manager`

**Khi Accountant upload:**
- Có thể chọn: `all`, `admin,accountant`, `accountant`

**Khi Admin upload:**
- Có thể chọn: Tất cả các mức

---

## 🎯 KẾT LUẬN & KHUYẾN NGHỊ

### **✅ Nên làm:**

1. **Phân loại tài liệu theo role:**
   - ✅ Tài liệu công khai (`all`) - Quy định, biểu mẫu, hướng dẫn
   - ✅ Tài liệu kế toán (`admin,accountant`) - Payroll, tax, finance
   - ✅ Tài liệu quản lý (`manager,admin`) - HR reports, evaluation templates
   - ✅ Tài liệu cá nhân (`employee`) - Hợp đồng, bảng lương của mình

2. **Implement access control:**
   - ✅ Tạo helper functions để check quyền
   - ✅ Filter documents theo `accessLevel` khi load
   - ✅ Thêm `accessLevel` vào form upload

3. **UI/UX cải thiện:**
   - ✅ Hiển thị badge "Chỉ dành cho Kế toán" / "Chỉ dành cho Quản lý"
   - ✅ Filter theo category và access level
   - ✅ Employee chỉ thấy tài liệu được phép xem

### **❌ Không nên:**

- ❌ Cho Employee upload tài liệu công khai (chỉ Manager/Accountant/Admin)
- ❌ Hiển thị tài liệu không được phép xem
- ❌ Cho phép xóa tài liệu của người khác (trừ Admin)

---

## 📝 CHECKLIST TRIỂN KHAI

- [ ] Tạo `src/utils/documentPermissions.js` với helper functions
- [ ] Sửa `Documents.jsx` - Filter theo accessLevel, thêm accessLevel vào form upload
- [ ] Sửa `EmployeeDocuments.jsx` - Filter theo accessLevel, gọi API thay vì hardcoded
- [ ] Cập nhật `fakeApi.js` - Thêm logic check accessLevel trong `getDocuments()`
- [ ] Thêm UI badges để hiển thị access level
- [ ] Test với các role khác nhau

---

**Báo cáo được tạo bởi:** AI Assistant  
**Ngày:** $(date)

