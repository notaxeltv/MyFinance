-- =============================================================================
-- MyFinance - Migration iniziale
-- Crea tutte le tabelle, gli enum, gli indici, i trigger e le policy RLS
-- necessarie per la gestione delle finanze personali (entrate, uscite, conti,
-- budget, ricorrenze, obiettivi di risparmio e collezione Pokemon).
-- =============================================================================

-- Estensione necessaria per gen_random_uuid()
create extension if not exists "pgcrypto";

-- =============================================================================
-- ENUM
-- =============================================================================

create type public.account_type as enum (
  'checking',
  'savings',
  'cash',
  'credit_card',
  'prepaid',
  'digital_wallet',
  'investment',
  'other'
);

create type public.category_type as enum (
  'income',
  'expense',
  'both'
);

create type public.transaction_type as enum (
  'income',
  'expense',
  'transfer'
);

create type public.recurring_frequency as enum (
  'daily',
  'weekly',
  'monthly',
  'yearly'
);

create type public.pokemon_product_type as enum (
  'booster_pack',
  'booster_box',
  'etb',
  'collection_box',
  'promo',
  'single_card',
  'graded_card',
  'sealed_product',
  'other'
);

create type public.pokemon_status as enum (
  'owned',
  'sold',
  'traded',
  'opened',
  'lost'
);

create type public.pokemon_condition as enum (
  'sealed',
  'near_mint',
  'played',
  'graded',
  'damaged',
  'unknown'
);

-- =============================================================================
-- FUNZIONI DI SUPPORTO (definite prima delle tabelle che le usano)
-- =============================================================================

-- Aggiorna automaticamente la colonna updated_at ad ogni UPDATE.
create or replace function public.set_updated_at()
returns trigger
language plpgsql
as $$
begin
  new.updated_at = now();
  return new;
end;
$$;

-- =============================================================================
-- TABELLA: profiles
-- =============================================================================

create table public.profiles (
  id uuid primary key default gen_random_uuid(),
  user_id uuid not null references auth.users (id) on delete cascade,
  display_name text,
  avatar_url text,
  default_currency text not null default 'EUR',
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now(),
  constraint profiles_user_id_key unique (user_id)
);

comment on table public.profiles is 'Profilo utente esteso, collegato a auth.users.';

create trigger set_profiles_updated_at
  before update on public.profiles
  for each row
  execute function public.set_updated_at();

-- =============================================================================
-- TABELLA: accounts (conti e portafogli)
-- =============================================================================

create table public.accounts (
  id uuid primary key default gen_random_uuid(),
  user_id uuid not null references auth.users (id) on delete cascade,
  name text not null check (char_length(trim(name)) > 0),
  type public.account_type not null default 'checking',
  currency text not null default 'EUR',
  initial_balance numeric(14, 2) not null default 0,
  current_balance numeric(14, 2) not null default 0,
  color text,
  icon text,
  is_active boolean not null default true,
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now()
);

comment on table public.accounts is 'Conti e portafogli dell''utente (correnti, contanti, carte, investimenti, ecc.).';

create index accounts_user_id_idx on public.accounts (user_id);
create index accounts_user_id_is_active_idx on public.accounts (user_id, is_active);

create trigger set_accounts_updated_at
  before update on public.accounts
  for each row
  execute function public.set_updated_at();

-- =============================================================================
-- TABELLA: categories
-- =============================================================================

create table public.categories (
  id uuid primary key default gen_random_uuid(),
  user_id uuid not null references auth.users (id) on delete cascade,
  name text not null check (char_length(trim(name)) > 0),
  type public.category_type not null default 'expense',
  color text,
  icon text,
  is_default boolean not null default false,
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now()
);

comment on table public.categories is 'Categorie di entrata/uscita, personalizzabili per ogni utente.';

create index categories_user_id_idx on public.categories (user_id);
create index categories_user_id_type_idx on public.categories (user_id, type);
create unique index categories_user_id_name_key on public.categories (user_id, name);

create trigger set_categories_updated_at
  before update on public.categories
  for each row
  execute function public.set_updated_at();

-- =============================================================================
-- TABELLA: recurring_transactions (movimenti ricorrenti)
-- Creata prima di "transactions" perche' quest'ultima la referenzia.
-- =============================================================================

