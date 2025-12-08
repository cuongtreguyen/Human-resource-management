// import React, { useState, useEffect } from 'react';
// import { useNavigate } from 'react-router-dom';
// import Layout from '../../components/layout/Layout';
// import Card from '../../components/ui/Card';
// import Button from '../../components/ui/Button';
// import Input from '../../components/ui/Input';
// import Select from '../../components/ui/Select';
// import {
//   Clock,
//   AlertCircle,
//   CheckCircle,
//   Eye,
//   FileText,
//   X,
//   User,
//   Calendar,
//   MessageSquare
// } from 'lucide-react';
// import fakeApi from '../../services/fakeApi';
// import { toast } from 'react-toastify';
// import { getRole } from '../../utils/auth';
// import { logApproveLeave, logRejectLeave } from '../../utils/systemLogger';
// import { getLeaveTypeName, getLeaveTypeColor } from '../../constants/leaveTypes';

// const LeaveManagement = () => {
//   const userRole = getRole();
//   const navigate = useNavigate();

//   // Màu sắc theo role
//   const getBannerColor = () => {
//     switch (userRole) {
//       case 'admin':
//         return 'from-blue-500 to-blue-600';
//       case 'manager':
//         return 'from-purple-600 to-purple-700';
//       case 'accountant':
//         return 'from-emerald-600 to-emerald-700';
//       default:
//         return 'from-orange-500 to-orange-600';
//     }
//   };

//   const getSubtitleColor = () => {
//     switch (userRole) {
//       case 'admin':
//         return 'text-blue-100';
//       case 'manager':
//         return 'text-purple-100';
//       case 'accountant':
//         return 'text-emerald-100';
//       default:
//         return 'text-orange-100';
//     }
//   };
//   const [leaveRequests, setLeaveRequests] = useState([]);
//   const [, setEmployees] = useState([]);
//   const [loading, setLoading] = useState(true);
//   const [filter, setFilter] = useState('all');
//   const [searchTerm, setSearchTerm] = useState('');

//   useEffect(() => {
//     loadData();
//   }, []);

//   const loadData = async () => {
//     try {
//       setLoading(true);
//       const [employeesRes, leaveRequestsRes] = await Promise.all([
//         fakeApi.getEmployees(),
//         fakeApi.getLeaveRequests()
//       ]);

//       setEmployees(employeesRes.data);
//       setLeaveRequests(leaveRequestsRes.data);
//     } catch {
//       console.error('Error loading data');
//     } finally {
//       setLoading(false);
//     }
//   };

//   const getStatusColor = (status) => {
//     switch (status) {
//       case 'approved': return 'bg-green-100 text-green-800';
//       case 'pending': return 'bg-yellow-100 text-yellow-800';
//       case 'rejected': return 'bg-red-100 text-red-800';
//       case 'cancelled': return 'bg-gray-100 text-gray-800';
//       default: return 'bg-gray-100 text-gray-800';
//     }
//   };

//   const getStatusName = (status) => {
//     const statuses = {
//       'approved': 'Đã duyệt',
//       'pending': 'Chờ duyệt',
//       'rejected': 'Từ chối',
//       'cancelled': 'Đã hủy'
//     };
//     return statuses[status] || status;
//   };


//   const handleViewDetail = (request) => {
//     navigate(`/leaves/${request.id}`);
//   };




//   const filteredRequests = leaveRequests.filter(request => {
//     const matchesFilter = filter === 'all' || request.status === filter;
//     const matchesSearch = request.employeeName.toLowerCase().includes(searchTerm.toLowerCase()) ||
//       request.reason.toLowerCase().includes(searchTerm.toLowerCase());
//     return matchesFilter && matchesSearch;
//   });

//   const stats = {
//     total: leaveRequests.length,
//     pending: leaveRequests.filter(r => r.status === 'pending').length,
//     approved: leaveRequests.filter(r => r.status === 'approved').length,
//     rejected: leaveRequests.filter(r => r.status === 'rejected').length
//   };

