import React, { useCallback, useEffect, useMemo, useRef, useState } from 'react';
import { ArrowLeft, Download, Calendar, Clock, LogIn, LogOut } from 'lucide-react';
import faceRecognitionApi from '../../services/faceRecognitionApi';
import fakeApi from '../../services/fakeApi';
import { getUserInfo } from '../../utils/auth';

// Status config - đồng bộ với Backend (AttendenceStatus enum)
// Backend: NOT_CHECKED_IN, IN_WORK, OUT_WORK, LATE, OVER_TIME
const STATUS_CONFIG = {
  // Backend status (uppercase)
  NOT_CHECKED_IN: { label: 'Chưa chấm công', className: 'bg-gray-100 text-gray-700' },
  IN_WORK: { label: 'Đang làm việc', className: 'bg-blue-100 text-blue-700' },
  OUT_WORK: { label: 'Tan làm', className: 'bg-green-100 text-green-700' },
  LATE: { label: 'Đi muộn', className: 'bg-yellow-100 text-yellow-700' },
  OVER_TIME: { label: 'Tăng ca', className: 'bg-purple-100 text-purple-700' },
  // FE status (lowercase) - fallback
  present: { label: 'Có mặt', className: 'bg-green-100 text-green-700' },
  late: { label: 'Đi muộn', className: 'bg-yellow-100 text-yellow-700' },
  overtime: { label: 'Tăng ca', className: 'bg-purple-100 text-purple-700' },
  pending: { label: 'Đang ghi nhận', className: 'bg-blue-100 text-blue-700' },
  absent: { label: 'Vắng', className: 'bg-red-100 text-red-700' }
};

const parseTimeToMinutes = (time) => {
  if (!time || time === '-') return null;
  const parts = time.split(':').map(Number);
  if (parts.length < 2 || Number.isNaN(parts[0]) || Number.isNaN(parts[1])) return null;
  const [h, m, s = 0] = parts;
  return h * 60 + m + (Number.isNaN(s) ? 0 : s / 60);
};

const calculateHours = (checkIn, checkOut) => {
  const inMinutes = parseTimeToMinutes(checkIn);
  const outMinutes = parseTimeToMinutes(checkOut);
  if (inMinutes == null || outMinutes == null) return 0;
  const diff = outMinutes - inMinutes;
  // Trả về số giờ (có thể là số thập phân nhỏ)
  return diff > 0 ? Number((diff / 60).toFixed(2)) : 0;
};

// Format giờ làm: hiển thị phút nếu < 1h, giờ nếu >= 1h
const formatHoursWorked = (hours) => {
  if (hours === 0) return '0m';
  if (hours < 1) {
    const minutes = Math.round(hours * 60);
    return `${minutes}m`;
  }
  return `${hours.toFixed(1)}h`;
};

// Quy định công ty: vào làm 08:00, tan làm 17:00
const WORK_START_MINUTES = 8 * 60; // 08:00 = 480 phút
const OVERTIME_HOURS = 9; // > 9 tiếng = tăng ca

const deriveStatus = (checkIn, checkOut, hours) => {
  if (!checkIn && !checkOut) return 'NOT_CHECKED_IN';
  if (checkIn && !checkOut) return 'IN_WORK';
  if (hours >= OVERTIME_HOURS) return 'OVER_TIME';

  const inMinutes = parseTimeToMinutes(checkIn);
  // Đi muộn: check-in sau 08:00
  if (inMinutes != null && inMinutes > WORK_START_MINUTES) {
    return 'LATE';
  }
  return 'OUT_WORK'; // Đã check-in và check-out đúng giờ
};

const transformBackendRecords = (items = []) =>
  items
    .map((item, index) => {
      // Hỗ trợ cả snake_case (check_in) và camelCase (checkIn)
      const checkIn = item.check_in || item.checkIn || '-';
      const checkOut = item.check_out || item.checkOut || '-';
      const hoursWorked = calculateHours(checkIn, checkOut);

      // Ưu tiên status từ Backend, fallback sang tính toán FE
      let status = item.status;
      if (!status || !STATUS_CONFIG[status]) {
        // Fallback: tự tính status nếu Backend không trả về
        status = deriveStatus(checkIn !== '-' ? checkIn : null, checkOut !== '-' ? checkOut : null, hoursWorked);
      }

      return {
        id: `${item.id}-${item.date}-${index}`,
        date: item.date,
        checkIn,
        checkOut,
        status,
        hoursWorked,
        hoursLabel: formatHoursWorked(hoursWorked)
      };
    })
    .sort((a, b) => {
      const aTime = `${a.date}T${a.checkOut !== '-' ? a.checkOut : a.checkIn !== '-' ? a.checkIn : '00:00:00'}`;
      const bTime = `${b.date}T${b.checkOut !== '-' ? b.checkOut : b.checkIn !== '-' ? b.checkIn : '00:00:00'}`;
      return new Date(bTime).getTime() - new Date(aTime).getTime();
    })
    .slice(0, 20);

