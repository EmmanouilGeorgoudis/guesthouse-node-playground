/**
 * Java: public interface CustomerServiceClient { boolean customerExists(Long id); }
 *
 * Till skillnad från BookingDTO-interfacet, här skriver vi faktiskt
 * `implements CustomerServiceClient` nedan - det är alltså nominal typing,
 * precis som i Java. TS stödjer BÅDA sätten (structural OCH nominal-liknande
 * via explicit `implements`) - det är upp till dig hur strikt du vill vara.
 */
export interface CustomerServiceClient {
  customerExists(customerId: number): boolean;
}

// Handskriven fejk-implementation, ungefär som en @MockitoBean i dina
// Java-integrationstester - fast här skriver du den manuellt istället för
// att ett ramverk (Mockito) genererar en mock åt dig via reflection.
export class FakeCustomerServiceClient implements CustomerServiceClient {
  private readonly knownCustomerIds: Set<number>;

  constructor(knownCustomerIds: number[] = [1, 42]) {
    this.knownCustomerIds = new Set(knownCustomerIds);
  }

  customerExists(customerId: number): boolean {
    return this.knownCustomerIds.has(customerId);
  }
}
