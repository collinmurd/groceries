
function UnauthorizedPage() {
  return (
    <div
      style={{
        display: 'flex',
        flexDirection: 'column',
        alignItems: 'center',
        justifyContent: 'center',
        minHeight: '100vh',
        padding: '2rem',
        textAlign: 'center',
      }}
    >
      <h1>Unauthorized</h1>
      <p>You do not have permission to view this page. Try logging in</p>
    </div>
  );
};

export default UnauthorizedPage;