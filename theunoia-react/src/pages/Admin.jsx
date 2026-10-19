import React, { useState, useEffect } from 'react';
import { API_BASE_URL } from '../config/api.js';
import AdminLogin from './AdminLogin.jsx';

export default function Admin() {
  const [authenticated, setAuthenticated] = useState(null);
  const [tab, setTab] = useState('overview');
  const [overview, setOverview] = useState(null);
  const [contacts, setContacts] = useState([]);
  const [makers, setMakers] = useState([]);
  const [loading, setLoading] = useState(false);
  const [statusFilter, setStatusFilter] = useState('all');
  const [search, setSearch] = useState('');
  const [selectedItem, setSelectedItem] = useState(null);
  const [actionMessage, setActionMessage] = useState('');

  // Check current auth status on mount
  useEffect(() => {
    checkAuth();
  }, []);

  const checkAuth = async () => {
    try {
      const res = await fetch(`${API_BASE_URL}/api/admin/me`, { credentials: 'include' });
      const data = await res.json().catch(() => ({}));
      if (res.ok && data.authenticated) {
        setAuthenticated(true);
        loadOverview();
      } else {
        setAuthenticated(false);
      }
    } catch {
      setAuthenticated(false);
    }
  };

  const handleLogout = async () => {
    try {
      await fetch(`${API_BASE_URL}/api/admin/logout`, {
        method: 'POST',
        credentials: 'include'
      });
    } finally {
      setAuthenticated(false);
    }
  };

  const loadOverview = async () => {
    setLoading(true);
    try {
      const res = await fetch(`${API_BASE_URL}/api/admin/overview`, { credentials: 'include' });
      const json = await res.json();
      if (res.ok && json.success) setOverview(json.data);
    } catch (err) {
      console.error(err);
    } finally {
      setLoading(false);
    }
  };

  const loadContacts = async () => {
    setLoading(true);
    try {
      const q = new URLSearchParams();
      if (statusFilter !== 'all') q.set('status', statusFilter);
      if (search) q.set('search', search);
      const res = await fetch(`${API_BASE_URL}/api/admin/contacts?${q.toString()}`, { credentials: 'include' });
      const json = await res.json();
      if (res.ok && json.success) setContacts(json.data.items || []);
    } catch (err) {
      console.error(err);
    } finally {
      setLoading(false);
    }
  };

  const loadMakers = async () => {
    setLoading(true);
    try {
      const q = new URLSearchParams();
      if (statusFilter !== 'all') q.set('status', statusFilter);
      if (search) q.set('search', search);
      const res = await fetch(`${API_BASE_URL}/api/admin/makers?${q.toString()}`, { credentials: 'include' });
      const json = await res.json();
      if (res.ok && json.success) setMakers(json.data.items || []);
    } catch (err) {
      console.error(err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    if (authenticated) {
      if (tab === 'overview') loadOverview();
      if (tab === 'contacts') loadContacts();
      if (tab === 'makers') loadMakers();
    }
  }, [tab, statusFilter, search, authenticated]);

  const updateContactStatus = async (id, newStatus) => {
    try {
      const res = await fetch(`${API_BASE_URL}/api/admin/contacts/${id}`, {
        method: 'PATCH',
        headers: { 'Content-Type': 'application/json' },
        credentials: 'include',
        body: JSON.stringify({ status: newStatus })
      });
      if (res.ok) {
        setActionMessage('Contact status updated.');
        loadContacts();
      }
    } catch (err) {
      console.error(err);
    }
  };

  const deleteContact = async (id) => {
    if (!window.confirm('Are you sure you want to delete this submission?')) return;
    try {
      const res = await fetch(`${API_BASE_URL}/api/admin/contacts/${id}`, {
        method: 'DELETE',
        credentials: 'include'
      });
      if (res.ok) {
        setActionMessage('Contact deleted.');
        setSelectedItem(null);
        loadContacts();
      }
    } catch (err) {
      console.error(err);
    }
  };

  const updateMakerStatus = async (id, newStatus, note) => {
    try {
      const res = await fetch(`${API_BASE_URL}/api/admin/makers/${id}`, {
        method: 'PATCH',
        headers: { 'Content-Type': 'application/json' },
        credentials: 'include',
        body: JSON.stringify({ status: newStatus, admin_note: note })
      });
      if (res.ok) {
        setActionMessage('Maker status updated.');
        loadMakers();
      }
    } catch (err) {
      console.error(err);
    }
  };

  const exportCSV = (type) => {
    const q = new URLSearchParams();
    if (statusFilter !== 'all') q.set('status', statusFilter);
    if (search) q.set('search', search);
    q.set('export', 'csv');
    window.open(`${API_BASE_URL}/api/admin/${type}?${q.toString()}`, '_blank');
  };

  if (authenticated === null) {
    return <div style={{ background: '#14213D', minHeight: '100vh', color: '#fff', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>Loading Admin Workspace...</div>;
  }

  if (authenticated === false) {
    return <AdminLogin onLoginSuccess={() => { setAuthenticated(true); loadOverview(); }} />;
  }

  return (
    <div style={{ display: 'flex', minHeight: '100vh', background: '#F4F5F7', fontFamily: 'Manrope, sans-serif' }}>
      {/* Sidebar */}
      <aside style={{ width: '260px', background: '#14213D', color: '#FAF7F0', display: 'flex', flexDirection: 'column' }}>
        <div style={{ padding: '24px 20px', borderBottom: '1px solid rgba(255,255,255,0.1)' }}>
          <img src="/assets/logo.png" width="140" alt="THEUNOiA" />
          <p style={{ margin: '8px 0 0', fontSize: '12px', color: '#C9A227', textTransform: 'uppercase', letterSpacing: '0.1em', fontWeight: '700' }}>Admin Console</p>
        </div>

        <nav style={{ padding: '20px 12px', display: 'flex', flexDirection: 'column', gap: '8px', flex: 1 }}>
          <button
            onClick={() => { setTab('overview'); setSelectedItem(null); setStatusFilter('all'); }}
            style={{ textAlign: 'left', padding: '12px 16px', borderRadius: '8px', background: tab === 'overview' ? '#24345A' : 'transparent', color: '#fff', border: 'none', cursor: 'pointer', fontSize: '15px', fontWeight: tab === 'overview' ? '700' : '500' }}
          >
            Overview
          </button>
          <button
            onClick={() => { setTab('contacts'); setSelectedItem(null); setStatusFilter('all'); }}
            style={{ textAlign: 'left', padding: '12px 16px', borderRadius: '8px', background: tab === 'contacts' ? '#24345A' : 'transparent', color: '#fff', border: 'none', cursor: 'pointer', fontSize: '15px', fontWeight: tab === 'contacts' ? '700' : '500' }}
          >
            Contact Enquiries
          </button>
          <button
            onClick={() => { setTab('makers'); setSelectedItem(null); setStatusFilter('all'); }}
            style={{ textAlign: 'left', padding: '12px 16px', borderRadius: '8px', background: tab === 'makers' ? '#24345A' : 'transparent', color: '#fff', border: 'none', cursor: 'pointer', fontSize: '15px', fontWeight: tab === 'makers' ? '700' : '500' }}
          >
            Maker Registrations
          </button>
        </nav>

        <div style={{ padding: '20px', borderTop: '1px solid rgba(255,255,255,0.1)' }}>
          <button
            onClick={handleLogout}
            style={{ width: '100%', padding: '10px', background: '#B5543A', border: 'none', borderRadius: '8px', color: '#fff', fontWeight: '700', cursor: 'pointer' }}
          >
            Sign Out
          </button>
        </div>
      </aside>

      {/* Main Content */}
      <main style={{ flex: 1, padding: '32px 40px', overflowY: 'auto' }}>
        {actionMessage && (
          <div style={{ marginBottom: '20px', padding: '12px 16px', background: '#E8F5E9', color: '#2E7D32', borderRadius: '8px', fontWeight: '600' }}>
            {actionMessage}
          </div>
        )}

        {tab === 'overview' && overview && (
          <div>
            <h1 style={{ fontSize: '28px', color: '#14213D', marginBottom: '24px' }}>Executive Overview</h1>
            <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(220px, 1fr))', gap: '20px' }}>
              <div style={{ background: '#fff', padding: '24px', borderRadius: '12px', border: '1px solid #E2E8F0' }}>
                <p style={{ margin: 0, color: '#64748B', fontSize: '14px', fontWeight: '600' }}>Total Contacts</p>
                <p style={{ margin: '8px 0 0', fontSize: '32px', fontWeight: '800', color: '#14213D' }}>{overview.totalContacts}</p>
              </div>
              <div style={{ background: '#fff', padding: '24px', borderRadius: '12px', border: '1px solid #E2E8F0' }}>
                <p style={{ margin: 0, color: '#64748B', fontSize: '14px', fontWeight: '600' }}>New Contacts</p>
                <p style={{ margin: '8px 0 0', fontSize: '32px', fontWeight: '800', color: '#C9A227' }}>{overview.newContacts}</p>
              </div>
              <div style={{ background: '#fff', padding: '24px', borderRadius: '12px', border: '1px solid #E2E8F0' }}>
                <p style={{ margin: 0, color: '#64748B', fontSize: '14px', fontWeight: '600' }}>Total Makers</p>
                <p style={{ margin: '8px 0 0', fontSize: '32px', fontWeight: '800', color: '#14213D' }}>{overview.totalMakers}</p>
              </div>
              <div style={{ background: '#fff', padding: '24px', borderRadius: '12px', border: '1px solid #E2E8F0' }}>
                <p style={{ margin: 0, color: '#64748B', fontSize: '14px', fontWeight: '600' }}>Pending Makers</p>
                <p style={{ margin: '8px 0 0', fontSize: '32px', fontWeight: '800', color: '#B5543A' }}>{overview.pendingMakers}</p>
              </div>
              <div style={{ background: '#fff', padding: '24px', borderRadius: '12px', border: '1px solid #E2E8F0' }}>
                <p style={{ margin: 0, color: '#64748B', fontSize: '14px', fontWeight: '600' }}>Approved Makers</p>
                <p style={{ margin: '8px 0 0', fontSize: '32px', fontWeight: '800', color: '#2E7D32' }}>{overview.approvedMakers}</p>
              </div>
              <div style={{ background: '#fff', padding: '24px', borderRadius: '12px', border: '1px solid #E2E8F0' }}>
                <p style={{ margin: 0, color: '#64748B', fontSize: '14px', fontWeight: '600' }}>Rejected Makers</p>
                <p style={{ margin: '8px 0 0', fontSize: '32px', fontWeight: '800', color: '#64748B' }}>{overview.rejectedMakers}</p>
              </div>
            </div>
          </div>
        )}

        {tab === 'contacts' && (
          <div>
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '24px' }}>
              <h1 style={{ fontSize: '28px', color: '#14213D', margin: 0 }}>Contact Enquiries</h1>
              <button onClick={() => exportCSV('contacts')} style={{ padding: '10px 18px', background: '#14213D', color: '#FAF7F0', border: 'none', borderRadius: '8px', cursor: 'pointer', fontWeight: '600' }}>
                Export CSV
              </button>
            </div>

            {/* Filter Bar */}
            <div style={{ display: 'flex', gap: '16px', marginBottom: '20px' }}>
              <input
                type="text"
                placeholder="Search name, company, email..."
                value={search}
                onChange={(e) => setSearch(e.target.value)}
                style={{ flex: 1, padding: '10px 16px', borderRadius: '8px', border: '1px solid #CBD5E1' }}
              />
              <select value={statusFilter} onChange={(e) => setStatusFilter(e.target.value)} style={{ padding: '10px 16px', borderRadius: '8px', border: '1px solid #CBD5E1' }}>
                <option value="all">All Statuses</option>
                <option value="new">New</option>
                <option value="in_progress">In Progress</option>
                <option value="resolved">Resolved</option>
              </select>
            </div>

            {/* Table */}
            <div style={{ background: '#fff', borderRadius: '12px', border: '1px solid #E2E8F0', overflow: 'hidden' }}>
              <table style={{ width: '100%', borderCollapse: 'collapse', textAlign: 'left' }}>
                <thead>
                  <tr style={{ background: '#F8FAFC', borderBottom: '1px solid #E2E8F0', fontSize: '13px', color: '#64748B' }}>
                    <th style={{ padding: '14px 20px' }}>Name</th>
                    <th style={{ padding: '14px 20px' }}>Company</th>
                    <th style={{ padding: '14px 20px' }}>Email</th>
                    <th style={{ padding: '14px 20px' }}>Phone</th>
                    <th style={{ padding: '14px 20px', minWidth: '220px' }}>Message</th>
                    <th style={{ padding: '14px 20px' }}>Status</th>
                    <th style={{ padding: '14px 20px' }}>Actions</th>
                  </tr>
                </thead>
                <tbody>
                  {contacts.map((c) => {
                    const msg = c.message && c.message.trim() ? c.message.trim() : null;
                    const preview = msg ? (msg.length > 55 ? `${msg.slice(0, 55)}...` : msg) : 'No message provided';

                    return (
                      <tr key={c.id} style={{ borderBottom: '1px solid #F1F5F9' }}>
                        <td style={{ padding: '14px 20px', fontWeight: '600' }}>{c.full_name}</td>
                        <td style={{ padding: '14px 20px' }}>{c.company || '—'}</td>
                        <td style={{ padding: '14px 20px' }}>{c.email}</td>
                        <td style={{ padding: '14px 20px' }}>{c.phone}</td>
                        <td style={{ padding: '14px 20px' }}>
                          <span
                            onClick={() => setSelectedItem({ type: 'contact', data: c })}
                            title={msg ? 'Click to view full message' : ''}
                            style={{
                              display: 'inline-block',
                              maxWidth: '260px',
                              cursor: msg ? 'pointer' : 'default',
                              color: msg ? '#14213D' : '#94A3B8',
                              fontStyle: msg ? 'normal' : 'italic',
                              textDecoration: msg ? 'underline' : 'none',
                              textDecorationColor: '#C9A227'
                            }}
                          >
                            {preview}
                          </span>
                        </td>
                        <td style={{ padding: '14px 20px' }}>
                          <span style={{
                            padding: '4px 10px',
                            borderRadius: '999px',
                            fontSize: '12px',
                            fontWeight: '700',
                            background: c.status === 'new' ? '#FEF3C7' : c.status === 'in_progress' ? '#E0F2FE' : '#DCFCE7',
                            color: c.status === 'new' ? '#92400E' : c.status === 'in_progress' ? '#0369A1' : '#15803D'
                          }}>
                            {c.status}
                          </span>
                        </td>
                        <td style={{ padding: '14px 20px', display: 'flex', gap: '8px' }}>
                          <button
                            onClick={() => setSelectedItem({ type: 'contact', data: c })}
                            style={{ padding: '4px 8px', background: '#EEF2FF', color: '#4338CA', border: 'none', borderRadius: '6px', cursor: 'pointer', fontSize: '12px', fontWeight: '700' }}
                          >
                            View
                          </button>
                          <select
                            value={c.status}
                            onChange={(e) => updateContactStatus(c.id, e.target.value)}
                            style={{ padding: '4px 8px', borderRadius: '6px', fontSize: '13px' }}
                          >
                            <option value="new">new</option>
                            <option value="in_progress">in_progress</option>
                            <option value="resolved">resolved</option>
                          </select>
                          <button onClick={() => deleteContact(c.id)} style={{ padding: '4px 10px', background: '#FEE2E2', color: '#B91C1C', border: 'none', borderRadius: '6px', cursor: 'pointer', fontSize: '12px', fontWeight: '700' }}>
                            Delete
                          </button>
                        </td>
                      </tr>
                    );
                  })}
                  {contacts.length === 0 && (
                    <tr>
                      <td colSpan="7" style={{ padding: '30px', textAlign: 'center', color: '#94A3B8' }}>No enquiries found.</td>
                    </tr>
                  )}
                </tbody>
              </table>
            </div>
          </div>
        )}

        {tab === 'makers' && (
          <div>
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '24px' }}>
              <h1 style={{ fontSize: '28px', color: '#14213D', margin: 0 }}>Maker Registrations</h1>
              <button onClick={() => exportCSV('makers')} style={{ padding: '10px 18px', background: '#14213D', color: '#FAF7F0', border: 'none', borderRadius: '8px', cursor: 'pointer', fontWeight: '600' }}>
                Export CSV
              </button>
            </div>

            {/* Filter Bar */}
            <div style={{ display: 'flex', gap: '16px', marginBottom: '20px' }}>
              <input
                type="text"
                placeholder="Search name, email..."
                value={search}
                onChange={(e) => setSearch(e.target.value)}
                style={{ flex: 1, padding: '10px 16px', borderRadius: '8px', border: '1px solid #CBD5E1' }}
              />
              <select value={statusFilter} onChange={(e) => setStatusFilter(e.target.value)} style={{ padding: '10px 16px', borderRadius: '8px', border: '1px solid #CBD5E1' }}>
                <option value="all">All Statuses</option>
                <option value="pending_review">Pending Review</option>
                <option value="approved">Approved</option>
                <option value="rejected">Rejected</option>
              </select>
            </div>

            {/* Table */}
            <div style={{ background: '#fff', borderRadius: '12px', border: '1px solid #E2E8F0', overflow: 'hidden' }}>
              <table style={{ width: '100%', borderCollapse: 'collapse', textAlign: 'left' }}>
                <thead>
                  <tr style={{ background: '#F8FAFC', borderBottom: '1px solid #E2E8F0', fontSize: '13px', color: '#64748B' }}>
                    <th style={{ padding: '14px 20px' }}>Applicant</th>
                    <th style={{ padding: '14px 20px' }}>Role</th>
                    <th style={{ padding: '14px 20px' }}>Phone</th>
                    <th style={{ padding: '14px 20px' }}>Email</th>
                    <th style={{ padding: '14px 20px' }}>Status</th>
                    <th style={{ padding: '14px 20px' }}>Actions</th>
                  </tr>
                </thead>
                <tbody>
                  {makers.map((m) => (
                    <tr key={m.id} style={{ borderBottom: '1px solid #F1F5F9' }}>
                      <td style={{ padding: '14px 20px', fontWeight: '600' }}>{m.full_name}</td>
                      <td style={{ padding: '14px 20px' }}>{m.role === 'Other' ? `${m.role} (${m.custom_role})` : m.role}</td>
                      <td style={{ padding: '14px 20px' }}>{m.phone}</td>
                      <td style={{ padding: '14px 20px' }}>{m.email}</td>
                      <td style={{ padding: '14px 20px' }}>
                        <span style={{
                          padding: '4px 10px',
                          borderRadius: '999px',
                          fontSize: '12px',
                          fontWeight: '700',
                          background: m.status === 'pending_review' ? '#FEF3C7' : m.status === 'approved' ? '#DCFCE7' : '#FEE2E2',
                          color: m.status === 'pending_review' ? '#92400E' : m.status === 'approved' ? '#15803D' : '#991B1B'
                        }}>
                          {m.status}
                        </span>
                      </td>
                      <td style={{ padding: '14px 20px', display: 'flex', gap: '8px' }}>
                        <button onClick={() => updateMakerStatus(m.id, 'approved')} style={{ padding: '4px 10px', background: '#DCFCE7', color: '#166534', border: 'none', borderRadius: '6px', cursor: 'pointer', fontSize: '12px', fontWeight: '700' }}>
                          Approve
                        </button>
                        <button onClick={() => updateMakerStatus(m.id, 'rejected')} style={{ padding: '4px 10px', background: '#FEE2E2', color: '#991B1B', border: 'none', borderRadius: '6px', cursor: 'pointer', fontSize: '12px', fontWeight: '700' }}>
                          Reject
                        </button>
                        <button onClick={() => updateMakerStatus(m.id, 'pending_review')} style={{ padding: '4px 10px', background: '#F1F5F9', color: '#475569', border: 'none', borderRadius: '6px', cursor: 'pointer', fontSize: '12px', fontWeight: '700' }}>
                          Reset
                        </button>
                      </td>
                    </tr>
                  ))}
                  {makers.length === 0 && (
                    <tr>
                      <td colSpan="6" style={{ padding: '30px', textAlign: 'center', color: '#94A3B8' }}>No applicants found.</td>
                    </tr>
                  )}
                </tbody>
              </table>
            </div>
          </div>
        )}
        {/* Details View Modal */}
        {selectedItem && selectedItem.type === 'contact' && (
          <div
            onClick={() => setSelectedItem(null)}
            style={{
              position: 'fixed',
              inset: 0,
              background: 'rgba(14, 24, 48, 0.65)',
              backdropFilter: 'blur(4px)',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              padding: '20px',
              zIndex: 1000
            }}
          >
            <div
              onClick={(e) => e.stopPropagation()}
              style={{
                background: '#FAF7F0',
                color: '#14213D',
                borderRadius: '16px',
                padding: '36px 32px',
                width: '100%',
                maxWidth: '620px',
                boxShadow: '0 20px 40px rgba(0,0,0,0.3)',
                position: 'relative'
              }}
            >
              <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', marginBottom: '20px' }}>
                <div>
                  <h2 style={{ margin: '0 0 6px', fontSize: '22px', fontWeight: '800' }}>Contact Enquiry Details</h2>
                  <p style={{ margin: 0, color: '#6B6559', fontSize: '13px' }}>
                    Submitted on: {selectedItem.data.created_at ? new Date(selectedItem.data.created_at).toLocaleString() : '—'}
                  </p>
                </div>
                <button
                  onClick={() => setSelectedItem(null)}
                  style={{ background: 'none', border: 'none', fontSize: '22px', fontWeight: '700', cursor: 'pointer', color: '#6B6559' }}
                >
                  ✕
                </button>
              </div>

              <div style={{ display: 'grid', gridTemplateColumns: 'repeat(2, 1fr)', gap: '14px', marginBottom: '24px' }}>
                <div>
                  <span style={{ fontSize: '11px', textTransform: 'uppercase', letterSpacing: '0.08em', fontWeight: '700', color: '#8A6D1F' }}>Full Name</span>
                  <p style={{ margin: '4px 0 0', fontWeight: '600', fontSize: '15px' }}>{selectedItem.data.full_name}</p>
                </div>
                <div>
                  <span style={{ fontSize: '11px', textTransform: 'uppercase', letterSpacing: '0.08em', fontWeight: '700', color: '#8A6D1F' }}>Company</span>
                  <p style={{ margin: '4px 0 0', fontWeight: '600', fontSize: '15px' }}>{selectedItem.data.company || 'None specified'}</p>
                </div>
                <div>
                  <span style={{ fontSize: '11px', textTransform: 'uppercase', letterSpacing: '0.08em', fontWeight: '700', color: '#8A6D1F' }}>Email</span>
                  <p style={{ margin: '4px 0 0', fontWeight: '600', fontSize: '15px' }}>
                    <a href={`mailto:${selectedItem.data.email}`} style={{ color: '#B5543A' }}>{selectedItem.data.email}</a>
                  </p>
                </div>
                <div>
                  <span style={{ fontSize: '11px', textTransform: 'uppercase', letterSpacing: '0.08em', fontWeight: '700', color: '#8A6D1F' }}>Phone</span>
                  <p style={{ margin: '4px 0 0', fontWeight: '600', fontSize: '15px' }}>
                    <a href={`tel:${selectedItem.data.phone}`} style={{ color: '#14213D' }}>{selectedItem.data.phone}</a>
                  </p>
                </div>
                <div style={{ gridColumn: '1 / -1' }}>
                  <span style={{ fontSize: '11px', textTransform: 'uppercase', letterSpacing: '0.08em', fontWeight: '700', color: '#8A6D1F' }}>Status</span>
                  <p style={{ margin: '4px 0 0' }}>
                    <span style={{
                      padding: '3px 10px',
                      borderRadius: '999px',
                      fontSize: '12px',
                      fontWeight: '700',
                      background: selectedItem.data.status === 'new' ? '#FEF3C7' : selectedItem.data.status === 'in_progress' ? '#E0F2FE' : '#DCFCE7',
                      color: selectedItem.data.status === 'new' ? '#92400E' : selectedItem.data.status === 'in_progress' ? '#0369A1' : '#15803D'
                    }}>
                      {selectedItem.data.status}
                    </span>
                  </p>
                </div>
              </div>

              <div>
                <span style={{ fontSize: '11px', textTransform: 'uppercase', letterSpacing: '0.08em', fontWeight: '700', color: '#8A6D1F' }}>Full Message</span>
                <div style={{
                  marginTop: '8px',
                  padding: '16px',
                  background: '#fff',
                  border: '1px solid #DCD1BE',
                  borderRadius: '8px',
                  lineHeight: '1.6',
                  fontSize: '15px',
                  whiteSpace: 'pre-wrap',
                  wordBreak: 'break-word',
                  maxHeight: '260px',
                  overflowY: 'auto'
                }}>
                  {selectedItem.data.message && selectedItem.data.message.trim() ? selectedItem.data.message : 'No message provided'}
                </div>
              </div>

              <div style={{ display: 'flex', justifyContent: 'flex-end', marginTop: '24px' }}>
                <button
                  onClick={() => setSelectedItem(null)}
                  style={{ padding: '10px 22px', background: '#14213D', color: '#FAF7F0', border: 'none', borderRadius: '8px', fontWeight: '700', cursor: 'pointer' }}
                >
                  Close
                </button>
              </div>
            </div>
          </div>
        )}
      </main>
    </div>
  );
}

