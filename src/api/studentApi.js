import axios from "axios";

const API_BASE_URL = "https://student-course-backend-gyb0.onrender.com";

// GET all students
export const getAllStudents = () => {
  return axios.get(`${API_BASE_URL}/students`);
};

// ADD student
export const addStudent = (student) => {
  return axios.post(`${API_BASE_URL}/students`, student);
};
