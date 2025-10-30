import { Session } from "./Session";
import { Address } from "./Address";
import { Password } from "./Password";
import { Role } from "./Role";
import { UserRole } from "./UserRole";
import type { Profile } from "./Profile";

export interface User {
    id: number;
    name: string;
    email?: string;
    password: string;
    
    // Relación 1:1 con Address
    // - `addressId` es el identificador FK opcional (útil si la API devuelve solo el id)
    // - `address` es el objeto embebido (útil si la API devuelve la dirección junto al usuario)
    addressId?: number;
    address?: Address;
    
    // Relación 1:1 con Profile
    // - `profileId` es el identificador FK opcional (útil si la API devuelve solo el id)
    // - `profile` es el objeto embebido (útil si la API devuelve el perfil junto al usuario)
    profileId?: number;
    profile?: Profile;
    
    // Relación 1:n con Password: un usuario puede tener múltiples contraseñas
    // - `passwords` contiene las contraseñas asociadas cuando la API las devuelve embebidas
    passwords?: Password[];
    
    // Relación n:n con Role mediante UserRole
    // - `roles` es la lista de roles cuando la API devuelve los roles embebidos
    // - `userRoles` es la lista de relaciones intermedias (puede contener metadatos como `startAt`/`endAt`)
    roles?: Role[];
    userRoles?: UserRole[];
    
    // Relación 1:n con Session: un usuario puede tener múltiples sesiones activas
    // - `sessions` contiene las sesiones cuando la API las devuelve embebidas
    sessions?: Session[];
}

// Aquí puedes añadir métodos o utilidades relacionadas con User si lo deseas.
// La relación 1:1 se representa por `profileId` y/o por el objeto `profile`.
// La relación 1:1 se representa por `addressId` y/o por el objeto `address`.