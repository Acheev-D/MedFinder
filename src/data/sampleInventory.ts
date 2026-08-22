import type { InventoryItem, UploadedInventory } from '../types';

export const SAMPLE_INVENTORY_ITEMS: InventoryItem[] = [
  {
    id: 'inv_1',
    medicineName: 'Augmentin 625 Duo',
    genericName: 'Generic Amoxyclav 625',
    saltComposition: 'Amoxicillin (500mg) + Clavulanic Acid (125mg)',
    packSize: '10 Tablets / Strip',
    stockQty: 18,
    unitMrp: 204.00,
    shelfLocation: 'Shelf A-3',
    batchNumber: 'AUG-2026-X8'
  },
  {
    id: 'inv_2',
    medicineName: 'Generic Amoxyclav 625',
    genericName: 'Generic Amoxyclav 625',
    saltComposition: 'Amoxicillin (500mg) + Clavulanic Acid (125mg)',
    packSize: '10 Tablets / Strip',
    stockQty: 34,
    unitMrp: 55.00,
    shelfLocation: 'Shelf A-4 (Generic Bay)',
    batchNumber: 'AMX-2026-B1'
  },
  {
    id: 'inv_3',
    medicineName: 'Crocin 650 Advance',
    genericName: 'Paracetamol 650mg',
    saltComposition: 'Paracetamol / Acetaminophen (650mg)',
    packSize: '15 Tablets / Strip',
    stockQty: 52,
    unitMrp: 33.50,
    shelfLocation: 'Bay 1-C (OTC Row)',
    batchNumber: 'CRC-2026-44'
  },
  {
    id: 'inv_4',
    medicineName: 'Paracetamol 650mg Generic',
    genericName: 'Paracetamol 650mg',
    saltComposition: 'Paracetamol (650mg)',
    packSize: '15 Tablets / Strip',
    stockQty: 80,
    unitMrp: 12.00,
    shelfLocation: 'Bay 1-D (Generic)',
    batchNumber: 'PCM-2026-G9'
  },
  {
    id: 'inv_5',
    medicineName: 'Azithral 500 Tablet',
    genericName: 'Azithromycin 500mg',
    saltComposition: 'Azithromycin (500mg)',
    packSize: '5 Tablets / Strip',
    stockQty: 12,
    unitMrp: 132.00,
    shelfLocation: 'Shelf B-2 (Antibiotics)',
    batchNumber: 'AZT-2026-90'
  },
  {
    id: 'inv_6',
    medicineName: 'Azithromycin 500mg Generic',
    genericName: 'Azithromycin 500mg',
    saltComposition: 'Azithromycin (500mg)',
    packSize: '5 Tablets / Strip',
    stockQty: 25,
    unitMrp: 48.00,
    shelfLocation: 'Shelf B-3 (Generic Antibiotics)',
    batchNumber: 'AZM-2026-02'
  },
  {
    id: 'inv_7',
    medicineName: 'Pan D Capsule',
    genericName: 'Pantoprazole 40mg + Domperidone 30mg SR',
    saltComposition: 'Pantoprazole (40mg) + Domperidone (30mg)',
    packSize: '15 Capsules / Strip',
    stockQty: 29,
    unitMrp: 199.00,
    shelfLocation: 'Drawer C-1 (Gastro)',
    batchNumber: 'PND-2026-11'
  },
  {
    id: 'inv_8',
    medicineName: 'Pantoprazole + Domperidone Generic',
    genericName: 'Pantoprazole 40mg + Domperidone 30mg SR',
    saltComposition: 'Pantoprazole (40mg) + Domperidone (30mg)',
    packSize: '15 Capsules / Strip',
    stockQty: 40,
    unitMrp: 58.00,
    shelfLocation: 'Drawer C-2 (Generic Gastro)',
    batchNumber: 'PNT-2026-77'
  },
  {
    id: 'inv_9',
    medicineName: 'Telma 40 Tablet',
    genericName: 'Telmisartan 40mg',
    saltComposition: 'Telmisartan (40mg)',
    packSize: '30 Tablets / Pack',
    stockQty: 22,
    unitMrp: 225.00,
    shelfLocation: 'Shelf D-4 (Cardio)',
    batchNumber: 'TLM-2026-88'
  },
  {
    id: 'inv_10',
    medicineName: 'Telmisartan 40mg Generic',
    genericName: 'Telmisartan 40mg',
    saltComposition: 'Telmisartan (40mg)',
    packSize: '30 Tablets / Pack',
    stockQty: 38,
    unitMrp: 62.00,
    shelfLocation: 'Shelf D-5 (Generic Cardio)',
    batchNumber: 'TLS-2026-31'
  },
  {
    id: 'inv_11',
    medicineName: 'Montair LC Tablet',
    genericName: 'Montelukast (10mg) + Levocetirizine (5mg)',
    saltComposition: 'Montelukast (10mg) + Levocetirizine (5mg)',
    packSize: '10 Tablets / Strip',
    stockQty: 16,
    unitMrp: 180.00,
    shelfLocation: 'Shelf E-1 (Allergy)',
    batchNumber: 'MNT-2026-55'
  },
  {
    id: 'inv_12',
    medicineName: 'Glycomet 500 SR',
    genericName: 'Metformin 500mg SR',
    saltComposition: 'Metformin Hydrochloride (500mg)',
    packSize: '20 Tablets / Strip',
    stockQty: 45,
    unitMrp: 46.00,
    shelfLocation: 'Shelf F-2 (Diabetic)',
    batchNumber: 'GLY-2026-92'
  }
];

export const DEFAULT_SAMPLE_INVENTORY: UploadedInventory = {
  fileName: 'Apollo_Indiranagar_Live_Stock.xlsx',
  uploadedAt: 'Today, 04:30 PM',
  rowCount: SAMPLE_INVENTORY_ITEMS.length,
  items: SAMPLE_INVENTORY_ITEMS
};
