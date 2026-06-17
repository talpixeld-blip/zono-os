# Services layer

This folder is the **data-access boundary** for ZONO. Components and pages call
services — never the mock data or the Supabase client directly. That way, when
the database goes live we swap the implementation here and nothing upstream
changes.

Today each service returns mock data from `src/data`. The function signatures
are already async so the swap to Supabase queries is non-breaking.

```
component / page  →  service (src/services)  →  data source
                                                ├─ now:   src/data (mock)
                                                └─ later: src/lib/supabase
```

No service performs writes yet — reads only, per the current foundation phase.
