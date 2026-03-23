import React from 'react';

type Props = {
  title: string;
  value: string;
  change?: string;
  icon?: React.ReactNode;
};

export default function StatCard({ title, value, change, icon }: Props) {
  return (
    <div style={{ background: '#fff', padding: 16, borderRadius: 12, boxShadow: '0 1px 4px rgba(0,0,0,0.06)' }}>
      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
        <div>
          <div style={{ fontSize: 12, color: '#6b7280' }}>{title}</div>
          <div style={{ fontSize: 20, fontWeight: 700 }}>{value}</div>
        </div>
        <div>{icon}</div>
      </div>
      {change && <div style={{ marginTop: 8, color: '#10b981', fontSize: 12 }}>{change}</div>}
    </div>
  );
}
