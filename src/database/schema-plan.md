# ZONO — Supabase Database Schema Plan

Planning document for the ZONO Postgres schema on Supabase. **Nothing here is
applied yet** — no migrations have been run and no auth is wired. This is the
blueprint the foundation was built against.

## Conventions

- **Primary keys**: `id uuid primary key default gen_random_uuid()`.
- **Timestamps**: `created_at timestamptz not null default now()`, `updated_at timestamptz` maintained by a trigger.
- **Multi-tenancy**: almost every table carries `agency_id` (the tenant). RLS isolates tenants.
- **Money**: stored as `integer` whole shekels (₪). No floats for currency.
- **Enums**: implemented as Postgres `enum` types (or `text` + `check`) mirroring the TypeScript unions in `src/types`.
- **Soft references**: `on delete` rules noted per FK; default is `restrict` for core records, `cascade` for owned children, `set null` for optional links.
- **Naming**: `snake_case` columns; the TS layer maps to `camelCase`.

## Entity overview

```
agencies ─< users
agencies ─< properties >─ sellers
properties ─< property_media
properties ─< property_price_history
properties ─< property_status_history
properties ─< property_journeys ─< journey_tasks
properties ─< matches >─ buyers
agencies ─< leads (convert → buyers / sellers)
agencies ─< opportunities, alerts
agencies ─< communications, followups, calendar_events
agencies ─< automations
agencies ─< documents ─< signature_requests
agencies ─< external_agents ─< property_distributions >─ properties
agencies ─< market_areas ─< market_events
* ─< audit_logs
```

---

## 1. `agencies`

**Purpose**: The tenant. Every other row belongs to exactly one agency.

**Fields**

| column | type | notes |
| --- | --- | --- |
| id | uuid PK | |
| name | text not null | |
| plan | enum(`starter`,`pro`,`agency`,`enterprise`) not null default `starter` | |
| regions | text[] | regions the agency operates in |
| logo_url | text | |
| created_at | timestamptz | |

**Relationships**: parent of `users`, `properties`, `buyers`, `sellers`, `leads`, and most other tables via `agency_id`.

**Indexes**: PK only (small table).

**Future RLS**: members read their own agency; only `owner`/`manager` may update. Tenant boundary anchor — every other policy joins back to `agency_id`.

---

## 2. `users`

**Purpose**: Application users (agents and staff) within an agency. Linked 1:1 to a Supabase `auth.users` row.

**Fields**

| column | type | notes |
| --- | --- | --- |
| id | uuid PK | equals `auth.users.id` |
| agency_id | uuid FK → agencies(id) on delete cascade | |
| full_name | text not null | |
| email | text not null unique | |
| phone | text | |
| role | enum(`owner`,`manager`,`agent`,`assistant`) not null default `agent` | |
| avatar_url | text | |
| created_at | timestamptz | |

**Relationships**: owns properties, buyers, sellers, leads, opportunities, etc. via `agent_id`.

**Indexes**: `unique(email)`, `index(agency_id)`.

**Future RLS**: a user reads users in the same agency; updates limited to self or `manager`/`owner`. Insert tied to invitation flow.

---

## 3. `properties`

**Purpose**: Core listing entity.

**Fields**

| column | type | notes |
| --- | --- | --- |
| id | uuid PK | |
| agency_id | uuid FK → agencies on delete cascade | |
| agent_id | uuid FK → users on delete set null | listing owner |
| seller_id | uuid FK → sellers on delete set null | |
| title | text not null | |
| description | text | |
| type | enum property_type | apartment, penthouse, … |
| listing_kind | enum(`sale`,`rent`) not null | |
| status | enum(`lead`,`listed`,`under_offer`,`in_contract`,`sold`,`withdrawn`) not null default `lead` | |
| price | integer not null | ₪ |
| monthly_rent | integer | when rent |
| rooms | numeric(3,1) not null | supports 2.5 |
| size_sqm | integer not null | |
| outdoor_sqm | integer | |
| floor | integer | |
| total_floors | integer | |
| has_parking, has_elevator, has_balcony, has_safe_room, has_storage, is_accessible | boolean not null default false | feature flags |
| location | jsonb not null | `{lat,lng,address,city,neighborhood,region}` |
| zono_score | smallint | 0–100 AI score |
| estimated_days_to_sell | smallint | |
| listed_at | timestamptz | |
| created_at / updated_at | timestamptz | |