create table public.recurring_transactions (
  id uuid primary key default gen_random_uuid(),
  user_id uuid not null references auth.users (id) on delete cascade,
  account_id uuid not null references public.accounts (id) on delete cascade,
  category_id uuid references public.categories (id) on delete set null,
  type public.transaction_type not null check (type in ('income', 'expense')),
  amount numeric(14, 2) not null check (amount > 0),
  description text not null check (char_length(trim(description)) > 0),
  frequency public.recurring_frequency not null,
  next_date date not null,
  end_date date,
  is_active boolean not null default true,
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now(),
  constraint recurring_transactions_end_date_check check (end_date is null or end_date >= next_date)
);

comment on table public.recurring_transactions is 'Modelli di entrate/uscite ricorrenti usati per generare movimenti futuri.';

create index recurring_transactions_user_id_idx on public.recurring_transactions (user_id);
create index recurring_transactions_next_date_idx on public.recurring_transactions (next_date);
create index recurring_transactions_user_id_is_active_idx on public.recurring_transactions (user_id, is_active);

create trigger set_recurring_transactions_updated_at
  before update on public.recurring_transactions
  for each row
  execute function public.set_updated_at();

-- =============================================================================
-- TABELLA: transactions (movimenti)
-- =============================================================================

create table public.transactions (
  id uuid primary key default gen_random_uuid(),
  user_id uuid not null references auth.users (id) on delete cascade,
  account_id uuid not null references public.accounts (id) on delete cascade,
  category_id uuid references public.categories (id) on delete set null,
  type public.transaction_type not null,
  amount numeric(14, 2) not null check (amount > 0),
  description text not null check (char_length(trim(description)) > 0),
  transaction_date date not null default current_date,
  payment_method text,
  notes text,
  is_recurring boolean not null default false,
  recurring_transaction_id uuid references public.recurring_transactions (id) on delete set null,
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now(),
  constraint transactions_category_required_check check (
    type = 'transfer' or category_id is not null
  )
);

comment on table public.transactions is 'Movimenti finanziari (entrate e uscite). I trasferimenti tra conti sono gestiti dalla tabella transfers.';

create index transactions_user_id_idx on public.transactions (user_id);
create index transactions_account_id_idx on public.transactions (account_id);
create index transactions_category_id_idx on public.transactions (category_id);
create index transactions_user_id_date_idx on public.transactions (user_id, transaction_date desc);
create index transactions_type_idx on public.transactions (type);
create index transactions_recurring_transaction_id_idx on public.transactions (recurring_transaction_id);

create trigger set_transactions_updated_at
  before update on public.transactions
  for each row
  execute function public.set_updated_at();

-- =============================================================================
-- TABELLA: transfers (trasferimenti tra conti propri)
-- =============================================================================

create table public.transfers (
  id uuid primary key default gen_random_uuid(),
  user_id uuid not null references auth.users (id) on delete cascade,
  from_account_id uuid not null references public.accounts (id) on delete cascade,
  to_account_id uuid not null references public.accounts (id) on delete cascade,
  amount numeric(14, 2) not null check (amount > 0),
  transfer_date date not null default current_date,
  description text,
  created_at timestamptz not null default now(),
  constraint transfers_different_accounts_check check (from_account_id <> to_account_id)
);

comment on table public.transfers is 'Trasferimenti di denaro tra due conti dello stesso utente.';

create index transfers_user_id_idx on public.transfers (user_id);
create index transfers_from_account_id_idx on public.transfers (from_account_id);
create index transfers_to_account_id_idx on public.transfers (to_account_id);
create index transfers_user_id_date_idx on public.transfers (user_id, transfer_date desc);

-- =============================================================================
-- TABELLA: budgets
-- =============================================================================

create table public.budgets (
  id uuid primary key default gen_random_uuid(),
  user_id uuid not null references auth.users (id) on delete cascade,
  category_id uuid not null references public.categories (id) on delete cascade,
  month date not null,
  amount numeric(14, 2) not null check (amount >= 0),
  alert_threshold numeric(5, 2) not null default 80 check (alert_threshold > 0 and alert_threshold <= 100),
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now(),
  constraint budgets_month_is_first_day_check check (month = date_trunc('month', month)::date),
  constraint budgets_user_category_month_key unique (user_id, category_id, month)
);

comment on table public.budgets is 'Budget mensili per categoria. "month" rappresenta sempre il primo giorno del mese.';

