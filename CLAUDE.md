# Proyecto: OCEÁNICA
Sistema de Gestión y Seguimiento del Proceso Formativo — Academia de Natación Oceánica
Proyecto académico: Politécnico Colombiano Jaime Isaza Cadavid, 2026.

## Stack tecnológico
- Frontend: React + Vite + TypeScript
- Backend: Node.js + Express
- Base de datos: Oracle XE (gestionada desde SQL Developer)
- Driver Oracle: oracledb (oficial de Oracle para Node.js)
- Auth: JWT (access token + detección de rol)
- Contraseñas: bcrypt (el campo Password_Hash ya existe en BD)

## Comandos esenciales
- Frontend: `cd frontend && npm run dev` → puerto 5173
- Backend:  `cd backend  && npm run dev` → puerto 3001
- Instalar: `npm install` dentro de cada carpeta

## Conexión Oracle
- Usuario BD: oceanica_admi / Oceanica2026!
- Container: XEPDB1
- Variables de entorno (.env):
  DB_USER=oceanica_admi
  DB_PASSWORD=Oceanica2026!
  DB_CONNECT_STRING=localhost:1521/XEPDB1
  JWT_SECRET=<secreto_largo>
  JWT_EXPIRES_IN=8h
  PORT=3001
- Usar POOL de conexiones (nunca conexión directa por request)
- La BD YA EXISTE — Claude NO debe crearla ni modificar su estructura

## Roles del sistema (ID_Perfil en Perfil_Oceanica)
- 1 = Administrador → acceso total
- 2 = Profesor      → gestión de sus clases y estudiantes
- 3 = Estudiante    → consulta y gestión propia

## Tablas y relaciones clave
### Tabla central: Usuario_Oceanica
Campos: ID_Usuario, ID_Perfil(FK), ID_Sexo(FK), Nombres, Primer_Apellido,
        Segundo_Apellido(opcional), Fecha_Nac, Correo(único), Password_Hash,
        Telefono(opcional), Celular, Direccion
Restricciones: Correo LIKE '%@%.%' | Fecha_Nac > 1900 y < hoy | Correo único

### Niveles y Habilidades
- Nivel_Oceanica: ID_Nivel, Nombre, Descripcion, Clases_Min(referencial)
- Habilidad_Oceanica: ID_Habilidad, ID_Nivel(FK), Nombre_Habilidad, Descripcion

### Clases y Sesiones
- Clase_Oceanica: ID_Clase, ID_Nivel(FK), Nombre, Cupo_Maximo (>0)
- Sesion_Clase_Oceanica: ID_Sesion, ID_Clase(FK), ID_Profesor(FK→Usuario),
  Fecha, Hora_Inicio(INTERVAL), Hora_Fin(INTERVAL), Estado(Programada|Realizada|Cancelada)

### Inscripciones
- Inscripcion_Oceanica: ID_Inscripcion, ID_Estudiante(FK), ID_Clase(FK),
  Fecha_Inicio, Estado(Activa|Inactiva|Retirada|Pendiente|Completada),
  ID_Sexo_Prof_Pref(FK, opcional)
- Restricción única: (ID_Estudiante, ID_Clase) → un estudiante no repite clase

### Asistencia y Progreso
- Asistencia_Oceanica: ID_Asistencia, ID_Inscripcion(FK), ID_Sesion(FK),
  Asistio(S|N), Motivo_Ausencia(solo si Asistio=N)
- Progreso_Oceanica: ID_Progreso, ID_Inscripcion(FK), ID_Nivel(FK),
  Observaciones, Fecha

### Auditoría (automática por triggers)
- Auditoria_Oceanica: registra INSERT/UPDATE/DELETE de tablas principales
- NO manipular directamente desde el backend — la BD lo hace sola

