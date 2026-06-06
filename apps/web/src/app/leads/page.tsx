'use client';

import { useState, useEffect } from 'react';
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
  source?: string;
}

interface GeoStats {
  geography: string;
  count: number;
  hotLeads: number;
  warmLeads: number;
  qualifiedLeads: number;
}

export default function LeadsPage() {
  const [leads, setLeads] = useState<Lead[]>([]);
  const [geoStats, setGeoStats] = useState<GeoStats[]>([]);
  const [selectedGeo, setSelectedGeo] = useState<string>('All');
  const [selectedService, setSelectedService] = useState<string>('All');
  const [loading, setLoading] = useState(true);

  const geographies = ['All', 'US', 'UK', 'UAE', 'Australia'];
  const services = ['All', 'MVP as a Service', 'ERP (NetSuite)', 'AI/ML Services', 'Custom App Development', 'Shopify'];

  useEffect(() => {
    fetchLeads();
  }, [selectedGeo, selectedService]);

  const fetchLeads = async () => {
    setLoading(true);
    try {
      const params = new URLSearchParams();
      if (selectedGeo !== 'All') params.append('geography', selectedGeo);
      if (selectedService !== 'All') params.append('service', selectedService);

      const response = await fetch(`http://localhost:3001/leads?${params.toString()}`);
      const data = await response.json();
      setLeads(data.data || []);
      
      // Calculate geo stats from all leads
      const allLeadsResponse = await fetch('http://localhost:3001/leads');
      const allData = await allLeadsResponse.json();
      calculateGeoStats(allData.data || []);
    } catch (error) {
      console.error('Error fetching leads:', error);
      setLeads([]);
    } finally {
      setLoading(false);
    }
  };

  const calculateGeoStats = (allLeads: Lead[]) => {
    const geos = ['US', 'UK', 'UAE', 'Australia'];
    const stats = geos.map(geo => {
      const geoLeads = allLeads.filter(lead => lead.geography === geo);
      return {
        geography: geo,
        count: geoLeads.length,
        hotLeads: geoLeads.filter(l => l.leadType?.includes('Hot')).length,
        warmLeads: geoLeads.filter(l => l.leadType?.includes('Warm')).length,
        qualifiedLeads: geoLeads.filter(l => l.leadType?.includes('Qualified')).length,
      };
    });
    setGeoStats(stats);
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

  return (
    <div className="min-h-screen bg-gray-50">
      <div className="max-w-7xl mx-auto px-4 py-8">
        {/* Header */}
        <div className="mb-8">
          <h1 className="text-3xl font-bold text-gray-900 mb-2">Lead Intelligence</h1>
          <p className="text-gray-600">AI-powered lead discovery and qualification</p>
        </div>

        {/* Geography Statistics */}
        <div className="grid grid-cols-1 md:grid-cols-4 gap-4 mb-8">
          {geoStats.map((stat) => (
            <button
              key={stat.geography}
              onClick={() => setSelectedGeo(stat.geography)}
              className={`bg-white rounded-lg shadow p-6 text-left transition-all hover:shadow-lg hover:scale-105 ${
                selectedGeo === stat.geography ? 'ring-2 ring-blue-500' : ''
              }`}
            >
              <div className="flex items-center justify-between mb-4">
                <h3 className="text-lg font-semibold text-gray-900">{stat.geography}</h3>
                <span className="text-2xl font-bold text-blue-600">{stat.count}</span>
              </div>
              <div className="space-y-2 text-sm">
                <div className="flex justify-between">
                  <span className="text-gray-600">Hot Leads</span>
                  <span className="font-medium text-red-600">{stat.hotLeads}</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-gray-600">Warm Leads</span>
                  <span className="font-medium text-orange-600">{stat.warmLeads}</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-gray-600">Qualified Leads</span>
                  <span className="font-medium text-green-600">{stat.qualifiedLeads}</span>
                </div>
              </div>
            </button>
          ))}
        </div>

        {/* Filters */}
        <div className="bg-white rounded-lg shadow p-6 mb-8">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Geography
              </label>
              <select
                value={selectedGeo}
                onChange={(e) => setSelectedGeo(e.target.value)}
                className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
              >
                {geographies.map((geo) => (
                  <option key={geo} value={geo}>
                    {geo}
                  </option>
                ))}
              </select>
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Service Type
              </label>
              <select
                value={selectedService}
                onChange={(e) => setSelectedService(e.target.value)}
                className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
              >
                {services.map((service) => (
                  <option key={service} value={service}>
                    {service}
                  </option>
                ))}
              </select>
            </div>
          </div>
        </div>

        {/* Leads List */}
        {loading ? (
          <div className="text-center py-12">
            <div className="inline-block h-8 w-8 animate-spin rounded-full border-4 border-solid border-blue-600 border-r-transparent"></div>
            <p className="mt-4 text-gray-600">Loading leads...</p>
          </div>
        ) : leads.length === 0 ? (
          <div className="bg-white rounded-lg shadow p-12 text-center">
            <p className="text-gray-600">No leads found matching your filters.</p>
          </div>
        ) : (
          <div className="space-y-6">
            {leads.map((lead) => (
              <div key={lead.id} className="bg-white rounded-lg shadow hover:shadow-lg transition-shadow">
                <div className="p-6">
                  {/* Header */}
                  <div className="flex items-start justify-between mb-4">
                    <div className="flex-1">
                      <div className="flex items-center gap-3 mb-2">
                        <h2 className="text-xl font-bold text-gray-900">{lead.companyName}</h2>
                        <span className={`px-3 py-1 rounded-full text-xs font-medium ${getStatusColor(lead.status)}`}>
                          {lead.status}
                        </span>
                        <span className="text-sm text-gray-500">📍 {lead.geography}</span>
                        {lead.source === 'LinkedIn' && (
                          <span className="px-3 py-1 bg-blue-600 text-white rounded-full text-xs font-medium animate-pulse">
                            🔴 LIVE from LinkedIn
                          </span>
                        )}
                      </div>
                      <div className="flex items-center gap-4 text-sm text-gray-600">
                        <span>{lead.industry}</span>
                        <span>•</span>
                        <span>{lead.employeeCount} employees</span>
                        <span>•</span>
                        <span>{lead.location}</span>
                      </div>
                    </div>
                    <div className={`text-center px-4 py-2 rounded-lg ${getScoreColor(lead.score)}`}>
                      <div className="text-2xl font-bold">{lead.score}</div>
                      <div className="text-xs">Score</div>
                    </div>
                  </div>

                  {/* Lead Type & Service */}
                  <div className="flex gap-2 mb-4">
                    <span className="px-3 py-1 bg-purple-100 text-purple-800 rounded-full text-sm font-medium">
                      {lead.leadType}
                    </span>
                    <span className="px-3 py-1 bg-indigo-100 text-indigo-800 rounded-full text-sm font-medium">
                      {lead.serviceMatch}
                    </span>
                  </div>

                  {/* Company Services */}
                  <div className="mb-4 p-4 bg-gray-50 rounded-lg">
                    <h3 className="text-sm font-semibold text-gray-900 mb-2">🏢 About Company</h3>
                    <p className="text-sm text-gray-700">{lead.companyServices}</p>
                  </div>

                  {/* Requirement */}
                  <div className="mb-4 p-4 bg-blue-50 rounded-lg">
                    <h3 className="text-sm font-semibold text-gray-900 mb-2">💼 Requirement Details</h3>
                    <p className="text-sm text-gray-700">{lead.requirement}</p>
                  </div>

                  {/* Evidence & Deadline */}
                  <div className="mb-4 grid grid-cols-2 gap-3">
                    <div className="p-3 bg-green-50 rounded-lg">
                      <div className="text-xs font-medium text-green-900 mb-1">📅 Deadline</div>
                      <div className="text-sm font-semibold text-green-700">{lead.deadline}</div>
                    </div>
                    <div className="p-3 bg-yellow-50 rounded-lg">
                      <div className="text-xs font-medium text-yellow-900 mb-1">🔗 Evidence Source</div>
                      <a href={lead.evidenceLink} target="_blank" rel="noopener noreferrer" 
                         className="text-sm font-semibold text-yellow-700 hover:underline">
                        View Source →
                      </a>
                    </div>
                  </div>

                  {/* Approach Strategy */}
                  <div className="mb-4 p-4 bg-green-50 rounded-lg">
                    <h3 className="text-sm font-semibold text-gray-900 mb-2">🎯 Approach Strategy</h3>
                    <p className="text-sm text-gray-700">{lead.approachStrategy}</p>
                  </div>

                  {/* Buying Signals */}
                  <div className="mb-4">
                    <h3 className="text-sm font-semibold text-gray-900 mb-2">🔔 Buying Signals</h3>
                    <div className="grid grid-cols-1 md:grid-cols-3 gap-2">
                      {lead.signals.map((signal, idx) => (
                        <div key={idx} className="p-3 bg-yellow-50 rounded-lg">
                          <span className="text-xs font-medium text-yellow-800">{signal.type}</span>
                          <p className="text-xs text-gray-700 mt-1">{signal.content}</p>
                        </div>
                      ))}
                    </div>
                  </div>

                  {/* Company Details */}
                  <div className="mb-4 p-4 bg-gray-50 rounded-lg">
                    <h3 className="text-sm font-semibold text-gray-900 mb-2">🏢 Company Details</h3>
                    <div className="grid grid-cols-1 md:grid-cols-3 gap-3 text-sm">
                      <a href={lead.website} target="_blank" rel="noopener noreferrer" 
                         className="text-blue-600 hover:underline flex items-center gap-1">
                        🌐 Website
                      </a>
                      <a href={lead.companyLinkedin} target="_blank" rel="noopener noreferrer"
                         className="text-blue-600 hover:underline flex items-center gap-1">
                        💼 LinkedIn
                      </a>
                      <a href={`mailto:${lead.companyEmail}`}
                         className="text-blue-600 hover:underline flex items-center gap-1">
                        ✉️ {lead.companyEmail}
                      </a>
                    </div>
                  </div>

                  {/* Contacts */}
                  <div className="mb-4">
                    <h3 className="text-sm font-semibold text-gray-900 mb-3">👥 Key Contacts</h3>
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                      {lead.contacts.map((contact, idx) => (
                        <div key={idx} className={`p-4 rounded-lg border-2 ${contact.decisionMaker ? 'border-green-500 bg-green-50' : 'border-gray-200 bg-white'}`}>
                          <div className="flex items-start justify-between mb-2">
                            <div>
                              <div className="font-semibold text-gray-900">{contact.name}</div>
                              <div className="text-sm text-gray-600">{contact.title}</div>
                            </div>
                            {contact.decisionMaker && (
                              <span className="px-2 py-1 bg-green-500 text-white text-xs rounded-full font-medium">
                                Decision Maker
                              </span>
                            )}
                          </div>
                          <div className="space-y-1 text-sm">
                            <a href={`mailto:${contact.email}`} className="block text-blue-600 hover:underline">
                              ✉️ {contact.email}
                            </a>
                            <a href={contact.linkedin} target="_blank" rel="noopener noreferrer" 
                               className="block text-blue-600 hover:underline">
                              💼 LinkedIn Profile
                            </a>
                            <div className="text-gray-700">📞 {contact.phone}</div>
                          </div>
                        </div>
                      ))}
                    </div>
                  </div>

                  {/* View Details Button */}
                  <div className="flex justify-end">
                    <Link href={`/leads/${lead.id}`}
                          className="px-6 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors font-medium">
                      View Full Details →
                    </Link>
                  </div>
                </div>
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  );
}
