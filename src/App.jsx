import { useEffect, useState } from "react";
import {
  getAllStudents,
  addStudent,
  deleteStudent,
} from "./api/studentApi";
import "./App.css";
import "./index.css";

function App() {
  const [students, setStudents] = useState([]);
  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [activeTab, setActiveTab] = useState("details");
  const [loading, setLoading] = useState(false);

  // Load students
  const loadStudents = async () => {
    try {
      const res = await getAllStudents();
      setStudents(res.data || []);
    } catch (err) {
      console.error("Failed to fetch students", err);
    }
  };

  useEffect(() => {
    loadStudents();
  }, []);

  // Add student
  const handleSubmit = async (e) => {
    e.preventDefault();

    if (!name || !email) {
      alert("Name and Email are required");
      return;
    }

    try {
      setLoading(true);
      await addStudent({ name, email });
      setName("");
      setEmail("");
      loadStudents();
      setActiveTab("details");
    } catch (err) {
      if (err.response?.status === 409) {
        alert("Email already exists!");
      } else {
        alert("Failed to add student");
      }
    } finally {
      setLoading(false);
    }
  };

  // Delete student
  const handleDelete = async (id) => {
    const confirmDelete = window.confirm(
      "Are you sure you want to delete this student?"
    );

    if (!confirmDelete) return;

    try {
      await deleteStudent(id);
      loadStudents();
    } catch (err) {
      alert("Failed to delete student");
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
        <button
          className={`btn btn-blue ${activeTab === "details" ? "active" : ""}`}
          onClick={() => setActiveTab("details")}
        >
          Get Students
        </button>

        <button
          className={`btn btn-orange ${activeTab === "add" ? "active" : ""}`}
          onClick={() => setActiveTab("add")}
        >
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

                  <div className="student-actions">
                    <span className="student-id">ID: {s.id}</span>

                    <button
                      className="btn btn-yellow"
                      onClick={() => handleDelete(s.id)}
                    >
                      Delete
                    </button>
                  </div>
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
                <button
                  className="btn btn-orange"
                  type="submit"
                  disabled={loading}
                >
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
