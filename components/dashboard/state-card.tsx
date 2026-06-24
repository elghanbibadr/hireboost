
export function StatCard({
  label, value, sub, icon: Icon,
}: {
  label: string; value:  number | string; sub?: string
  icon: React.ElementType;
}) {
  return (
    <div style={{
      background: '#111', border: '1px solid rgba(255,255,255,0.08)',
      borderRadius: 20, padding: '24px',
    }}>
      <div className="flex items-center justify-between mb-4">
        <p style={{ fontSize: 11, fontWeight: 600, color: 'rgba(255,255,255,0.4)', textTransform: 'uppercase', letterSpacing: '0.05em' }}>
          {label}
        </p>
        <div className="w-8 h-8 rounded-lg flex items-center justify-center" style={{ background: 'rgba(255,255,255,0.03)', border: '1px solid rgba(255,255,255,0.08)' }}>
          <Icon className="h-4 w-4" style={{ color: 'rgba(255,255,255,0.6)' }} />
        </div>
      </div>
      <div>
        <p className="text-3xl font-bold text-white tracking-tight">{value}</p>
        {sub && <p style={{ fontSize: 12, color: 'rgba(255,255,255,0.3)', marginTop: 4 }}>{sub}</p>}
      </div>
    </div>
  )
}
