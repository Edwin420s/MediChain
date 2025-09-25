import React, { createContext, useContext, useState, useEffect } from 'react';
import { patientAPI } from '../services/api';

const UserContext = createContext();

export const useUser = () => {
  const context = useContext(UserContext);
  if (!context) {
    throw new Error('useUser must be used within a UserProvider');
  }
  return context;
};

export const UserProvider = ({ children }) => {
  const [userProfile, setUserProfile] = useState(null);
  const [medicalRecords, setMedicalRecords] = useState([]);
  const [consents, setConsents] = useState([]);
  const [auditLogs, setAuditLogs] = useState([]);
  const [loading, setLoading] = useState(false);
  const [stats, setStats] = useState({
    totalRecords: 0,
    activeConsents: 0,
    recentAccess: 0
  });

  useEffect(() => {
    if (userProfile?.role === 'PATIENT') {
      loadPatientData();
    }
  }, [userProfile]);

  const loadPatientData = async () => {
    setLoading(true);
    try {
      const [recordsResponse, consentsResponse, auditResponse] = await Promise.all([
        patientAPI.getRecords(),
        patientAPI.getConsents(),
        patientAPI.getAuditLogs()
      ]);

      setMedicalRecords(recordsResponse.data || []);
      setConsents(consentsResponse.data || []);
      setAuditLogs(auditResponse.data || []);

      setStats({
        totalRecords: recordsResponse.data?.length || 0,
        activeConsents: consentsResponse.data?.filter(c => c.isActive)?.length || 0,
        recentAccess: auditResponse.data?.filter(log => 
          new Date(log.createdAt) > new Date(Date.now() - 7 * 24 * 60 * 60 * 1000)
        )?.length || 0
      });
    } catch (error) {
      console.error('Error loading patient data:', error);
    } finally {
      setLoading(false);
    }
  };

  const addMedicalRecord = (record) => {
    setMedicalRecords(prev => [record, ...prev]);
    setStats(prev => ({
      ...prev,
      totalRecords: prev.totalRecords + 1
    }));
  };

  const updateConsent = (consentId, updates) => {
    setConsents(prev => prev.map(consent =>
      consent.id === consentId ? { ...consent, ...updates } : consent
    ));

    if (updates.isActive !== undefined) {
      setStats(prev => ({
        ...prev,
        activeConsents: updates.isActive 
          ? prev.activeConsents + 1 
          : prev.activeConsents - 1
      }));
    }
  };

  const addAuditLog = (log) => {
    setAuditLogs(prev => [log, ...prev.slice(0, 99)]); // Keep last 100 logs
  };

  const value = {
    userProfile,
    setUserProfile,
    medicalRecords,
    consents,
    auditLogs,
    stats,
    loading,
    addMedicalRecord,
    updateConsent,
    addAuditLog,
    refreshData: loadPatientData
  };

  return (
    <UserContext.Provider value={value}>
      {children}
    </UserContext.Provider>
  );
};