import { User } from "./User";

export interface Profile  {
    id: number; // Identificador único del perfil, que viene del usuario
    phone: string;
    photoUrl: string;
}