# Kloyya — frontend

Frontend autonome (Next.js 14 App Router + TypeScript + Tailwind) pour le
backend Kloyya. Reproduit le prototype fourni : dashboard des outcomes,
création d'un nouvel outcome, revue de plan, exécution en direct, détail
d'un outcome livré, et gestion des connexions d'outils.

## Démarrer

```bash
npm install
cp .env.local.example .env.local   # ajuste NEXT_PUBLIC_API_URL si besoin
npm run dev
```

Ouvre http://localhost:3000 — ça redirige vers `/outcomes`.

## Comment ça se branche au backend

Tout passe par **`lib/api.ts`** — c'est le seul fichier à modifier pour
coller au vrai contrat de ton API. Chaque fonction :

1. tente l'appel réel vers `NEXT_PUBLIC_API_URL` (par défaut
   `https://kloyya-ia-vert.vercel.app`) ;
2. si ça échoue (404, CORS, réseau — normal tant que le backend n'expose
   pas encore ces routes), elle retombe silencieusement sur des données
   de démo dans `lib/mock-data.ts`.

Ça veut dire que l'app est utilisable et navigable dès maintenant, même
sans backend prêt, et qu'elle "s'allume" progressivement au fur et à
mesure que tu ajoutes les routes côté serveur.

Les routes supposées (à ajuster) :

| Méthode | Route                             | Rôle                                  |
|---------|------------------------------------|----------------------------------------|
| GET     | `/api/outcomes`                    | liste des outcomes                     |
| POST    | `/api/outcomes`                    | crée un outcome à partir d'une requête en langage naturel → plan |
| GET     | `/api/outcomes/:id/plan`           | plan d'un outcome                      |
| POST    | `/api/outcomes/:id/plan/answer`    | répond à la question de clarification  |
| POST    | `/api/outcomes/:id/run`            | démarre l'exécution                    |
| GET     | `/api/outcomes/:id/run`            | statut de l'exécution (pollé toutes les 3s pendant que `status === "running"`) |
| GET     | `/api/outcomes/:id`                | détail d'un outcome livré              |
| GET     | `/api/connections`                 | liste des connexions d'outils          |
| POST    | `/api/connections/:id/connect`     | démarre le flow OAuth du tool          |
| POST    | `/api/connections/:id/disconnect`  | déconnecte le tool                     |

Les types exacts attendus sont dans `lib/types.ts`.

## Ce qui n'est pas encore branché

- **Auth** : volontairement absent (cf. décision du départ). Les écrans
  Landing / Sign up / Onboarding / Choose plan / Checkout du prototype
  n'ont pas été repris — l'app part directement sur `/outcomes`. Facile
  à ajouter plus tard (ex. middleware Next.js + NextAuth ou Supabase
  Auth) sans toucher au reste.
- **Le run "live run"** poll l'API toutes les 3 secondes tant que le
  statut est `running`. Si tu préfères du websocket/SSE côté backend,
  remplace juste le `setTimeout` de polling dans
  `app/outcomes/[id]/run/page.tsx` par un `EventSource`.

## Structure

```
app/
  outcomes/page.tsx          Dashboard
  outcomes/new/page.tsx      Nouvel outcome (compose)
  outcomes/[id]/plan/page.tsx   Revue du plan
  outcomes/[id]/run/page.tsx    Exécution en direct
  outcomes/[id]/page.tsx        Détail livré
  connections/page.tsx       Connexions
components/                  AppShell, Sidebar, ToolIcon, StatGrid
lib/
  api.ts                     <- SEUL fichier à adapter au vrai backend
  types.ts                   Types partagés
  mock-data.ts                Données de démo (fallback)
```

