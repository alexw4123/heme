# Heme research handoff

Start with [README.md](README.md) for the study, attribution, and evidence boundaries. The public project is [Heme](https://alexw4123.github.io/heme/). The README includes historical release notes. Use the current manifest and workflow to identify the live package.

## Where to work

- `studio-source/src/App.jsx` owns the React opening, navigation, and model inspector. `ScrollAssay.jsx` and `Applications.jsx` in the same folder own the guided chemistry and application panels. `refinements.css` contains the current responsive layout.
- `molecule-engine.js` owns model rendering and source verification. `content.js`, `application-data.js`, `figures-data.js`, and `research-records.js` own the research content and records.
- The production entry is `index.html`. Follow its script and stylesheet references and the copy list in [.github/workflows/pages.yml](.github/workflows/pages.yml). Other root-level scripts and styles include older viewer iterations.

## Preview and validate

- For a local preview, reproduce the workflow's static staging step in a scratch directory and serve that directory with `python -m http.server 8000`. The archives supply files that the raw checkout does not expose at their served paths.
- This checkout includes the React sources and prebuilt bundles. Regenerating the bundles requires the separate Vite build workspace; there is no package manifest in `studio-source/`. For a release that changes bundles, keep `index.html`, the workflow copy list, and [ASSET-MANIFEST.json](ASSET-MANIFEST.json) aligned.
- Preserve source coordinates, atom order, explicit connectivity, selection mappings, figures, and replay inputs during UI or docs work. The opening model should verify against the manifest and report 1,213 atoms and 1,232 explicit bonds. Check phone widths and confirm **Explore the 3D model** opens the inspector when editing the opening.
- Keep camera motion, saved simulation frames, proposed assays, and experimental evidence distinct. The displayed model does not establish binding or catalytic activity. Keep private notebooks out of the public site.
- A push to `main` runs the Pages deployment. Use a separate branch for review when the task does not authorize a site release.
