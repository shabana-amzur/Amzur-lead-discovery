'use client';

import { useState, useEffect } from 'react';
import { useParams, useRouter } from 'next/navigation';
import Link from 'next/link';

interface Contact {
  name: string;
  title: string;
  email: string;
  linkedin: string;
  phone: string;
  decisionMaker: boolean;
}

interface Signal {
  type: string;
  content: string;
}

interface Lead {
  id: string;
  companyName: string;
  website: string;
  companyLinkedin: string;
  companyEmail: string;
  industry: string;
  employeeCount: number;
  geography: string;
  location: string;
  status: string;
  score: number;
  leadType: string;
  companyServices: string;
  requirement: string;
  approachStrategy: string;
  evidenceLink: string;
  deadline: string;
  serviceMatch: string;
  signals: Signal[];
  contacts: Contact[];
  createdAt: string;
}

export default function LeadDetailPage() {
  const params = useParams();
  const router = useRouter();
  const [lead, setLead] = useState<Lead | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    if (params.id) {
      fetchLead(params.id as string);
    }
  }, [params.id]);

  const fetchLead = async (id: string) => {
    try {
      const response = await fetch(`http://localhost:3001/leads/${id}`);
      const data = await response.json();
      setLead(data);
    } catch (error) {
      console.error('Error fetching lead:', error);
    } finally {
      setLoading(false);
    }
  };

  const getScoreColor = (score: number) => {
    if (score >= 85) return 'text-green-600 bg-green-50';
    if (score >= 70) return 'text-blue-600 bg-blue-50';
    return 'text-yellow-600 bg-yellow-50';
  };

  const getStatusColor = (status: string) => {
    if (status === 'qualified') return 'bg-green-100 text-green-800';
    if (status === 'new') return 'bg-blue-100 text-blue-800';
    return 'bg-gray-100 text-gray-800';
  };

  if (loading) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <div className="text-center">
          <div className="inline-block h-8 w-8 animate-spin rounded-full border-4 border-solid border-blue-600 border-r-transparent"></div>
          <p className="mt-4 text-gray-600">Loading lead details...</p>
        </div>
      </div>
    );
  }

  if (!lead) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <div className="text-center">
          <h2 className="text-2xl font-bold text-gray-900 mb-4">Lead Not Found</h2>
          <Link href="/leads" className="text-blue-600 hover:underline">
            ← Back to Leads
          </Link>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-50">
      <div className="max-w-6xl mx-auto px-4 py-8">
        {/* Back Button */}
        <Link href="/leads" className="inline-flex items-center text-blue-600 hover:underline mb-6">
          ← Back to All Leads
        </Link>

        {/* Header Card */}
        <div className="bg-white rounded-lg shadow-lg p-8 mb-6">
          <div className="flex items-start justify-between mb-6">
            <div className="flex-1">
              <div className="flex items-center gap-3 mb-3">
                <h1 className="text-3xl font-bold text-gray-900">{lead.companyName}</h1>
                <span className={`px-3 py-1 rounded-full text-sm font-medium ${getStatusColor(lead.status)}`}>
                  {lead.status}
                </span>
              </div>
              <div className="flex items-center gap-4 text-gray-600 mb-4">
                <span>📍 {lead.location}</span>
                <span>•</span>
                <span>{lead.geography}</span>
                <span>•</span>
                <span>{lead.industry}</span>
                <span>•</span>
                <span>{lead.employeeCount} employees</span>
              </div>
              <div className="flex gap-2">
                <span className="px-4 py-2 bg-purple-100 text-purple-800 rounded-lg text-sm font-medium">
                  {lead.leadType}
                </span>
                <span className="px-4 py-2 bg-indigo-100 text-indigo-800 rounded-lg text-sm font-medium">
                  {lead.serviceMatch}
                </span>
              </div>
            </div>
            <div className={`text-center px-6 py-4 rounded-lg ${getScoreColor(lead.score)}`}>
              <div className="text-4xl font-bold">{lead.score}</div>
              <div className="text-sm">Lead Score</div>
            </div>
          </div>

          {/* Company Links */}
          <div className="flex gap-4 p-4 bg-gray-50 rounded-lg">
            <a href={lead.website} target="_blank" rel="noopener noreferrer" 
               className="flex items-center gap-2 px-4 py-2 bg-white border border-gray-300 rounded-lg hover:bg-gray-50 transition-colors">
              🌐 <span className="font-medium">Visit Website</span>
            </a>
            <a href={lead.companyLinkedin} target="_blank" rel="noopener noreferrer"
               className="flex items-center gap-2 px-4 py-2 bg-white border border-gray-300 rounded-lg hover:bg-gray-50 transition-colors">
              💼 <span className="font-medium">LinkedIn Page</span>
            </a>
            <a href={`mailto:${lead.companyEmail}`}
               className="flex items-center gap-2 px-4 py-2 bg-white border border-gray-300 rounded-lg hover:bg-gray-50 transition-colors">
              ✉️ <span className="font-medium">{lead.companyEmail}</span>
            </a>
            <a href={lead.evidenceLink} target="_blank" rel="noopener noreferrer"
               className="flex items-center gap-2 px-4 py-2 bg-yellow-100 border border-yellow-300 rounded-lg hover:bg-yellow-200 transition-colors">
              🔗 <span className="font-medium">Evidence Source</span>
            </a>
          </div>
        </div>

        {/* Deadline Alert */}
        <div className="bg-gradient-to-r from-red-50 to-orange-50 border-l-4 border-red-500 rounded-lg p-6 mb-6">
          <div className="flex items-center gap-3">
            <span className="text-3xl">⏰</span>
            <div className="flex-1">
              <h3 className="text-lg font-bold text-red-900">Decision Deadline</h3>
              <p className="text-red-700 mt-1">Must reach out by: <span className="font-bold">{lead.deadline}</span></p>
            </div>
            <div className="text-right">
              <div className="text-sm text-red-600">Days Remaining</div>
              <div className="text-2xl font-bold text-red-900">
                {Math.ceil((new Date(lead.deadline).getTime() - new Date().getTime()) / (1000 * 60 * 60 * 24))}
              </div>
            </div>
          </div>
        </div>

        {/* Company Services Section */}
        <div className="bg-white rounded-lg shadow-lg p-8 mb-6">
          <h2 className="text-2xl font-bold text-gray-900 mb-4">🏢 About the Company</h2>
          <div className="p-6 bg-gray-50 rounded-lg">
            <p className="text-gray-800 leading-relaxed">{lead.companyServices}</p>
          </div>
        </div>

        {/* Requirement Section */}
        <div className="bg-white rounded-lg shadow-lg p-8 mb-6">
          <h2 className="text-2xl font-bold text-gray-900 mb-4">💼 Detailed Business Requirement</h2>
          <div className="p-6 bg-blue-50 rounded-lg">
            <p className="text-gray-800 leading-relaxed whitespace-pre-line">{lead.requirement}</p>
          </div>
        </div>

        {/* Approach Strategy Section */}
        <div className="bg-white rounded-lg shadow-lg p-8 mb-6">
          <h2 className="text-2xl font-bold text-gray-900 mb-4">🎯 Recommended Approach Strategy</h2>
          <div className="p-6 bg-green-50 rounded-lg">
            <p className="text-gray-800 leading-relaxed">{lead.approachStrategy}</p>
          </div>
        </div>

        {/* Buying Signals Section */}
        <div className="bg-white rounded-lg shadow-lg p-8 mb-6">
          <h2 className="text-2xl font-bold text-gray-900 mb-4">🔔 Buying Signals</h2>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            {lead.signals.map((signal, idx) => (
              <div key={idx} className="p-6 bg-yellow-50 rounded-lg border-l-4 border-yellow-500">
                <div className="font-semibold text-yellow-900 mb-2">{signal.type}</div>
                <p className="text-gray-700 text-sm">{signal.content}</p>
              </div>
            ))}
          </div>
        </div>

        {/* Key Contacts Section */}
        <div className="bg-white rounded-lg shadow-lg p-8">
          <h2 className="text-2xl font-bold text-gray-900 mb-6">👥 Key Contacts for Outreach</h2>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            {lead.contacts.map((contact, idx) => (
              <div key={idx} className={`p-6 rounded-lg border-2 ${contact.decisionMaker ? 'border-green-500 bg-green-50' : 'border-gray-200 bg-gray-50'}`}>
                <div className="flex items-start justify-between mb-4">
                  <div>
                    <h3 className="text-xl font-bold text-gray-900">{contact.name}</h3>
                    <p className="text-gray-600 mt-1">{contact.title}</p>
                  </div>
                  {contact.decisionMaker && (
                    <span className="px-3 py-1 bg-green-500 text-white text-sm rounded-full font-medium">
                      ⭐ Decision Maker
                    </span>
                  )}
                </div>
                
                <div className="space-y-3">
                  <div className="flex items-center gap-3">
                    <span className="text-gray-500 text-sm w-6">✉️</span>
                    <a href={`mailto:${contact.email}`} className="text-blue-600 hover:underline">
                      {contact.email}
                    </a>
                  </div>
                  <div className="flex items-center gap-3">
                    <span className="text-gray-500 text-sm w-6">💼</span>
                    <a href={contact.linkedin} target="_blank" rel="noopener noreferrer" 
                       className="text-blue-600 hover:underline">
                      View LinkedIn Profile
                    </a>
                  </div>
                  <div className="flex items-center gap-3">
                    <span className="text-gray-500 text-sm w-6">📞</span>
                    <span className="text-gray-700">{contact.phone}</span>
                  </div>
                </div>

                {contact.decisionMaker && (
                  <div className="mt-4 p-3 bg-green-100 rounded-lg">
                    <p className="text-xs text-green-800 font-medium">
                      ⭐ This is a key decision maker - prioritize reaching out to this contact
                    </p>
                  </div>
                )}
              </div>
            ))}
          </div>
        </div>

        {/* Action Buttons */}
        <div className="mt-8 flex gap-4">
          <button className="flex-1 px-6 py-3 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors font-medium">
            📧 Generate Outreach Email
          </button>
          <button className="flex-1 px-6 py-3 bg-green-600 text-white rounded-lg hover:bg-green-700 transition-colors font-medium">
            📞 Schedule Call
          </button>
          <button className="flex-1 px-6 py-3 bg-purple-600 text-white rounded-lg hover:bg-purple-700 transition-colors font-medium">
            💼 Create Opportunity
          </button>
        </div>
      </div>
    </div>
  );
}
