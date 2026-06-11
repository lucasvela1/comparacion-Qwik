# Aplicación de Clima con React

Una aplicación web para consultar información meteorológica (temperatura y precipitaciones) de ciudades argentinas. Está construida con **React**, **TypeScript** y **Vite** como herramienta de compilación.

## 🌦️ Características

- **Consulta de clima**: Visualiza temperatura y precipitaciones de ciudades predefinidas
- **Ciudades por defecto**: Ushuaia, Río Grande y Tolhuin
- **Agregar ciudades**: Permite agregar nuevas ciudades de forma personalizada
- **Almacenamiento local**: Guarda las ciudades agregadas en `localStorage`
- **Interfaz responsive**: Diseño adaptable a diferentes dispositivos
- **Animación de lluvia**: Fondo animado con efecto de lluvia

## 🛠️ Tecnologías

- **React 19** - Librería de interfaz de usuario
- **TypeScript** - Tipado estático para JavaScript
- **Vite 8** - Herramienta de compilación y bundling
- **React Router DOM** - Enrutamiento en la aplicación
- **ESLint** - Linter para validar el código

## 📁 Estructura del Proyecto

```
src/
├── components/          # Componentes reutilizables
│   ├── Layout.tsx       # Componente principal de layout
│   ├── RainBackground.tsx
│   ├── WeatherLoader.tsx
│   └── WeatherModal.tsx
├── pages/              # Páginas de la aplicación
│   ├── Clima.tsx       # Página principal de clima
│   └── AgregarCiudad.tsx
├── services/           # Servicios para llamadas API
│   ├── precipitaciones.ts
│   └── temperaturas.ts
├── constants/          # Constantes de configuración
│   └── api.ts
└── App.tsx            # Componente raíz
```

## 🚀 Instalación y Ejecución

### Requisitos previos

- Node.js (v18 o superior)
- npm o yarn

### Pasos de instalación

1. Navega a la carpeta del proyecto:

```bash
cd comparacion-Qwik
```

2. Instala las dependencias:

```bash
npm install
```

### Comandos disponibles

- **Iniciar servidor de desarrollo**:

```bash
npm run dev
```

Abre http://localhost:5173 en tu navegador.

- **Compilar para producción**:

```bash
npm run build
```

Genera la carpeta `dist/` con los archivos optimizados.

- **Vista previa de la compilación**:

```bash
npm run preview
```

Sirve la carpeta `dist/` localmente para inspeccionar la compilación.

- **Validar código con ESLint**:

```bash
npm run lint
```
