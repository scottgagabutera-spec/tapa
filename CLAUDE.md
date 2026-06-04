@AGENTS.md


---

## Bug Prevention Rules
*(Added Jun 4, 2026 — learned from production bugs)*

### URL Param State Initialization
Any page that reads URL params on load MUST initialize state from those params — never default to false or empty when params are present.

**Wrong:**
```ts
const [searched, setSearched] = useState(false);
```

**Correct:**
```ts
const [searched, setSearched] = useState(!!(searchParams.get("from") || searchParams.get("to")));
```

This applies to any boolean or derived state that controls rendering based on URL params. If you skip this, results will show on mobile (which triggers re-renders differently) but not on desktop.

### Mobile First Verification
Before every merge, open DevTools → toggle device toolbar → Samsung Galaxy A51 (412px). Every screen must look premium at this size. If it looks like a stacked form, it fails Mobile First.

### Statement Filter — apply to every single decision
Every change must pass ALL nine statements:
Mobile First. User Friendly. Modern. Premium. Giants Way. Long Term. Consistent. Very Logical. Unique.

Not some. All. If even one fails, do not merge.

### Consistency Check
Before adding any UI pattern (search bar, input field, card, button), grep the codebase for existing implementations of that pattern first. Never build the same thing twice with different styles.
```bash
grep -rn "AirportInput\|AirportField\|search.*form" app/ | grep -v ".next"
```
