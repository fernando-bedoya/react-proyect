import { Session } from "./Session";
export interface User {
    id?: number;
    name?: string;
    email?: string;
    password?:string;
}

//aqui se pueden escribir metodos, aqui se tiran las cardinalidades de las relaciones
//ejemplo si un usuario tiene muchos posts, se puede hacer un metodo que traiga los posts de ese usuario
//pero en este caso no hay relaciones, asi que no hay metodos