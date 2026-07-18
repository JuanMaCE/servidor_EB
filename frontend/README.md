# EB Music Studio

Frontend en React y TypeScript para gestionar secuencias y letras mediante la API de EB Music.

## Desarrollo

Requiere Node.js 20.19 o superior.

```bash
npm install
npm run dev
```

Vite envía por defecto las llamadas de `/api` a `http://127.0.0.1:8000`. Para usar otra URL, crea un archivo `.env.local`:

```env
VITE_API_URL=https://api.example.com
```

## Verificación

```bash
npm run lint
npm run build
```

## Contrato utilizado

El cliente compone la biblioteca con estos recursos:

- `/songs/`
- `/artists/`
- `/song-artists/`

La configuración de producción debe servir la SPA con fallback a `index.html` y redirigir `/api` al backend, o definir `VITE_API_URL` durante el build.