**Relationships**: belongs to agency, agent, seller. Parent of media, price/status history, journeys, matches, distributions.

**Indexes**: `index(agency_id, status)`, `index(agent_id)`, `index(seller_id)`, `index(type)`, GIN on `location` and a generated `region` column for geo filtering, `index(price)` for range queries.

**Future RLS**: agency members read; `agent_id` owner or `manager`/`owner` may write. Consider exposing a public read view for a future buyer-facing site (restricted columns only).

---

## 4. `buyers`

**Purpose**: Prospective buyers and their search criteria (matching engine input).

**Fields**

| column | type | notes |
| --- | --- | --- |
| id | uuid PK | |
| agency_id | uuid FK → agencies on delete cascade | |
| agent_id | uuid FK → users on delete set null | |
| full_name | text not null | |
| phone | text not null | |
| email | text | |
| preferred_channel | enum(`phone`,`whatsapp`,`email`,`sms`) | |
| notes | text | |
| preferences | jsonb not null | budget/rooms/size ranges, types, regions, must-haves |
| temperature | enum(`hot`,`warm`,`cold`) | |
| buying_readiness | smallint | 0–100 |
| has_mortgage_pre_approval | boolean default false | |
| viewed_property_ids | uuid[] | |
| saved_property_ids | uuid[] | |
| last_contacted_at | timestamptz | |
| created_at / updated_at | timestamptz | |

**Relationships**: belongs to agency/agent; referenced by matches, opportunities, alerts, calendar_events, communications.

**Indexes**: `index(agency_id, temperature)`, `index(agent_id)`, GIN on `preferences` (budget/region filters), `index(phone)`.

**Future RLS**: agency-scoped read; owning agent or manager writes. PII — restrict column exposure in any public/edge contexts.

---

## 5. `sellers`

**Purpose**: Property owners selling through the agency; tracks exclusivity.

**Fields**

| column | type | notes |
| --- | --- | --- |
| id | uuid PK | |
| agency_id | uuid FK → agencies on delete cascade | |
| agent_id | uuid FK → users on delete set null | |
| full_name | text not null | |
| phone | text not null | |
| email | text | |
| preferred_channel | enum channel | |
| notes | text | |
| motivation | enum(`urgent`,`motivated`,`exploring`) | |
| has_exclusivity | boolean default false | בלעדיות |
| exclusivity_ends_at | timestamptz | |
| expected_price | integer | ₪ |
| created_at / updated_at | timestamptz | |

**Relationships**: 1:N with properties (a seller can list several).

**Indexes**: `index(agency_id)`, `index(agent_id)`, `index(exclusivity_ends_at)` for expiry sweeps.

**Future RLS**: agency-scoped; owning agent or manager writes. PII handling as for buyers.

---

## 6. `leads`

**Purpose**: Inbound/sourced leads before qualification into buyer/seller.

**Fields**

| column | type | notes |
| --- | --- | --- |
| id | uuid PK | |
| agency_id | uuid FK → agencies on delete cascade | |
| agent_id | uuid FK → users on delete set null | |
| full_name | text not null | |
| phone | text | |
| email | text | |
| source | enum(`yad2`,`madlan`,`facebook`,`instagram`,`website`,`referral`,`sign_call`,`open_house`,`cold_outreach`,`other`) | |
| intent | enum(`buyer`,`seller`,`both`,`unknown`) | |
| stage | enum(`new`,`contacted`,`qualified`,`nurturing`,`converted`,`lost`) not null default `new` | |
| message | text | |
| property_id | uuid FK → properties on delete set null | enquired-about listing |
| score | smallint | 0–100 |
| converted_buyer_id | uuid FK → buyers on delete set null | |
| converted_seller_id | uuid FK → sellers on delete set null | |
| lost_reason | text | |
| last_activity_at | timestamptz | |
| created_at / updated_at | timestamptz | |

**Relationships**: optional links to a property and to converted buyer/seller.

**Indexes**: `index(agency_id, stage)`, `index(agent_id)`, `index(source)`, `index(score)`, `index(last_activity_at)` for stale-lead detection.

**Future RLS**: agency-scoped; assigned agent or manager writes. Service-role insert path for webhook/portal ingestion.

---

## 7. `matches`

