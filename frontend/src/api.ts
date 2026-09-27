import axios from "axios";export const api=axios.create({baseURL:import.meta.env.VITE_API_URL||"http://localhost:4000/api",headers:{"x-user-name":"Portal User","x-user-role":"admin"}});
