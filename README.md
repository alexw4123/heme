# Heme research

Designing a Four-Helix Nucleopeptide Bundle Capable of Hemin Binding

Christie Stevkovski, Alexander Wong, and Jillian Smith-Carpenter
Smith-Carpenter Lab, Fairfield University

## Interface

One Fairfield University header provides four links: Structure, How it works, Applications and Research. The opening shows the original PEG2 model. Scroll to turn it, or open the structure controls to select components, change representation, isolate, rotate, zoom and reset.

How it works pairs a sticky molecular view with five direct chapter buttons: Bundle, Iron site, Peroxide, Glucose and Readout. Helices/Atoms controls, pause and reduced motion provide alternatives. Scrolling changes the camera and component emphasis; it never changes source coordinates or represents observed self-assembly.

The visible application section explains peroxide measurement, GOx-coupled glucose reporting and a possible peroxide counter-screen in drug research. A five-step experimental plan covers material verification, reaction controls, peroxide calibration, glucose coupling and practical comparisons. Lower cost is a question to test through cost per validated measurement, not a demonstrated advantage. No therapeutic use is claimed.

## Evidence and explanation

The original model contains 1,213 atoms and 1,232 explicit bonds. Fe-His connections are imposed starting-model connections. Binding, reporter activity and calibration for this bundle still require experiments. No performance curve, detection limit or price comparison is invented.

The separate five-second atomic simulation replay retains its authentic saved frames and captions. Physical simulation time remains unverified. This replay is distinct from the scroll camera motion.

The reagent insets use PubChem reference conformers: hydrogen peroxide CID 784 and beta-D-glucose CID 64689. Their source URLs, counts and hashes are in assets/assay/reagent-provenance.json. These are explanatory reference structures, not measured binding poses. GOx supplies glucose recognition; a validated heme assembly would supply peroxide reporter chemistry. Green denotes the optical signal.

Original PDB SHA256: e3eccb1cbe10a18a0bd633aaf076a7cd1fd2beeedccba0fd73a2a7695b238b4c

## Source and release

React layout and CSS are in studio-source/src. Molecular rendering remains in molecule-engine.js. Existing research content stays separate in content.js, application-data.js and figures-data.js. All 30 public source inputs are byte-identical to v8, including molecular models, atom mappings, figures and replay assets. GitHub Pages serves prebuilt hashed JavaScript/CSS and unchanged binary assets from the existing archives. Notebook records are title-only and retain their permissions.

This release updates Heme only. DHFR and the original bundle viewer remain independent and unchanged. Release 20261101-heme-v9-clarity; parent 125e35ff9b7ca3a9cf94e03f1b64c09a05a55b2e is retained for rollback.
