import { useEffect, useState } from "react";
import { getAllStudents, addStudent } from "./api/studentApi";
import "./App.css";
import "./index.css";   // 👈 THIS IS IMPORTANT

function App() {
  const [students, setStudents] = useState([]);
  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [activeTab, setActiveTab] = useState("details");
  const [loading, setLoading] = useState(false);

  const loadStudents = async () => {
    try {
      const res = await getAllStudents();
      setStudents(res.data || []);
    } catch (err) {
      console.error(err);
    }
  };

  useEffect(() => {
    loadStudents();
  }, []);

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!name || !email) return;

    try {
      setLoading(true);
      await addStudent({ name, email });
      setName("");
      setEmail("");
      loadStudents();
      setActiveTab("details");
    } finally {
      setLoading(false);
    }
  };

  return (
    <>
      {/* NAVBAR */}
      <div className="navbar">
        <h1>Student Course Registration</h1>
      </div>

      {/* BUTTON BAR */}
      <div className="button-bar">
        <button className="btn btn-blue" onClick={() => setActiveTab("details")}>
          Get Students
        </button>
        <button className="btn btn-orange" onClick={() => setActiveTab("add")}>
          Add Student
        </button>
      </div>

      {/* CONTENT */}
      <div className="content">
        {activeTab === "details" ? (
          <div className="card">
            <h2>Student List</h2>

            {students.length === 0 ? (
              <div className="empty">No students found</div>
            ) : (
              students.map((s) => (
                <div className="student-card" key={s.id}>
                  <div className="student-left">
                    <div className="avatar">
                      {s.name.charAt(0).toUpperCase()}
                    </div>
                    <div className="student-info">
                      <span>{s.name}</span>
                      <span>{s.email}</span>
                    </div>
                  </div>
                  <div className="student-id">ID: {s.id}</div>
                </div>
              ))
            )}
          </div>
        ) : (
          <div className="card">
            <h2>Add Student</h2>

            <form className="form" onSubmit={handleSubmit}>
              <input
                className="input"
                placeholder="Student Name"
                value={name}
                onChange={(e) => setName(e.target.value)}
              />

              <input
                className="input"
                type="email"
                placeholder="Student Email"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
              />

              <div className="form-actions">
                <button className="btn btn-orange" type="submit" disabled={loading}>
                  {loading ? "Saving..." : "Add Student"}
                </button>
              </div>
            </form>
          </div>
        )}
      </div>
    </>
  );
}

export default App;
