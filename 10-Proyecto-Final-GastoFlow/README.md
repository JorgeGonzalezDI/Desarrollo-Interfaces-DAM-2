# GastoFlow · Gestión de gastos corporativos

Aplicación multiplataforma (PWA / híbrida) para registrar, aprobar y analizar los gastos de empresa.
Proyecto final del módulo **Desarrollo de Interfaces (0488)**, DAM 2 · Nebrija · Jorge González Gómez.

- **Empleado** (usuario estándar): registra sus gastos y sigue su estado.
- **Administración** (administrador): aprueba o rechaza gastos, consulta el cuadro de mando y exporta informes PDF/CSV.

Stack: Ionic 9 + Angular 22 (standalone, signals, sin zone.js) · Supabase · Chart.js · Vercel.

Propuesta completa del proyecto: [docs/propuesta-proyecto.pdf](docs/propuesta-proyecto.pdf)

## Cómo arrancarlo en local

```powershell
npm install
npm start
```

## Ramas

- `main`: solo lo terminado (se publica en Vercel).
- `develop`: trabajo en curso.
- `feature/*`: una rama por funcionalidad, que vuelve a `develop`.
