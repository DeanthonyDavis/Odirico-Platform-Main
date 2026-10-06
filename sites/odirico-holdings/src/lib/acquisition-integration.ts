/** Future private-system contract. Never expose records through a public route. */
export type AcquisitionStage =
  | "opportunity"
  | "initial-screening"
  | "financial-evaluation"
  | "due-diligence"
  | "transaction-documentation"
  | "closing";
export interface AcquisitionIntakeEvent {
  opportunityId: string;
  receivedAt: string;
  stage: AcquisitionStage;
}
export interface PrivateAcquisitionAdapter {
  receive(event: AcquisitionIntakeEvent): Promise<void>;
}
// Intentionally no implementation, persistence, credentials, or automatic data forwarding.
// Add a reviewed server-only adapter once authentication, retention, and access rules exist.
