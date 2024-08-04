# Legal Pal

## Structure

```
├── app
│   ├── src
│   │   ├── lib
│   │   │   └── trpc
│   │   │       ├── routers (api modules)
│   │   │       │   └── auth.ts 
│   │   └── routes (user facing routes)
│   │       ├── app
│   │       ├── login
│   │       ├── register
│   │       └── site
├── schemas
│   ├── db.ts (database generated introspection)
│   ├── input.ts (trpc input also shared with temporal activities and workflows)
│   ├── migrations
└── workflows (so far nodejs based workers)   
    ├── src    
    │   ├── default (default worker related code)
    │   │   ├── activities.ts
    │   │   └── workflows.ts
    │   └── default-worker.ts (worker init)
```