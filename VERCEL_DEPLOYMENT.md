# Guía de Despliegue en Vercel

## Problema Resuelto: Error 404 NOT_FOUND

El error 404 que estabas experimentando se debía a la falta de configuración específica para Vercel. Tu proyecto usa una estructura full-stack con Express y React que requiere configuración especial.

## Cambios Realizados

### 1. Archivo `vercel.json`
Se creó la configuración necesaria para Vercel:
- Define el comando de build: `npm run build`
- Configura el directorio de salida: `dist`
- Establece las reglas de reescritura para API y frontend
- Configura las funciones serverless

### 2. Archivo `api/index.ts`
Se creó un handler para Vercel Functions que:
- Maneja las rutas API (`/api/*`)
- Sirve el frontend construido para otras rutas
- Proporciona fallback para desarrollo

### 3. Modificaciones en `server/node-build.ts`
- Se agregó exportación para Vercel
- Se modificó la lógica de inicio del servidor

### 4. Dependencias
- Se agregó `@vercel/node` como dependencia de desarrollo

## Pasos para Desplegar

1. **Instalar dependencias:**
   ```bash
   npm install
   ```

2. **Construir el proyecto:**
   ```bash
   npm run build
   ```

3. **Conectar a Vercel:**
   - Ve a [vercel.com](https://vercel.com)
   - Conecta tu repositorio de GitHub
   - Vercel detectará automáticamente la configuración

4. **Variables de entorno (si las necesitas):**
   - Configura las variables en el dashboard de Vercel
   - Ejemplo: `PING_MESSAGE`, `PORT`, etc.

## Estructura del Proyecto

```
├── api/
│   └── index.ts          # Handler para Vercel Functions
├── client/               # Frontend React
├── server/               # Backend Express
├── dist/                 # Archivos construidos
│   ├── spa/             # Frontend construido
│   └── server/          # Servidor construido
├── vercel.json          # Configuración de Vercel
└── package.json
```

## Verificación

Después del despliegue, verifica:
- ✅ La página principal carga correctamente
- ✅ Las rutas API funcionan (`/api/ping`, `/api/demo`)
- ✅ El enrutamiento del frontend funciona
- ✅ No hay errores 404

## Solución de Problemas

Si sigues teniendo problemas:

1. **Revisa los logs de Vercel** en el dashboard
2. **Verifica que el build sea exitoso** localmente
3. **Confirma que las variables de entorno** estén configuradas
4. **Revisa que el archivo `vercel.json`** esté en la raíz del proyecto

## Comandos Útiles

```bash
# Desarrollo local
npm run dev

# Construcción
npm run build

# Inicio en producción
npm start
``` 