const transformMockRecords = (items = []) =>
  items.slice(0, 20).map((item) => ({
    id: item.id,
    date: item.date,
    checkIn: item.checkIn || '-',
    checkOut: item.checkOut || '-',
    status: item.status,
    hoursWorked: Number(item.hoursWorked) || 0,
    hoursLabel: `${Number(item.hoursWorked || 0).toFixed(1)}h`
  }));

const EmployeeAttendance = () => {
  const userInfo = getUserInfo();
  // Ưu tiên: employeeId > id (vì id có thể là user ID, không phải employee ID)
  // userInfo.id từ login API là Employee.id trong DB
  // TODO: Cần fix mapping ID ở backend - tạm hardcode để test
  let employeeId = userInfo?.employeeId || userInfo?.id || '1';
  const employeeName = userInfo?.name || 'Nhân viên';

  // WORKAROUND: Nếu userInfo.id = 21 (user vinh tran), map sang employee_id = 24
  // Vì face recognition system dùng employee.id = 24, không phải user.id = 21
  // TODO: Backend cần trả về đúng employee.id khi login
  if (employeeId === '21' || employeeId === 21) {
    console.warn('[Attendance] WORKAROUND: Mapping user.id=21 to employee.id=24 for face recognition');
    employeeId = '24';
  }

  // Debug log - QUAN TRỌNG: Kiểm tra ID đang dùng
  console.log('[Attendance] userInfo:', userInfo);
  console.log('[Attendance] Using employeeId:', employeeId, '(from userInfo.employeeId:', userInfo?.employeeId, ', userInfo.id:', userInfo?.id, ')');

  const [records, setRecords] = useState([]);
  const [loading, setLoading] = useState(true);
  const [isRecognizing, setIsRecognizing] = useState(false);
  const [recognitionInfo, setRecognitionInfo] = useState({ status: null, message: '' });
  const recognitionTimerRef = useRef(null);

  const refreshAttendance = useCallback(
    async (showLoader = true) => {
      if (showLoader) setLoading(true);
      try {
        console.log('[Attendance] Fetching attendance for employeeId:', employeeId);
        const data = await faceRecognitionApi.getEmployeeAttendance(employeeId);
        console.log('[Attendance] API response:', data);
        const transformed = transformBackendRecords(Array.isArray(data) ? data : []);
        console.log('[Attendance] Transformed records:', transformed);
        setRecords(transformed);
        return transformed;
      } catch (error) {
        console.error('getEmployeeAttendance failed:', error);
        try {
          const res = await fakeApi.getAttendanceRecords();
          const transformed = transformMockRecords(res.data);
          setRecords(transformed);
          return transformed;
        } catch (fallbackError) {
          console.error('fallback attendance failed:', fallbackError);
          setRecords([]);
          return [];
        }
      } finally {
        if (showLoader) setLoading(false);
      }
    },
    [employeeId]
  );

  useEffect(() => {
    refreshAttendance();
    return () => {
      if (recognitionTimerRef.current) {
        clearTimeout(recognitionTimerRef.current);
      }
    };
  }, [refreshAttendance]);

  const totalHours = useMemo(
    () => records.reduce((sum, r) => sum + (Number.isFinite(r.hoursWorked) ? r.hoursWorked : 0), 0),
    [records]
  );

  const presentDays = useMemo(
    () => records.filter(r => r.status === 'present' || r.status === 'overtime').length,
    [records]
  );

  const handleRecognition = useCallback(
    async (type) => {
      if (!employeeId) {
        setRecognitionInfo({
          status: 'error',
          message: 'Không xác định được mã nhân viên. Vui lòng đăng nhập lại.'
        });
        return;
      }

      const previousFirst = records[0];

      setIsRecognizing(true);
      setRecognitionInfo({
        status: 'running',
        message:
          type === 'clockout'
            ? 'Đang nhận diện để ghi nhận giờ ra về...'
            : 'Đang nhận diện để ghi nhận giờ vào làm...'
      });

      try {
        const response = await faceRecognitionApi.startRecognition(type);

        if (response.status !== 'success') {
          setRecognitionInfo({
            status: 'error',
            message: response.message || 'Không thể khởi động nhận diện. Vui lòng thử lại.'
          });
          return;
        }

        setRecognitionInfo({
          status: 'running',
          message: 'Hệ thống đang xử lý dữ liệu nhận diện. Vui lòng giữ nguyên trong vài giây...'
        });

        // Polling để kiểm tra khi nào DB được cập nhật (thay vì đợi cố định 6s)
        // Python subprocess có thể mất nhiều thời gian hơn (load model, mở camera, nhận diện...)
        const pollForUpdate = async (maxAttempts = 10, interval = 2000) => {
          for (let attempt = 1; attempt <= maxAttempts; attempt++) {
            await new Promise(resolve => setTimeout(resolve, interval));

            const updated = await refreshAttendance(false);
            const latest = updated && updated[0];

            // Kiểm tra xem có thay đổi so với trước không
            if (latest) {
              const hasNewCheckIn = previousFirst
                ? (latest.checkIn !== previousFirst.checkIn && latest.checkIn && latest.checkIn !== '-')
                : (latest.checkIn && latest.checkIn !== '-');
              const hasNewCheckOut = previousFirst
                ? (latest.checkOut !== previousFirst.checkOut && latest.checkOut && latest.checkOut !== '-')
                : (latest.checkOut && latest.checkOut !== '-');

              if (hasNewCheckIn || hasNewCheckOut) {
                let action = hasNewCheckOut ? 'Check-out' : 'Check-in';
                let time = hasNewCheckOut ? latest.checkOut : latest.checkIn;

                setRecognitionInfo({
                  status: 'success',
                  message: `${action} được ghi nhận lúc ${time || '---'} ngày ${latest.date}.`
                });
                return true;
              }
            }

            // Cập nhật message để user biết đang chờ
            setRecognitionInfo({
              status: 'running',
              message: `Đang chờ dữ liệu từ hệ thống... (${attempt}/${maxAttempts})`
            });
          }

          // Hết số lần thử, báo lỗi
          setRecognitionInfo({
            status: 'error',
            message: 'Không nhận được dữ liệu mới. Vui lòng kiểm tra lại hoặc thử lại sau.'
          });
          return false;
        };

        recognitionTimerRef.current = setTimeout(async () => {
          await pollForUpdate();
        }, 1000); // Bắt đầu poll sau 1s
      } catch (error) {
        console.error('startRecognition failed:', error);
        setRecognitionInfo({
          status: 'error',
          message: 'Không thể kết nối tới hệ thống nhận diện. Vui lòng kiểm tra lại và thử lại sau.'
        });
      } finally {
        setIsRecognizing(false);
      }
    },
    [employeeId, records, refreshAttendance]
  );

  const statusBadgeFor = (status) => {
    const config = STATUS_CONFIG[status] || STATUS_CONFIG.pending;
    return (
      <span className={`px-3 py-1 text-xs font-medium rounded-full ${config.className}`}>
        {config.label}
      </span>
    );
  };

  return (
    <div>
      <div className="space-y-6">
        <div className="bg-gradient-to-r from-orange-500 to-orange-600 text-white p-6 rounded-2xl shadow-lg">
          <div className="flex items-center justify-between mb-4">
            <a
              href="/employee"
              className="flex items-center gap-2 px-4 py-2 bg-white/20 text-white rounded-lg hover:bg-white/30 transition-all duration-200 backdrop-blur-sm"
            >
             <ArrowLeft size={18} />
              <span>Quay lại</span>
            </a>
            <button className="flex items-center gap-2 px-4 py-2 bg-white/20 text-white rounded-lg hover:bg-white/30 transition-all duration-200 backdrop-blur-sm">
              <Download size={18} />
              <span>Tải báo cáo</span>
            </button>
          </div>
          <div className="flex items-center justify-between">
            <div>
              <h1 className="text-3xl font-bold mb-2">Chấm công của tôi</h1>
              <p className="text-indigo-100">Theo dõi lịch sử điểm danh, đi muộn, nghỉ phép</p>
              <p className="text-indigo-200 text-sm mt-1">Nhân viên: {employeeName}</p>
            </div>
          </div>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
          <div className="bg-white p-6 rounded-xl border border-gray-200 shadow-sm hover:shadow-md transition-shadow">
            <div className="flex items-center gap-3">
              <div className="p-3 bg-green-100 rounded-lg">
                <Calendar className="text-green-600" size={24} />
              </div>
              <div>
                <p className="text-sm text-gray-500">Ngày làm việc</p>
                <p className="text-2xl font-bold text-gray-900">{presentDays}</p>
              </div>
            </div>
          </div>

          <div className="bg-white p-6 rounded-xl border border-gray-200 shadow-sm hover:shadow-md transition-shadow">
            <div className="flex items-center gap-3">
              <div className="p-3 bg-blue-100 rounded-lg">
                <Clock className="text-blue-600" size={24} />
              </div>
              <div>
                <p className="text-sm text-gray-500">Tổng giờ làm</p>
                <p className="text-2xl font-bold text-gray-900">{totalHours.toFixed(1)}h</p>
              </div>
            </div>
          </div>

          <div className="bg-white p-6 rounded-xl border border-gray-200 shadow-sm hover:shadow-md transition-shadow">
            <div className="flex items-center gap-3">
              <div className="p-3 bg-purple-100 rounded-lg">
                <Calendar className="text-purple-600" size={24} />
              </div>
              <div>
                <p className="text-sm text-gray-500">Bản ghi</p>
                <p className="text-2xl font-bold text-gray-900">{records.length}</p>
              </div>
            </div>
          </div>
        </div>

        <div className="bg-white rounded-xl border border-gray-200 overflow-hidden shadow-sm">
          <div className="p-4 border-b border-gray-200 flex flex-col gap-4 md:flex-row md:items-center md:justify-between bg-gray-50">
            <div>
              <div className="font-semibold text-gray-700">Lịch sử gần đây</div>
              <div className="text-sm text-gray-500">Hiển thị {records.length} mục</div>
            </div>

            <div className="flex flex-col gap-2 md:flex-row md:items-center">
              {recognitionInfo.status && (
                <div
                  className={`px-3 py-2 text-sm rounded-lg ${
                    recognitionInfo.status === 'success'
                      ? 'bg-green-50 text-green-700 border border-green-200'
                      : recognitionInfo.status === 'running'
                      ? 'bg-blue-50 text-blue-700 border border-blue-200'
                      : 'bg-red-50 text-red-700 border border-red-200'
                  }`}
                >
                  {recognitionInfo.message}
                </div>
              )}

              <div className="flex gap-2">
                <button
                  onClick={() => handleRecognition('clockin')}
                  disabled={isRecognizing}
                  className="flex items-center justify-center gap-2 px-4 py-2 bg-purple-600 text-white rounded-lg hover:bg-purple-700 transition-all duration-200 disabled:opacity-60"
                >
                  <LogIn size={18} />
                  {isRecognizing ? 'Đang xử lý...' : 'Check-in bằng khuôn mặt'}
                </button>
                <button
                  onClick={() => handleRecognition('clockout')}
                  disabled={isRecognizing}
                  className="flex items-center justify-center gap-2 px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-all duration-200 disabled:opacity-60"
                >
                  <LogOut size={18} />
                  {isRecognizing ? 'Đang xử lý...' : 'Check-out bằng khuôn mặt'}
                </button>
              </div>
            </div>
          </div>
          <div className="overflow-x-auto">
            <table className="min-w-full">
              <thead className="bg-gray-50">
                <tr>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Ngày</th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Check-in</th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Check-out</th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Trạng thái</th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Giờ làm</th>
                </tr>
              </thead>
              <tbody className="bg-white divide-y divide-gray-200">
                {!loading && records.map((r) => (
                  <tr key={r.id} className="hover:bg-gray-50 transition-colors">
                    <td className="px-6 py-4 text-sm font-medium text-gray-900">{r.date}</td>
                    <td className="px-6 py-4 text-sm text-gray-700">{r.checkIn}</td>
                    <td className="px-6 py-4 text-sm text-gray-700">{r.checkOut}</td>
                    <td className="px-6 py-4">
                      {statusBadgeFor(r.status)}
                    </td>
                    <td className="px-6 py-4 text-sm font-medium text-gray-900">{r.hoursLabel}</td>
                  </tr>
                ))}
                {loading && (
                  <tr>
                    <td className="px-6 py-12 text-center text-gray-500" colSpan={5}>
                      <div className="flex items-center justify-center gap-2">
                        <div className="w-5 h-5 border-2 border-purple-600 border-t-transparent rounded-full animate-spin" />
                        <span>Đang tải...</span>
                      </div>
                    </td>
                  </tr>
                )}
                {!loading && records.length === 0 && (
                  <tr>
                    <td className="px-6 py-12 text-center text-gray-500" colSpan={5}>
                      Chưa có dữ liệu chấm công
                    </td>
                  </tr>
                )}
              </tbody>
            </table>
          </div>
        </div>
      </div>
    </div>
  );
};

export default EmployeeAttendance;
