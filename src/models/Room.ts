import { RoomTypeUnion } from "./RoomType.js";

/**
 * Jämför med din Java-klass:
 *
 *   @Entity
 *   public class Room {
 *       @Id @GeneratedValue private Long id;
 *       private String name;
 *       private RoomType roomType;
 *       private int extraBeds;
 *       public int getMaxCapacity() { ... }
 *   }
 *
 * - `@Entity`, `@Id`, `@GeneratedValue`: annoteringar som Spring/Hibernate
 *   läser via reflection vid uppstart, för att bygga en databastabell och
 *   mappa rader ↔ objekt. Vanlig TS/React har ingen sådan mekanism inbyggd -
 *   TS-klasser är "bara" vanliga klasser, inget körs åt dig i bakgrunden.
 *   (Om du vill ha ORM-liknande annoteringar i TS finns t.ex. TypeORM/Prisma,
 *   men det är separata bibliotek, inte språkfunktioner.)
 *
 * - Lombok @Data: genererar getters/setters/constructor/equals/hashCode åt
 *   dig vid kompilering. TS har ingen Lombok, men språket har en inbyggd
 *   genväg som gör nästan samma sak: "parameter properties" i konstruktorn
 *   nedan (`public id`, `public name`, ...) skapar OCH tilldelar fälten
 *   automatiskt - du slipper skriva `this.id = id` för varje fält.
 */
export class Room {
  constructor(
    public id: number | null,
    public name: string,
    public roomType: RoomTypeUnion,
    public extraBeds: number = 0
  ) {}

  // Java: public int getMaxCapacity() { ... } - en beräknad getter, inget
  // fält bakom sig. I TS/JS kan du skriva en riktig "get accessor": den
  // anropas som en vanlig property (room.maxCapacity), INTE som en metod
  // (room.maxCapacity() skulle vara fel här).
  get maxCapacity(): number {
    const base = this.roomType === "SINGLE" ? 1 : 2;
    return base + this.extraBeds;
  }

  /* Så hade det sett ut helt utan genvägen (= din Java-kod utan Lombok):

  private _name: string;

  getName(): string {
    return this._name;
  }

  setName(value: string): void {
    this._name = value;
  }
  */
}