## Triggers de negocio (la BD los maneja, el backend debe conocerlos)
1. TRG_Validar_Perfil_Profesor → solo ID_Perfil=2 puede ser profesor en sesión
2. TRG_Validar_Perfil_Estudiante → solo ID_Perfil=3 puede inscribirse
3. TRG_Validar_SexoProfesor → valida preferencia de sexo del profesor al inscribirse
4. TRG_Validar_Solapamiento → impide que un profesor tenga 2 sesiones solapadas
5. TRG_Validar_Cupo → impide inscripciones que superen Cupo_Maximo
6. Triggers de auditoría (Usuario, Clase, Sesion, Inscripcion, Asistencia, Progreso)

IMPORTANTE: Cuando Oracle lanza error ORA-20010 a ORA-20014, el backend debe
capturar ese error y retornarlo al frontend con mensaje amigable.

## Funcionalidades por rol

### ADMINISTRADOR
- Ver y gestionar TODOS los usuarios (crear, editar, cambiar rol/perfil)
- Ver todos los niveles, habilidades, clases, sesiones
- Ver progreso y asistencia de todos los estudiantes
- Crear/editar/cancelar sesiones de clase
- Crear/editar niveles, habilidades y clases
- Ver log de auditoría

### PROFESOR
- Ver sus sesiones asignadas (filtrar por ID_Profesor)
- Ver lista de estudiantes inscritos en sus clases
- Registrar asistencia por sesión
- Registrar/editar progreso de sus estudiantes
- Ver historial académico de sus estudiantes
- Editar sus propios datos personales

### ESTUDIANTE
- Ver su perfil y editar datos personales
- Ver clases disponibles (con cupo disponible)
- Inscribirse a una clase (con preferencia opcional de sexo del profesor)
- Retirarse de una clase (cambiar estado a Retirada)
- Ver sus inscripciones activas e historial
- Ver su asistencia por sesión
- Ver su progreso y nivel actual
- Ver las sesiones programadas de sus clases

## Estructura de carpetas
/frontend/src/
  pages/
    auth/           ← Login, Registro
    admin/          ← Dashboard admin, GestionUsuarios, GestionClases, Auditoria
    profesor/       ← Dashboard profesor, MisClases, Asistencia, Progreso
    estudiante/     ← Dashboard estudiante, MisClases, ClasesDisponibles, MiProgreso
  components/
    shared/         ← Navbar, Sidebar, TablaGenerica, Graficas
    forms/          ← Formularios reutilizables
  services/         ← Llamadas a la API (authService, usuarioService, etc.)
  context/          ← AuthContext (token JWT + datos del usuario + rol)
  hooks/            ← useAuth, useFetch, etc.

/backend/src/
  routes/           ← auth.routes, admin.routes, profesor.routes, estudiante.routes
  controllers/      ← Un controller por entidad
  services/         ← Lógica de negocio
  repositories/     ← ÚNICA capa que toca Oracle (oracledb)
  middlewares/
    auth.middleware.ts      ← Verifica JWT
    role.middleware.ts      ← Verifica rol permitido para esa ruta
  db/
    connection.ts   ← Pool de conexiones Oracle

## Reglas de desarrollo (OBLIGATORIAS)
- NUNCA hardcodear credenciales — solo desde .env
- Queries Oracle SOLO en /repositories
- Validar rol en el BACKEND — nunca confiar solo en el frontend
- Capturar errores ORA-20XXX de los triggers y traducirlos a mensajes claros
- El campo Asistio en Asistencia_Oceanica es 'S' o 'N' (no boolean)
- INTERVAL DAY TO SECOND en Oracle: manejar conversión cuidadosamente en Node.js
- Segundo_Apellido, Telefono, ID_Sexo_Prof_Pref son opcionales (pueden ser NULL)

## Decisiones tomadas
- JWT almacena: ID_Usuario, ID_Perfil, Nombres
- Dashboard varía completamente según rol
- Gráficas en dashboard: progreso por nivel, asistencia %, clases activas
- La auditoría es automática (triggers), no manual desde backend
- Password_Hash usa bcrypt desde el backend al registrar