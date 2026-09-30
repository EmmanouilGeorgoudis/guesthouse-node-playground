# Guesthouse booking – Node/Express playground

Samma domän som `guesthouse-ts-playground`, men som en riktig HTTP-backend
(Express) istället för en React-frontend. Jämför de två projekten sida vid
sida – det är den mest lärorika biten.

## Vad som är identiskt mot React-varianten

`src/models/`, `src/dtos/`, `src/services/` – **rakt kopierade, orörda**.
Det är hela poängen: ren TS-domänlogik (klasser, interfaces, business rules)
bryr sig inte om vem som anropar den. Samma sak gäller i Java – din
`BookingServiceImpl` skulle fungera oavsett om den anropades från en
`@RestController` eller ett CLI-verktyg.

## Vad som är nytt/annorlunda

| | React-varianten | Node-varianten |
|---|---|---|
| "Entrypoint" | `main.tsx` (monterar UI i webbläsaren) | `server.ts` (startar en HTTP-server) |
| Vad som "anropar" servicen | knapptryck i UI:t (`onClick`) | HTTP-requests (`router.post(...)`) |
| Byggverktyg | Vite | `tsx` (dev) / `tsc` (build) – inget bundlande behövs för en backend |
| tsconfig `lib`/`jsx` | `DOM`, `jsx: react-jsx` | inget av det – Node har varken DOM eller JSX |
| Java-motsvarighet till hela lagret | `@Controller`/UI-vy | `@RestController` |

## Kommentar om namnet "tsx"

Notera att `npm run dev` kör paketet **`tsx`** ("TypeScript execute") – ett
körverktyg som låter dig köra `.ts`-filer direkt utan att förkompilera. Det
har **inget** med filändelsen `.tsx` (React-komponenter) att göra – olyckligt
namnkrock, men två helt separata saker.

## Java-jämförelse: routing

```java
@RestController
@RequestMapping("/api/bookings")
public class BookingApiController {
    @GetMapping
    public List<BookingDTO> getAll() { ... }

    @PostMapping
    public ResponseEntity<BookingDTO> create(@RequestBody @Valid BookingDTO dto) { ... }
}
```

```ts
// bookingRoutes.ts
router.get("/", (_req, res) => { res.json(bookingService.getAllBookings()); });
router.post("/", (req, res) => { /* req.body istf @RequestBody */ });
```

Ingen reflection, inga annoteringar som scannas vid uppstart – routingen
*är* koden som körs, i den ordning den står skriven.

## Köra det

```bash
npm install
npm run dev
```

Testa i en annan terminal (eller webbläsaren för GET):

```bash
curl http://localhost:8081/api/bookings

curl -X POST http://localhost:8081/api/bookings \
  -H "Content-Type: application/json" \
  -d '{"checkIn":"2027-03-01","checkOut":"2027-03-05","customerId":1,"roomId":1}'
```
