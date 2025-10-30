# Relación 1:1 — Usuario y Perfil

## 📋 Resumen

La relación **1:1** entre `User` y `Profile` significa que:
- Cada usuario tiene **exactamente un perfil** (o ninguno)
- Cada perfil pertenece a **exactamente un usuario**

---

## 🔗 Cómo se modela la relación 1:1

### En el Backend (Python/SQLAlchemy) ✅

```python
# profile.py
class Profile(db.Model):
    id = db.Column(db.Integer, primary_key=True)
    user_id = db.Column(db.Integer, db.ForeignKey('users.id'), unique=True)  # ← UNIQUE hace 1:1
    user = db.relationship('User', back_populates='profile')
    phone = db.Column(db.String(20))
    photo = db.Column(db.String(255))  # Path relativo (ej: "profiles/uuid_file.png")
```

```python
# user.py (debes tener algo así)
class User(db.Model):
    id = db.Column(db.Integer, primary_key=True)
    profile = db.relationship('Profile', back_populates='user', uselist=False)  # ← uselist=False hace 1:1
```

**Diferencia clave con 1:n:**
- ✅ `user_id` tiene constraint `UNIQUE` → garantiza que solo un perfil por usuario
- ✅ `uselist=False` en la relación → devuelve un objeto, no una lista

---

### En el Frontend (TypeScript) ✅

```typescript
// Profile.ts
export interface Profile {
  id: number;        // ← ID único del perfil
  userId: number;    // ← FK al User.id (relación 1:1)
  phone?: string;
  photo?: string;    // Path relativo (backend lo devuelve así)
  // ...
}

// User.ts
export interface User {
  id: number;
  profileId?: number;  // ← FK opcional (si la API solo devuelve el id)
  profile?: Profile;   // ← Objeto embebido (si la API devuelve el perfil completo)
  // ...
}
```

**Diferencias con relaciones 1:n:**
- ❌ NO usar `profiles?: Profile[]` (sería 1:n)
- ✅ Usar `profile?: Profile` (singular, un solo objeto)

---

## 📸 Manejo de la foto de perfil

### Cómo funciona en el backend

1. **Upload (POST/PUT):**
   - Cliente envía `multipart/form-data` con el archivo `photo`
   - Backend guarda el archivo en `static/uploads/profiles/`
   - Backend genera un nombre único: `uuid_filename.png`
   - Backend guarda en BD solo el path relativo: `"profiles/uuid_123.png"`

2. **Respuesta de la API:**
   ```json
   {
     "id": 1,
     "user_id": 5,
     "phone": "123456789",
     "photo": "profiles/abc-123-def-456_avatar.png",  ← Path relativo
     "created_at": "2025-10-30T10:00:00Z"
   }
   ```

3. **Download (GET):**
   - Endpoint: `GET /api/profiles/{filename}`
   - Ejemplo: `GET /api/profiles/profiles/abc-123-def-456_avatar.png`
   - Backend sirve el archivo con `send_file()`

---

### Cómo usarlo en el frontend

#### 1. Función helper para construir la URL completa

```typescript
import { getProfilePhotoUrl } from '../models/Profile';

const profile: Profile = {
  id: 1,
  userId: 5,
  phone: "123456789",
  photo: "profiles/abc-123-def-456_avatar.png",
};

// Construir URL completa
const photoUrl = getProfilePhotoUrl(profile.photo);
// Resultado: "http://localhost:5000/api/profiles/profiles/abc-123-def-456_avatar.png"

// Usar en un componente
<img 
  src={photoUrl || '/default-avatar.png'} 
  alt="Profile photo" 
  className="w-20 h-20 rounded-full"
/>
```

#### 2. Subir una foto de perfil (ejemplo)

