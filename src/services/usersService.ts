import api from './api';

export interface Rol {
  id_rol: number;
  nombre_rol: string;
  descripcion: string;
}

export interface Usuario {
  id_usuario: number;
  id_auth: string;
  email: string;
  dni: string;
  nombre_usuario: string;
  nombre_completo: string;
  id_rol: number;
  foto_perfil_url: string;
  telefono: string;
  ultimo_acceso: string;
  estado_logico: boolean;
  fecha_registro: string;
  rol?: Rol;
}

export interface GetUsersResponse {
  success: boolean;
  message: string;
  data: Usuario[];
}

export interface GetUserResponse {
  success: boolean;
  message: string;
  data: Usuario;
}

export interface UpdateUserStatusPayload {
  estado_logico: boolean;
}

export interface UpdateUserPayload {
  nombre_completo?: string;
  telefono?: string;
  foto_perfil_url?: string;
  id_rol?: number;
}

export interface CreateUserPayload {
  email: string;
  password: string;
  dni: string;
  nombre_usuario: string;
  nombre_completo: string;
  id_rol: number;
  telefono?: string;
  foto_perfil_url?: string;
}

export interface CreateUserResponse {
  success: boolean;
  message: string;
  data: Usuario;
}

export const usersService = {
  /**
   * Crear un nuevo usuario
   */
  createUser: async (payload: CreateUserPayload): Promise<Usuario> => {
    const response = await api.post<CreateUserResponse>('/users', payload);
    return response.data.data;
  },
  /**
   * Obtener todos los usuarios
   */
  getAllUsers: async (): Promise<Usuario[]> => {
    const response = await api.get<GetUsersResponse>('/users');
    return response.data.data;
  },

  /**
   * Obtener un usuario por ID
   */
  getUserById: async (id: number): Promise<Usuario> => {
    const response = await api.get<GetUserResponse>(`/users/${id}`);
    return response.data.data;
  },

  /**
   * Actualizar estado de un usuario
   */
  updateUserStatus: async (id: number, estado_logico: boolean): Promise<Usuario> => {
    const response = await api.patch<GetUserResponse>(`/users/${id}/status`, {
      estado_logico,
    });
    return response.data.data;
  },

  /**
   * Actualizar información de un usuario
   */
  updateUser: async (id: number, payload: UpdateUserPayload): Promise<Usuario> => {
    const response = await api.put<GetUserResponse>(`/users/${id}`, payload);
    return response.data.data;
  },

  /**
   * Eliminar usuario (soft delete)
   */
  deleteUser: async (id: number): Promise<Usuario> => {
    const response = await api.delete<GetUserResponse>(`/users/${id}`);
    return response.data.data;
  },

  /**
   * Activar usuario
   */
  activateUser: async (id: number): Promise<Usuario> => {
    return usersService.updateUserStatus(id, true);
  },

  /**
   * Desactivar usuario
   */
  deactivateUser: async (id: number): Promise<Usuario> => {
    return usersService.updateUserStatus(id, false);
  },
};

export default usersService;