**Purpose**: Scored buyer↔property pairings from the matching engine.

**Fields**

| column | type | notes |
| --- | --- | --- |
| id | uuid PK | |
| agency_id | uuid FK → agencies on delete cascade | |
| buyer_id | uuid FK → buyers on delete cascade | |
| property_id | uuid FK → properties on delete cascade | |
| score | smallint not null | 0–100 |
| reasons | jsonb not null | explainable factor breakdown |
| meets_hard_constraints | boolean not null | |
| action | enum(`new`,`presented`,`viewing_scheduled`,`viewed`,`rejected`,`offer_made`) not null default `new` | |
| created_at / updated_at | timestamptz | |

**Relationships**: join table buyers×properties (extra attributes).

**Indexes**: `unique(buyer_id, property_id)`, `index(agency_id, score desc)`, `index(property_id)`, `index(buyer_id, action)`.

**Future RLS**: agency-scoped read; writes via service-role (engine) only. Agents update `action` for their own matches.

---

## 8. `alerts`

**Purpose**: Time-sensitive notifications for an agent ("something happened / is due").

**Fields**

| column | type | notes |
| --- | --- | --- |
| id | uuid PK | |
| agency_id | uuid FK → agencies on delete cascade | |
| agent_id | uuid FK → users on delete cascade | recipient |
| level | enum(`info`,`success`,`warning`,`critical`) not null | |
| category | enum(`task_due`,`followup_due`,`price_change`,`new_lead`,`document_pending`,`exclusivity_expiring`,`market_event`,`system`) | |
| title | text not null | |
| body | text | |
| is_read | boolean not null default false | |
| href | text | deep link |
| property_id / buyer_id / seller_id / lead_id | uuid FK (set null) | optional context |
| due_at | timestamptz | |
| created_at | timestamptz | |

**Indexes**: `index(agent_id, is_read, created_at desc)`, `index(due_at)`.

**Future RLS**: recipient agent reads/updates own alerts; insert via service-role.

---

## 9. `opportunities`

**Purpose**: Proactive AI recommendations (the opportunities feed).

**Fields**

| column | type | notes |
| --- | --- | --- |
| id | uuid PK | |
| agency_id | uuid FK → agencies on delete cascade | |
| agent_id | uuid FK → users on delete cascade | |
| type | enum opportunity_type | price_drop, new_match, … |
| priority | enum(`high`,`medium`,`low`) not null | |
| status | enum(`open`,`snoozed`,`acted`,`dismissed`) not null default `open` | |
| title | text not null | |
| summary | text not null | |
| suggested_action | text | |
| potential_value | integer | ₪ upside |
| confidence | smallint | 0–100 |
| property_id / buyer_id / seller_id / lead_id | uuid FK (set null) | |
| snoozed_until | timestamptz | |
| created_at / updated_at | timestamptz | |

**Indexes**: `index(agent_id, status, priority)`, `index(agency_id)`, `index(snoozed_until)`.

**Future RLS**: owning agent reads/updates status; insert via service-role engine.

---

## 10. `property_journeys`

**Purpose**: The lifecycle journey for a single property (one per property).

**Fields**

| column | type | notes |
| --- | --- | --- |
| id | uuid PK | |
| agency_id | uuid FK → agencies on delete cascade | |
| property_id | uuid FK → properties on delete cascade unique | 1:1 with property |
| current_stage | enum journey_stage(`intake`,`preparation`,`pricing`,`marketing`,`viewings`,`negotiation`,`contract`,`closing`) | |
| stages | jsonb not null | per-stage status/progress snapshot |
| overall_progress | smallint | 0–100 |
| created_at / updated_at | timestamptz | |

**Relationships**: 1:1 with `properties`; parent of `journey_tasks`.

**Indexes**: `unique(property_id)`, `index(agency_id, current_stage)`.

**Future RLS**: agency-scoped; owning agent or manager writes.

---

## 11. `journey_tasks`

**Purpose**: Concrete tasks within a journey stage.

**Fields**

| column | type | notes |
| --- | --- | --- |
| id | uuid PK | |
| journey_id | uuid FK → property_journeys on delete cascade | |
| stage | enum journey_stage | which stage |
| title | text not null | |
| done | boolean not null default false | |
| automatable | boolean not null default false | ZONO can do it |
| due_at | timestamptz | |
| assignee_id | uuid FK → users on delete set null | |
| created_at / updated_at | timestamptz | |