create index budgets_user_id_idx on public.budgets (user_id);
create index budgets_user_id_month_idx on public.budgets (user_id, month);
create index budgets_category_id_idx on public.budgets (category_id);

create trigger set_budgets_updated_at
  before update on public.budgets
  for each row
  execute function public.set_updated_at();

-- =============================================================================
-- TABELLA: savings_goals (obiettivi di risparmio)
-- =============================================================================

create table public.savings_goals (
  id uuid primary key default gen_random_uuid(),
  user_id uuid not null references auth.users (id) on delete cascade,
  name text not null check (char_length(trim(name)) > 0),
  target_amount numeric(14, 2) not null check (target_amount > 0),
  current_amount numeric(14, 2) not null default 0 check (current_amount >= 0),
  deadline date,
  color text,
  description text,
  is_completed boolean not null default false,
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now()
);

comment on table public.savings_goals is 'Obiettivi di risparmio personali con importo target e versamenti accumulati.';

create index savings_goals_user_id_idx on public.savings_goals (user_id);
create index savings_goals_user_id_is_completed_idx on public.savings_goals (user_id, is_completed);

create trigger set_savings_goals_updated_at
  before update on public.savings_goals
  for each row
  execute function public.set_updated_at();

-- =============================================================================
-- TABELLA: pokemon_items (collezione e investimenti Pokemon)
-- Sezione separata dalle finanze "tradizionali".
-- =============================================================================

create table public.pokemon_items (
  id uuid primary key default gen_random_uuid(),
  user_id uuid not null references auth.users (id) on delete cascade,
  name text not null check (char_length(trim(name)) > 0),
  set_name text,
  product_type public.pokemon_product_type not null default 'other',
  quantity integer not null default 1 check (quantity > 0),
  purchase_price numeric(14, 2) not null check (purchase_price >= 0),
  estimated_value numeric(14, 2) check (estimated_value >= 0),
  purchase_date date not null default current_date,
  status public.pokemon_status not null default 'owned',
  condition public.pokemon_condition not null default 'unknown',
  seller text,
  notes text,
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now()
);

comment on table public.pokemon_items is 'Collezione e investimenti Pokemon, gestiti separatamente dalle transazioni finanziarie ordinarie.';

create index pokemon_items_user_id_idx on public.pokemon_items (user_id);
create index pokemon_items_user_id_status_idx on public.pokemon_items (user_id, status);
create index pokemon_items_product_type_idx on public.pokemon_items (product_type);
create index pokemon_items_set_name_idx on public.pokemon_items (set_name);

create trigger set_pokemon_items_updated_at
  before update on public.pokemon_items
  for each row
  execute function public.set_updated_at();

-- =============================================================================
-- CALCOLO SALDO CONTI
-- Il saldo corrente viene ricalcolato da zero (initial_balance + entrate -
-- uscite - trasferimenti in uscita + trasferimenti in entrata) ogni volta che
-- una transazione o un trasferimento collegato al conto viene creato,
-- modificato o eliminato. Questo evita derive di calcolo incrementali.
-- =============================================================================

create or replace function public.recalculate_account_balance(p_account_id uuid)
returns void
language plpgsql
security definer
set search_path = public
as $$
begin
  if p_account_id is null then
    return;
  end if;

  update public.accounts
  set current_balance = initial_balance
    + coalesce((
        select sum(amount) from public.transactions
        where account_id = p_account_id and type = 'income'
      ), 0)
    - coalesce((
        select sum(amount) from public.transactions
        where account_id = p_account_id and type = 'expense'
      ), 0)
    - coalesce((
        select sum(amount) from public.transfers
        where from_account_id = p_account_id
      ), 0)
    + coalesce((
        select sum(amount) from public.transfers
        where to_account_id = p_account_id
      ), 0)
  where id = p_account_id;
end;
$$;

create or replace function public.handle_transaction_balance_change()
returns trigger
language plpgsql
as $$
begin
  if tg_op = 'DELETE' then
    perform public.recalculate_account_balance(old.account_id);
    return old;
  end if;

  perform public.recalculate_account_balance(new.account_id);

  if tg_op = 'UPDATE' and old.account_id is distinct from new.account_id then
    perform public.recalculate_account_balance(old.account_id);
  end if;

  return new;
end;
$$;