```typescript
import { mapProfileApiToProfile, ProfileApi } from '../types/api';

async function uploadProfilePhoto(userId: number, file: File) {
  const formData = new FormData();
  formData.append('photo', file);
  formData.append('phone', '123456789'); // opcional, si también actualizas el teléfono

  const response = await fetch(`${API_URL}/profiles/user/${userId}`, {
    method: 'POST',
    body: formData,
    // NO incluir 'Content-Type' header, fetch lo configura automáticamente para multipart
  });

  const profile: ProfileApi = await response.json();
  return mapProfileApiToProfile(profile);
}
```

#### 3. Actualizar la foto de perfil

```typescript
import { mapProfileApiToProfile, ProfileApi } from '../types/api';

async function updateProfilePhoto(profileId: number, file: File) {
  const formData = new FormData();
  formData.append('photo', file);

  const response = await fetch(`${API_URL}/profiles/${profileId}`, {
    method: 'PUT',
    body: formData,
  });

  const profile: ProfileApi = await response.json();
  return mapProfileApiToProfile(profile);
}
```

#### 4. Componente de ejemplo para mostrar y editar foto

```tsx
import { useState } from 'react';
import { Profile, getProfilePhotoUrl } from '../models/Profile';

interface ProfilePhotoProps {
  profile: Profile;
  onUpdate: (file: File) => Promise<void>;
}

const ProfilePhoto: React.FC<ProfilePhotoProps> = ({ profile, onUpdate }) => {
  const [uploading, setUploading] = useState(false);
  const photoUrl = getProfilePhotoUrl(profile.photo);

  const handleFileChange = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;

    // Validar tipo y tamaño
    if (!file.type.startsWith('image/')) {
      alert('Solo se permiten imágenes');
      return;
    }
    if (file.size > 5 * 1024 * 1024) { // 5MB
      alert('La imagen no puede superar 5MB');
      return;
    }

    setUploading(true);
    try {
      await onUpdate(file);
      alert('Foto actualizada exitosamente');
    } catch (error) {
      alert('Error al subir la foto');
    } finally {
      setUploading(false);
    }
  };

  return (
    <div className="flex flex-col items-center gap-4">
      {/* Mostrar foto actual o avatar por defecto */}
      <img
        src={photoUrl || '/default-avatar.png'}
        alt={`Foto de perfil`}
        className="w-32 h-32 rounded-full object-cover border-4 border-gray-200"
      />

      {/* Input para subir nueva foto */}
      <label className="cursor-pointer px-4 py-2 bg-blue-500 text-white rounded hover:bg-blue-600">
        {uploading ? 'Subiendo...' : 'Cambiar foto'}
        <input
          type="file"
          accept="image/*"
          className="hidden"
          onChange={handleFileChange}
          disabled={uploading}
        />
      </label>

      {profile.phone && (
        <p className="text-sm text-gray-600">📞 {profile.phone}</p>
      )}
    </div>
  );
};

export default ProfilePhoto;
```

---

## 🎯 Endpoints disponibles

| Método | Endpoint | Descripción |
|--------|----------|-------------|
| `GET` | `/api/profiles/` | Obtener todos los perfiles |
| `GET` | `/api/profiles/:profileId` | Obtener un perfil por ID |
| `GET` | `/api/profiles/user/:userId` | Obtener el perfil de un usuario específico |
| `POST` | `/api/profiles/user/:userId` | Crear perfil para un usuario (con foto opcional) |
| `PUT` | `/api/profiles/:profileId` | Actualizar perfil (con foto opcional) |
| `DELETE` | `/api/profiles/:profileId` | Eliminar perfil (y su foto) |
| `GET` | `/api/profiles/{filename}` | Servir archivo de foto |

---

## 🔑 Diferencias clave: 1:1 vs 1:n

