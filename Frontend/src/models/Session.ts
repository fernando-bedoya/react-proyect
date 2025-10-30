/**
 * Interfaz que representa la respuesta del backend (snake_case).
 * Útil para tipar las respuestas de la API directamente.
 */
export interface SessionApi {
  id: string;           // UUID (string en el backend)
  user_id: number;      // FK al User.id
  token: string;
  expiration: string;   // ISO datetime string
  FACode?: string;
  state: string;
  created_at?: string;  // ISO datetime string
  updated_at?: string;  // ISO datetime string
  // si el backend devuelve el usuario embebido:
  user?: any;
}

/**
 * Interfaz para uso interno en el frontend (camelCase + Date).
 * Se obtiene transformando SessionApi con mapSessionApiToSession.
 */
export interface Session {
  id: string;
  userId: number;
  token: string;
  expiration: Date;
  FACode?: string;
  state: string;
  createdAt?: Date;
  updatedAt?: Date;
  // si el backend devuelve el usuario embebido:
  user?: import("./User").User;
}

/**
 * Mapper: transforma la respuesta de la API (snake_case) a objeto Session (camelCase).
 */
export function mapSessionApiToSession(api: SessionApi): Session {
  return {
    id: api.id,
    userId: api.user_id,
    token: api.token,
    expiration: new Date(api.expiration),
    FACode: api.FACode,
    state: api.state,
    createdAt: api.created_at ? new Date(api.created_at) : undefined,
    updatedAt: api.updated_at ? new Date(api.updated_at) : undefined,
    // user: api.user ? mapUserApiToUser(api.user) : undefined, // descomentar si necesitas mapear user embebido
  };
}

/**
 * Mapper inverso: transforma un objeto Session (camelCase) a formato API (snake_case).
 * Útil para enviar datos al backend (POST/PUT).
 */
export function mapSessionToSessionApi(session: Partial<Session>): Partial<SessionApi> {
  return {
    id: session.id,
    user_id: session.userId,
    token: session.token,
    expiration: session.expiration?.toISOString(),
    FACode: session.FACode,
    state: session.state,
    // created_at y updated_at normalmente no se envían en POST/PUT
  };
}