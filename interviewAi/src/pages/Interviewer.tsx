import React from 'react';
import { useSelector } from 'react-redux';
import type { RootState } from '../redux/store';
import { UserOutlined, CheckCircleOutlined, ClockCircleOutlined} from '@ant-design/icons';

import { LineChart, Line, BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, Legend, ResponsiveContainer } from 'recharts';

const Interviewer: React.FC = () => {
  const candidates = useSelector((state: RootState) => state.interview.candidates);
  const questions = useSelector((state: RootState) => state.interview.questions);

  const completedCandidates = candidates.filter(c => c.score !== null);
  const averageScore = completedCandidates.length > 0
    ? Math.round(completedCandidates.reduce((sum, c) => sum + (c.score || 0), 0) / completedCandidates.length)
    : 0;

  const chartData = completedCandidates.map((candidate, index) => ({
    name: candidate.name.split(' ')[0],
    score: candidate.score || 0,
    index: index + 1
  }));

  return (
    <div className="p-5 min-h-screen w-screen mx-auto text-black">
      {/* Header */}
      <div className="mb-6">
        <h1 className="text-3xl font-bold mb-2 text-white">Interview Dashboard</h1>
        <p className="text-gray-500 flex items-center gap-2">
            React & Node.js Technical Interviews
        </p>
      </div>

      {/* Statistics */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-4 mb-6">
        <div className="bg-white shadow rounded p-4 flex flex-col items-center">
          <UserOutlined className="text-2xl text-red-600 mb-2 stroke-red-600" />
          <p className="text-gray-500">Total Candidates</p>
          <p className="text-xl font-bold">{candidates.length}</p>
        </div>
        <div className="bg-white shadow rounded p-4 flex flex-col items-center">
          <CheckCircleOutlined className="text-2xl text-green-600 mb-2" />
          <p className="text-gray-500">Completed Interviews</p>
          <p className="text-xl font-bold text-green-600">{completedCandidates.length}</p>
        </div>
        <div className="bg-white shadow rounded p-4 flex flex-col items-center">
          <p className="text-gray-500">Average Score</p>
          <p className={`text-xl font-bold ${averageScore >= 70 ? 'text-green-600' : 'text-red-600'}`}>
            {averageScore} / 100
          </p>
        </div>
        <div className="bg-white shadow rounded p-4 flex flex-col items-center">
          <ClockCircleOutlined className="text-2xl text-blue-600 mb-2" />
          <p className="text-gray-500">In Progress</p>
          <p className="text-xl font-bold text-blue-600">{candidates.length - completedCandidates.length}</p>
        </div>
      </div>

      {/* Charts */}
      {chartData.length > 0 && (
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-6">
          <div className="bg-white shadow rounded p-4">
            <h2 className="text-lg font-semibold mb-2">Score Distribution</h2>
            <ResponsiveContainer width="100%" height={250}>
              <BarChart data={chartData}>
                <CartesianGrid strokeDasharray="3 3" />
                <XAxis dataKey="name" />
                <YAxis domain={[0, 100]} />
                <Tooltip />
                <Legend />
                <Bar dataKey="score" fill="#1890ff" name="Score" />
              </BarChart>
            </ResponsiveContainer>
          </div>
          <div className="bg-white shadow rounded p-4">
            <h2 className="text-lg font-semibold mb-2">Score Trend</h2>
            <ResponsiveContainer width="100%" height={250}>
              <LineChart data={chartData}>
                <CartesianGrid strokeDasharray="3 3" />
                <XAxis dataKey="name" />
                <YAxis domain={[0, 100]} />
                <Tooltip />
                <Legend />
                <Line type="monotone" dataKey="score" stroke="#52c41a" strokeWidth={2} name="Score" />
              </LineChart>
            </ResponsiveContainer>
          </div>
        </div>
      )}

      {/* Candidates Table */}
      <div className="bg-white shadow rounded p-4">
        <h2 className="text-lg font-semibold mb-4">All Candidates</h2>
        {candidates.length === 0 ? (
          <div className="flex flex-col items-center justify-center py-20 text-gray-400">
            <p>No candidates yet. Start an interview to see data here.</p>
          </div>
        ) : (
          <div className="overflow-x-auto">
            <table className="min-w-full divide-y divide-gray-200">
              <thead className="bg-gray-50">
                <tr>
                  <th className="px-4 py-2 text-left text-sm font-medium text-gray-500">Name</th>
                  <th className="px-4 py-2 text-left text-sm font-medium text-gray-500">Email</th>
                  <th className="px-4 py-2 text-left text-sm font-medium text-gray-500">Phone</th>
                  <th className="px-4 py-2 text-left text-sm font-medium text-gray-500">Score</th>
                  <th className="px-4 py-2 text-left text-sm font-medium text-gray-500">Status</th>
                  <th className="px-4 py-2 text-left text-sm font-medium text-gray-500">Completed At</th>
                </tr>
              </thead>
              <tbody className="bg-white divide-y divide-gray-200">
                {candidates.map(candidate => (
                  <tr key={candidate.id}>
                    <td className="px-4 py-2 font-semibold">{candidate.name}</td>
                    <td className="px-4 py-2">{candidate.email}</td>
                    <td className="px-4 py-2">{candidate.phone || '-'}</td>
                    <td className="px-4 py-2">
                      {candidate.score === null ? (
                        <span className="bg-orange-200 text-orange-800 px-2 py-1 rounded text-sm">In Progress</span>
                      ) : (
                        <span className={`px-2 py-1 rounded text-sm ${candidate.score >= 80 ? 'bg-green-200 text-green-800' : candidate.score >= 60 ? 'bg-yellow-200 text-yellow-800' : 'bg-red-200 text-red-800'}`}>
                          {candidate.score}/100
                        </span>
                      )}
                    </td>
                    <td className="px-4 py-2">
                      {candidate.score !== null ? (
                        <span className="flex items-center gap-1 text-green-600">
                          <CheckCircleOutlined /> Completed
                        </span>
                      ) : (
                        <span className="flex items-center gap-1 text-blue-600">
                          <ClockCircleOutlined /> In Progress
                        </span>
                      )}
                    </td>
                    <td className="px-4 py-2">{candidate.completedAt ? new Date(candidate.completedAt).toLocaleString() : '-'}</td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        )}
      </div>
    </div>
  );
};

export default Interviewer;
