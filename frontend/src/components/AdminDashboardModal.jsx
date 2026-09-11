import React, { useState, useEffect } from 'react';
import { X, Users, CheckCircle, XCircle, Download, RefreshCw, Shield, Clock, Search, Filter, QrCode, PlusCircle, Copy, Check, Printer, ExternalLink } from 'lucide-react';
import QRCode from 'qrcode';
import { WeddingService } from '../services/api';

export default function AdminDashboardModal({ isOpen, onClose }) {
  const [stats, setStats] = useState(null);
  const [masterList, setMasterList] = useState([]);
  const [loading, setLoading] = useState(false);
  const [activeTab, setActiveTab] = useState('manifest'); // 'manifest' or 'generate'
  
  // Filters & Search
  const [filterSide, setFilterSide] = useState('ALL');
  const [filterStatus, setFilterStatus] = useState('ALL'); // 'ALL', 'REGISTERED', 'UNUSED'
  const [searchTerm, setSearchTerm] = useState('');

  // Generate New Pass Form State
  const [newFamilyName, setNewFamilyName] = useState('');
  const [newAllowedSize, setNewAllowedSize] = useState(2);
  const [newSide, setNewSide] = useState("Bride's Side (Chandrika)");
  const [newTable, setNewTable] = useState('Table 1 - Royal Lotus');
  const [isGenerating, setIsGenerating] = useState(false);
  const [generatedPass, setGeneratedPass] = useState(null);
  const [generatedQrDataUrl, setGeneratedQrDataUrl] = useState('');
  const [copiedLink, setCopiedLink] = useState(false);

  const loadData = async () => {
    setLoading(true);
    try {
      const [statsData, listData] = await Promise.all([
        WeddingService.getMasterStats(),
        WeddingService.getMasterList()
      ]);
      setStats(statsData);
      setMasterList(listData);
    } catch (err) {
      console.error("Failed to load admin data:", err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    if (isOpen) {
      loadData();
    }
  }, [isOpen]);

  // Handle Invitation Generation
  const handleGeneratePass = async (e) => {
    e.preventDefault();
    if (!newFamilyName.trim()) return;

    setIsGenerating(true);
    setGeneratedPass(null);
    setGeneratedQrDataUrl('');
    setCopiedLink(false);

    try {
      const res = await WeddingService.createAdminInvitation({
        familyName: newFamilyName.trim(),
        allowedPartySize: parseInt(newAllowedSize, 10),
        side: newSide,
        assignedTable: newTable
      });

      if (res.success) {
        setGeneratedPass(res);
        
        // Construct full URL
        const origin = window.location.origin;
        const fullInviteUrl = `${origin}/invite/${res.rawToken}`;
        res.fullInviteUrl = fullInviteUrl;

        // Generate QR code data URL
        const qrUrl = await QRCode.toDataURL(fullInviteUrl, {
          width: 320,
          margin: 2,
          color: {
            dark: '#1F1B18',
            light: '#FFFFFF'
          }
        });
        setGeneratedQrDataUrl(qrUrl);

        // Reload manifest
        loadData();
      } else {
        alert(res.message || "Failed to create invitation pass.");
      }
    } catch (err) {
      console.error(err);
      alert("Error generating invitation pass.");
    } finally {
      setIsGenerating(false);
    }
  };

  const copyInviteLink = () => {
    if (!generatedPass?.fullInviteUrl) return;
    navigator.clipboard.writeText(generatedPass.fullInviteUrl);
    setCopiedLink(true);
    setTimeout(() => setCopiedLink(false), 2500);
  };

  const downloadQrCode = () => {
    if (!generatedQrDataUrl || !generatedPass) return;
    const a = document.createElement('a');
    a.href = generatedQrDataUrl;
    a.download = `Wedding_QR_${generatedPass.invitationCode}_${generatedPass.familyName.replace(/\s+/g, '_')}.png`;
    a.click();
  };

  if (!isOpen) return null;

  const filteredParties = masterList.filter(p => {
    const matchesSide = filterSide === 'ALL' || (p.side && p.side.toLowerCase().includes(filterSide.toLowerCase()));
    const matchesStatus = filterStatus === 'ALL' || (p.status && p.status.toUpperCase() === filterStatus.toUpperCase());
    const matchesSearch = !searchTerm || 
      (p.familyName && p.familyName.toLowerCase().includes(searchTerm.toLowerCase())) || 
      (p.primaryEmail && p.primaryEmail.toLowerCase().includes(searchTerm.toLowerCase())) ||
      (p.invitationCode && p.invitationCode.toLowerCase().includes(searchTerm.toLowerCase())) ||
      (p.assignedTable && p.assignedTable.toLowerCase().includes(searchTerm.toLowerCase()));
    return matchesSide && matchesStatus && matchesSearch;
  });

  const exportMasterCsv = () => {
    if (!masterList.length) return;
    const headers = ["Invitation Code", "Family Name", "Registration Status", "Primary Email", "Allowed Seats", "Confirmed Headcount", "RSVP Status", "Side", "Table Assignment", "Attending Members", "Pass Serial"];
    const rows = masterList.map(p => [
      `"${p.invitationCode || ''}"`,
      `"${p.familyName || ''}"`,
      `"${p.status || 'UNUSED'}"`,
      `"${p.primaryEmail || ''}"`,
      p.allowedPartySize || 2,
      p.confirmedHeadcount || 0,
      `"${p.rsvpStatus || 'PENDING'}"`,
      `"${p.side || ''}"`,
      `"${p.assignedTable || ''}"`,
      `"${(p.attendingMembers || '').replace(/"/g, '""')}"`,
      `"${p.passSerial || ''}"`
    ]);

    const csvContent = "data:text/csv;charset=utf-8," + [headers.join(','), ...rows.map(e => e.join(','))].join('\n');
    const encodedUri = encodeURI(csvContent);
    const link = document.createElement("a");
    link.setAttribute("href", encodedUri);
    link.setAttribute("download", `chandrika_xudong_invitations_manifest_${new Date().toISOString().slice(0, 10)}.csv`);
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
  };

  const confirmedCount = stats?.confirmedHeadcount || 4;
  const totalCapacity = 100;
  const capacityPercent = Math.min(100, Math.round((confirmedCount / totalCapacity) * 100));

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-3 sm:p-4 bg-black/75 backdrop-blur-sm animate-fade-in">
      <div className="relative w-full max-w-5xl bg-[#FFFDF9] rounded-2xl shadow-2xl border-2 border-gold-400 p-5 sm:p-7 my-4 text-charcoal max-h-[92vh] flex flex-col">
        
        {/* Header */}
        <div className="flex items-center justify-between border-b border-gold-200 pb-3">
          <div className="flex items-center gap-2.5">
            <div className="w-10 h-10 rounded-full bg-gold-100 flex items-center justify-center text-gold-800 border border-gold-300">
              <Shield className="w-5 h-5" />
            </div>
            <div>
              <h2 className="font-serif font-bold text-lg sm:text-xl text-charcoal">
                100-Guest Invitation Manager & Host Concierge
              </h2>
              <p className="text-[11px] text-charcoal/60">
                Chandrika & Xudong Wedding • The Oberoi Udaivilas
              </p>
            </div>
          </div>

          <div className="flex items-center gap-2">
            <button
              onClick={loadData}
              title="Refresh Data"
              className="p-2 rounded-lg border border-gold-300 hover:bg-gold-50 text-gold-800 transition-colors"
            >
              <RefreshCw className={`w-4 h-4 ${loading ? 'animate-spin' : ''}`} />
            </button>
            <button
              onClick={onClose}
              className="p-2 text-charcoal/60 hover:text-charcoal rounded-lg hover:bg-gray-100 transition-colors"
            >
              <X className="w-5 h-5" />
            </button>
          </div>
        </div>

        {/* 100-Seat Capacity Gauge & Counters */}
        <div className="my-3 bg-white p-3.5 rounded-xl border border-gold-200 shadow-sm">
          <div className="flex items-center justify-between mb-1.5 text-xs font-bold">
            <span className="text-charcoal/80 uppercase tracking-wider">Wedding Guest Capacity Limit</span>
            <span className="text-gold-900 font-mono text-sm">{confirmedCount} of 100 Seats Confirmed ({capacityPercent}%)</span>
          </div>

          {/* Progress bar */}
          <div className="w-full h-2.5 bg-gold-100 rounded-full overflow-hidden">
            <div
              className="h-full bg-gradient-to-r from-gold-500 via-gold-600 to-green-600 rounded-full transition-all duration-700"
              style={{ width: `${capacityPercent}%` }}
            />
          </div>

          {/* Metrics Tiles */}
          <div className="grid grid-cols-2 sm:grid-cols-5 gap-2 mt-2.5 pt-2.5 border-t border-gold-100 text-xs">
            <div>
              <span className="text-charcoal/60 text-[10px] uppercase font-bold block">Confirmed Guests</span>
              <span className="font-serif font-bold text-base text-green-700">{confirmedCount}</span>
            </div>
            <div>
              <span className="text-charcoal/60 text-[10px] uppercase font-bold block">Remaining Seats</span>
              <span className="font-serif font-bold text-base text-gold-900">{Math.max(0, 100 - confirmedCount)}</span>
            </div>
            <div>
              <span className="text-charcoal/60 text-[10px] uppercase font-bold block">Total Passes</span>
              <span className="font-serif font-bold text-base text-charcoal">{stats?.totalParties || masterList.length}</span>
            </div>
            <div>
              <span className="text-charcoal/60 text-[10px] uppercase font-bold block">Registered Passes</span>
              <span className="font-serif font-bold text-base text-blue-700">{stats?.registeredParties || 0}</span>
            </div>
            <div>
              <span className="text-charcoal/60 text-[10px] uppercase font-bold block">Unused Passes</span>
              <span className="font-serif font-bold text-base text-amber-600">{stats?.unusedParties || 0}</span>
            </div>
          </div>
        </div>

        {/* View Tabs */}
        <div className="flex items-center gap-2 mb-3">
          <button
            onClick={() => setActiveTab('manifest')}
            className={`px-3.5 py-1.5 rounded-xl text-xs font-bold uppercase tracking-wider transition-all flex items-center gap-1.5 ${
              activeTab === 'manifest'
                ? 'bg-gold-500 text-white shadow-sm'
                : 'bg-gold-50 text-gold-900 hover:bg-gold-100 border border-gold-200'
            }`}
          >
            <Users className="w-3.5 h-3.5" />
            <span>Master Guest Manifest ({filteredParties.length})</span>
          </button>

          <button
            onClick={() => setActiveTab('generate')}
            className={`px-3.5 py-1.5 rounded-xl text-xs font-bold uppercase tracking-wider transition-all flex items-center gap-1.5 ${
              activeTab === 'generate'
                ? 'bg-gold-500 text-white shadow-sm'
                : 'bg-gold-50 text-gold-900 hover:bg-gold-100 border border-gold-200'
            }`}
          >
            <PlusCircle className="w-3.5 h-3.5 text-gold-700" />
            <span>Generate New Pass & QR</span>
          </button>
        </div>

        {/* TAB 1: MANIFEST LIST */}
        {activeTab === 'manifest' && (
          <div className="flex-1 flex flex-col overflow-hidden">
            {/* Search and Filters Bar */}
            <div className="flex flex-wrap items-center justify-between gap-2.5 mb-3 bg-gold-50/50 p-2.5 rounded-xl border border-gold-200/80">
              <div className="flex flex-wrap items-center gap-2 flex-1">
                {/* Search */}
                <div className="relative flex-1 min-w-[180px]">
                  <Search className="w-3.5 h-3.5 absolute left-3 top-2.5 text-charcoal/40" />
                  <input
                    type="text"
                    placeholder="Search by name, email, pass ID, or table..."
                    value={searchTerm}
                    onChange={(e) => setSearchTerm(e.target.value)}
                    className="w-full pl-8 pr-3 py-1.5 text-xs rounded-lg border border-gold-300 bg-white focus:outline-none focus:ring-1 focus:ring-gold-500"
                  />
                </div>

                {/* Status Filter */}
                <select
                  value={filterStatus}
                  onChange={(e) => setFilterStatus(e.target.value)}
                  className="px-2.5 py-1.5 text-xs rounded-lg border border-gold-300 bg-white font-medium text-charcoal"
                >
                  <option value="ALL">All Status</option>
                  <option value="REGISTERED">Registered</option>
                  <option value="UNUSED">Unused</option>
                </select>

                {/* Side Filter */}
                <select
                  value={filterSide}
                  onChange={(e) => setFilterSide(e.target.value)}
                  className="px-2.5 py-1.5 text-xs rounded-lg border border-gold-300 bg-white font-medium text-charcoal"
                >
                  <option value="ALL">All Sides</option>
                  <option value="Chandrika">Bride's Side</option>
                  <option value="Xudong">Groom's Side</option>
                </select>
              </div>

              {/* Export CSV Button */}
              <button
                onClick={exportMasterCsv}
                className="px-3 py-1.5 rounded-lg bg-white border border-gold-300 text-gold-900 hover:bg-gold-50 text-xs font-bold flex items-center gap-1.5 shadow-sm"
              >
                <Download className="w-3.5 h-3.5" />
                <span>Export CSV</span>
              </button>
            </div>

            {/* Manifest Table */}
            <div className="flex-1 overflow-y-auto border border-gold-200 rounded-xl bg-white shadow-inner">
              <table className="w-full text-left border-collapse text-xs">
                <thead className="bg-gold-50/80 sticky top-0 text-[10px] font-bold uppercase tracking-wider text-charcoal/70 border-b border-gold-200">
                  <tr>
                    <th className="p-2.5">Pass ID</th>
                    <th className="p-2.5">Family / Primary Guest</th>
                    <th className="p-2.5">Status</th>
                    <th className="p-2.5">Email</th>
                    <th className="p-2.5">Seats</th>
                    <th className="p-2.5">Side</th>
                    <th className="p-2.5">Table</th>
                    <th className="p-2.5">RSVP</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-gold-100">
                  {filteredParties.map((p) => {
                    const isRegistered = p.status === 'REGISTERED';
                    return (
                      <tr key={p.id} className="hover:bg-gold-50/40 transition-colors">
                        <td className="p-2.5 font-mono font-bold text-gold-900">
                          {p.invitationCode || `INV-${String(p.id).padStart(4, '0')}`}
                        </td>
                        <td className="p-2.5 font-semibold text-charcoal">
                          {p.familyName}
                        </td>
                        <td className="p-2.5">
                          {isRegistered ? (
                            <span className="inline-flex items-center gap-1 px-2 py-0.5 rounded-full text-[10px] font-bold bg-green-100 text-green-800">
                              <CheckCircle className="w-3 h-3" /> Registered
                            </span>
                          ) : (
                            <span className="inline-flex items-center gap-1 px-2 py-0.5 rounded-full text-[10px] font-bold bg-amber-100 text-amber-800">
                              <Clock className="w-3 h-3" /> Unused
                            </span>
                          )}
                        </td>
                        <td className="p-2.5 font-mono text-[11px] text-charcoal/70">
                          {p.primaryEmail || <span className="italic text-charcoal/40">Not registered yet</span>}
                        </td>
                        <td className="p-2.5 font-mono">
                          <span className="font-bold text-charcoal">{p.confirmedHeadcount || 0}</span>
                          <span className="text-charcoal/40"> / {p.allowedPartySize}</span>
                        </td>
                        <td className="p-2.5 text-[11px] text-charcoal/70">
                          {p.side?.includes('Chandrika') ? "Bride's Side" : "Groom's Side"}
                        </td>
                        <td className="p-2.5 text-[11px] font-medium text-gold-900">
                          {p.assignedTable || 'Table 1'}
                        </td>
                        <td className="p-2.5">
                          <span className={`px-2 py-0.5 rounded-full text-[10px] font-bold uppercase ${
                            p.rsvpStatus === 'ATTENDING'
                              ? 'bg-green-100 text-green-800'
                              : p.rsvpStatus === 'DECLINED'
                              ? 'bg-red-100 text-red-800'
                              : 'bg-gray-100 text-gray-700'
                          }`}>
                            {p.rsvpStatus || 'PENDING'}
                          </span>
                        </td>
                      </tr>
                    );
                  })}
                  {filteredParties.length === 0 && (
                    <tr>
                      <td colSpan={8} className="p-8 text-center text-charcoal/50">
                        No invitations matched your search filters.
                      </td>
                    </tr>
                  )}
                </tbody>
              </table>
            </div>
          </div>
        )}

        {/* TAB 2: GENERATE NEW INVITATION PASS */}
        {activeTab === 'generate' && (
          <div className="flex-1 flex flex-col md:flex-row gap-5 overflow-y-auto pt-1">
            {/* Form */}
            <form onSubmit={handleGeneratePass} className="w-full md:w-1/2 space-y-3.5 bg-white p-4 rounded-xl border border-gold-200">
              <h3 className="font-serif font-bold text-sm text-charcoal border-b border-gold-100 pb-2">
                Generate Unique Invitation Pass
              </h3>

              <div>
                <label className="block text-[11px] font-bold uppercase tracking-wider text-charcoal/70 mb-1">
                  Family / Primary Guest Name <span className="text-red-500">*</span>
                </label>
                <input
                  type="text"
                  required
                  value={newFamilyName}
                  onChange={(e) => setNewFamilyName(e.target.value)}
                  placeholder="e.g. Kapoor Family or Dr. Arvind Sharma"
                  className="w-full px-3 py-2 rounded-lg border border-gold-300 text-xs focus:outline-none focus:ring-2 focus:ring-gold-500"
                />
              </div>

              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="block text-[11px] font-bold uppercase tracking-wider text-charcoal/70 mb-1">
                    Allowed Guests (Quota)
                  </label>
                  <select
                    value={newAllowedSize}
                    onChange={(e) => setNewAllowedSize(e.target.value)}
                    className="w-full px-3 py-2 rounded-lg border border-gold-300 text-xs bg-white"
                  >
                    {[1, 2, 3, 4, 5, 6].map(num => (
                      <option key={num} value={num}>{num} {num === 1 ? 'Guest' : 'Guests'}</option>
                    ))}
                  </select>
                </div>

                <div>
                  <label className="block text-[11px] font-bold uppercase tracking-wider text-charcoal/70 mb-1">
                    Side
                  </label>
                  <select
                    value={newSide}
                    onChange={(e) => setNewSide(e.target.value)}
                    className="w-full px-3 py-2 rounded-lg border border-gold-300 text-xs bg-white"
                  >
                    <option value="Bride's Side (Chandrika)">Bride's Side (Chandrika)</option>
                    <option value="Groom's Side (Xudong)">Groom's Side (Xudong)</option>
                  </select>
                </div>
              </div>

              <div>
                <label className="block text-[11px] font-bold uppercase tracking-wider text-charcoal/70 mb-1">
                  Assigned Dining Table
                </label>
                <input
                  type="text"
                  value={newTable}
                  onChange={(e) => setNewTable(e.target.value)}
                  placeholder="e.g. Table 1 - Royal Lotus"
                  className="w-full px-3 py-2 rounded-lg border border-gold-300 text-xs focus:outline-none focus:ring-2 focus:ring-gold-500"
                />
              </div>

              <button
                type="submit"
                disabled={isGenerating || !newFamilyName.trim()}
                className="w-full py-2.5 px-4 rounded-xl bg-gold-gradient hover:opacity-95 text-white font-bold text-xs uppercase tracking-wider shadow-md transition-all flex items-center justify-center gap-1.5 disabled:opacity-50 mt-2"
              >
                {isGenerating ? (
                  <>
                    <RefreshCw className="w-3.5 h-3.5 animate-spin" />
                    <span>Generating Secure Token & QR...</span>
                  </>
                ) : (
                  <>
                    <PlusCircle className="w-3.5 h-3.5" />
                    <span>Create Invitation Pass</span>
                  </>
                )}
              </button>
            </form>

            {/* Generated Pass Preview & QR Code */}
            <div className="w-full md:w-1/2 flex flex-col items-center justify-center p-4 bg-white rounded-xl border border-gold-200">
              {generatedPass && generatedQrDataUrl ? (
                <div className="w-full space-y-3 animate-fade-in text-center">
                  <div className="p-3 bg-gold-50 rounded-xl border border-gold-200 inline-block">
                    <img
                      src={generatedQrDataUrl}
                      alt="Invitation QR Code"
                      className="w-44 h-44 mx-auto rounded-lg shadow-sm border border-gold-300"
                    />
                  </div>

                  <div>
                    <span className="font-mono text-xs font-bold text-gold-900 bg-gold-100/80 px-2.5 py-1 rounded-full border border-gold-300">
                      {generatedPass.invitationCode}
                    </span>
                    <h4 className="font-serif font-bold text-base text-charcoal mt-1">
                      {generatedPass.familyName}
                    </h4>
                    <p className="text-[11px] text-charcoal/60">
                      Quota: {generatedPass.allowedPartySize} Guests • {generatedPass.assignedTable}
                    </p>
                  </div>

                  <div className="flex flex-col sm:flex-row items-center gap-2 pt-1">
                    <button
                      onClick={copyInviteLink}
                      className="w-full sm:w-1/2 py-2 px-3 rounded-lg border border-gold-300 bg-gold-50 hover:bg-gold-100 text-gold-900 text-xs font-bold flex items-center justify-center gap-1.5 transition-colors"
                    >
                      {copiedLink ? <Check className="w-3.5 h-3.5 text-green-600" /> : <Copy className="w-3.5 h-3.5" />}
                      <span>{copiedLink ? 'Link Copied!' : 'Copy Link'}</span>
                    </button>

                    <button
                      onClick={downloadQrCode}
                      className="w-full sm:w-1/2 py-2 px-3 rounded-lg bg-gold-gradient text-white text-xs font-bold flex items-center justify-center gap-1.5 shadow-sm hover:opacity-95 transition-opacity"
                    >
                      <Download className="w-3.5 h-3.5" />
                      <span>Download QR</span>
                    </button>
                  </div>

                  <p className="text-[10px] text-charcoal/50 italic">
                    Print this QR code on the physical invitation pass. Once scanned, the guest registers their email.
                  </p>
                </div>
              ) : (
                <div className="text-center p-6 text-charcoal/40">
                  <QrCode className="w-12 h-12 mx-auto text-gold-300 mb-2 stroke-[1.5]" />
                  <p className="text-xs font-medium">
                    Fill out the form on the left to generate an invitation pass with a unique token and printable QR code.
                  </p>
                </div>
              )}
            </div>
          </div>
        )}

      </div>
    </div>
  );
}
