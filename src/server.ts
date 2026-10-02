import express from "express";
import { Room } from "./models/Room.js";
import { BookingService } from "./services/BookingService.js";
import { FakeCustomerServiceClient } from "./services/CustomerServiceClient.js";
import { createBookingRouter } from "./routes/bookingRoutes.js";

/**
 * Jämför med:
 *
 *   @SpringBootApplication
 *   public class GuesthouseBookingSystemApplication {
 *       public static void main(String[] args) {
 *           SpringApplication.run(GuesthouseBookingSystemApplication.class, args);
 *       }
 *   }
 *
 * - `SpringApplication.run(...)` bygger en hel application context åt dig:
 *   scannar @Component/@Service/@RestController, kopplar ihop dem, startar
 *   en inbäddad Tomcat-server. Väldigt mycket "magi" bakom en enda rad.
 *
 * - Express gör INGET av det automatiskt. Allt nedan - att skapa appen,
 *   koppla in middleware, skapa dina services manuellt, montera routes,
 *   och starta servern på en port - är sådant DU gör explicit, rad för rad.
 *   Mer att skriva, men inget "svart låda"-beteende att hålla koll på.
 */

const app = express();
app.use(express.json()); // krävs för att req.body ska fyllas i vid POST/PUT - Spring gör detta åt dig

// Manuell "wiring" - jämför med Spring DI-containern som byggde upp
// samma graf av beroenden åt dig via @Autowired/component-scanning.
const rooms = [
  new Room(1, "101", "SINGLE"),
  new Room(2, "102", "DOUBLE", 1),
];
const bookingService = new BookingService(rooms, new FakeCustomerServiceClient([1, 42]));

// server.port=${PORT:8081} i application.properties → samma mönster i Node,
// fast som ren JS: läs från process.env, med en fallback.
const port = Number(process.env.PORT ?? 8081);

app.get("/", (_req, res) => {
  res.send("Guesthouse booking API (Node/Express) is running");
});

app.use("/api/bookings", createBookingRouter(bookingService));

app.listen(port, () => {
  console.log(`Server listening on http://localhost:${port}`);
});
