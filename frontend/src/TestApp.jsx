// Simple test component
function TestApp() {
  return (
    <div style={{ padding: '50px', background: '#0B0B0B', color: 'white', minHeight: '100vh' }}>
      <h1 style={{ color: '#D4AF37', fontSize: '48px' }}>CEO BAZAAR TEST</h1>
      <p style={{ fontSize: '24px' }}>If you see this, React is working!</p>
      <p>Server time: {new Date().toLocaleTimeString()}</p>
    </div>
  )
}

export default TestApp
