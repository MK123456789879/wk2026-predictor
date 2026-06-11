# Pin-beveiliging

De site is niet openbaar: bezoekers moeten eerst een pin invoeren. Zonder pin is niets zichtbaar (pagina’s, API’s, CSV).

## Instellen

In `.env.local` (lokaal) en op Vercel als Environment Variable:

```
WEB_PIN=jouwpin
```

Staat `WEB_PIN` niet ingesteld, dan is er geen blokkade (handig voor lokaal ontwikkelen).

## Hoe het werkt

1. Bezoeker opent de URL → redirect naar `/pin`
2. Pin wordt gecontroleerd via `POST /api/pin`
3. Bij juiste pin: httpOnly cookie (`web_pin_auth`, 30 dagen)
4. Daarna toegang tot de hele app

## Bestanden

| Bestand | Rol |
|---------|-----|
| `middleware.js` | Blokkeert verkeer zonder geldige cookie |
| `app/pin/page.jsx` | Pin-invoerscherm |
| `app/api/pin/route.js` | Pin controleren en cookie zetten |
| `lib/pin-auth.js` | Gedeelde token-hash (pin → cookie-waarde) |

## Niet vindbaar in Google

In `app/layout.jsx` staat `robots: { index: false, follow: false }` — zoekmachines indexeren de site niet.
