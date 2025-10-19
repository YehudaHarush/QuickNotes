import api from "./api";

export interface LoginDto {
  email: string;
  password: string;
}

export interface RegisterDto {
  email: string;
  password: string;
  name?: string;
}

export interface AuthResponse {
  access_token: string;
  user: {
    id: string;
    email: string;
    name?: string;
  };
}

export const authService = {
  async login(data: LoginDto): Promise<AuthResponse> {
    const response = await api.post("/auth/login", data);
    return response.data;
  },

  async register(data: RegisterDto): Promise<AuthResponse> {
    const response = await api.post("/auth/register", data);
    return response.data;
  },

  logout() {
    localStorage.removeItem("token");
    localStorage.removeItem("user");
  },

  getToken(): string | null {
    return localStorage.getItem("token");
  },

  getUser() {
    const user = localStorage.getItem("user");
    return user ? JSON.parse(user) : null;
  },

  setAuth(data: AuthResponse) {
    localStorage.setItem("token", data.access_token);
    localStorage.setItem("user", JSON.stringify(data.user));
  },
};
