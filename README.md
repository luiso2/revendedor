# Vendemax - Sistema de Gestión para Revendedores

![Vendemax Logo](https://img.shields.io/badge/Vendemax-Sistema%20de%20Gestión-blue)
![React](https://img.shields.io/badge/React-19.0.0-blue)
![Ionic](https://img.shields.io/badge/Ionic-8.5.0-purple)
![TypeScript](https://img.shields.io/badge/TypeScript-5.1.6-blue)

## 🚀 Demo en Vivo

**Accede a la aplicación:** [https://luiso2.github.io/revendedor](https://luiso2.github.io/revendedor)

## 📋 Descripción

Vendemax es una aplicación web moderna desarrollada con React, Ionic y TypeScript que proporciona una solución integral para la gestión de revendedores. La aplicación incluye funcionalidades completas para administrar inventario, ventas, clientes, pedidos y más.

## ✨ Características Principales

### 🏠 Dashboard
- **Dashboard Propietario**: Vista general con métricas clave
- **Dashboard Gestor**: Panel de control específico para gestores
- Estadísticas en tiempo real
- Gráficos y métricas de rendimiento

### 📦 Gestión de Inventario
- Control completo de stock
- Categorización de productos
- Alertas de inventario bajo
- Historial de movimientos

### 💰 Ventas y Ganancias
- Registro de ventas
- Cálculo automático de ganancias
- Reportes de rentabilidad
- Análisis de tendencias

### 👥 Gestión de Clientes
- Base de datos de clientes
- Historial de compras
- Sistema de comunicación
- Segmentación de clientes

### 📋 Pedidos
- Gestión de pedidos
- Estado de entrega
- Notificaciones automáticas
- Seguimiento en tiempo real

### 👨‍💼 Gestión de Gestores
- Panel de administración de gestores
- Asignación de responsabilidades
- Control de permisos
- Reportes de rendimiento

### 🛠️ Herramientas
- Utilidades de negocio
- Calculadoras
- Generadores de reportes
- Configuraciones avanzadas

## 🛠️ Tecnologías Utilizadas

- **Frontend**: React 19.0.0, Ionic 8.5.0
- **Lenguaje**: TypeScript 5.1.6
- **Build Tool**: Vite 5.2.0
- **UI Framework**: Ionic React Components
- **Routing**: React Router DOM 5.3.4
- **Iconos**: Ionicons 7.4.0
- **Fechas**: date-fns 4.1.0

## 🚀 Instalación y Desarrollo

### Prerrequisitos
- Node.js 18 o superior
- npm o yarn

### Pasos de Instalación

1. **Clonar el repositorio**
   ```bash
   git clone https://github.com/luiso2/revendedor.git
   cd revendedor
   ```

2. **Instalar dependencias**
   ```bash
   npm install
   ```

3. **Ejecutar en modo desarrollo**
   ```bash
   npm run dev
   ```

4. **Compilar para producción**
   ```bash
   npm run build
   ```

5. **Previsualizar build**
   ```bash
   npm run preview
   ```

## 📁 Estructura del Proyecto

```
vendemax/
├── src/
│   ├── components/          # Componentes reutilizables
│   ├── contexts/           # Contextos de React
│   ├── pages/              # Páginas de la aplicación
│   │   ├── Auth/           # Autenticación
│   │   ├── Dashboard/      # Paneles de control
│   │   ├── Clientes/       # Gestión de clientes
│   │   ├── Ventas/         # Sistema de ventas
│   │   ├── Inventario/     # Control de inventario
│   │   ├── Pedidos/        # Gestión de pedidos
│   │   ├── Ganancias/      # Análisis de ganancias
│   │   ├── Gestores/       # Administración de gestores
│   │   └── Herramientas/   # Utilidades del sistema
│   ├── services/           # Servicios y APIs
│   ├── types/              # Definiciones TypeScript
│   └── utils/              # Utilidades generales
├── public/                 # Archivos estáticos
├── dist/                   # Build de producción
└── .github/workflows/      # GitHub Actions
```

## 🔧 Scripts Disponibles

- `npm run dev` - Inicia el servidor de desarrollo
- `npm run build` - Compila para producción
- `npm run preview` - Previsualiza el build
- `npm run deploy` - Despliega a GitHub Pages
- `npm run test.e2e` - Ejecuta tests end-to-end
- `npm run test.unit` - Ejecuta tests unitarios
- `npm run lint` - Ejecuta el linter

## 🌐 Despliegue

El proyecto está configurado para despliegue automático en GitHub Pages. Cada push a la rama `main` activará el workflow de CI/CD que:

1. Instala las dependencias
2. Compila el proyecto
3. Despliega automáticamente a GitHub Pages

## 🤝 Contribución

1. Fork el proyecto
2. Crea una rama para tu feature (`git checkout -b feature/AmazingFeature`)
3. Commit tus cambios (`git commit -m 'Add some AmazingFeature'`)
4. Push a la rama (`git push origin feature/AmazingFeature`)
5. Abre un Pull Request

## 📝 Licencia

Este proyecto está bajo la Licencia MIT. Ver el archivo `LICENSE` para más detalles.

## 👨‍💻 Autor

**Luiso2** - [GitHub](https://github.com/luiso2)

## 📞 Soporte

Si tienes alguna pregunta o necesitas ayuda, no dudes en abrir un issue en el repositorio.

---

⭐ Si te gusta este proyecto, ¡dale una estrella en GitHub! 