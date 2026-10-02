<p align="center">
  <img src="https://github.com/Oceanica-poli/Escuela-Oceanica-poli/blob/master/PORTADA.jpg?raw=true" alt="Portada Oceánica Infantil" width="100%">
</p>

# Sistema de Gestión y Seguimiento del Proceso Formativo en la Academia de Natación Oceánica

> **Propuesta de proyecto PPI-T**

---

## 📌 Información General & Equipo

<div align="center">

| 🏢 Información General | 👨‍💻 Equipo de Desarrollo |
| :--- | :--- |
| **Empresa:** Oceánica | **Carlos Andrés Palacio Franco**<br>📧 `Carlos_palacio23212@elpoli.edu.co` |
| **Ubicación:** Medellín | **Juan Sebastián Gutiérrez Colorado**<br>📧 `Juan_gutierrez23222@elpoli.edu.co` |
| **Contacto:** Viviana Marín | |

</div>

---

### ⚠️ Descripción del Problema
Actualmente, la academia no cuenta con un sistema que permita gestionar, organizar y analizar la información de los estudiantes de manera eficiente. Esto limita el seguimiento del proceso formativo, ya que no se dispone de información estructurada que permita evaluar el estado real de cada estudiante.

Adicionalmente, la ausencia de mecanismos que permitan el control y seguimiento automático de la información dificulta la toma de decisiones por parte de los profesores, afectando la calidad del proceso de enseñanza.

### 🎯 Objetivo General
Desarrollar un sistema de información que permita gestionar el historial de los estudiantes activos de la academia Oceánica, facilitando no solo el almacenamiento de la información, sino también el seguimiento y control del proceso formativo, con el fin de mejorar la toma de decisiones dentro de la organización.

---

## 📋 Objetivos Específicos

1. **Definir requerimientos:** Establecer las necesidades del proceso formativo, control de información y condiciones funcionales y no funcionales del sistema.
2. **Análisis y diseño:** Estructurar procesos, organizar la información y definir el modelo de datos relacional.
3. **Implementación:** Desarrollar la estructura lógica necesaria para la gestión y almacenamiento de datos.
4. **Automatización:** Implementar mecanismos para el registro automático de información, progreso y asistencia.
5. **Interfaz Web:** Construir una interfaz web intuitiva, clara y funcional para los usuarios.
6. **Pruebas y ajustes:** Validar el correcto funcionamiento, corregir errores y garantizar confiabilidad.
7. **Despliegue y mantenimiento:** Asegurar la disponibilidad en producción y definir lineamientos de actualización continua.

---

## 🚀 Alcance del Proyecto

El proyecto abarca el diseño, desarrollo y puesta en producción de un sistema de información web organizado en **7 módulos principales**:

<p align="center">
  <img src="https://github.com/Oceanica-poli/Escuela-Oceanica-poli/blob/master/MODULOS.jpg?raw=true" alt="Módulos del Sistema" width="100%">
</p>

### 🧩 Detalle de Módulos
1. **Gestión de usuarios:** Registro, autenticación por roles, recuperación de contraseña y edición de perfil.
2. **Gestión de estudiantes:** Registro, actualización, consulta y activación/inactivación.
3. **Gestión de clases:** Programación de clases, asignación de estudiantes y validación automática de cupos y solapamientos.
4. **Control de asistencia:** Registro por clase, porcentaje acumulado, alertas por inasistencias y reportes.
5. **Seguimiento del progreso:** Parametrización de niveles técnicos, evaluaciones periódicas y línea de tiempo.
6. **Historial académico:** Consulta consolidada con exportación de reportes en PDF.
7. **Reportes y consultas:** Indicadores estadísticos, panel de administrador y filtros avanzados.

> *Nota: Funcionalidades como inicio/cierre de sesión, registro inicial y menú principal se consideran transversales.*

---

### 📅 Distribución por Semestres

| Semestre | Avance | Entregables Clave |
| :---: | :---: | :--- |
| **Quinto** | `30%` | Documentación completa y prototipo funcional hosted (Módulos 1 y 2). |
| **Sexto** | `60%` | Desarrollo completo de Módulos 3, 4, 5 y 6. |
| **Séptimo** | `10%` | Módulo 7 (Reportes), integración total, pruebas en producción y despliegue final. |

---

### 🚫 Fuera del Alcance
* 📱 Aplicación móvil nativa (exclusivamente web responsive).
* 💳 Pasarela de pagos o facturación.
* 📩 Notificaciones por SMS o correo masivo.
* 🏢 Gestión de múltiples sedes o franquicias.
* 👥 Módulo de nómina o recursos humanos.
* 🤖 Analítica predictiva o inteligencia artificial.
* 🔗 Integración con federaciones deportivas externas.
* 📦 Control de inventario de material deportivo.

---

## 🛠️ Aspectos Técnicos y Arquitectura

<p align="center">
  <img src="https://github.com/Oceanica-poli/Escuela-Oceanica-poli/blob/master/TECNOLOGIAS.jpg?raw=true" alt="Stack Tecnológico" width="100%">
</p>

* **Base de datos:** MySQL administrada en MySQL Workbench. Modelo E-R normalizado hasta **3FN** *(Usuario, Rol, Estudiante, Profesor, Clase, Inscripción, Asistencia, Evaluación de Progreso e Historial)*.
* **Arquitectura:** En capas (*Modelo – Repositorio – Servicio – Controlador*) aplicando POO (clase base `Usuario` heredada por `Estudiante` y `Profesor`).
* **Estructuras de datos:** Listas, mapas/diccionarios y colas para colecciones y búsquedas eficientes.
* **Stack Tecnológico:** JavaScript / TypeScript, Backend en **Node.js + Express**, Frontend en **React + HTML/CSS**, Base de datos **MySQL**.
