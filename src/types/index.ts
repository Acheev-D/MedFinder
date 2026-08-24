export interface GenericEquivalent {
  name: string;
  price: number;
  savingsPercent: number;
}

export interface Medicine {
  id: string;
  brandName: string;
  activeFormula: string;
  dosageForm: string;
  brandPrice: number;
  genericEquivalent: GenericEquivalent;
  popular?: boolean;
  category?: string;
  prescribedFor?: string;
}

export type SimulatorStatus =
  | 'IDLE'
  | 'CHECKING_STORES'
  | 'STORE_FOUND'
  | 'RESERVED'
  | 'COMPLETED'
  | 'NO_STORES_FOUND';

export type SearchRadius = '3km' | '8km';

export interface UserProfile {
  phone: string;
  isVerified: boolean;
}

export interface InventoryItem {
  id: string;
  medicineName: string;
  genericName?: string;
  saltComposition: string;
  packSize: string;
  stockQty: number;
  unitMrp: number;
  shelfLocation: string;
  batchNumber: string;
}

export interface UploadedInventory {
  fileName: string;
  uploadedAt: string;
  rowCount: number;
  items: InventoryItem[];
}

export interface ActiveOffer {
  storeId: string;
  pharmacyName: string;
  distance: string;
  address: string;
  phone: string;
  medicineName: string;
  activeFormula: string;
  price: number;
  originalBrandPrice: number;
  isGeneric: boolean;
  savingsAmount: number;
  savingsPercent: number;
  timestamp: string;
  claimedAt: number;
  token?: string;
  prescriptionImage?: string | null;
}

export interface IncomingInquiry {
  id: string;
  patientId: string;
  isCurrentPatient: boolean;
  medicine: Medicine;
  allowAlternatives: boolean; // default false
  distance: string;
  customerLocation: string;
  timerSeconds: number;
  createdAt: number;
  status: 'PENDING' | 'OFFERED' | 'DECLINED' | 'TIMEOUT';
  prescriptionImage?: string | null;
}

export interface HoldReservation {
  id: string;
  token: string; // 4-digit code e.g. "4829"
  medicineName: string;
  activeFormula: string;
  isGeneric: boolean;
  price: number;
  originalBrandPrice: number;
  savingsPercent: number;
  customerPhoneMasked: string;
  savedUntil: string;
  savedUntilTimestamp: number;
  storeName: string;
  storeId: string;
  status: 'HELD' | 'VERIFIED_HANDED_OVER' | 'CANCELLED';
  createdAt: string;
  isCurrentPatient?: boolean;
  prescriptionImage?: string | null;
}

export interface PharmacyStore {
  id: string;
  name: string;
  branchNumber: string;
  distance: string;
  distanceKm: number;
  address: string;
  rating: number;
  reviewCount: number;
  phone: string;
  status: 'ONLINE' | 'BUSY' | 'OFFLINE';
  verifiedBadge: boolean;
}

export interface ActivityLogItem {
  id: string;
  time: string;
  type: 'SEARCH_INIT' | 'STORE_PING' | 'OFFER_CLAIM' | 'HOLD_PLACED' | 'HANDOVER_COMPLETE' | 'HOLD_CANCELLED' | 'RADIUS_EXPANDED' | 'OUT_OF_STOCK';
  title: string;
  description: string;
  badge?: string;
}
