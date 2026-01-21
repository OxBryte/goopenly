-- Users Table
create table users (
  id uuid primary key default uuid_generate_v4(),
  email text unique,
  full_name text,
  kyc_status text default 'pending', -- pending, approved, rejected
  bridge_customer_id text, -- Links to Bridge.xyz
  created_at timestamp with time zone default now()
);

-- Wallets Table (Solana)
create table wallets (
  user_id uuid references users(id),
  public_key text,
  encrypted_private_key text, -- If custodial
  currency text default 'USDC'
);

-- Virtual Accounts Table
create table virtual_accounts (
  id uuid primary key,
  user_id uuid references users(id),
  bank_name text,
  account_number text,
  routing_number text,
  bridge_address_id text
);

-- Cards Table
create table cards (
  id uuid primary key,
  user_id uuid references users(id),
  card_id_external text, -- Bridge Card ID
  last_4 text,
  expiry text,
  status text default 'active',
  design_theme text default 'pink_glass'
);
