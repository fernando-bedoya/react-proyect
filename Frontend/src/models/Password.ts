export interface Password {
    id?: number;
    content?: string;
    // corregidos typos y aceptar Date o ISO string
    startAt?: Date;
    endAt?: Date;
    // FK opcional apuntando al usuario dueño de esta contraseña
    userId?: number;
    user_id?: number; // alias snake_case
}