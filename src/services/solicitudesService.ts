import api from "./api";

/* ═════════════════════════════════════════════════════════════════════
 *  SOLICITUDES DE REGISTRO
 *  POST público (enviar) + revisión exclusiva del Administrador.
 * ═════════════════════════════════════════════════════════════════════ */

export type EstadoSolicitud = "PENDIENTE" | "APROBADA" | "RECHAZADA";

export interface RolInfo {
  id_rol: number;
  nombre_rol: string;
  descripcion: string;
}

export interface SolicitudRegistro {
  id_solicitud: number;
  nombre_completo: string;
  email: string;
  telefono: string | null;
  dni: string;
  fecha_nacimiento: string | null;
  direccion: string | null;
  notas: string | null;
  id_rol: number;
  estado: EstadoSolicitud;
  fecha_solicitud: string;
  fecha_revision: string | null;
  revisado_por: number | null;
  rol?: RolInfo;
}

export interface CreateSolicitudPayload {
  nombre_completo: string;
  email: string;
  telefono?: string;
  dni: string;
  fecha_nacimiento?: string;
  direccion?: string;
  notas?: string;
  /** 1 = Administrador, 2 = Vendedor, 3 = Almacenero */
  id_rol: number;
}

export interface SolicitudesResponse {
  success: boolean;
  message: string;
  data: SolicitudRegistro[];
}

export interface SolicitanteCreado {
  id_usuario: number;
  email: string;
  nombre_completo: string;
  nombre_usuario: string;
  rol?: RolInfo;
}

export interface AprobarResponse {
  success: boolean;
  message: string;
  data: {
    solicitud: SolicitudRegistro;
    usuario: SolicitanteCreado;
    password_temporal: string;
  };
}

export interface SolicitudMutationResponse {
  success: boolean;
  message: string;
  data: SolicitudRegistro;
}

export const solicitudesService = {
  /**
   * Crear una solicitud de registro (endpoint público, sin token).
   */
  createSolicitud: async (payload: CreateSolicitudPayload): Promise<SolicitudRegistro> => {
    const response = await api.post<{ success: boolean; data: SolicitudRegistro }>(
      "/solicitudes",
      payload
    );
    return response.data.data;
  },

  /**
   * Listar todas las solicitudes (solo Administrador).
   */
  getAllSolicitudes: async (): Promise<SolicitudRegistro[]> => {
    const response = await api.get<SolicitudesResponse>("/solicitudes");
    return response.data.data;
  },

  /**
   * Aprobar una solicitud → crea el usuario real y devuelve la
   * contraseña temporal para entregarla al nuevo personal.
   */
  aprobarSolicitud: async (id: number): Promise<AprobarResponse["data"]> => {
    const response = await api.patch<AprobarResponse>(`/solicitudes/${id}/aprobar`);
    return response.data.data;
  },

  /**
   * Rechazar una solicitud.
   */
  rechazarSolicitud: async (id: number): Promise<SolicitudRegistro> => {
    const response = await api.patch<SolicitudMutationResponse>(`/solicitudes/${id}/rechazar`);
    return response.data.data;
  },
};

export default solicitudesService;
