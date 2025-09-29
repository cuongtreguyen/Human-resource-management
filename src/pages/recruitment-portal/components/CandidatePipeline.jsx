import React, { useState } from 'react';
import { motion } from 'framer-motion';
import { Users, Star, Phone, Mail, Download, Eye, Filter, Search, User } from 'lucide-react';

const CandidatePipeline = ({ candidates, setCandidates, mockAPI }) => {
  const [selectedStage, setSelectedStage] = useState('all');
  const [searchTerm, setSearchTerm] = useState('');
  const [selectedCandidate, setSelectedCandidate] = useState(null);
  const [showCandidateModal, setShowCandidateModal] = useState(false);

  // Pipeline stages
  const stages = [
    { id: 'Applied', label: 'Applied', color: 'bg-blue-100 text-blue-800', count: 0 },
    { id: 'Screening', label: 'Screening', color: 'bg-yellow-100 text-yellow-800', count: 0 },
    { id: 'Interview', label: 'Interview', color: 'bg-purple-100 text-purple-800', count: 0 },
    { id: 'Offer', label: 'Offer', color: 'bg-green-100 text-green-800', count: 0 },
    { id: 'Hired', label: 'Hired', color: 'bg-emerald-100 text-emerald-800', count: 0 },
    { id: 'Rejected', label: 'Rejected', color: 'bg-red-100 text-red-800', count: 0 }
  ];

  // Update stage counts
  stages?.forEach(stage => {
    stage.count = candidates?.filter(c => c?.stage === stage?.id)?.length;
  });

  // Filter candidates
  const filteredCandidates = candidates?.filter(candidate => {
    const matchesSearch = candidate?.name?.toLowerCase()?.includes(searchTerm?.toLowerCase()) ||
                         candidate?.position?.toLowerCase()?.includes(searchTerm?.toLowerCase()) ||
                         candidate?.email?.toLowerCase()?.includes(searchTerm?.toLowerCase());
    const matchesStage = selectedStage === 'all' || candidate?.stage === selectedStage;
    return matchesSearch && matchesStage;
  });

  // Handle stage change
  const handleStageChange = async (candidateId, newStage) => {
    try {
      await mockAPI?.updateCandidateStage(candidateId, newStage);
      setCandidates(prevCandidates =>
        prevCandidates?.map(c =>
          c?.id === candidateId ? { ...c, stage: newStage } : c
        )
      );
    } catch (error) {
      console.log('Demo: Stage update completed');
    }
  };

  const getScoreColor = (score) => {
    if (score >= 90) return 'text-green-600';
    if (score >= 80) return 'text-blue-600';
    if (score >= 70) return 'text-yellow-600';
    return 'text-red-600';
  };

  const CandidateCard = ({ candidate }) => (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      className="bg-white rounded-lg shadow-sm border hover:shadow-md transition-shadow p-4"
    >
      <div className="flex items-start justify-between mb-3">
        <div className="flex items-center space-x-3">
          <div className="bg-gray-100 rounded-full p-2">
            <User className="h-6 w-6 text-gray-600" />
          </div>
          <div>
            <h3 className="font-medium text-gray-900">{candidate?.name}</h3>
            <p className="text-sm text-gray-600">{candidate?.position}</p>
          </div>
        </div>
        <div className="flex items-center space-x-1">
          <Star className={`h-4 w-4 ${getScoreColor(candidate?.score)}`} />
          <span className={`text-sm font-medium ${getScoreColor(candidate?.score)}`}>
            {candidate?.score}
          </span>
        </div>
      </div>

      <div className="space-y-2 mb-4">
        <div className="flex items-center space-x-2 text-sm text-gray-600">
          <Mail className="h-4 w-4" />
          <span>{candidate?.email}</span>
        </div>
        <div className="flex items-center space-x-2 text-sm text-gray-600">
          <Phone className="h-4 w-4" />
          <span>{candidate?.phone}</span>
        </div>
        <div className="text-sm text-gray-600">
          <span className="font-medium">Experience:</span> {candidate?.experience}
        </div>
      </div>

      <div className="flex flex-wrap gap-1 mb-4">
        {candidate?.skills?.slice(0, 3)?.map((skill, index) => (
          <span key={index} className="px-2 py-1 bg-blue-50 text-blue-700 text-xs rounded-full">
            {skill}
          </span>
        ))}
        {candidate?.skills?.length > 3 && (
          <span className="px-2 py-1 bg-gray-50 text-gray-600 text-xs rounded-full">
            +{candidate?.skills?.length - 3} more
          </span>
        )}
      </div>

      <div className="flex items-center justify-between">
        <select
          value={candidate?.stage}
          onChange={(e) => handleStageChange(candidate?.id, e?.target?.value)}
          className="text-xs border border-gray-300 rounded px-2 py-1"
        >
          {stages?.map(stage => (
            <option key={stage?.id} value={stage?.id}>{stage?.label}</option>
          ))}
        </select>

        <div className="flex items-center space-x-2">
          <button
            onClick={() => {
              setSelectedCandidate(candidate);
              setShowCandidateModal(true);
            }}
            className="text-blue-600 hover:bg-blue-50 px-2 py-1 rounded text-xs"
          >
            <Eye className="h-3 w-3 inline mr-1" />
            View
          </button>
          <button className="text-gray-600 hover:bg-gray-50 px-2 py-1 rounded text-xs">
            <Download className="h-3 w-3 inline mr-1" />
            CV
          </button>
        </div>
      </div>
    </motion.div>
  );

  const CandidateModal = () => {
    if (!showCandidateModal || !selectedCandidate) return null;

    return (
      <div className="fixed inset-0 z-50 overflow-y-auto">
        <div className="flex items-end justify-center min-h-screen pt-4 px-4 pb-20 text-center sm:block sm:p-0">
          <div className="fixed inset-0 bg-gray-500 bg-opacity-75 transition-opacity" onClick={() => setShowCandidateModal(false)}></div>
          
          <div className="inline-block align-bottom bg-white rounded-lg text-left overflow-hidden shadow-xl transform transition-all sm:my-8 sm:align-middle sm:max-w-2xl sm:w-full">
            <div className="bg-white px-4 pt-5 pb-4 sm:p-6 sm:pb-4">
              <div className="flex justify-between items-center mb-6">
                <h3 className="text-lg font-medium text-gray-900">Candidate Details</h3>
                <button 
                  onClick={() => setShowCandidateModal(false)}
                  className="text-gray-400 hover:text-gray-600 text-xl"
                >
                  ×
                </button>
              </div>
              
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <div className="space-y-4">
                  <div>
                    <label className="block text-sm font-medium text-gray-700">Full Name</label>
                    <p className="mt-1 text-sm text-gray-900">{selectedCandidate?.name}</p>
                  </div>
                  
                  <div>
                    <label className="block text-sm font-medium text-gray-700">Email</label>
                    <p className="mt-1 text-sm text-gray-900">{selectedCandidate?.email}</p>
                  </div>
                  
                  <div>
                    <label className="block text-sm font-medium text-gray-700">Phone</label>
                    <p className="mt-1 text-sm text-gray-900">{selectedCandidate?.phone}</p>
                  </div>
                  
                  <div>
                    <label className="block text-sm font-medium text-gray-700">Position Applied</label>
                    <p className="mt-1 text-sm text-gray-900">{selectedCandidate?.position}</p>
                  </div>
                </div>
                
                <div className="space-y-4">
                  <div>
                    <label className="block text-sm font-medium text-gray-700">Experience</label>
                    <p className="mt-1 text-sm text-gray-900">{selectedCandidate?.experience}</p>
                  </div>
                  
                  <div>
                    <label className="block text-sm font-medium text-gray-700">Current Stage</label>
                    <span className={`inline-flex px-2 py-1 rounded-full text-xs font-medium ${
                      stages?.find(s => s?.id === selectedCandidate?.stage)?.color
                    }`}>
                      {selectedCandidate?.stage}
                    </span>
                  </div>
                  
                  <div>
                    <label className="block text-sm font-medium text-gray-700">Match Score</label>
                    <div className="flex items-center space-x-2">
                      <span className={`text-lg font-bold ${getScoreColor(selectedCandidate?.score)}`}>
                        {selectedCandidate?.score}
                      </span>
                      <Star className={`h-5 w-5 ${getScoreColor(selectedCandidate?.score)}`} />
                    </div>
                  </div>
                  
                  <div>
                    <label className="block text-sm font-medium text-gray-700">Applied Date</label>
                    <p className="mt-1 text-sm text-gray-900">
                      {new Date(selectedCandidate.appliedDate)?.toLocaleDateString()}
                    </p>
                  </div>
                </div>
              </div>
              
              <div className="mt-6">
                <label className="block text-sm font-medium text-gray-700 mb-2">Skills & Technologies</label>
                <div className="flex flex-wrap gap-2">
                  {selectedCandidate?.skills?.map((skill, index) => (
                    <span key={index} className="px-3 py-1 bg-blue-50 text-blue-700 text-sm rounded-full">
                      {skill}
                    </span>
                  ))}
                </div>
              </div>
            </div>
            
            <div className="bg-gray-50 px-4 py-3 sm:px-6 sm:flex sm:flex-row-reverse">
              <button
                type="button"
                className="w-full inline-flex justify-center rounded-md border border-transparent shadow-sm px-4 py-2 bg-blue-600 text-base font-medium text-white hover:bg-blue-700 sm:ml-3 sm:w-auto sm:text-sm"
              >
                Schedule Interview
              </button>
              <button
                type="button"
                className="mt-3 w-full inline-flex justify-center rounded-md border border-gray-300 shadow-sm px-4 py-2 bg-white text-base font-medium text-gray-700 hover:bg-gray-50 sm:mt-0 sm:ml-3 sm:w-auto sm:text-sm"
              >
                Download CV
              </button>
              <button
                type="button"
                className="mt-3 w-full inline-flex justify-center rounded-md border border-gray-300 shadow-sm px-4 py-2 bg-white text-base font-medium text-gray-700 hover:bg-gray-50 sm:mt-0 sm:w-auto sm:text-sm"
                onClick={() => setShowCandidateModal(false)}
              >
                Close
              </button>
            </div>
          </div>
        </div>
      </div>
    );
  };

  return (
    <div>
      {/* Pipeline Stats */}
      <div className="grid grid-cols-2 md:grid-cols-6 gap-4 mb-6">
        {stages?.map((stage) => (
          <motion.div
            key={stage?.id}
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            className={`text-center p-3 rounded-lg cursor-pointer transition-colors ${
              selectedStage === stage?.id ? 'bg-blue-50 border-blue-200 border-2' : 'bg-white border'
            }`}
            onClick={() => setSelectedStage(selectedStage === stage?.id ? 'all' : stage?.id)}
          >
            <div className={`inline-flex px-2 py-1 rounded-full text-xs font-medium ${stage?.color} mb-2`}>
              {stage?.label}
            </div>
            <div className="text-2xl font-bold text-gray-900">{stage?.count}</div>
          </motion.div>
        ))}
      </div>
      {/* Controls */}
      <div className="flex flex-col sm:flex-row gap-4 mb-6">
        <div className="flex-1">
          <div className="relative">
            <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-gray-400" />
            <input
              type="text"
              placeholder="Search candidates by name, position, or email..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e?.target?.value)}
              className="pl-10 pr-4 py-2 w-full border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
            />
          </div>
        </div>
        
        <button
          onClick={() => setSelectedStage('all')}
          className="bg-gray-100 hover:bg-gray-200 text-gray-700 px-4 py-2 rounded-lg flex items-center space-x-2"
        >
          <Filter className="h-4 w-4" />
          <span>Clear Filters</span>
        </button>
      </div>
      {/* Candidate Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
        {filteredCandidates?.map((candidate) => (
          <CandidateCard key={candidate?.id} candidate={candidate} />
        ))}
      </div>
      {filteredCandidates?.length === 0 && (
        <div className="text-center py-12">
          <Users className="h-12 w-12 text-gray-300 mx-auto mb-4" />
          <h3 className="text-lg font-medium text-gray-900 mb-2">No candidates found</h3>
          <p className="text-gray-500">Try adjusting your search criteria or pipeline stage filter.</p>
        </div>
      )}
      <CandidateModal />
    </div>
  );
};

export default CandidatePipeline;

