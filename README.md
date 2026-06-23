# Delta Manga Sécurité (DMS) — Site Vitrine

Site vitrine statique pour **Delta Manga Sécurité (DMS)**, entreprise gabonaise spécialisée dans la sécurité privée, la protection des personnes et des biens, et le placement de personnel qualifié.

Basé à Libreville / Owendo sous la direction de M. Matha Akombi Stevie.

---

## Structure du projet

```
dms-2/
├── index.html          # Accueil — hero vidéo, manifeste, services, stats, dirigeant
├── a-propos.html       # À propos — histoire, mission/vision/valeurs, direction, équipe
├── services.html       # Services — 5 sections détaillées avec navigation sticky
├── pourquoi-dms.html   # Pourquoi DMS — 6 raisons, processus, galerie
├── contact.html        # Contact — infos, carte, formulaire avec validation
│
├── assets/
│   ├── img/            # Images du site (icônes SVG inline, quelques .jpg/.png)
│   └── videos/         # Vidéos d'arrière-plan (hero, moniteur de surveillance)
│
├── css/
│   ├── style.css       # Design system — variables, reset, nav, footer, composants globaux
│   ├── home.css        # Page d'accueil — hero, moniteur, manifeste, services, stats, dirigeant
│   ├── pages.css       # Pages internes — hero, about, équipe, services, pourquoi, contact, formulaire
│   ├── about.css       # Importe pages.css (cohérence)
│   ├── services.css    # Importe pages.css
│   ├── pourquoi.css    # Importe pages.css
│   └── contact.css     # Importe pages.css
│
└── js/
    ├── components.js   # Injection nav/footer, loader
    ├── main.js         # Animations, compteurs, custom cursor, dark mode, typing, canvas
    └── contact.js      # Validation formulaire, soumission, anti-spam
```

---

## Pages

### Accueil (`index.html`)
- **Hero** : Vidéo d'arrière-plan, animation canvas, effet typographie, moniteur de surveillance avec flux vidéo multi-caméras
- **Manifeste** : Mission + grille des valeurs (Courage, Loyauté, Dévouement, Vigilance)
- **Services** : Aperçu des 5 services avec cartes interactives
- **Stats** : Bandeau statistiques (24h/24, 5 expertises, 100% formé, intervention immédiate)
- **Dirigeant** : Citation du PDG avec photo et badge

### À propos (`a-propos.html`)
- Hero page avec fond dégradé
- **Introduction** : Présentation DMS avec icônes design (bouclier, équipe)
- **Mission, Vision & Valeurs** : 3 cartes détaillées
- **Valeurs détaillées** : 5 piliers (Courage, Loyauté, Dévouement, Professionnalisme, Vigilance)
- **Direction** : Carte dirigeant avec citation et icônes événements
- **Équipe "Sentinelles DMS"** : 5 cartes équipe avec icônes design

### Services (`services.html`)
- Navigation sticky avec ancres pour chaque service
- **01 — Surveillance humaine** : Agents statiques, rondiers, cynophiles, événementiel
- **02 — Sécurité mobile & intervention** : Patrouilles motorisées, intervention sur alarme, coordination
- **03 — Contrôle d'accès & accueil** : Filtrage, vérification d'identité, accueil sécurisé
- **04 — Placement de personnel** : Agents HSE, HTM, ouvriers qualifiés, agents d'entretien
- **05 — Systèmes de sécurité** : Vidéosurveillance, alarmes, contrôle d'accès, incendie

### Pourquoi DMS (`pourquoi-dms.html`)
- Chiffres clés : 6 raisons, 24h/24, 100% conforme, 5 services
- **6 raisons** : Expérience locale, personnel qualifié, offres complètes, tarifs compétitifs, réactivité 24h/24, respect du droit gabonais
- **Processus** : 4 étapes (analyse, proposition, déploiement, suivi)
- **Galerie d'icônes** : 4 icônes design terrain

### Contact (`contact.html`)
- Coordonnées : téléphone, email, WhatsApp, adresse Libreville
- Google Maps intégré
- **Formulaire** : Nom, email, téléphone, entreprise, service souhaité, message
  - Validation native + personnalisée
  - Anti-spam (honeypot)
  - Compteur de caractères
  - État de succès avec animations

---

## Design system

### Typographie
- **Titres** : `Bebas Neue` (uppercase, large)
- **Corps** : `Inter` (300–800)

### Couleurs
| Rôle | Light | Dark |
|------|-------|-------|
| Fond (`--night`) | `#F7F9FC` | `#0A0E1A` |
| Fond profond (`--deep`) | `#EDF2F8` | `#0D1526` |
| Surface (`--surface`) | `#FFFFFF` | `#151f35` |
| Accent teal (`--teal`) | `#1A6F95` | `#1E7FA6` |
| Texte (`--white`) | `#0D2340` | `#F4F7FA` |
| Bordure (`--border`) | `rgba(13,35,64,.1)` | `rgba(255,255,255,.07)` |

### Composants globaux
- Curseur personnalisé (dot + ring)
- Loader de page avec barre de progression
- Navigation fixe avec menu hamburger et drawer mobile
- Boutons : `btn-primary` (teal), `btn-gold`, `btn-outline`, `btn-ghost`
- Badges : `badge-teal`, `badge-gold`, `badge-red` + dot animé
- Cartes avec effet hover 3D, glow et border highlight
- Grille responsive (`grid-2`, `grid-3`, `grid-4`, etc.)
- Animations au scroll (`[data-reveal]` avec délais configurables)
- Thème clair/sombre avec bouton de bascule

---

## Fonctionnalités JavaScript

### `components.js`
- Injection automatique de la navigation et du footer sur toutes les pages
- Loader de page avec animation SVG

### `main.js`
- **Compteurs animés** (`[data-counter]`) au scroll
- **Curseur personnalisé** avec états `active`
- **Bascule dark/light mode** avec persistance localStorage
- **Animation typing** (`[data-typing]`) pour la rotation des mots-clés
- **Canvas hero** avec particules connectées
- **Animations au scroll** avec `IntersectionObserver`
- **Ripple effect** sur les boutons
- **Data-tilt** sur cartes (effet 3D au survol)
- Horloge live dans le moniteur

### `contact.js`
- Validation complète du formulaire
- Anti-spam honeypot
- Compteur de caractères en temps réel
- Simulation d'envoi avec état loading
- Message de succès animé

---

## Utilisation

Aucune dépendance ni build. Simple ouverture dans un navigateur :

```bash
# Serveur local (recommandé)
npx serve .
# Ou ouvrir directement
start index.html
```

Le site fonctionne en **100% statique** — HTML, CSS et JS vanilla.

---

## Contact

- **Téléphone** : +241 (0) 65 08 26 82 / +241 (0) 76 44 34 24
- **Email** : samyrmatha.akombi@gmail.com
- **WhatsApp** : +241 65 08 26 82
- **Adresse** : Libreville / Owendo, Gabon

---

© Delta Manga Sécurité — Tous droits réservés.
# mengo-site-officiel
