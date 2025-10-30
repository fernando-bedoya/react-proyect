import axios from "axios";
import { User } from "../models/User";
import { Session } from "../models/Session";
import { SessionApi, mapSessionApiToSession, mapSessionToSessionApi } from "../types/api";
import { store } from "../store/store";
import { setUser } from "../store/userSlice";

class SecurityService extends EventTarget {
    keySession: string;
    API_URL: string;
    user: User;
    theAuthProvider: any;
    
    constructor() {
        super();

        this.keySession = 'session';
        this.API_URL = import.meta.env.VITE_API_URL || ""; // Reemplaza con la URL real
        const storedUser = localStorage.getItem("user");
        if (storedUser) {
            this.user = JSON.parse(storedUser);
        } else {
            this.user = {};
        }
    }

    async login(user: User) {
        console.log("llamando api " + `${this.API_URL}/login`);
        try {
            const response = await axios.post(`${this.API_URL}/login`, user, {
                headers: {
                    'Content-Type': 'application/json',
                },
            });

            const data = response.data;
            //localStorage.setItem("user", JSON.stringify(data));
            store.dispatch(setUser(data));
            return data;
        } catch (error) {
            console.error('Error during login:', error);
            throw error;
        }
    }
    
    getUser() {
        return this.user;
    }
    
    logout() {
        this.user = {};
        
        this.dispatchEvent(new CustomEvent("userChange", { detail: null }));
        store.dispatch(setUser(null));
    }

    isAuthenticated() {
        return localStorage.getItem(this.keySession) !== null;
    }

    getToken() {
        return localStorage.getItem(this.keySession);
    }

    // ========== Métodos para gestionar sesiones (usando mappers) ==========

    /**
     * Obtiene todas las sesiones de un usuario específico.
     * Endpoint: GET /api/sessions/user/:userId
     */
    async getUserSessions(userId: number): Promise<Session[]> {
        try {
            const response = await axios.get<SessionApi[]>(`${this.API_URL}/sessions/user/${userId}`);
            // Transformar cada SessionApi a Session (camelCase + Date)
            return response.data.map(mapSessionApiToSession);
        } catch (error) {
            console.error('Error fetching user sessions:', error);
            throw error;
        }
    }

    /**
     * Crea una nueva sesión para un usuario.
     * Endpoint: POST /api/sessions/user/:userId
     */
    async createSession(userId: number, sessionData: Partial<Session>): Promise<Session> {
        try {
            // Transformar Session (camelCase) a SessionApi (snake_case) para enviar al backend
            const apiData = mapSessionToSessionApi(sessionData);
            const response = await axios.post<SessionApi>(`${this.API_URL}/sessions/user/${userId}`, apiData, {
                headers: { 'Content-Type': 'application/json' },
            });
            // Transformar la respuesta de vuelta a Session
            return mapSessionApiToSession(response.data);
        } catch (error) {
            console.error('Error creating session:', error);
            throw error;
        }
    }

    /**
     * Revoca/elimina una sesión específica.
     * Endpoint: DELETE /api/sessions/:sessionId
     */
    async revokeSession(sessionId: string): Promise<void> {
        try {
            await axios.delete(`${this.API_URL}/sessions/${sessionId}`);
        } catch (error) {
            console.error('Error revoking session:', error);
            throw error;
        }
    }

    /**
     * Obtiene una sesión específica por su ID.
     * Endpoint: GET /api/sessions/:sessionId
     */
    async getSessionById(sessionId: string): Promise<Session> {
        try {
            const response = await axios.get<SessionApi>(`${this.API_URL}/sessions/${sessionId}`);
            return mapSessionApiToSession(response.data);
        } catch (error) {
            console.error('Error fetching session:', error);
            throw error;
        }
    }

    /**
     * Actualiza una sesión existente (por ejemplo, renovar token, cambiar estado).
     * Endpoint: PUT /api/sessions/:sessionId
     */
    async updateSession(sessionId: string, updates: Partial<Session>): Promise<Session> {
        try {
            const apiData = mapSessionToSessionApi(updates);
            const response = await axios.put<SessionApi>(`${this.API_URL}/sessions/${sessionId}`, apiData, {
                headers: { 'Content-Type': 'application/json' },
            });
            return mapSessionApiToSession(response.data);
        } catch (error) {
            console.error('Error updating session:', error);
            throw error;
        }
    }
}

export default new SecurityService();
