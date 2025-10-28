export interface Address {
    id?: number;
    street?: string;
    number?: string;
    latitude?: number;
    longitude?: number;
    // FK al usuario propietario (opcional). Mantenerlo opcional para flexibilidad.
    userId?: number;
    user_id?: number; // alias para compatibilidad con backend snake_case
}