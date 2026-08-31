import api from './api';

export interface LoginCredentials {
  email: string;
  password: string;
}

export interface User {
  id_usuario: number;
  email: string;
  dni: string;
  nombre_usuario: string;
  nombre_completo: string;
  foto_perfil_url: string | null;
  telefono: string | null;
  rol: {
    id_rol: number;
    nombre_rol: string;
    descripcion: string;
  };
}

export interface LoginResponse {
  success: boolean;
  message: string;
  data: {
    user: User;
    session: {
      access_token: string;
      refresh_token: string;
      expires_at: number;
    };
  };
}

export const authService = {
  /**
   * Login de usuario
   */
  login: async (credentials: LoginCredentials): Promise<LoginResponse> => {
    const response = await api.post<LoginResponse>('/auth/login', credentials);
    
    if (response.data.success) {
      const { access_token, refresh_token } = response.data.data.session;
      const { user } = response.data.data;

      localStorage.setItem('access_token', access_token);
      localStorage.setItem('refresh_token', refresh_token);
      localStorage.setItem('user', JSON.stringify(user));
    }

    return response.data;
  },

  /**
   * Logout de usuario
   */
  logout: async (): Promise<void> => {
    try {
      await api.post('/auth/logout');
    } finally {
      localStorage.removeItem('access_token');
      localStorage.removeItem('refresh_token');
      localStorage.removeItem('user');
    }
  },

  /**
   * Obtener perfil del usuario autenticado
   */
  getProfile: async (): Promise<User> => {
    const response = await api.get<{ success: boolean; data: User }>('/auth/profile');
    return response.data.data;
  },

  /**
   * Verificar si el usuario está autenticado
   */
  isAuthenticated: (): boolean => {
    return !!localStorage.getItem('access_token');
  },

  /**
   * Obtener usuario del localStorage
   */
  getCurrentUser: (): User | null => {
    const userStr = localStorage.getItem('user');
    return userStr ? JSON.parse(userStr) : null;
  },

  /**
   * Verificar si el usuario tiene un rol específico
   */
  hasRole: (roleId: number): boolean => {
    const user = authService.getCurrentUser();
    return user?.rol.id_rol === roleId;
  },

  /**
   * Verificar si el usuario es administrador
   */
  isAdmin: (): boolean => {
    return authService.hasRole(1);
  },

  /**
   * Verificar si el usuario es vendedor
   */
  isVendedor: (): boolean => {
    return authService.hasRole(2);
  },

  /**
   * Verificar si el usuario es almacenero
   */
  isAlmacenero: (): boolean => {
    return authService.hasRole(3);
  },

  /**
   * Solicitar restablecimiento de contraseña
   */
  forgotPassword: async (email: string): Promise<{ success: boolean; message: string }> => {
    const response = await api.post<{ success: boolean; message: string }>('/auth/forgot-password', { email });
    return response.data;
  },

  /**
   * Restablecer contraseña con token
   */
  resetPassword: async (access_token: string, new_password: string): Promise<{ success: boolean; message: string }> => {
    const response = await api.post<{ success: boolean; message: string }>('/auth/reset-password', {
      access_token,
      new_password,
    });
    return response.data;
  },
};

export default authService;
