import { Router } from "express";
import type { BookingService } from "../services/BookingService";

/**
 * Jämför med din Java-controller:
 *
 *   @RestController
 *   @RequestMapping("/api/bookings")
 *   public class BookingApiController {
 *       @Autowired private BookingService bookingService;
 *
 *       @GetMapping
 *       public List<BookingDTO> getAll() { ... }
 *
 *       @PostMapping
 *       public ResponseEntity<BookingDTO> create(@RequestBody @Valid BookingDTO dto) { ... }
 *   }
 *
 * Express har inga annoteringar/decorators för routing - du registrerar
 * routes genom att anropa metoder på ett Router-objekt direkt i kod.
 * Ingen reflection, ingen component-scanning: det som står här är exakt
 * det som körs, i den ordning det står.
 *
 * - `@RequestMapping("/api/bookings")`  → `Router()` monteras på "/api/bookings" i server.ts
 * - `@GetMapping` / `@PostMapping`      → `router.get(...)` / `router.post(...)`
 * - `@RequestBody`                      → `req.body` (kräver `express.json()`-middleware, se server.ts)
 * - `@PathVariable Long id`             → `req.params.id` (OBS: alltid en STRING, du måste själv göra Number(...))
 * - `ResponseEntity<T>` med statuskod    → `res.status(201).json(dto)`
 * - `@Valid` (Bean Validation)          → inget inbyggt - se den manuella valideringen nedan.
 *   I ett riktigt projekt hade du använt ett bibliotek som Zod här.
 */
export function createBookingRouter(bookingService: BookingService): Router {
  const router = Router();

  router.get("/", (_req, res) => {
    res.json(bookingService.getAllBookings());
  });

  router.post("/", (req, res) => {
    const { checkIn, checkOut, customerId, roomId } = req.body ?? {};

    // Manuell "validering" - jämför med vad @NotNull/@Valid gjorde automatiskt i Java.
    if (!checkIn || !checkOut || customerId == null || roomId == null) {
      return res.status(400).json({ error: "checkIn, checkOut, customerId and roomId are required" });
    }

    try {
      const created = bookingService.save({ checkIn, checkOut, customerId, roomId });
      res.status(201).json(created);
    } catch (e) {
      // Java: @ExceptionHandler eller en global @ControllerAdvice hade fångat
      // detta och byggt ett ResponseEntity<?> med rätt statuskod centralt.
      // Express har ingen sådan mekanism inbyggd - du hanterar det själv,
      // per route (eller skriver egen error-handling middleware, se server.ts).
      res.status(409).json({ error: (e as Error).message });
    }
  });

  router.get("/available-rooms", (req, res) => {
    const checkIn = new Date(String(req.query.checkIn));
    const checkOut = new Date(String(req.query.checkOut));
    res.json(bookingService.getAvailableRooms(checkIn, checkOut));
  });

  return router;
}