**Indexes**: `index(journey_id, stage)`, `index(assignee_id, done)`, `index(due_at)`.

**Future RLS**: agency-scoped via journey→property; assignee or manager writes.

---

## 12. `communications`

**Purpose**: Log of every outbound/inbound interaction (WhatsApp, email, SMS, call) with a contact. Powers the timeline and follow-up engine.

**Fields**

| column | type | notes |
| --- | --- | --- |
| id | uuid PK | |
| agency_id | uuid FK → agencies on delete cascade | |
| agent_id | uuid FK → users on delete set null | |
| channel | enum(`phone`,`whatsapp`,`email`,`sms`,`note`) not null | |
| direction | enum(`inbound`,`outbound`) not null | |
| subject | text | |
| body | text | |
| buyer_id / seller_id / lead_id / property_id | uuid FK (set null) | who/what it relates to |
| sent_by_automation_id | uuid FK → automations on delete set null | if auto-sent |
| occurred_at | timestamptz not null default now() | |
| created_at | timestamptz | |

**Indexes**: `index(agency_id, occurred_at desc)`, `index(buyer_id)`, `index(seller_id)`, `index(lead_id)`, `index(agent_id)`.

**Future RLS**: agency-scoped read; owning agent writes; service-role insert for automated sends. PII-heavy — strict column control.

---

## 13. `followups`

**Purpose**: Scheduled future touches with a contact ("call back in 3 days").

**Fields**

| column | type | notes |
| --- | --- | --- |
| id | uuid PK | |
| agency_id | uuid FK → agencies on delete cascade | |
| agent_id | uuid FK → users on delete cascade | |
| buyer_id / seller_id / lead_id / property_id | uuid FK (set null) | target |
| reason | text | |
| status | enum(`pending`,`done`,`snoozed`,`cancelled`) not null default `pending` | |
| due_at | timestamptz not null | |
| completed_at | timestamptz | |
| created_by_ai | boolean not null default false | |
| created_at / updated_at | timestamptz | |

**Indexes**: `index(agent_id, status, due_at)`, `index(agency_id)`, `index(due_at)`.

**Future RLS**: owning agent reads/writes own follow-ups; manager read across agency.

---

## 14. `calendar_events`

**Purpose**: Scheduled items on an agent's calendar (viewings, signings, meetings).

**Fields**

| column | type | notes |
| --- | --- | --- |
| id | uuid PK | |
| agency_id | uuid FK → agencies on delete cascade | |
| agent_id | uuid FK → users on delete cascade | |
| type | enum(`viewing`,`open_house`,`meeting`,`call`,`signing`,`valuation`,`task`,`followup`) | |
| status | enum(`tentative`,`confirmed`,`completed`,`cancelled`,`no_show`) not null default `tentative` | |
| title | text not null | |
| notes | text | |
| start_at | timestamptz not null | |
| end_at | timestamptz not null | |
| all_day | boolean not null default false | |
| location | jsonb | geo + address |
| property_id / buyer_id / seller_id / lead_id | uuid FK (set null) | |
| created_by_ai | boolean not null default false | |
| created_at | timestamptz | |

**Indexes**: `index(agent_id, start_at)`, `index(agency_id, start_at)`, `index(property_id)`. Consider an exclusion constraint to prevent double-booking an agent.

**Future RLS**: owning agent reads/writes; manager reads across agency.

---

## 15. `automations`

**Purpose**: No-code workflows: when `trigger` (+ conditions) → run `actions`.

**Fields**

| column | type | notes |
| --- | --- | --- |
| id | uuid PK | |
| agency_id | uuid FK → agencies on delete cascade | |
| agent_id | uuid FK → users on delete set null | null = agency-wide |
| name | text not null | |
| description | text | |
| enabled | boolean not null default true | |
| trigger | enum automation_trigger | new_lead, price_drop, … |
| conditions | jsonb not null default '[]' | field/op/value list |
| actions | jsonb not null | ordered action steps |
| last_run_at | timestamptz | |
| run_count | integer not null default 0 | |
| created_at / updated_at | timestamptz | |

**Indexes**: `index(agency_id, enabled)`, `index(trigger)`.

