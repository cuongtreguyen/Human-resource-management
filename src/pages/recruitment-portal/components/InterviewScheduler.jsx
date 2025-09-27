import React, { useState } from 'react';
import { motion } from 'framer-motion';
import { Calendar, Clock, User, Video, Phone, Plus, Edit3, CheckCircle, AlertCircle } from 'lucide-react';

const InterviewScheduler = ({ interviews, candidates }) => {
  const [selectedDate, setSelectedDate] = useState(new Date()?.toISOString()?.split('T')?.[0]);
  const [showScheduleModal, setShowScheduleModal] = useState(false);
  const [viewMode, setViewMode] = useState('list'); // 'list' or 'calendar'

  // Generate calendar days for the current month
  const generateCalendarDays = () => {
    const today = new Date();
    const year = today?.getFullYear();
    const month = today?.getMonth();
    
    const firstDay = new Date(year, month, 1);
    const lastDay = new Date(year, month + 1, 0);
    const startDate = new Date(firstDay);
    startDate?.setDate(startDate?.getDate() - firstDay?.getDay());
    
    const days = [];
    for (let i = 0; i < 42; i++) {
      const day = new Date(startDate);
      day?.setDate(startDate?.getDate() + i);
      
      const interviewsOnDay = interviews?.filter(interview => 
        interview?.date === day?.toISOString()?.split('T')?.[0]
      );
      
      days?.push({
        date: day,
        isCurrentMonth: day?.getMonth() === month,
        isToday: day?.toDateString() === today?.toDateString(),
        interviews: interviewsOnDay
      });
    }
    
    return days;
  };

  const calendarDays = generateCalendarDays();

  const getStatusIcon = (status) => {
    switch (status?.toLowerCase()) {
      case 'scheduled':
        return <Clock className="h-4 w-4 text-blue-500" />;
      case 'completed':
        return <CheckCircle className="h-4 w-4 text-green-500" />;
      case 'cancelled':
        return <AlertCircle className="h-4 w-4 text-red-500" />;
      default:
        return <Clock className="h-4 w-4 text-gray-500" />;
    }
  };

  const getStatusColor = (status) => {
    switch (status?.toLowerCase()) {
      case 'scheduled':
        return 'bg-blue-100 text-blue-800';
      case 'completed':
        return 'bg-green-100 text-green-800';
      case 'cancelled':
        return 'bg-red-100 text-red-800';
      default:
        return 'bg-gray-100 text-gray-800';
    }
  };

  const InterviewCard = ({ interview }) => (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      className="bg-white rounded-lg shadow-sm border hover:shadow-md transition-shadow p-4"
    >
      <div className="flex items-start justify-between mb-3">
        <div className="flex items-center space-x-3">
          <div className="bg-blue-100 rounded-full p-2">
            <User className="h-5 w-5 text-blue-600" />
          </div>
          <div>
            <h3 className="font-medium text-gray-900">{interview?.candidateName}</h3>
            <p className="text-sm text-gray-600">{interview?.position}</p>
          </div>
        </div>
        <span className={`px-2 py-1 rounded-full text-xs font-medium ${getStatusColor(interview?.status)}`}>
          {interview?.status}
        </span>
      </div>

      <div className="space-y-2 mb-4">
        <div className="flex items-center space-x-2 text-sm text-gray-600">
          <Calendar className="h-4 w-4" />
          <span>{new Date(interview.date)?.toLocaleDateString()}</span>
          <Clock className="h-4 w-4 ml-2" />
          <span>{interview?.time}</span>
        </div>
        
        <div className="flex items-center space-x-2 text-sm text-gray-600">
          <User className="h-4 w-4" />
          <span>{interview?.interviewer}</span>
        </div>
        
        <div className="flex items-center space-x-2 text-sm text-gray-600">
          <Video className="h-4 w-4" />
          <span>{interview?.type} Interview</span>
        </div>
      </div>

      <div className="flex items-center justify-between pt-3 border-t">
        <button className="text-blue-600 hover:bg-blue-50 px-3 py-1 rounded text-sm">
          <Video className="h-4 w-4 inline mr-1" />
          Join Meeting
        </button>
        <div className="flex items-center space-x-2">
          <button className="text-gray-600 hover:bg-gray-50 px-2 py-1 rounded text-sm">
            <Edit3 className="h-4 w-4" />
          </button>
          <button className="text-red-600 hover:bg-red-50 px-2 py-1 rounded text-sm">
            Cancel
          </button>
        </div>
      </div>
    </motion.div>
  );

  const ScheduleModal = () => {
    const [formData, setFormData] = useState({
      candidateId: '',
      date: '',
      time: '',
      interviewer: '',
      type: 'Technical',
      meetingType: 'Video Call'
    });

    if (!showScheduleModal) return null;

    return (
      <div className="fixed inset-0 z-50 overflow-y-auto">
        <div className="flex items-end justify-center min-h-screen pt-4 px-4 pb-20 text-center sm:block sm:p-0">
          <div className="fixed inset-0 bg-gray-500 bg-opacity-75 transition-opacity" onClick={() => setShowScheduleModal(false)}></div>
          
          <div className="inline-block align-bottom bg-white rounded-lg text-left overflow-hidden shadow-xl transform transition-all sm:my-8 sm:align-middle sm:max-w-lg sm:w-full">
            <div className="bg-white px-4 pt-5 pb-4 sm:p-6 sm:pb-4">
              <div className="flex justify-between items-center mb-4">
                <h3 className="text-lg font-medium text-gray-900">Schedule Interview</h3>
                <button 
                  onClick={() => setShowScheduleModal(false)}
                  className="text-gray-400 hover:text-gray-600 text-xl"
                >
                  ×
                </button>
              </div>
              
              <form className="space-y-4">
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">Select Candidate</label>
                  <select 
                    className="w-full border border-gray-300 rounded-lg px-3 py-2"
                    value={formData?.candidateId}
                    onChange={(e) => setFormData({...formData, candidateId: e?.target?.value})}
                  >
                    <option value="">Choose a candidate...</option>
                    {candidates?.map(candidate => (
                      <option key={candidate?.id} value={candidate?.id}>
                        {candidate?.name} - {candidate?.position}
                      </option>
                    ))}
                  </select>
                </div>
                
                <div className="grid grid-cols-2 gap-4">
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">Date</label>
                    <input 
                      type="date"
                      className="w-full border border-gray-300 rounded-lg px-3 py-2"
                      value={formData?.date}
                      onChange={(e) => setFormData({...formData, date: e?.target?.value})}
                    />
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">Time</label>
                    <input 
                      type="time"
                      className="w-full border border-gray-300 rounded-lg px-3 py-2"
                      value={formData?.time}
                      onChange={(e) => setFormData({...formData, time: e?.target?.value})}
                    />
                  </div>
                </div>
                
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">Interviewer</label>
                  <input 
                    type="text"
                    placeholder="Enter interviewer name"
                    className="w-full border border-gray-300 rounded-lg px-3 py-2"
                    value={formData?.interviewer}
                    onChange={(e) => setFormData({...formData, interviewer: e?.target?.value})}
                  />
                </div>
                
                <div className="grid grid-cols-2 gap-4">
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">Interview Type</label>
                    <select 
                      className="w-full border border-gray-300 rounded-lg px-3 py-2"
                      value={formData?.type}
                      onChange={(e) => setFormData({...formData, type: e?.target?.value})}
                    >
                      <option value="Technical">Technical</option>
                      <option value="Behavioral">Behavioral</option>
                      <option value="Cultural Fit">Cultural Fit</option>
                      <option value="Final">Final Round</option>
                    </select>
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">Meeting Type</label>
                    <select 
                      className="w-full border border-gray-300 rounded-lg px-3 py-2"
                      value={formData?.meetingType}
                      onChange={(e) => setFormData({...formData, meetingType: e?.target?.value})}
                    >
                      <option value="Video Call">Video Call</option>
                      <option value="Phone Call">Phone Call</option>
                      <option value="In Person">In Person</option>
                    </select>
                  </div>
                </div>
              </form>
            </div>
            
            <div className="bg-gray-50 px-4 py-3 sm:px-6 sm:flex sm:flex-row-reverse">
              <button
                type="button"
                className="w-full inline-flex justify-center rounded-md border border-transparent shadow-sm px-4 py-2 bg-blue-600 text-base font-medium text-white hover:bg-blue-700 sm:ml-3 sm:w-auto sm:text-sm"
                onClick={() => setShowScheduleModal(false)}
              >
                Schedule Interview
              </button>
              <button
                type="button"
                className="mt-3 w-full inline-flex justify-center rounded-md border border-gray-300 shadow-sm px-4 py-2 bg-white text-base font-medium text-gray-700 hover:bg-gray-50 sm:mt-0 sm:w-auto sm:text-sm"
                onClick={() => setShowScheduleModal(false)}
              >
                Cancel
              </button>
            </div>
          </div>
        </div>
      </div>
    );
  };

  return (
    <div>
      {/* Header Controls */}
      <div className="flex items-center justify-between mb-6">
        <div className="flex items-center space-x-4">
          <h2 className="text-xl font-semibold text-gray-900">Interview Schedule</h2>
          <div className="flex bg-gray-100 rounded-lg p-1">
            <button
              onClick={() => setViewMode('list')}
              className={`px-3 py-1 rounded text-sm ${
                viewMode === 'list' ?'bg-white text-gray-900 shadow-sm' :'text-gray-600 hover:text-gray-900'
              }`}
            >
              List View
            </button>
            <button
              onClick={() => setViewMode('calendar')}
              className={`px-3 py-1 rounded text-sm ${
                viewMode === 'calendar' ?'bg-white text-gray-900 shadow-sm' :'text-gray-600 hover:text-gray-900'
              }`}
            >
              Calendar
            </button>
          </div>
        </div>
        
        <button
          onClick={() => setShowScheduleModal(true)}
          className="bg-blue-600 hover:bg-blue-700 text-white px-4 py-2 rounded-lg flex items-center space-x-2"
        >
          <Plus className="h-4 w-4" />
          <span>Schedule Interview</span>
        </button>
      </div>
      {viewMode === 'list' ? (
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          {interviews?.map((interview) => (
            <InterviewCard key={interview?.id} interview={interview} />
          ))}
        </div>
      ) : (
        <div className="bg-white rounded-lg shadow-sm border p-6">
          <div className="grid grid-cols-7 gap-1 mb-4">
            {['Sun', 'Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat']?.map(day => (
              <div key={day} className="p-2 text-center text-sm font-medium text-gray-500">
                {day}
              </div>
            ))}
          </div>
          
          <div className="grid grid-cols-7 gap-1">
            {calendarDays?.map((day, index) => (
              <div
                key={index}
                className={`p-2 min-h-[60px] border border-gray-100 ${
                  day?.isCurrentMonth ? 'bg-white' : 'bg-gray-50'
                } ${
                  day?.isToday ? 'bg-blue-50 border-blue-200' : ''
                }`}
              >
                <div className={`text-sm mb-1 ${
                  day?.isCurrentMonth ? 'text-gray-900' : 'text-gray-400'
                } ${
                  day?.isToday ? 'font-bold text-blue-600' : ''
                }`}>
                  {day?.date?.getDate()}
                </div>
                
                {day?.interviews?.map((interview, idx) => (
                  <div
                    key={idx}
                    className="text-xs bg-blue-100 text-blue-800 rounded px-1 py-0.5 mb-1 truncate"
                    title={`${interview?.time} - ${interview?.candidateName}`}
                  >
                    {interview?.time}
                  </div>
                ))}
              </div>
            ))}
          </div>
        </div>
      )}
      {interviews?.length === 0 && viewMode === 'list' && (
        <div className="text-center py-12">
          <Calendar className="h-12 w-12 text-gray-300 mx-auto mb-4" />
          <h3 className="text-lg font-medium text-gray-900 mb-2">No interviews scheduled</h3>
          <p className="text-gray-500 mb-4">Start scheduling interviews with your candidates.</p>
          <button
            onClick={() => setShowScheduleModal(true)}
            className="bg-blue-600 hover:bg-blue-700 text-white px-4 py-2 rounded-lg"
          >
            Schedule First Interview
          </button>
        </div>
      )}
      <ScheduleModal />
    </div>
  );
};

export default InterviewScheduler;