| Aspecto | Relación 1:1 (User ↔ Profile) | Relación 1:n (User ↔ Sessions) |
|---------|-------------------------------|--------------------------------|
| **FK en BD** | `user_id UNIQUE` | `user_id` (sin UNIQUE) |
| **Relación en modelo** | `uselist=False` | `uselist=True` (default) |
| **Propiedad en User (TS)** | `profile?: Profile` | `sessions?: Session[]` |
| **Cardinalidad** | Cada user tiene 0 o 1 profile | Cada user tiene 0 a N sessions |
| **Endpoint GET** | `/profiles/user/:userId` | `/sessions/user/:userId` |
| **Restricción backend** | Error si ya existe perfil | Permite crear múltiples |

---

## ⚠️ Validaciones importantes

### En el backend (ya implementado) ✅

```python
# profile_controller.py - al crear
if Profile.query.filter_by(user_id=user_id).first():
    return {"error": "User already has a profile"}, 400
```

### En el frontend (recomendado)

```typescript
// Antes de crear perfil, verificar si ya existe
async function ensureUserHasNoProfile(userId: number): Promise<boolean> {
  try {
    await fetch(`${API_URL}/profiles/user/${userId}`);
    // Si no lanza error, significa que ya existe
    return false;
  } catch {
    // Si lanza 404, significa que no existe (puede crear)
    return true;
  }
}
```

---

## 📊 Ejemplo completo de flujo

### 1. Usuario se registra (aún sin perfil)

```typescript
const newUser = await createUser({ name: 'Juan', email: 'juan@example.com' });
// newUser.profile === undefined (aún no tiene perfil)
```

### 2. Crear perfil con foto

```typescript
const file = document.getElementById('photoInput').files[0];
const newProfile = await createProfileWithPhoto(newUser.id, '555-1234', file);

// newProfile = {
//   id: 10,
//   userId: 5,
//   phone: '555-1234',
//   photo: 'profiles/uuid-123.png',
// }
```

### 3. Obtener usuario con perfil embebido

```typescript
const userWithProfile = await getUserById(newUser.id);
// userWithProfile.profile = { id: 10, userId: 5, ... }

const photoUrl = getProfilePhotoUrl(userWithProfile.profile?.photo);
```

### 4. Actualizar foto de perfil

```typescript
const newFile = document.getElementById('newPhotoInput').files[0];
await updateProfilePhoto(newProfile.id, newFile);
```

### 5. Eliminar perfil (opcional)

```typescript
await deleteProfile(newProfile.id);
// El archivo de foto también se elimina del servidor
```

---

## 🛠️ Mappers disponibles

```typescript
import { 
  mapProfileApiToProfile,    // API → Frontend
  mapProfileToProfileApi,    // Frontend → API
} from '../types/api';

import { getProfilePhotoUrl } from '../models/Profile'; // Helper para construir URL de foto

// Uso:
const apiResponse: ProfileApi = await fetch(...).then(r => r.json());
const profile: Profile = mapProfileApiToProfile(apiResponse);

const photoUrl = getProfilePhotoUrl(profile.photo);
// photoUrl = "http://localhost:5000/api/profiles/profiles/uuid_file.png"
```

**Nota:** Siguiendo el principio de separación de responsabilidades:
- **`/models/Profile.ts`** → Interfaz de dominio `Profile` y helpers de negocio (`getProfilePhotoUrl`)
- **`/types/api.ts`** → Interfaces de API (`ProfileApi`), mappers y transformaciones

---

## ✅ Resumen final

1. **Relación 1:1** → `User.profile?: Profile` (singular, no array)
2. **FK única** → `Profile.userId` con constraint UNIQUE en BD
3. **Foto** → Backend guarda path relativo, frontend construye URL completa
4. **Upload** → Usar `FormData` con `multipart/form-data`
5. **Download** → Endpoint `GET /api/profiles/{filename}`
6. **Validación** → Backend rechaza crear segundo perfil para mismo usuario
7. **Mappers** → Convierten automáticamente snake_case ↔ camelCase

---

**🎉 Relación 1:1 implementada correctamente en los modelos!**
