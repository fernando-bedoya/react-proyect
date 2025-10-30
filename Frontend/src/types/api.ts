/**
 * ============================================================================
 * API Types & Mappers
 * ============================================================================
 * 
 * Este archivo contiene:
 * - Interfaces que representan las respuestas del backend (snake_case)
 * - Mappers bidireccionales entre formato API (snake_case) y modelos de dominio (camelCase)
 * 
 * Separación de responsabilidades:
 * - /models/*.ts → Interfaces de dominio (camelCase) para uso en componentes
 * - /types/api.ts → Interfaces de API (snake_case) y transformaciones
 * - /services/*.ts → Lógica de negocio y llamadas HTTP
 * ============================================================================
 */

import { Session } from '../models/Session';
import { Profile } from '../models/Profile';

// ============================================================================
// Session API Types
// ============================================================================

/**
 * Interfaz que representa la respuesta del backend para Session (snake_case).
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
    user?: any;           // Usuario embebido (opcional)
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
    };
}

// ============================================================================
// Profile API Types
// ============================================================================

/**
 * Interfaz que representa la respuesta del backend para Profile (snake_case).
 */
export interface ProfileApi {
    id: number;
    user_id: number;        // FK al User.id (relación 1:1)
    phone?: string;
    photo?: string;         // Path relativo (ej: "profiles/uuid_filename.png")
    created_at?: string;    // ISO datetime string
    updated_at?: string;    // ISO datetime string
}

/**
 * Mapper: transforma la respuesta de la API (snake_case) a objeto Profile (camelCase).
 */
export function mapProfileApiToProfile(api: ProfileApi): Profile {
    return {
        id: api.id,
        userId: api.user_id,
        phone: api.phone,
        photo: api.photo,
        createdAt: api.created_at ? new Date(api.created_at) : undefined,
        updatedAt: api.updated_at ? new Date(api.updated_at) : undefined,
    };
}

/**
 * Mapper inverso: transforma un objeto Profile (camelCase) a formato API (snake_case).
 * Útil para enviar datos al backend (POST/PUT).
 */
export function mapProfileToProfileApi(profile: Partial<Profile>): Partial<ProfileApi> {
    return {
        id: profile.id,
        user_id: profile.userId,
        phone: profile.phone,
        photo: profile.photo,
    };
}

// ============================================================================
// Agregar aquí más tipos de API según sea necesario
// ============================================================================
