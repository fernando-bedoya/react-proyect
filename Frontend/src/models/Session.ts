/**
 * ============================================================================
 * Session - Modelo de Dominio
 * ============================================================================
 * 
 * Interfaz que representa una sesión en el dominio de la aplicación.
 * Relación 1:n con User: un usuario puede tener múltiples sesiones activas.
 * 
 * Nota: Para tipos de API y mappers, ver src/types/api.ts
 * ============================================================================
 */

/**
 * Interfaz Session - Modelo de dominio (camelCase).
 * Representa una sesión activa de un usuario en el sistema.
 */
export interface Session {
    id: string;           // UUID único de la sesión
    userId: number;       // FK al User.id (relación 1:n)
    token: string;        // Token de autenticación
    expiration: Date;     // Fecha/hora de expiración
    FACode?: string;      // Código de autenticación de dos factores (opcional)
    state: string;        // Estado de la sesión (ej: 'active', 'inactive', 'expired')
    createdAt?: Date;     // Fecha de creación
    updatedAt?: Date;     // Fecha de última actualización
    // Si el backend devuelve el usuario embebido:
    user?: import("./User").User;
}