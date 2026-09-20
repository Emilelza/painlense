create table if not exists patients (
  id text primary key,
  name text not null,
  age integer not null,
  care_type text not null,
  password_hash text not null
);

create table if not exists visits (
  id text primary key,
  patient_id text not null references patients(id) on delete cascade,
  date date not null,
  observer text not null,
  note text not null,
  raw numeric,
  corrected numeric
);

create index if not exists visits_patient_date_idx on visits(patient_id, date, id);
