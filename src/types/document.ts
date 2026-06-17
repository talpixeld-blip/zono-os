import type { ISODateString, UUID } from "./common";

/** Category of a document in ZONO. */
export type DocumentType =
  | "exclusivity_agreement" // הסכם בלעדיות
  | "brokerage_agreement" // הסכם תיווך
  | "viewing_confirmation" // אישור צפייה
  | "offer" // הצעת מחיר
  | "sale_contract" // חוזה מכר
  | "rental_contract" // חוזה שכירות
  | "disclosure" // גילוי נאות
  | "id_document"
  | "other";

/** Processing/lifecycle status of a document. */
export type DocumentStatus =
  | "draft"
  | "pending_signature"
  | "signed"
  | "expired"
  | "archived";

/** A stored document, optionally tied to a signature flow. */
export interface Document {
  id: UUID;
  agencyId: UUID;
  agentId: UUID;

  type: DocumentType;
  status: DocumentStatus;

  title: string;
  url?: string;
  /** Storage key in Supabase storage. */
  storagePath?: string;

  /** Linked entities. */
  propertyId?: UUID;
  buyerId?: UUID;
  sellerId?: UUID;
  signatureRequestId?: UUID;

  createdAt: ISODateString;
  updatedAt: ISODateString;
}

/** Status of an individual signer. */
export type SignerStatus = "pending" | "viewed" | "signed" | "declined";

/** One party who must sign a document. */
export interface Signer {
  name: string;
  email?: string;
  phone?: string;
  status: SignerStatus;
  signedAt?: ISODateString;
}

/** An e-signature request wrapping a document. */
export interface SignatureRequest {
  id: UUID;
  agencyId: UUID;
  documentId: UUID;
  signers: Signer[];
  status: "open" | "completed" | "cancelled" | "expired";
  sentAt: ISODateString;
  completedAt?: ISODateString;
}
