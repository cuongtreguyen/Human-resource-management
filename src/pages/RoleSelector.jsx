import React from 'react';
import { useNavigate } from 'react-router-dom';
import Layout from '../components/layout/Layout';
import Card from '../components/ui/Card';
import Button from '../components/ui/Button';
import { setRole } from '../utils/auth';

const RoleSelector = () => {
  const navigate = useNavigate();

  const chooseEmployee = () => {
    setRole('employee');
    navigate('/employee');
  };

  return (
    <Layout>
      <div className="min-h-screen bg-gray-50 p-6 flex items-center justify-center">
        <div className="max-w-xl w-full">
          <div className="text-center mb-6">
            <h1 className="text-3xl font-bold text-gray-900">Chọn vai trò</h1>
            <p className="text-gray-600 mt-2">Hiện tại chỉ hỗ trợ cổng Nhân viên</p>
          </div>
          <Card>
            <div className="space-y-4">
              <div className="p-4 border border-gray-200 rounded-xl bg-white">
                <div className="flex items-center justify-between">
                  <div>
                    <div className="text-lg font-semibold text-gray-900">Nhân viên</div>
                    <div className="text-gray-600 text-sm">Truy cập cổng thông tin nhân viên</div>
                  </div>
                  <Button variant="primary" onClick={chooseEmployee}>Vào cổng</Button>
                </div>
              </div>
            </div>
          </Card>
        </div>
      </div>
    </Layout>
  );
};

export default RoleSelector;


