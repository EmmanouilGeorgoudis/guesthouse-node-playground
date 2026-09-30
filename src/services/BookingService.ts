// OBS: den här filen är IDENTISK med versionen i React-playgrounden.
// Det är poängen - ren domänlogik/affärsregler (en "service" i Java-mening)
// bryr sig inte om vem som anropar den. Samma sak gäller för Room.ts,
// Booking.ts, BookingDTO.ts och CustomerServiceClient.ts i det här projektet.
import { Booking } from "../models/Booking";
import { Room } from "../models/Room";
import type { BookingDTO } from "../dtos/BookingDTO";
import type { CustomerServiceClient } from "./CustomerServiceClient";

/**
 * Jämför med din @Service-annoterade BookingServiceImpl i Java:
 *
 * - I Spring Boot instansieras denna klass ÅT DIG av ramverket. Spring
 *   scannar classpath efter @Service/@Component, bygger en dependency-graf,
 *   och "injicerar" BookingRepository/CustomerServiceClient automatiskt
 *   (@Autowired eller constructor injection) - du skriver aldrig
 *   `new BookingServiceImpl(...)` själv.
 *
 * - Vanlig React/Vite har INGEN inbyggd DI-container. Du instansierar
 *   klassen helt manuellt (se App.tsx: `new BookingService(rooms, ...)`).
 *   Om du vill ha "riktig" DI med decorators i TS-världen, det är dit
 *   NestJS (backend) eller Angular (frontend) kommer in - de har
 *   @Injectable(), @Controller() osv. som fungerar konceptuellt som
 *   Spring Boots annoteringar. Vanlig React löser liknande behov via
 *   Context + hooks istället för en DI-container.
 *
 * - Ingen databas här (det är ett playground) - `bookings` är bara en array
 *   i minnet, ungefär som om din BookingRepository vore en ArrayList istället
 *   för en riktig JPA-repository mot MySQL.
 */
export class BookingService {
  private bookings: Booking[] = [];
  private nextId = 1;

  constructor(
    private rooms: Room[],
    private customerServiceClient: CustomerServiceClient
  ) {}

  getAllBookings(): BookingDTO[] {
    return this.bookings.map(this.toDto);
  }

  // Java: public BookingDTO save(BookingDTO dto) { ... throw new RuntimeException(...) ... }
  // TS: `throw new Error(...)` är närmsta motsvarighet till en unchecked
  // RuntimeException - TS/JS har inga "checked exceptions" alls, till
  // skillnad från Java där du kan tvinga anroparen att hantera ett fel.
  save(dto: Omit<BookingDTO, "id">): BookingDTO {
    if (!this.customerServiceClient.customerExists(dto.customerId)) {
      throw new Error(`Customer ${dto.customerId} does not exist`);
    }

    const checkIn = new Date(dto.checkIn);
    const checkOut = new Date(dto.checkOut);

    const hasConflict = this.bookings.some(
      (b) =>
        b.roomId === dto.roomId && checkIn < b.checkOut && checkOut > b.checkIn
    );
    if (hasConflict) {
      throw new Error("Room already booked for those dates");
    }

    const booking = new Booking(
      this.nextId++,
      checkIn,
      checkOut,
      dto.customerId,
      dto.roomId
    );
    this.bookings.push(booking);
    return this.toDto(booking);
  }

  getAvailableRooms(checkIn: Date, checkOut: Date): Room[] {
    const bookedRoomIds = new Set(
      this.bookings
        .filter((b) => checkIn < b.checkOut && checkOut > b.checkIn)
        .map((b) => b.roomId)
    );
    return this.rooms.filter((r) => r.id !== null && !bookedRoomIds.has(r.id));
  }

  // Arrow function som klassfält (inte en vanlig metod) - en TS/JS-specifik
  // knep för att `this` alltid ska peka på rätt instans även om metoden
  // "lossnar" från objektet (t.ex. skickas som callback till .map()).
  // Java har inget motsvarande problem eftersom `this` alltid är bundet.
  private toDto = (b: Booking): BookingDTO => ({
    id: b.id,
    checkIn: b.checkIn.toISOString().slice(0, 10),
    checkOut: b.checkOut.toISOString().slice(0, 10),
    customerId: b.customerId,
    roomId: b.roomId,
  });
}
