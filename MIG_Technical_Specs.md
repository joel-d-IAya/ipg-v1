# MIG Technical Specs - DiayaVinci Knowledge Base

## Modèles

### Nano Banana 2 — `gemini-3.1-flash-image-preview` ⭐ Nouveau

- **Rôle** : Modèle principal pour l'**édition d'images** et la génération en **format libre/custom**.
- **Optimisé pour** : Vitesse, volumes élevés, intégration de recherche web en temps réel.
- **Formats supportés** : Tous — 1:1, 4:3, 3:4, 16:9, 9:16, 21:9, 9:21, et **ratios personnalisés**.

### Imagen 4 — `imagen-4.0-generate-001`

- **Rôle** : Génération d'images depuis un prompt texte (formats standards uniquement).
- **Formats supportés** : 1:1, 4:3, 3:4, 16:9, 9:16, 21:9.

---

## Formats (Aspect Ratios)

- **Auto**: Le format sera déterminé automatiquement. *(Imagen 4)*
- **9:21 (Ultra Tall)**: Portrait ultra haut 9:21. *(Nano Banana 2)*
- **9:16 (Tall)**: Le format final doit être un portrait haut 9:16.
- **2:3 (Portrait)**: Le format final doit être un portrait 2:3.
- **3:4 (Portrait)**: Le format final doit être un portrait 3:4.
- **4:5 (Portrait)**: Le format final doit être un portrait 4:5.
- **1:1 (Square)**: Le format final doit être un carré 1:1.
- **5:4 (Landscape)**: Le format final doit être un paysage 5:4.
- **4:3 (Landscape)**: Le format final doit être un paysage 4:3.
- **3:2 (Landscape)**: Le format final doit être un paysage 3:2.
- **16:9 (Wide)**: Le format final doit être un paysage large 16:9.
- **21:9 (Ultrawide)**: Le format final doit être un paysage ultra large 21:9.
- **✦ Libre (Custom)**: Format personnalisé via ratio W:H saisi par l'utilisateur. *(Nano Banana 2 uniquement)*

## Framing

- **Macro Shot**: Cadre un plan macro extrême, révélant des détails minuscules.
- **Tight Shot**: Utilise un plan très serré sur une partie spécifique du sujet.
- **Close-Up**: Cadre un gros plan sur le sujet, typiquement le visage.
- **Medium Close-Up**: Cadre le sujet de la tête à la poitrine.
- **Medium Shot**: Cadre le sujet de la tête à la taille.
- **Italian Shot**: Cadre le sujet de la tête aux genoux.
- **American Shot**: Cadre le sujet de la tête à mi-cuisse.
- **Full Shot**: Cadre le sujet en entier, de la tête aux pieds.
- **Wide Shot**: Utilise un plan large, montrant le sujet dans son environnement.
- **Extreme Wide Shot**: Utilise un plan très large où l'environnement domine le sujet.

## Camera Angles

- **Frontal View**: Cadre le sujet directement de face.
- **Three-Quarter Profile**: Cadre le sujet de profil trois quarts.
- **Profile Shot**: Cadre le sujet de profil strict.
- **Rear View**: Montre la scène depuis l'arrière du sujet.
- **Eye-Level**: Place la caméra à la hauteur des yeux du sujet.
- **High Angle**: Place la caméra en hauteur, en regardant vers le bas.
- **Low Angle**: Place la caméra en bas, en regardant vers le haut.
- **Top-Down Shot**: Vue verticale, directement d'en haut.
- **Aerial View**: Vue depuis une grande hauteur.

## Artistic Styles

- **3D Render**: Polygoné.
- **Abstract**: Formes et couleurs.
- **Manga / Anime**: Style japonais.
- **Architectural Style**: Dessein architectural.
- **Art Nouveau**: Lignes organiques.
- **Assemblage Art**: Objets trouvés.
- **Black and White**: Noir et Blanc.
- **Cartoon**: Dessin animé.
- **Collage**: Papier et photos.
- **Comic Book Style**: Bande dessinée.
- **Cubism**: Formes géométriques.
- **Cyberpunk**: Néons, futuriste.
- **Digital Art**: Art numérique.
- **Double Exposure**: Superposition.
- **Famous Artist Style**: Style distinctif.
- **Futurism**: Vitesse et technologie.
- **Impressionism**: Touches de pinceau.
- **Ink Painting**: Peinture à l'encre.
- **Land Art**: Matériaux naturels.
- **Minimalism**: Espace négatif.
- **Mosaic**: Mosaïque.
- **Naive Art**: Simplicité enfantine.
- **Neoclassicism**: Ordre et clarté.
- **Oil Painting**: Peinture à l'huile.
- **Op Art**: Illusions d'optique.
- **Pencil Sketch**: Croquis.
- **Photorealistic**: Photoréaliste.
- **Pixel Art**: 16 bits.
- **Pointillism**: Petits points.
- **Pop Art**: Couleurs vives.
- **Post-Impressionism**: Couleurs vives, pinceau distinct.
- **Realism**: Détails fidèles.
- **Futuristic Sci-Fi**: Science-fiction.
- **Street Art**: Graffiti.
- **Surrealism**: Onirique.
- **Vintage**: Ancien.
- **Vintage Film**: Pellicule ancienne.
- **Watercolor**: Aquarelle.

## Lighting

- **Natural Lighting**: Soleil, fenêtre.
- **Backlighting**: Contre-jour.
- **Studio Lighting**: Professionnel.
- **Golden Hour**: Lumière chaude.
- **Neon**: Néon vibrant.
- **Chiaroscuro**: Clair-obscur.
- **Soft Light**: Douce et diffuse.
- **Hard Light**: Ombres nettes.
- **Diffused Light**: Lueur douce.
- **Side Lighting**: Latérale.
- **Butterfly Lighting**: Ombre sous le nez.
- **Rim Lighting**: Contour.
- **High Key Lighting**: Lumineux et uniforme.
- **Low Key Lighting**: Sombre et mystérieux.
- **Blue Hour**: Crépuscule.

## Lenses

- **Wide-Angle Lens**: Perspective large (24mm).
- **Telephoto Lens**: Compresser la perspective (135mm).
- **Macro Lens**: Gros plans extrêmes.
- **Bokeh**: Flou d'arrière-plan.
