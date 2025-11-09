import React from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import Layout from '../../components/layout/Layout';
import Card from '../../components/ui/Card';
import Button from '../../components/ui/Button';

const EmployeeDetails = () => {
  const { id } = useParams();
  const navigate = useNavigate();

  return (
    <Layout>
      <div className="min-h-screen bg-gray-50 p-6">
        <div className="max-w-4xl mx-auto">
          {/* Header */}
          <div className="bg-gradient-to-r from-purple-600 to-purple-700 text-white p-6 rounded-lg mb-6">
            <div className="flex justify-between items-center">
              <div>
                <h1 className="text-3xl font-bold">Employee Details</h1>
                <p className="text-purple-100 mt-1">View employee information</p>
              </div>
              <Button 
                variant="secondary" 
                size="md" 
                onClick={() => navigate('/employees')}
              >
                ← Back to Employees
              </Button>
            </div>
          </div>

          {/* Employee Info */}
          <Card title={`Employee ID: ${id}`}>
            <div className="space-y-6">
              <div className="text-center py-12">
                <div className="w-24 h-24 bg-purple-600 rounded-full flex items-center justify-center text-white text-2xl font-bold mx-auto mb-4">
                  EMP
                </div>
                <h2 className="text-2xl font-bold text-gray-900 mb-2">Employee Details</h2>
                <p className="text-gray-600 mb-6">Detailed employee information will be displayed here</p>
                
                <div className="bg-blue-50 border border-blue-200 rounded-lg p-4 max-w-md mx-auto">
                  <p className="text-blue-800">
                    This page will show comprehensive employee details including personal information, 
                    work history, performance metrics, and more.
                  </p>
                </div>
              </div>
            </div>
          </Card>
        </div>
      </div>
    </Layout>
  );
};

export default EmployeeDetails;
