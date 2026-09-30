// Java: @Entity public class Booking { private Long id; private LocalDate checkIn; ... }
//
// Notera: Java skiljer på LocalDate (bara datum) och LocalDateTime. TS/JS har
// bara ett enda Date-objekt för bådadera - du får själv hålla koll på om
// du menar bara datum eller datum+tid.
export class Booking {
  constructor(
    public id: number | null,
    public checkIn: Date,
    public checkOut: Date,
    public customerId: number,
    public roomId: number
  ) {}
}
