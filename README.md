# MyFinance

App personale per la gestione delle finanze: entrate, uscite, conti,
budget, movimenti ricorrenti, obiettivi di risparmio, report e collezione
Pokémon. Pensata inizialmente per uso singolo utente, ma progettata per
essere estesa a più utenti in futuro (autenticazione e Row Level Security
già multi-utente by design).

## Stack tecnologico

- React 19 + TypeScript (strict) + Vite
- Tailwind CSS v4 + shadcn/ui (Radix UI)
- Supabase (PostgreSQL, Auth, Row Level Security)
- React Router
- TanStack Query
- React Hook Form + Zod
- Recharts, Lucide React, date-fns

## Avvio del progetto

1. Installa le dipendenze:

   ```bash
   npm install
   ```

2. Copia `.env.example` in `.env.local` e inserisci i valori del tuo
   progetto Supabase (URL e "anon key" pubblica, mai la "service role key"):

   ```bash
   cp .env.example .env.local
   ```

3. Applica la migration SQL al tuo progetto Supabase (SQL editor della
   dashboard oppure Supabase CLI) usando i file in `supabase/migrations/`.

4. Avvia il server di sviluppo:

   ```bash
   npm run dev
   ```

5. Apri [http://localhost:5173](http://localhost:5173).

## Script disponibili

- `npm run dev` — avvia il server di sviluppo Vite.
- `npm run build` — esegue il type-check (`tsc -b`) e crea la build di
  produzione.
- `npm run lint` — esegue il linting con oxlint.
- `npm run preview` — anteprima locale della build di produzione.

## Struttura del progetto

```
src/
  components/   Componenti UI riutilizzabili, organizzati per dominio
  pages/        Pagine dell'applicazione (una per rotta)
  layouts/      Layout condivisi (autenticazione, app con sidebar)
  hooks/        Hook React (autenticazione, dati, ecc.)
  lib/          Utility, validazioni Zod, client Supabase, CSV
  services/     Accesso ai dati Supabase, isolato dalla UI
  types/        Tipi TypeScript di dominio
  integrations/ Integrazioni esterne (Supabase)

supabase/
  migrations/   Migration SQL dello schema del database
```

## Sicurezza

- Nessuna chiave privata è presente nel codice: tutte le configurazioni
  sensibili passano da variabili d'ambiente (`VITE_*`).
- Il database applica Row Level Security su tutte le tabelle: ogni utente
  può leggere e scrivere esclusivamente i propri dati.
- L'app non implementa funzioni bancarie reali né accesso diretto a conti
  correnti: i "conti" sono registri gestiti manualmente dall'utente.
