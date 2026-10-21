# ISN Supernova Digital Booklet

Editable source for the current 18-page ISN 2026 booklet.
Includes paper page-turn animation, eight club performance cards,
About ISN, updated club introduction artwork, Behind the Scenes,
four interview placeholder pages, Facebook and Feedback.

## Run
Open index.html in a modern browser, or run:

    python3 -m http.server 8000

Then open http://localhost:8000.

## Edit
- index.html: booklet structure, contents menu and programme dialog text.
- style.css: colours, typography, layout and animation.
- app.js: page mapping, carousel and interactions.
- assets/: page artwork exported from Canva and the shared star background.

Club introduction and interview pages are artwork images; edit those in
Canva and replace the matching assets. Performance details are still
placeholders. Add the final programme titles, introductions and highlight
images before the event.

## Collaborate
Invite your partner under repository Settings > Collaborators.
Use a separate branch and pull request for changes you want reviewed.
Updating this repository does not automatically update the current live
booklet until a deployment integration is configured.

## Hosting
This is a static website. No build command is required.
The repository root is the publish directory for a static host.
