# Escuela-Oceanica-poli
Página web y app para consultar y reservar clases en una escuela de natación
# Sistema de Gestión y Seguimiento del Proceso Formativo en la Academia de Natación Oceánica

Propuesta de proyecto PPI-T.

## Información general

| Campo | Detalle |
| --- | --- |
| **Empresa** | Oceánica |
| **Ubicación** | Medellín |
| **Contacto** | Viviana Marín |

## Equipo

| Nombre | Correo |
| --- | --- |
| Carlos Andrés Palacio Franco | Carlos_palacio23212@elpoli.edu.co |

## Descripción del problema, interés o necesidad

Actualmente, la academia no cuenta con un sistema que permita gestionar, organizar y analizar la información de los estudiantes de manera eficiente. Esto limita el seguimiento del proceso formativo, ya que no se dispone de información estructurada que permita evaluar el estado real de cada estudiante.

Adicionalmente, la ausencia de mecanismos que permitan el control y seguimiento automático de la información dificulta la toma de decisiones por parte de los profesores, afectando la calidad del proceso de enseñanza.

## Objetivo general

Desarrollar un sistema de información que permita gestionar el historial de los estudiantes activos de la academia Oceánica, facilitando no solo el almacenamiento de la información, sino también el seguimiento y control del proceso formativo, con el fin de mejorar la toma de decisiones dentro de la organización.

## Objetivos específicos

1. Definir los requerimientos funcionales y no funcionales del sistema, estableciendo las necesidades del proceso formativo, el control de la información y las condiciones de funcionamiento del sistema.
2. Realizar el análisis y diseño del sistema, mediante la estructuración de los procesos, la organización de la información y la definición del modelo de datos que soporte el funcionamiento del sistema.
3. Implementar la solución propuesta, desarrollando la estructura lógica necesaria para la gestión y almacenamiento de la información de los estudiantes.
4. Desarrollar mecanismos que permitan automatizar procesos clave del sistema, como el registro de información, el seguimiento del progreso y el control de asistencia.
5. Construir una interfaz web funcional para la gestión de la información, que facilite la interacción del usuario con el sistema de manera clara y organizada.
6. Ejecutar pruebas y realizar ajustes al sistema, con el fin de validar su funcionamiento, corregir errores y garantizar la confiabilidad de la información.
7. Gestionar el despliegue y plantear el mantenimiento del sistema, asegurando su disponibilidad y estableciendo lineamientos para su actualización y mejora continua.

## Alcance

El proyecto abarca el diseño, desarrollo y puesta en producción de un sistema de información web que centraliza y automatiza el proceso formativo de los estudiantes de la Academia Oceánica, organizado en siete módulos:

1. **Gestión de usuarios:** registro, autenticación por roles, recuperación de contraseña y edición de perfil.
2. **Gestión de estudiantes:** registro, actualización, consulta y activación/inactivación de estudiantes.
3. **Gestión de clases:** creación y programación de clases, asignación de estudiantes, validación automática de cruces de horario y cupos.
4. **Control de asistencia:** registro por clase, cálculo automático del porcentaje acumulado, alertas de inasistencias reiteradas y reportes por periodo.
5. **Seguimiento del progreso:** parametrización de niveles y criterios técnicos de natación, registro de evaluaciones periódicas, línea de tiempo del avance y comparación frente al nivel esperado.
6. **Historial académico:** consulta consolidada de asistencia, evaluaciones y clases, con exportación en PDF.
7. **Reportes y consultas:** indicadores estadísticos, panel de administrador y consultas avanzadas con filtros combinados.

Funcionalidades como el acceso al sistema, el cierre de sesión, el registro inicial, la recuperación de contraseña y el ingreso al menú principal se consideran transversales y no pertenecen a ningún módulo en particular.

### Distribución por semestres

| Semestre | Avance | Entregables |
| --- | --- | --- |
| Quinto | 30 % | Documentación completa del proyecto y, al final del semestre, prototipo funcional en host de los módulos de Gestión de usuarios y Gestión de estudiantes |
| Sexto | 60 % | Desarrollo completo de los módulos de Gestión de clases, Control de asistencia, Seguimiento del progreso e Historial académico |
| Séptimo | 10 % | Módulo de Reportes y consultas, integración final, pruebas del sistema completo y despliegue en producción |

### Fuera del alcance

- Aplicación móvil nativa (el sistema será exclusivamente web, con diseño responsive).
- Pasarela de pagos o facturación de mensualidades.
- Envío de notificaciones por SMS o correo masivo.
- Gestión de múltiples sedes o franquicias.
- Módulo de nómina o recursos humanos del personal administrativo.
- Analítica predictiva o inteligencia artificial para recomendar rutinas de entrenamiento.
- Integración con federaciones deportivas externas.
- Control de inventario de material deportivo.

## Aspectos técnicos

- **Base de datos:** MySQL, administrada mediante MySQL Workbench, con un modelo entidad-relación normalizado hasta la Tercera Forma Normal, compuesto por las entidades Usuario, Rol, Estudiante, Profesor, Clase, Inscripción, Asistencia, Evaluación de Progreso e Historial.
- **Arquitectura:** en capas (Modelo–Repositorio–Servicio–Controlador), aplicando Programación Orientada a Objetos, con una clase base `Usuario` de la que heredan `Estudiante` y `Profesor`.
- **Estructuras de datos:** listas, diccionarios/mapas y colas para el manejo de colecciones, búsquedas y procesamiento de tareas internas.
- **Tecnologías:** JavaScript/TypeScript, backend en Node.js y Express, frontend en React con HTML y CSS, y base de datos MySQL.
