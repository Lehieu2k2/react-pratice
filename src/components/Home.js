const Home = () => {
  return (
    <div
      style={{
        fontFamily: "Arial, sans-serif",
        padding: "20px",
        backgroundColor: "#f4f4f4",
        minHeight: "100vh",
      }}
    >
      {/* Header */}
      <header
        style={{
          backgroundColor: "#4a90e2",
          color: "white",
          padding: "15px 20px",
          textAlign: "center",
        }}
      >
        <h1 style={{ margin: 0 }}>User Management Dashboard</h1>
      </header>

      {/* Hero Section */}
      <section
        style={{
          padding: "40px",
          textAlign: "center",
          backgroundColor: "#fff",
          margin: "30px 0",
          borderRadius: "10px",
        }}
      >
        <h2 style={{ color: "#333" }}>Welcome to the User Management System</h2>
        <p style={{ color: "#666", maxWidth: "600px", margin: "auto" }}>
          Easily manage, track, and maintain user data. Add, update, and delete
          users in just a few clicks.
        </p>
      </section>

      {/* Footer */}
      <footer
        style={{
          backgroundColor: "#333",
          color: "white",
          padding: "20px",
          textAlign: "center",
          marginTop: "30px",
        }}
      >
        <p>&copy; 2024 User Management. All rights reserved.</p>
      </footer>
    </div>
  );
};
export default Home;
