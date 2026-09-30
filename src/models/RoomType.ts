// Java: public enum RoomType { SINGLE, DOUBLE }
//
// TS enums fungerar liknande, men kompileras (som standard) ner till ett
// vanligt JS-objekt med dubbelriktad mappning. Många TS-utvecklare undviker
// enum till förmån för en "union type" istället, se kommentar längst ner.
export enum RoomType {
  SINGLE = "SINGLE",
  DOUBLE = "DOUBLE",
}

// Alternativ, mer "TS-idiomatisk" variant (ingen runtime-representation alls,
// existerar bara vid kompilering - jämför med hur interfaces fungerar):
//
// export type RoomTypeUnion = "SINGLE" | "DOUBLE";
