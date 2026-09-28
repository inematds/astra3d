# Astra3D

**🇧🇷 [Português](README.md) · 🇺🇸 [English](README.en.md) · 🇪🇸 [Español](README.es.md)**

A visual studio for customizing and exporting websites with original 3D scenes.

**[Open the editor](https://inematds.github.io/astra3d/)** · **[User guide](https://inematds.github.io/astra3d/guia/en/)** · **[Plan for all versions](docs/PLANO-VERSOES.md)**

![Astra3D — create your website](capa/capa.png)

## Available in V2.0

- Órbita (portfolio), Forma (agency), and Caderno (publication).
- Visual editor with text, local images, themes, fonts, motion, and sections.
- Desktop/mobile preview using the same HTML as the export.
- Up to six projects or articles; reading details; search/category in Caderno.
- Library with independent projects, renaming, duplication, archiving/restoring, search, and filters.
- Up to five saved versions per project, plus undo/redo during the session.
- JSON backup of the entire library and import as new copies.
- Migration of V1 drafts and detection of conflicts between tabs.
- [Órbita demo](https://inematds.github.io/astra3d/demos/portfolio/), [Forma](https://inematds.github.io/astra3d/demos/agency/), and [Caderno](https://inematds.github.io/astra3d/demos/journal/): complete websites without the editor.
- JSON import/export and download of a standalone HTML file, with fonts and scene included.
- Reduced motion and accessible HTML content even without WebGL.

No account or AI key required. Chat, the four advanced models, and automatic website publishing for visitors are **planned, not implemented**. [See the V1–V6 plan](docs/PLANO-VERSOES.md).

## Development

Node.js 22.12+ or 24 and npm.

```sh
npm ci
npm run dev
```

```sh
npm test
npm run build
npm run preview
npx playwright install chromium
npm run test:e2e
```

The build generates the 3D runtime locally and publishes the editor, guide, and plans to `dist/`. `src/generated` is not versioned. The `.github/workflows/pages.yml` workflow publishes via GitHub Actions.

## Usage and data

Explore a demo → create a project → customize → save a version → export HTML. Keep the library backup in My Projects. Rename the HTML file to `index.html` and upload it to a static host. Drafts are not remote backups: clearing the browser deletes them. The editor does not send images or content to a server. External links are set by whoever creates the website.

The sample content notice is enabled by default; disable it only after replacing the demo text. There is no email collection or fake checkout.

## Documentation

- [V2.0 details and upcoming V2.1–V2.2 features](docs/PLANO-V2.md)
- [Architecture and configuration contract](docs/ARQUITETURA.md)
- [Plans and acceptance criteria](docs/PLANO-VERSOES.md)
- [Guide](guia/index.html)
- [Credits and assets](docs/CREDITOS.md)

## License

Original code under MIT. Libraries and fonts retain their own licenses; see the credits. The reference PDF is not redistributed.
