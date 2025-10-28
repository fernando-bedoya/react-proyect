import type { User } from "./User";
import type { Role } from "./Role";

export interface UserRole {
    // backend usa UUIDs (string) para este id; aceptar number por compatibilidad
    id?: string | number;
    // corregido typo: startAt (acepta Date o ISO string)
    startAt?: Date | string;
    endAt?: Date | string;
    // FK a User y Role (aceptar tanto camelCase como snake_case)
    userId?: number;
    user_id?: number;
    roleId?: number;
    role_id?: number;
    // Referencias opcionales al objeto completo (si la API las devuelve embebidas)
    user?: User;
    role?: Role;
}
//aqui se pueden escribir metodos, aqui se tiran las cardinalidades de las relaciones
//ejemplo si un usuario tiene muchos posts, se puede hacer un metodo que traiga los posts de ese usuario
//pero en este caso no hay relaciones, asi que no hay metodos