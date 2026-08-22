import type { Medicine, PharmacyStore } from '../types';

export const MEDICINE_CATALOG: Medicine[] = [
  {
    id: "med_1",
    brandName: "Augmentin 625 Duo",
    activeFormula: "Amoxicillin (500mg) + Potassium Clavulanate (125mg)",
    dosageForm: "Tablet (Strip of 10)",
    brandPrice: 204.00,
    genericEquivalent: {
      name: "Generic Amoxyclav 625",
      price: 55.00,
      savingsPercent: 73
    },
    popular: true,
    category: "Antibiotic",
    prescribedFor: "Bacterial infections, ENT, Respiratory tract"
  },
  {
    id: "med_2",
    brandName: "Crocin 650",
    activeFormula: "Paracetamol (650mg)",
    dosageForm: "Tablet (Strip of 15)",
    brandPrice: 32.00,
    genericEquivalent: {
      name: "Generic Paracetamol / Dolo 650",
      price: 14.00,
      savingsPercent: 56
    },
    popular: true,
    category: "Analgesic & Antipyretic",
    prescribedFor: "Fever, Mild-to-moderate body pain, Headache"
  },
  {
    id: "med_3",
    brandName: "Azithral 500",
    activeFormula: "Azithromycin (500mg)",
    dosageForm: "Tablet (Strip of 5)",
    brandPrice: 132.00,
    genericEquivalent: {
      name: "Generic Azithromycin 500",
      price: 42.00,
      savingsPercent: 68
    },
    popular: true,
    category: "Macrolide Antibiotic",
    prescribedFor: "Throat infection, Bronchitis, Sinusitis"
  },
  {
    id: "med_4",
    brandName: "Pan D Capsule",
    activeFormula: "Pantoprazole (40mg) + Domperidone (30mg)",
    dosageForm: "Capsule (Strip of 15)",
    brandPrice: 198.00,
    genericEquivalent: {
      name: "Generic Pantop-D / Pan-Safe D",
      price: 48.00,
      savingsPercent: 75
    },
    popular: false,
    category: "Antacid & Anti-reflux",
    prescribedFor: "Acidity, GERD, Heartburn, Gastric reflux"
  },
  {
    id: "med_5",
    brandName: "Telma 40",
    activeFormula: "Telmisartan (40mg)",
    dosageForm: "Tablet (Strip of 30)",
    brandPrice: 220.00,
    genericEquivalent: {
      name: "Generic Telmisartan 40",
      price: 60.00,
      savingsPercent: 72
    },
    popular: false,
    category: "Cardiovascular / Antihypertensive",
    prescribedFor: "Hypertension / Blood Pressure Management"
  }
];

export const PRIMARY_STORE: PharmacyStore = {
  id: "store_104",
  name: "Apollo Chemist",
  branchNumber: "Store #104",
  distance: "800m away",
  distanceKm: 0.8,
  address: "Shop 12, Sunrise Complex, Main Market Road",
  rating: 4.8,
  reviewCount: 420,
  phone: "+91 98201-44589",
  status: "ONLINE",
  verifiedBadge: true
};

export const NEARBY_STORES_3KM: PharmacyStore[] = [
  PRIMARY_STORE,
  {
    id: "store_108",
    name: "MedPlus Pharmacy",
    branchNumber: "Store #108",
    distance: "1.2 km away",
    distanceKm: 1.2,
    address: "Block B, Green Avenue",
    rating: 4.6,
    reviewCount: 290,
    phone: "+91 98202-33211",
    status: "ONLINE",
    verifiedBadge: true
  },
  {
    id: "store_112",
    name: "Care Point Chemist",
    branchNumber: "Store #112",
    distance: "2.1 km away",
    distanceKm: 2.1,
    address: "Crossroad Junction, Sector 4",
    rating: 4.5,
    reviewCount: 155,
    phone: "+91 98204-77110",
    status: "ONLINE",
    verifiedBadge: true
  }
];

export const EXPANDED_STORES_8KM: PharmacyStore[] = [
  ...NEARBY_STORES_3KM,
  {
    id: "store_120",
    name: "Wellness Forever Superstore",
    branchNumber: "Store #120",
    distance: "3.8 km away",
    distanceKm: 3.8,
    address: "Metro Station Plaza, Pillar 42",
    rating: 4.9,
    reviewCount: 910,
    phone: "+91 98206-88990",
    status: "ONLINE",
    verifiedBadge: true
  },
  {
    id: "store_124",
    name: "Guardian Life Pharmacy",
    branchNumber: "Store #124",
    distance: "4.5 km away",
    distanceKm: 4.5,
    address: "City Central Mall, Lower Ground",
    rating: 4.7,
    reviewCount: 310,
    phone: "+91 98208-11223",
    status: "ONLINE",
    verifiedBadge: true
  },
  {
    id: "store_130",
    name: "Sanjivani 24x7 Meds",
    branchNumber: "Store #130",
    distance: "5.4 km away",
    distanceKm: 5.4,
    address: "Near Civil Hospital Gate 2",
    rating: 4.4,
    reviewCount: 680,
    phone: "+91 98209-55667",
    status: "ONLINE",
    verifiedBadge: true
  }
];
