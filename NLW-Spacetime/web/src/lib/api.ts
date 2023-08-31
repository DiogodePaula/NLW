import axios from "axios";

export const api = axios.create({
  baseURL: "http://192.168.0.109:3333",
  // baseURL: "http://localhost:3333",
});

// quando host: "0.0.0.0" estiver habilitado no back para poder funcionar o back no mobile,
// usar o ip address no front
