/**
 * Jämför med din Java-klass:
 *
 *   @Data @AllArgsConstructor @NoArgsConstructor
 *   public class BookingDTO {
 *       private Long id;
 *       @NotNull private LocalDate checkIn;
 *       ...
 *   }
 *
 * STÖRSTA SKILLNADEN mellan Java och TS här:
 *
 * - I Java är BookingDTO en riktig klass som finns kvar i den kompilerade
 *   bytekoden. Du kan göra `new BookingDTO()`, `obj instanceof BookingDTO`,
 *   och Jackson (JSON-biblioteket) använder reflection för att bygga objekt
 *   av rätt klass.
 *
 * - I TS är ett `interface` BARA ett kompileringstids-kontrakt. Det raderas
 *   helt när koden kompileras till JS ("type erasure") - det finns inget
 *   `instanceof BookingDTO` i TS, för klassen existerar inte i runtime.
 *
 * - TS använder "structural typing" (även kallat "duck typing"): vilket
 *   objekt som helst som RÅKAR ha exakt dessa fält räknas automatiskt som
 *   en giltig BookingDTO - du behöver aldrig skriva "implements BookingDTO"
 *   explicit (till skillnad från Javas nominal typing, där en klass måste
 *   uttryckligen deklarera vilka interface den implementerar).
 *
 * - `@NotNull` (Bean Validation) motsvaras inte av något i vanlig TS - TS
 *   type-checkar bara vid kompilering, inte vid runtime. Om du vill validera
 *   faktisk inkommande data (t.ex. ett API-svar) behöver du ett separat
 *   bibliotek som Zod eller Yup, som gör runtime-validering.
 */
export interface BookingDTO {
  id: number | null;
  checkIn: string; // ISO-datumsträng, precis som JSON:en Jackson skickar från din Java-backend
  checkOut: string;
  customerId: number;
  roomId: number;
}
