/**
 * ============================================================================
 * Profile - Modelo de Dominio
 * ============================================================================
 * 
 * Interfaz que representa un perfil de usuario en el dominio de la aplicación.
 * Relación 1:1 con User: cada perfil pertenece a exactamente un usuario.
 * 
 * Nota: Para tipos de API y mappers, ver src/types/api.ts
 * ============================================================================
 */

/**
 * Interfaz Profile - Modelo de dominio (camelCase).
 * Representa el perfil de un usuario (relación 1:1).
 */
export interface Profile {
    id: number;             // Identificador único del perfil
    userId: number;         // FK al User.id (relación 1:1)
    phone?: string;         // Número de teléfono
    photo?: string;         // Path relativo de la foto (ej: "profiles/uuid_file.png")
    createdAt?: Date;       // Fecha de creación
    updatedAt?: Date;       // Fecha de última actualización
    // Si el backend devuelve el usuario embebido, descomentar:
    // user?: import("./User").User;
}

/**
 * Construye la URL completa de la foto del perfil.
 * @param photoPath - Path relativo devuelto por la API (ej: "profiles/uuid_file.png")
 * @param baseUrl - URL base de la API (por defecto: VITE_API_URL del .env)
 * @returns URL completa o null si no hay foto
 * 
 * Ejemplo de uso:
 *   const photoUrl = getProfilePhotoUrl(profile.photo);
 *   <img src={photoUrl || '/default-avatar.png'} alt="Profile" />
 */
export function getProfilePhotoUrl(photoPath?: string, baseUrl?: string): string | null {
    if (!photoPath) return null;
    
    // @ts-ignore - Vite define import.meta.env en tiempo de ejecución
    const apiUrl = baseUrl || (typeof import.meta !== 'undefined' && import.meta.env?.VITE_API_URL) || '';
    
    // El backend sirve las fotos en: GET /api/profiles/{filename}
    // Según profile_routes.py: @profile_bp.route('/<path:filename>', methods=['GET'])
    return `${apiUrl}/profiles/${photoPath}`;
}