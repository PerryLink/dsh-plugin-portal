<div align="center">

<picture>
  <source media="(prefers-color-scheme: dark)" srcset="docs/assets/dsh-plugin-portal-hero-en-dark.webp">
  <img src="docs/assets/dsh-plugin-portal-hero-en-light.webp" width="100%" alt="dsh-plugin-portal: una página estática para el ecosistema de plugins — data/repos.json alimenta 99 tarjetas de roster en 17 grupos, index.html lleva CSS/JS inline sin build, verify.html consulta registros attestationId en solo lectura y node scripts/verify-portal.mjs imprime los recuentos">
</picture>

# dsh-plugin-portal

Portal estático sin dependencias para el ecosistema de plugins PerryLink DSH: una sola página de tarjetas agrupadas sobre el roster completo, más una página de consulta de atestaciones de solo lectura.

[English](README.md) · [简体中文](README-zh.md) · [Español](README-es.md) · [Português](README-pt.md) · [हिन्दी](README-hi.md)

</div>

> Este archivo es la entrada localizada en español; el cuerpo técnico completo vive en el [README.md](README.md) en inglés y no se repite aquí.

<picture>
  <source media="(prefers-color-scheme: dark)" srcset="docs/assets/dsh-plugin-portal-flow-v5-dark.svg">
  <img src="docs/assets/dsh-plugin-portal-flow-v5-light.svg" width="100%" alt="Diagrama de estructura de dsh-plugin-portal: dsh-kit/data/repos.json se copia literalmente en data/repos.json (con el sha256 en _source); index.html renderiza 99 tarjetas agrupadas y verify.html lee sin red data/levels.json y el espejo data/attestations.json; node scripts/verify-portal.mjs ejecuta las comprobaciones 1 a 11 sin dependencias e imprime los recuentos">
</picture>

*Estructura: data/repos.json → index.html / verify.html → puerta. Las etiquetas del diagrama son rutas, nombres de archivo y el comando de la puerta reales, por eso una sola imagen sirve a los cinco idiomas.*

## Resumen del ecosistema / Ecosystem overview

![dsh-plugin-portal: ejecución real de node scripts/verify-portal.mjs en un checkout limpio — pasan las comprobaciones 1, 2, 4 y 9, la 6 se omite sin el checkout hermano dsh-plugin-kit, los recuentos muestran 99 entradas en 17 grupos y termina en verify-portal: PASS](docs/assets/dsh-plugin-portal-demo.gif)

*Animación: node scripts/verify-portal.mjs re-ejecutado el 2026-11-21 desde un checkout limpio — la comprobación 6 se omite porque falta el checkout hermano dsh-plugin-kit, igual que en un runner de CI. stdout real, sin llamadas de red.*

El portal renderiza el roster completo de `dsh-plugin-kit/data/repos.json` (todos los repositorios de plugins + el repo de infraestructura `dsh-plugin-kit`): cada tarjeta muestra nombre, descripción de una línea, número de ★, dos badges de shields.io y el enlace a GitHub; los recuentos autoritativos los imprime `node scripts/verify-portal.mjs` y el README evita fijarlos. Detalle completo en el [README.md](README.md) en inglés.

## Navegación por grupos / Grouped navigation

Las tarjetas se agrupan por el campo `group` del roster, con etiqueta bilingüe y lista de contenido por grupo; los recuentos por grupo también los imprime `node scripts/verify-portal.mjs` en lugar de congelarse en la documentación. La tabla completa está en el README en inglés.

## Estado P0 / P0 status

P0 (lo imprescindible del portal) está hecho para v1: portal estático de un solo archivo, sincronización de la fuente de datos, render agrupado y badges de calidad; P1/P2 ya incluyen chips de nivel de adopción de solo lectura, el espejo de atestaciones y la consulta en `verify.html`; siguen fuera de alcance la actualización automática, la búsqueda/filtro, las páginas de detalle y el servicio de badges propio.

## Señales de calidad / Quality signals

Cada tarjeta muestra dos señales: el número de ★ del snapshot del roster y un badge de estrellas en vivo de shields.io; el badge estático refleja el valor `star` sincronizado (`n/a` para `dsh-plugin-kit`, que no publica estrellas). Son solo señales de visualización: el scoring vive en `dsh-plugin-kit`.

## Visualización de solo lectura / Read-only display

El portal solo muestra niveles de adopción y atestaciones: no calcula niveles, no emite, valida ni revoca atestaciones, y no es sitio oficial, organismo de certificación ni auditoría de seguridad; un eje sin evidencia se muestra `not-run` / `not-measured`, nunca como aprobado. En `verify.html` un registro vencido se muestra `stale` y uno retirado `withdrawn`, nunca válido.

## Estructura y sincronización / Layout & sync

`index.html` y `verify.html` son páginas sin dependencias; `data/repos.json` es una copia del roster de `dsh-plugin-kit/data/repos.json` (el `_source` registra el sha256 de origen), `data/levels.json` es una proyección de solo lectura de las tres profundidades de adopción y `data/attestations.json` es un espejo del índice de atestaciones; para refrescar, se vuelve a copiar el archivo de origen. El árbol completo está en el README en inglés.

## Vista local / Local preview

Ábrelo por HTTP (las páginas hacen fetch de los tres `data/*.json`, que `file://` bloquea): `python -m http.server 8080` y luego visita `http://localhost:8080/` y `http://localhost:8080/verify.html`.

## Validación / Validation

Puerta sin dependencias: `node scripts/verify-portal.mjs` (o `npm test`, sin instalar) imprime los recuentos autoritativos y ejecuta 11 comprobaciones — cero dependencias, contrato del roster, script inline, cobertura de blurbs, derivación del owner, copia literal del upstream, README sin recuentos congelados, evidencia de levels, espejo de atestaciones, página verify y fila de nivel; la ejecución real está en la animación de arriba.

## Familia de plugins PerryLink DSH

Este repositorio forma parte de la familia de plugins de DeepSeek Harness de [PerryLink](https://github.com/PerryLink); el índice completo por grupos está en [FAMILY.md](https://github.com/PerryLink/PerryLink/blob/main/FAMILY.md) y el roster completo en el [README.md](README.md) en inglés.

## Niveles de adopción (no oficiales)

El ecosistema avanza hacia tres profundidades de adopción: `DSH-ENTRY` (instalable y arrancable), `DSH-FLOW` (configurable, recuperable, actualizable y desinstalable) y `DSH-BOOST` (práctica Cordis y coste medible); no son certificación, ni ranking, ni respaldo de DeepSeek. La spec legible por máquina está en el proyecto privado `dsh-standards`; este portal solo renderiza el espejo `data/levels.json`.

[Privacy](PRIVACY.md) · [Security](SECURITY.md) · [Contributing](CONTRIBUTING.md) · [Changelog](CHANGELOG.md)