**Future RLS**: `manager`/`owner` write agency-wide automations; agents manage their own. Execution runs under service-role.

---

## 16. `documents`

**Purpose**: Stored documents (agreements, offers, contracts), optionally tied to a signature flow.

**Fields**

| column | type | notes |
| --- | --- | --- |
| id | uuid PK | |
| agency_id | uuid FK → agencies on delete cascade | |
| agent_id | uuid FK → users on delete set null | |
| type | enum document_type | exclusivity_agreement, sale_contract, … |
| status | enum(`draft`,`pending_signature`,`signed`,`expired`,`archived`) not null default `draft` | |
| title | text not null | |
| url | text | |
| storage_path | text | Supabase Storage key |
| property_id / buyer_id / seller_id | uuid FK (set null) | |
| signature_request_id | uuid FK → signature_requests on delete set null | |
| created_at / updated_at | timestamptz | |

**Indexes**: `index(agency_id, status)`, `index(property_id)`, `index(type)`.

**Future RLS**: agency-scoped; owning agent or manager. Storage bucket policies must mirror row access (signed URLs only).

---

## 17. `signature_requests`

**Purpose**: E-signature request wrapping a document, with one row per request and signer state in JSON.

**Fields**

| column | type | notes |
| --- | --- | --- |
| id | uuid PK | |
| agency_id | uuid FK → agencies on delete cascade | |
| document_id | uuid FK → documents on delete cascade | |
| signers | jsonb not null | name/contact/status per signer |
| status | enum(`open`,`completed`,`cancelled`,`expired`) not null default `open` | |
| sent_at | timestamptz not null default now() | |
| completed_at | timestamptz | |

**Indexes**: `index(document_id)`, `index(agency_id, status)`.

**Future RLS**: agency-scoped; provider webhooks update status via service-role.

---

## 18. `external_agents`

**Purpose**: Other agents/agencies ZONO collaborates with for co-broking and listing distribution.

**Fields**

| column | type | notes |
| --- | --- | --- |
| id | uuid PK | |
| agency_id | uuid FK → agencies on delete cascade | the owning agency's contact record |
| full_name | text not null | |
| agency_name | text | external firm |
| phone | text | |
| email | text | |
| trust_level | enum(`trusted`,`known`,`new`) not null default `new` | |
| notes | text | |
| created_at / updated_at | timestamptz | |

**Indexes**: `index(agency_id)`, `index(email)`.

**Future RLS**: agency-scoped read/write by `agent`+.

---

## 19. `property_distributions`

**Purpose**: Record of a property being shared/published to a channel or external agent (e.g. Yad2, Madlan, a co-broker).

**Fields**

| column | type | notes |
| --- | --- | --- |
| id | uuid PK | |
| agency_id | uuid FK → agencies on delete cascade | |
| property_id | uuid FK → properties on delete cascade | |
| channel | enum(`yad2`,`madlan`,`facebook`,`instagram`,`external_agent`,`website`,`whatsapp_group`) | |
| external_agent_id | uuid FK → external_agents on delete set null | when channel = external_agent |
| status | enum(`pending`,`published`,`failed`,`removed`) not null default `pending` | |
| external_url | text | live listing URL |
| published_at | timestamptz | |
| created_at / updated_at | timestamptz | |

**Indexes**: `unique(property_id, channel, external_agent_id)`, `index(agency_id, status)`, `index(property_id)`.

**Future RLS**: agency-scoped; owning agent or manager. Publishing jobs run service-role.

---

## 20. `market_areas`

**Purpose**: Geographic markets with aggregate statistics powering market intelligence.

**Fields**

| column | type | notes |
| --- | --- | --- |
| id | uuid PK | |
| name | text not null | "פלורנטין, תל אביב" |
| region | enum region | |
| city | text not null | |
| neighborhood | text | |
| median_price_per_sqm | integer | ₪ |
| yoy_change_pct | numeric(5,2) | |
| trend | enum(`up`,`down`,`stable`) | |
| median_days_on_market | smallint | |
| active_listings | integer | |
| demand_index | smallint | 0–100 |
| updated_at | timestamptz | |

**Relationships**: parent of `market_events`. Largely shared/reference data (may be global rather than agency-scoped).

**Indexes**: `index(region)`, `index(city)`, `unique(city, neighborhood)`.

**Future RLS**: read for all authenticated users; writes via service-role ingestion only.

