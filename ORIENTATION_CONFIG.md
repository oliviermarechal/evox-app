# Configuration de l'Orientation - EVOX App

## Vue d'ensemble

L'application EVOX utilise maintenant un système d'orientation hybride qui permet de contrôler l'orientation au niveau de chaque écran individuellement.

## Configuration globale

Dans `app.json`, l'orientation est configurée sur `"default"` pour permettre toutes les orientations au niveau de l'application.

## Hook d'orientation

Le hook `useScreenOrientation` permet de contrôler l'orientation de chaque écran :

```typescript
import { useScreenOrientation } from '@/hooks/useScreenOrientation';
import * as ScreenOrientation from 'expo-screen-orientation';

// Forcer le portrait
useScreenOrientation(ScreenOrientation.OrientationLock.PORTRAIT);

// Permettre toutes les orientations
useScreenOrientation(ScreenOrientation.OrientationLock.DEFAULT);

// Autres options disponibles
useScreenOrientation(ScreenOrientation.OrientationLock.LANDSCAPE);
useScreenOrientation(ScreenOrientation.OrientationLock.PORTRAIT_UP);
useScreenOrientation(ScreenOrientation.OrientationLock.LANDSCAPE_LEFT);
useScreenOrientation(ScreenOrientation.OrientationLock.ALL);
// etc.
```

## Configuration par écran

### Écrans en mode portrait uniquement
- **Home** (`app/(tabs)/index.tsx`) - Interface principale
- **Workouts** (`app/(tabs)/workouts.tsx`) - Gestion des séances
- **PRs** (`app/(tabs)/prs.tsx`) - Records personnels
- **Profile** (`app/(tabs)/profile.tsx`) - Profil utilisateur

### Écrans avec orientation libre
- **Free Timer** (`app/timers/free/index.tsx`) - Chronomètre libre
- **For Time** (`app/timers/fortime/index.tsx`) - Timer avec objectif
- **EMOM** (`app/timers/emom/index.tsx`) - Every Minute On the Minute
- **AMRAP** (`app/timers/amrap/index.tsx`) - As Many Rounds As Possible
- **Tabata** (`app/timers/tabata/index.tsx`) - Intervalles haute intensité

## Avantages

1. **Interface cohérente** : Les écrans de navigation restent en portrait pour une expérience utilisateur familière
2. **Flexibilité des timers** : Les timers peuvent utiliser le paysage pour une meilleure visibilité pendant l'entraînement
3. **Contrôle granulaire** : Chaque écran peut avoir sa propre configuration d'orientation
4. **Expérience optimisée** : Les utilisateurs peuvent choisir l'orientation qui leur convient le mieux selon le contexte

## Utilisation

L'orientation se change automatiquement lors de la navigation entre les écrans. Les timers détectent automatiquement l'orientation et adaptent leur interface en conséquence grâce au hook `useOrientation` existant.