//   if (loading) {
//     return (
//       <Layout>
//         <div className="min-h-screen bg-gray-50 flex items-center justify-center">
//           <div className="text-center">
//             <div className="animate-spin rounded-full h-32 w-32 border-b-2 border-blue-600 mx-auto"></div>
//             <p className="text-gray-600 mt-4">Đang tải dữ liệu...</p>
//           </div>
//         </div>
//       </Layout>
//     );
//   }

//   return (
//     <Layout>
//       <div className="min-h-screen bg-gray-50 p-6">
//         <div className="max-w-7xl mx-auto">
//           {/* Header */}
//           <div className={`bg-gradient-to-r ${getBannerColor()} text-white p-6 rounded-lg mb-6`}>
//             <div>
//               <h1 className="text-3xl font-bold">Duyệt đơn nghỉ phép</h1>
//               <p className={`${getSubtitleColor()} mt-1`}>
//                 {userRole === 'admin'
//                   ? 'Xem và duyệt tất cả các đơn nghỉ phép (bao gồm accountant và manager)'
//                   : userRole === 'manager'
//                     ? 'Xem và duyệt các đơn nghỉ phép của nhân viên'
//                     : 'Xem các đơn nghỉ phép'}
//               </p>
//             </div>
//           </div>

//           {/* Statistics */}
//           <div className="grid grid-cols-1 md:grid-cols-4 gap-6 mb-6">
//             <Card title="Tổng đơn nghỉ phép" icon={<FileText className="h-5 w-5 text-blue-500" />}>
//               <div className="text-center">
//                 <div className="text-2xl font-bold text-blue-600">{stats.total}</div>
//                 <div className="text-sm text-gray-500">Tổng số đơn</div>
//               </div>
//             </Card>

//             <Card title="Chờ duyệt" icon={<Clock className="h-5 w-5 text-yellow-500" />}>
//               <div className="text-center">
//                 <div className="text-2xl font-bold text-yellow-600">{stats.pending}</div>
//                 <div className="text-sm text-gray-500">Cần xử lý</div>
//               </div>
//             </Card>

//             <Card title="Đã duyệt" icon={<CheckCircle className="h-5 w-5 text-green-500" />}>
//               <div className="text-center">
//                 <div className="text-2xl font-bold text-green-600">{stats.approved}</div>
//                 <div className="text-sm text-gray-500">Đã duyệt</div>
//               </div>
//             </Card>

//             <Card title="Từ chối" icon={<AlertCircle className="h-5 w-5 text-red-500" />}>
//               <div className="text-center">
//                 <div className="text-2xl font-bold text-red-600">{stats.rejected}</div>
//                 <div className="text-sm text-gray-500">Từ chối</div>
//               </div>
//             </Card>
//           </div>

//           {/* Filters */}
//           <Card className="mb-6">
//             <div className="flex items-center space-x-4">
//               <div className="flex-1">
//                 <Input
//                   label="Tìm kiếm"
//                   value={searchTerm}
//                   onChange={(value) => setSearchTerm(value)}
//                   placeholder="Tìm theo tên nhân viên hoặc lý do..."
//                 />
//               </div>
//               <Select
//                 label="Lọc theo trạng thái"
//                 options={[
//                   { value: 'all', label: 'Tất cả' },
//                   { value: 'pending', label: 'Chờ duyệt' },
//                   { value: 'approved', label: 'Đã duyệt' },
//                   { value: 'rejected', label: 'Từ chối' },
//                   { value: 'cancelled', label: 'Đã hủy' }
//                 ]}
//                 value={filter}
//                 onChange={(value) => setFilter(value)}
//                 className="w-48"
//               />
//             </div>
//           </Card>