---

## 21. `market_events`

**Purpose**: Dated events affecting a market area (new projects, infrastructure, price signals).

**Fields**

| column | type | notes |
| --- | --- | --- |
| id | uuid PK | |
| market_area_id | uuid FK → market_areas on delete cascade | |
| type | enum(`new_project`,`infrastructure`,`price_signal`,`regulation`,`transaction`) | |
| title | text not null | |
| description | text | |
| impact | numeric(3,2) | -1..1 expected price impact |
| occurred_at | timestamptz not null | |
| created_at | timestamptz | |

**Indexes**: `index(market_area_id, occurred_at desc)`, `index(type)`.

**Future RLS**: read for all authenticated; writes via service-role.

---

## 22. `property_media`

**Purpose**: Photos, videos, floorplans and 360° tours for a property.

**Fields**

| column | type | notes |
| --- | --- | --- |
| id | uuid PK | |
| property_id | uuid FK → properties on delete cascade | |
| kind | enum(`photo`,`video`,`floorplan`,`tour_360`,`document`) not null | |
| url | text not null | |
| storage_path | text | Supabase Storage key |
| is_cover | boolean not null default false | |
| sort_order | smallint not null default 0 | |
| created_at | timestamptz | |

**Indexes**: `index(property_id, sort_order)`, partial `unique(property_id) where is_cover` to enforce a single cover.

**Future RLS**: agency-scoped via property; owning agent or manager writes. Storage bucket policies mirror this.

---

## 23. `property_price_history`

**Purpose**: Immutable audit of every price point for a property (drives charts and "price drop" opportunities).

**Fields**

| column | type | notes |
| --- | --- | --- |
| id | uuid PK | |
| property_id | uuid FK → properties on delete cascade | |
| price | integer not null | ₪ |
| reason | enum(`initial`,`reduction`,`increase`,`correction`) | |
| changed_by | uuid FK → users on delete set null | |
| recorded_at | timestamptz not null default now() | |

**Indexes**: `index(property_id, recorded_at)`.

**Future RLS**: agency-scoped read; insert-only (append) via trigger when `properties.price` changes; no updates/deletes.

---

## 24. `property_status_history`

**Purpose**: Immutable audit of status transitions for a property (funnel analytics, time-in-stage).

**Fields**

| column | type | notes |
| --- | --- | --- |
| id | uuid PK | |
| property_id | uuid FK → properties on delete cascade | |
| from_status | enum property_status | nullable for first row |
| to_status | enum property_status not null | |
| changed_by | uuid FK → users on delete set null | |
| changed_at | timestamptz not null default now() | |

**Indexes**: `index(property_id, changed_at)`.

**Future RLS**: agency-scoped read; insert-only via trigger on status change.

---

## 25. `audit_logs`

**Purpose**: Cross-cutting security/audit trail of significant actions (who did what, when).

**Fields**

| column | type | notes |
| --- | --- | --- |
| id | uuid PK (bigint identity acceptable for volume) | |
| agency_id | uuid FK → agencies on delete cascade | |
| actor_id | uuid FK → users on delete set null | null = system/service-role |
| action | text not null | e.g. `property.updated`, `document.signed` |
| entity_type | text not null | table/entity name |
| entity_id | uuid | affected row |
| metadata | jsonb | before/after diff, request context |
| created_at | timestamptz not null default now() | |

**Indexes**: `index(agency_id, created_at desc)`, `index(entity_type, entity_id)`, `index(actor_id)`.

**Future RLS**: `owner`/`manager` read within agency; append-only, no updates/deletes; all inserts via service-role.

---

## Cross-cutting notes

- **Updated-at trigger**: one shared `set_updated_at()` trigger applied to every table with `updated_at`.
- **History triggers**: `properties` price/status changes fan out to `property_price_history` / `property_status_history`.
- **Enums**: define Postgres enum types once; keep them in lock-step with the TS unions in `src/types`.
- **RLS rollout**: enable RLS on every table; the canonical policy is "row's `agency_id` ∈ the caller's agencies". Layer role checks (`owner`/`manager`/`agent`) on top. Engine/ingestion writes use the service-role key (bypasses RLS) from trusted server code only.
- **Generated types**: after migrating, regenerate `src/lib/supabase/types.ts` so the typed client matches this schema.