create trigger transactions_balance_trigger
  after insert or update or delete on public.transactions
  for each row
  execute function public.handle_transaction_balance_change();

create or replace function public.handle_transfer_balance_change()
returns trigger
language plpgsql
as $$
begin
  if tg_op = 'DELETE' then
    perform public.recalculate_account_balance(old.from_account_id);
    perform public.recalculate_account_balance(old.to_account_id);
    return old;
  end if;

  perform public.recalculate_account_balance(new.from_account_id);
  perform public.recalculate_account_balance(new.to_account_id);

  if tg_op = 'UPDATE' then
    if old.from_account_id is distinct from new.from_account_id then
      perform public.recalculate_account_balance(old.from_account_id);
    end if;
    if old.to_account_id is distinct from new.to_account_id then
      perform public.recalculate_account_balance(old.to_account_id);
    end if;
  end if;

  return new;
end;
$$;

create trigger transfers_balance_trigger
  after insert or update or delete on public.transfers
  for each row
  execute function public.handle_transfer_balance_change();

-- Se il saldo iniziale di un conto viene modificato, ricalcola il saldo corrente
-- da zero (stesso ordine di grandezza dei trigger su transactions/transfers,
-- cosi' il calcolo resta sempre coerente in un unico punto del codice).
create or replace function public.handle_account_initial_balance_change()
returns trigger
language plpgsql
as $$
begin
  if new.initial_balance is distinct from old.initial_balance then
    perform public.recalculate_account_balance(new.id);
  end if;
  return null;
end;
$$;

create trigger accounts_initial_balance_trigger
  after update on public.accounts
  for each row
  when (new.initial_balance is distinct from old.initial_balance)
  execute function public.handle_account_initial_balance_change();

-- =============================================================================
-- GESTIONE NUOVO UTENTE: crea profilo e categorie predefinite in italiano.
-- =============================================================================

create or replace function public.handle_new_user()
returns trigger
language plpgsql
security definer
set search_path = public
as $$
begin
  insert into public.profiles (user_id, display_name, default_currency)
  values (new.id, new.raw_user_meta_data ->> 'display_name', 'EUR');

  insert into public.categories (user_id, name, type, color, icon, is_default)
  values
    (new.id, 'Stipendio', 'income', '#16a34a', 'wallet', true),
    (new.id, 'Freelance', 'income', '#22c55e', 'briefcase', true),
    (new.id, 'Casa', 'expense', '#0ea5e9', 'home', true),
    (new.id, 'Bollette', 'expense', '#0284c7', 'receipt', true),
    (new.id, 'Alimentari', 'expense', '#f59e0b', 'shopping-cart', true),
    (new.id, 'Auto', 'expense', '#64748b', 'car', true),
    (new.id, 'Carburante', 'expense', '#78716c', 'fuel', true),
    (new.id, 'Trasporti', 'expense', '#0d9488', 'bus', true),
    (new.id, 'Salute', 'expense', '#ef4444', 'heart-pulse', true),
    (new.id, 'Palestra', 'expense', '#f97316', 'dumbbell', true),
    (new.id, 'Abbonamenti', 'expense', '#8b5cf6', 'refresh-cw', true),
    (new.id, 'Tecnologia', 'expense', '#6366f1', 'cpu', true),
    (new.id, 'Gaming', 'expense', '#a855f7', 'gamepad-2', true),
    (new.id, 'Pokemon', 'expense', '#facc15', 'sparkles', true),
    (new.id, 'Abbigliamento', 'expense', '#ec4899', 'shirt', true),
    (new.id, 'Ristoranti', 'expense', '#fb923c', 'utensils', true),
    (new.id, 'Tempo libero', 'expense', '#06b6d4', 'popcorn', true),
    (new.id, 'Università', 'expense', '#3b82f6', 'graduation-cap', true),
    (new.id, 'Tasse', 'expense', '#71717a', 'landmark', true),
    (new.id, 'Altro', 'both', '#94a3b8', 'more-horizontal', true);

  return new;
end;
$$;

create trigger on_auth_user_created
  after insert on auth.users
  for each row
  execute function public.handle_new_user();

-- =============================================================================
-- ROW LEVEL SECURITY
-- Ogni utente puo' leggere e modificare esclusivamente i propri dati.
-- =============================================================================

alter table public.profiles enable row level security;
alter table public.accounts enable row level security;
alter table public.categories enable row level security;
alter table public.recurring_transactions enable row level security;
alter table public.transactions enable row level security;
alter table public.transfers enable row level security;
alter table public.budgets enable row level security;
alter table public.savings_goals enable row level security;
alter table public.pokemon_items enable row level security;

-- profiles
create policy "profiles_select_own" on public.profiles
  for select using (auth.uid() = user_id);
create policy "profiles_insert_own" on public.profiles
  for insert with check (auth.uid() = user_id);
create policy "profiles_update_own" on public.profiles
  for update using (auth.uid() = user_id) with check (auth.uid() = user_id);
create policy "profiles_delete_own" on public.profiles
  for delete using (auth.uid() = user_id);

-- accounts
create policy "accounts_select_own" on public.accounts
  for select using (auth.uid() = user_id);
create policy "accounts_insert_own" on public.accounts
  for insert with check (auth.uid() = user_id);
create policy "accounts_update_own" on public.accounts
  for update using (auth.uid() = user_id) with check (auth.uid() = user_id);
create policy "accounts_delete_own" on public.accounts
  for delete using (auth.uid() = user_id);

-- categories
create policy "categories_select_own" on public.categories
  for select using (auth.uid() = user_id);
create policy "categories_insert_own" on public.categories
  for insert with check (auth.uid() = user_id);
create policy "categories_update_own" on public.categories
  for update using (auth.uid() = user_id) with check (auth.uid() = user_id);
create policy "categories_delete_own" on public.categories
  for delete using (auth.uid() = user_id);

-- recurring_transactions
create policy "recurring_transactions_select_own" on public.recurring_transactions
  for select using (auth.uid() = user_id);
create policy "recurring_transactions_insert_own" on public.recurring_transactions
  for insert with check (auth.uid() = user_id);
create policy "recurring_transactions_update_own" on public.recurring_transactions
  for update using (auth.uid() = user_id) with check (auth.uid() = user_id);
create policy "recurring_transactions_delete_own" on public.recurring_transactions
  for delete using (auth.uid() = user_id);

-- transactions
create policy "transactions_select_own" on public.transactions
  for select using (auth.uid() = user_id);
create policy "transactions_insert_own" on public.transactions
  for insert with check (auth.uid() = user_id);
create policy "transactions_update_own" on public.transactions
  for update using (auth.uid() = user_id) with check (auth.uid() = user_id);
create policy "transactions_delete_own" on public.transactions
  for delete using (auth.uid() = user_id);

-- transfers
create policy "transfers_select_own" on public.transfers
  for select using (auth.uid() = user_id);
create policy "transfers_insert_own" on public.transfers
  for insert with check (auth.uid() = user_id);
create policy "transfers_update_own" on public.transfers
  for update using (auth.uid() = user_id) with check (auth.uid() = user_id);
create policy "transfers_delete_own" on public.transfers
  for delete using (auth.uid() = user_id);

-- budgets
create policy "budgets_select_own" on public.budgets
  for select using (auth.uid() = user_id);
create policy "budgets_insert_own" on public.budgets
  for insert with check (auth.uid() = user_id);
create policy "budgets_update_own" on public.budgets
  for update using (auth.uid() = user_id) with check (auth.uid() = user_id);
create policy "budgets_delete_own" on public.budgets
  for delete using (auth.uid() = user_id);

-- savings_goals
create policy "savings_goals_select_own" on public.savings_goals
  for select using (auth.uid() = user_id);
create policy "savings_goals_insert_own" on public.savings_goals
  for insert with check (auth.uid() = user_id);
create policy "savings_goals_update_own" on public.savings_goals
  for update using (auth.uid() = user_id) with check (auth.uid() = user_id);
create policy "savings_goals_delete_own" on public.savings_goals
  for delete using (auth.uid() = user_id);

-- pokemon_items
create policy "pokemon_items_select_own" on public.pokemon_items
  for select using (auth.uid() = user_id);
create policy "pokemon_items_insert_own" on public.pokemon_items
  for insert with check (auth.uid() = user_id);
create policy "pokemon_items_update_own" on public.pokemon_items
  for update using (auth.uid() = user_id) with check (auth.uid() = user_id);
create policy "pokemon_items_delete_own" on public.pokemon_items
  for delete using (auth.uid() = user_id);
