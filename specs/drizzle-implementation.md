# Drizzle ORM Implementation Specification

## Overview

Implementation plan for adding PostgreSQL database with Drizzle ORM to DevRoast for persistent storage of code submissions, roast results, and leaderboard data.

## Technology Stack

- **Database**: PostgreSQL (via Docker Compose)
- **ORM**: Drizzle ORM
- **Migration**: Drizzle Kit
- **Environment**: Node.js with Next.js 16

---

## Database Schema

### Enums

```typescript
// Roast mode enum
export const roastModeEnum = pgEnum('roast_mode', ['helpful', 'sarcastic']);

// Programming language enum (common languages, can be extended)
export const languageEnum = pgEnum('language', [
  'javascript',
  'typescript',
  'python',
  'java',
  'csharp',
  'cpp',
  'go',
  'rust',
  'ruby',
  'php',
  'swift',
  'kotlin',
  'sql',
  'html',
  'css',
  'json',
  'yaml',
  'markdown',
  'bash',
  'other'
]);
```

---

### Tables

#### 1. `submissions`

Stores code submissions from users.

| Column | Type | Description |
|--------|------|-------------|
| `id` | `uuid` | Primary key |
| `code` | `text` | Submitted code content |
| `language` | `languageEnum` | Detected or selected language |
| `roast_mode` | `roastModeEnum` | Mode used for roasting |
| `created_at` | `timestamp` | Submission timestamp |

```typescript
export const submissions = pgTable('submissions', {
  id: uuid('id').defaultRandom().primaryKey(),
  code: text('code').notNull(),
  language: languageEnum('language').default('other'),
  roastMode: roastModeEnum('roast_mode').default('sarcastic'),
  createdAt: timestamp('created_at').defaultNow().notNull(),
});
```

#### 2. `roasts`

Stores roast feedback for each submission.

| Column | Type | Description |
|--------|------|-------------|
| `id` | `uuid` | Primary key |
| `submission_id` | `uuid` | Foreign key to submissions |
| `roast_content` | `text` | The actual roast feedback |
| `score` | `integer` | Shame score (0-100, higher = worse) |
| `roast_mode` | `roastModeEnum` | Mode used for this roast |
| `created_at` | `timestamp` | Roast generation timestamp |

```typescript
export const roasts = pgTable('roasts', {
  id: uuid('id').defaultRandom().primaryKey(),
  submissionId: uuid('submission_id')
    .references(() => submissions.id, { onDelete: 'cascade' })
    .notNull(),
  roastContent: text('roast_content').notNull(),
  score: integer('score').notNull(),
  roastMode: roastModeEnum('roast_mode').default('sarcastic'),
  createdAt: timestamp('created_at').defaultNow().notNull(),
});
```

#### 3. `leaderboard` (View)

A view to query top submissions by shame score (highest first).

```sql
CREATE VIEW leaderboard AS
SELECT 
  s.id,
  s.code,
  s.language,
  s.created_at,
  r.roast_content,
  r.score,
  r.roast_mode
FROM submissions s
JOIN roasts r ON s.id = r.submission_id
ORDER BY r.score DESC;
```

---

## Docker Compose Configuration

```yaml
version: '3.8'

services:
  postgres:
    image: postgres:16-alpine
    container_name: devroast-db
    environment:
      POSTGRES_USER: devroast
      POSTGRES_PASSWORD: devroast_password
      POSTGRES_DB: devroast
    ports:
      - "5432:5432"
    volumes:
      - postgres_data:/var/lib/postgresql/data
    healthcheck:
      test: ["CMD-SHELL", "pg_isready -U devroast"]
      interval: 5s
      timeout: 5s
      retries: 5

volumes:
  postgres_data:
```

---

## Project Structure

```
src/
├── db/
│   ├── index.ts          # Database connection
│   ├── schema.ts         # All table definitions
│   ├── migrations/       # Drizzle migrations
│   └── seed.ts           # Optional seed data
├── lib/
│   └── db.ts             # Database utility functions
```

---

## Environment Variables

```env
# .env.local
DATABASE_URL=postgresql://devroast:devroast_password@localhost:5432/devroast
```

---

## Implementation TODO

### Phase 1: Setup

- [ ] Install Drizzle dependencies
  ```bash
  npm install drizzle-orm
  npm install -D drizzle-kit
  ```
- [ ] Create `docker-compose.yml` for PostgreSQL
- [ ] Create `.env` with `DATABASE_URL`
- [ ] Create `src/db/schema.ts` with table definitions
- [ ] Create `src/db/index.ts` for database connection

### Phase 2: Database Operations

- [ ] Run initial migration
  ```bash
  npx drizzle-kit push
  ```
- [ ] Create CRUD functions in `src/lib/db.ts`:
  - `createSubmission(code, language, roastMode)`
  - `createRoast(submissionId, content, score, mode)`
  - `getSubmissionById(id)`
  - `getRoastBySubmissionId(submissionId)`
  - `getLeaderboard(limit)`

### Phase 3: API Integration

- [ ] Create API route: `POST /api/submit` - Submit code for roasting
- [ ] Create API route: `GET /api/roast/[id]` - Get roast result
- [ ] Create API route: `GET /api/leaderboard` - Get leaderboard entries

### Phase 4: UI Integration

- [ ] Update home page to store submissions in DB
- [ ] Update roast results page to fetch from DB
- [ ] Update leaderboard to fetch from DB

### Phase 5: Production

- [ ] Add health check endpoint
- [ ] Configure connection pooling for production
- [ ] Set up proper backup strategy
- [ ] Update deployment docs with database requirements

---

## Queries Reference

### Insert Submission
```typescript
const submission = await db.insert(submissions).values({
  code: 'console.log("hello")',
  language: 'javascript',
  roastMode: 'sarcastic',
}).returning();
```

### Insert Roast
```typescript
const roast = await db.insert(roasts).values({
  submissionId: submission[0].id,
  roastContent: 'This is the worst code I have ever seen...',
  score: 95,
  roastMode: 'sarcastic',
}).returning();
```

### Get Leaderboard
```typescript
const leaderboard = await db
  .select({
    id: submissions.id,
    code: submissions.code,
    language: submissions.language,
    score: roasts.score,
    roastContent: roasts.roastContent,
    createdAt: submissions.createdAt,
  })
  .from(submissions)
  .innerJoin(roasts, eq(roasts.submissionId, submissions.id))
  .orderBy(desc(roasts.score))
  .limit(20);
```

---

## Notes

- All timestamps use UTC timezone
- UUIDs are auto-generated using `genRandomUUID()` or database default
- Scores range from 0 (great code) to 100 (terrible code)
- Leaderboard is public and shows top 20 worst submissions
- No authentication required (anonymous submissions)