//           {/* Leave Requests List */}
//           <Card title="Danh sách đơn nghỉ phép">
//             <div className="overflow-x-auto">
//               <table className="w-full">
//                 <thead>
//                   <tr className="border-b border-gray-200">
//                     <th className="text-left py-3 px-4 font-medium text-gray-700">ID</th>
//                     <th className="text-left py-3 px-4 font-medium text-gray-700">NHÂN VIÊN</th>
//                     <th className="text-left py-3 px-4 font-medium text-gray-700">PHÒNG BAN</th>
//                     <th className="text-left py-3 px-4 font-medium text-gray-700">LOẠI NGHỈ</th>
//                     <th className="text-left py-3 px-4 font-medium text-gray-700">THỜI GIAN</th>
//                     <th className="text-left py-3 px-4 font-medium text-gray-700">SỐ NGÀY</th>
//                     <th className="text-left py-3 px-4 font-medium text-gray-700">LÝ DO</th>
//                     <th className="text-left py-3 px-4 font-medium text-gray-700">TRẠNG THÁI</th>
//                     <th className="text-left py-3 px-4 font-medium text-gray-700">HÀNH ĐỘNG</th>
//                   </tr>
//                 </thead>
//                 <tbody>
//                   {filteredRequests.map((request) => (
//                     <tr key={request.id} className="border-b border-gray-100 hover:bg-gray-50">
//                       <td className="py-3 px-4">
//                         <span className="text-sm font-medium text-blue-600">{request.employeeId}</span>
//                       </td>

//                       <td className="py-3 px-4">
//                         <div className="flex items-center space-x-3">
//                           <div className="w-8 h-8 bg-blue-600 text-white rounded-full flex items-center justify-center text-sm font-medium">
//                             {request.employeeName.charAt(0)}
//                           </div>
//                           <span className="font-medium text-gray-900">{request.employeeName}</span>
//                         </div>
//                       </td>

//                       <td className="py-3 px-4">
//                         <span className="text-sm text-gray-700">{request.department || 'Chưa xác định'}</span>
//                       </td>

//                       <td className="py-3 px-4">
//                         <span className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium ${getLeaveTypeColor(request.type)}`}>
//                           {getLeaveTypeName(request.type)}
//                         </span>
//                       </td>

//                       <td className="py-3 px-4">
//                         <div className="text-sm">
//                           <div className="font-medium text-gray-900">
//                             {new Date(request.startDate).toLocaleDateString('vi-VN')}
//                           </div>
//                           <div className="text-gray-500">
//                             đến {new Date(request.endDate).toLocaleDateString('vi-VN')}
//                           </div>
//                         </div>
//                       </td>

//                       <td className="py-3 px-4">
//                         <div className="text-center">
//                           <div className="text-lg font-bold text-gray-900">{request.days}</div>
//                           <div className="text-sm text-gray-500">ngày</div>
//                         </div>
//                       </td>

//                       <td className="py-3 px-4">
//                         <div className="max-w-xs">
//                           <p className="text-sm text-gray-900 truncate" title={request.reason}>
//                             {request.reason}
//                           </p>
//                         </div>
//                       </td>

//                       <td className="py-3 px-4">
//                         <span className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium ${getStatusColor(request.status)}`}>
//                           {getStatusName(request.status)}
//                         </span>
//                       </td>

//                       <td className="py-3 px-4">
//                         <Button
//                           variant="secondary"
//                           size="sm"
//                           onClick={() => handleViewDetail(request)}
//                         >
//                           <Eye className="h-4 w-4 mr-1" />
//                           Xem
//                         </Button>
//                       </td>
//                     </tr>
//                   ))}
//                 </tbody>
//               </table>
//             </div>
//           </Card>
//         </div>
//       </div>
//     </Layout>
//   );
// };

// export default LeaveManagement;














// src/pages/leave/LeaveManagement.jsx
import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import Layout from '../../components/layout/Layout';
import Card from '../../components/ui/Card';
import Button from '../../components/ui/Button';
import Input from '../../components/ui/Input';
import Select from '../../components/ui/Select';
import {
  Clock,
  AlertCircle,
  CheckCircle,
  Eye,
  FileText,
} from 'lucide-react';
import { toast } from 'react-toastify';
import { getRole } from '../../utils/auth';
import { getEmployees, getLeaveRequests } from '../../services/api';
import { getLeaveTypeName, getLeaveTypeColor } from '../../constants/leaveTypes';

const LeaveManagement = () => {
  const userRole = getRole();
  const navigate = useNavigate();

  const getBannerColor = () => {
    switch (userRole) {
      case 'admin': return 'from-blue-500 to-blue-600';
      case 'manager': return 'from-purple-600 to-purple-700';
      case 'accountant': return 'from-emerald-600 to-emerald-700';
      default: return 'from-orange-500 to-orange-600';
    }
  };

  const getSubtitleColor = () => {
    switch (userRole) {
      case 'admin': return 'text-blue-100';
      case 'manager': return 'text-purple-100';
      case 'accountant': return 'text-emerald-100';
      default: return 'text-orange-100';
    }
  };

  const [leaveRequests, setLeaveRequests] = useState([]);
  const [, setEmployees] = useState([]);
  const [loading, setLoading] = useState(true);
  const [filter, setFilter] = useState('all');
  const [searchTerm, setSearchTerm] = useState('');

  useEffect(() => {
    loadData();
  }, []);

  const loadData = async () => {
    try {
      setLoading(true);
      const [employeesRes, leaveRequestsRes] = await Promise.all([
        getEmployees(),
        getLeaveRequests()
      ]);

      setEmployees(employeesRes || []);
      setLeaveRequests(leaveRequestsRes || []);
    } catch (err) {
      console.error('Error loading data', err);
      toast.error('Không thể tải dữ liệu nghỉ phép');
    } finally {
      setLoading(false);
    }
  };

  const getStatusColor = (status) => {
    switch (status) {
      case 'approved': return 'bg-green-100 text-green-800';
      case 'pending': return 'bg-yellow-100 text-yellow-800';
      case 'rejected': return 'bg-red-100 text-red-800';
      case 'cancelled': return 'bg-gray-100 text-gray-800';
      default: return 'bg-gray-100 text-gray-800';
    }
  };

  const getStatusName = (status) => {
    const statuses = {
      approved: 'Đã duyệt',
      pending: 'Chờ duyệt',
      rejected: 'Từ chối',
      cancelled: 'Đã hủy'
    };
    return statuses[status] || status;
  };

  // ✅ FIXED: Chặn reload và giữ route SPA
  const handleViewDetail = (e, request) => {
    e.preventDefault();
    navigate(`/leaves/${request.id}`, { replace: false });
  };

  const filteredRequests = leaveRequests.filter(request => {
    const matchesFilter = filter === 'all' || request.status === filter;
    const matchesSearch =
      request.employeeName?.toLowerCase().includes(searchTerm.toLowerCase()) ||
      request.reason?.toLowerCase().includes(searchTerm.toLowerCase());
    return matchesFilter && matchesSearch;
  });

  const stats = {
    total: leaveRequests.length,
    pending: leaveRequests.filter(r => r.status === 'pending').length,
    approved: leaveRequests.filter(r => r.status === 'approved').length,
    rejected: leaveRequests.filter(r => r.status === 'rejected').length
  };

  if (loading) {
    return (
      <Layout>
        <div className="min-h-screen bg-gray-50 flex items-center justify-center">
          <div className="text-center">
            <div className="animate-spin rounded-full h-32 w-32 border-b-2 border-blue-600 mx-auto"></div>
            <p className="text-gray-600 mt-4">Đang tải dữ liệu...</p>
          </div>
        </div>
      </Layout>
    );
  }

  return (
    <Layout>
      <div className="min-h-screen bg-gray-50 p-6">
        <div className="max-w-7xl mx-auto">
          {/* Header */}
          <div className={`bg-gradient-to-r ${getBannerColor()} text-white p-6 rounded-lg mb-6`}>
            <div>
              <h1 className="text-3xl font-bold">Duyệt đơn nghỉ phép</h1>
              <p className={`${getSubtitleColor()} mt-1`}>
                {userRole === 'admin'
                  ? 'Xem và duyệt tất cả các đơn nghỉ phép'
                  : userRole === 'manager'
                    ? 'Xem và duyệt các đơn nghỉ phép của nhân viên'
                    : 'Xem các đơn nghỉ phép của bạn'}
              </p>
            </div>
          </div>

          {/* Statistics */}
          <div className="grid grid-cols-1 md:grid-cols-4 gap-6 mb-6">
            <Card title="Tổng đơn nghỉ phép" icon={<FileText className="h-5 w-5 text-blue-500" />}>
              <div className="text-center">
                <div className="text-2xl font-bold text-blue-600">{stats.total}</div>
                <div className="text-sm text-gray-500">Tổng số đơn</div>
              </div>
            </Card>

            <Card title="Chờ duyệt" icon={<Clock className="h-5 w-5 text-yellow-500" />}>
              <div className="text-center">
                <div className="text-2xl font-bold text-yellow-600">{stats.pending}</div>
                <div className="text-sm text-gray-500">Cần xử lý</div>
              </div>
            </Card>

            <Card title="Đã duyệt" icon={<CheckCircle className="h-5 w-5 text-green-500" />}>
              <div className="text-center">
                <div className="text-2xl font-bold text-green-600">{stats.approved}</div>
                <div className="text-sm text-gray-500">Đã duyệt</div>
              </div>
            </Card>

            <Card title="Từ chối" icon={<AlertCircle className="h-5 w-5 text-red-500" />}>
              <div className="text-center">
                <div className="text-2xl font-bold text-red-600">{stats.rejected}</div>
                <div className="text-sm text-gray-500">Từ chối</div>
              </div>
            </Card>
          </div>

          {/* Filters */}
          <Card className="mb-6">
            <div className="flex items-center space-x-4">
              <div className="flex-1">
                <Input
                  label="Tìm kiếm"
                  value={searchTerm}
                  onChange={(value) => setSearchTerm(value)}
                  placeholder="Tìm theo tên nhân viên hoặc lý do..."
                />
              </div>
              <Select
                label="Lọc theo trạng thái"
                options={[
                  { value: 'all', label: 'Tất cả' },
                  { value: 'pending', label: 'Chờ duyệt' },
                  { value: 'approved', label: 'Đã duyệt' },
                  { value: 'rejected', label: 'Từ chối' },
                  { value: 'cancelled', label: 'Đã hủy' }
                ]}
                value={filter}
                onChange={(value) => setFilter(value)}
                className="w-48"
              />
            </div>
          </Card>

          {/* Leave Requests List */}
          <Card title="Danh sách đơn nghỉ phép">
            <div className="overflow-x-auto">
              <table className="w-full">
                <thead>
                  <tr className="border-b border-gray-200">
                    <th className="py-3 px-4 text-left">MÃ NV</th>
                    <th className="py-3 px-4 text-left">NHÂN VIÊN</th>
                    <th className="py-3 px-4 text-left">PHÒNG BAN</th>
                    <th className="py-3 px-4 text-left">LOẠI NGHỈ</th>
                    <th className="py-3 px-4 text-left">THỜI GIAN</th>
                    <th className="py-3 px-4 text-left">SỐ NGÀY</th>
                    <th className="py-3 px-4 text-left">LÝ DO</th>
                    <th className="py-3 px-4 text-left">TRẠNG THÁI</th>
                    <th className="py-3 px-4 text-left">HÀNH ĐỘNG</th>
                  </tr>
                </thead>
                <tbody>
                  {filteredRequests.map((request) => (
                    <tr key={request.id} className="border-b hover:bg-gray-50">
                      <td className="py-3 px-4 text-blue-600 font-medium">{request.employeeId}</td>
                      <td className="py-3 px-4 font-medium text-gray-900">{request.employeeName}</td>
                      <td className="py-3 px-4 text-gray-700">{request.department || 'Chưa rõ'}</td>
                      <td className="py-3 px-4">
                        <span className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium ${getLeaveTypeColor(request.type)}`}>
                          {getLeaveTypeName(request.type)}
                        </span>
                      </td>
                      <td className="py-3 px-4 text-sm">
                        {new Date(request.startDate).toLocaleDateString('vi-VN')} → {new Date(request.endDate).toLocaleDateString('vi-VN')}
                      </td>
                      <td className="py-3 px-4 text-center font-bold">{request.days}</td>
                      <td className="py-3 px-4 truncate max-w-xs" title={request.reason}>{request.reason}</td>
                      <td className="py-3 px-4">
                        <span className={`px-2 py-1 rounded-full text-xs font-medium ${getStatusColor(request.status)}`}>
                          {getStatusName(request.status)}
                        </span>
                      </td>
                      <td className="py-3 px-4">
                        <Button
                          variant="secondary"
                          size="sm"
                          onClick={(e) => handleViewDetail(e, request)}
                        >
                          <Eye className="h-4 w-4 mr-1" /> Xem
                        </Button>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </Card>
        </div>
      </div>
    </Layout>
  );
};

export default LeaveManagement;
