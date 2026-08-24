import React, { createContext, useContext, useState, useEffect, useCallback } from 'react';
import type { ReactNode } from 'react';
import confetti from 'canvas-confetti';
import type {
  Medicine,
  SimulatorStatus,
  SearchRadius,
  ActiveOffer,
  HoldReservation,
  IncomingInquiry,
  ActivityLogItem,
  UserProfile,
  UploadedInventory,
  InventoryItem
} from '../types';
import { MEDICINE_CATALOG, PRIMARY_STORE, NEARBY_STORES_3KM, EXPANDED_STORES_8KM } from '../data/medicines';
import { DEFAULT_SAMPLE_INVENTORY, SAMPLE_INVENTORY_ITEMS } from '../data/sampleInventory';
import { sound } from '../utils/audio';
import { TRANSLATIONS } from '../utils/translations';
import type { Language } from '../utils/translations';

export interface VerificationResult {
  success: boolean;
  message: string;
  token?: string;
}

interface SimulatorContextType {
  // Patient Mobile State
  searchQuery: string;
  selectedMedicine: Medicine | null;
  allowAlternatives: boolean; // default: false
  searchRadius: SearchRadius;
  status: SimulatorStatus;
  timerSeconds: number;
  activeOffer: ActiveOffer | null;
  pickupCode: string;
  isDirectionsOpen: boolean;
  savedUntilTimeStr: string;

  // Real Prescription Camera & Upload State
  prescriptionImage: string | null;
  setPrescriptionImage: (image: string | null) => void;
  clearPrescriptionImage: () => void;

  // Language & Translation Support
  language: Language;
  setLanguage: (lang: Language) => void;
  toggleLanguage: () => void;
  t: typeof TRANSLATIONS['en'];

  // Outer Workspace Night Theme State (Isolated to outer canvas)
  isNightMode: boolean;
  setIsNightMode: (night: boolean) => void;
  toggleNightMode: () => void;

  // Intro Splash State (Patient Mobile Frame Only)
  showSplash: boolean;
  setShowSplash: (show: boolean) => void;
  replaySplash: () => void;

  // Just-In-Time Auth State
  userProfile: UserProfile | null;
  isAuthModalOpen: boolean;
  authStep: 'PHONE' | 'OTP';
  phoneInput: string;
  otpInput: string[];
  authError: string;

  // Pharmacist Multi-Request Queues & Panel State
  incomingInquiries: IncomingInquiry[];
  reservations: HoldReservation[];
  verificationFeedback: VerificationResult | null;
  isMuted: boolean;
  activeStoreCount: number;
  availableStores: typeof NEARBY_STORES_3KM;
  activityLogs: ActivityLogItem[];
  isTerminalCollapsed: boolean;

  // Excel / CSV Inventory State
  uploadedInventory: UploadedInventory | null;
  isInventoryDrawerOpen: boolean;

  // Actions
  setSearchQuery: (query: string) => void;
  selectMedicine: (medicine: Medicine | null) => void;
  setAllowAlternatives: (allow: boolean) => void;
  startStoreCheck: () => void;
  expandRadius: () => void;
  pharmacistClaimExact: (inquiryId?: string, customPrice?: number) => void;
  pharmacistClaimGeneric: (inquiryId?: string, customPrice?: number) => void;
  pharmacistDeclineStock: (inquiryId?: string) => void;
  respondToInquiry: (inquiryId: string, choice: 'EXACT' | 'GENERIC' | 'OUT_OF_STOCK', customPrice?: number) => void;
  
  // Auth & Hold Flow Actions
  handleHoldItemClick: () => void;
  handleSendOtp: (e?: React.FormEvent) => void;
  handleVerifyOtp: (e?: React.FormEvent) => void;
  handleAutoFillOtp: () => void;
  setPhoneInput: (phone: string) => void;
  setOtpInput: (otp: string[]) => void;
  closeAuthModal: () => void;
  cancelHold: (token?: string) => void;

  // Inventory & Panel Actions
  setIsTerminalCollapsed: (collapsed: boolean) => void;
  toggleTerminalCollapse: () => void;
  loadSampleInventory: () => void;
  handleFileUpload: (file: File) => void;
  removeUploadedInventory: () => void;
  setIsInventoryDrawerOpen: (open: boolean) => void;
  findInventoryMatch: (medName: string, activeFormula?: string) => InventoryItem | undefined;

  verifyAndHandover: (token: string) => VerificationResult;
  clearVerificationFeedback: () => void;
  resetSimulator: () => void;
  toggleMute: () => void;
  setIsDirectionsOpen: (open: boolean) => void;
  fastForwardTimer: () => void;
}

const SimulatorContext = createContext<SimulatorContextType | undefined>(undefined);

export const SimulatorProvider: React.FC<{ children: ReactNode }> = ({ children }) => {
  const [searchQuery, setSearchQuery] = useState<string>('Augmentin 625 Duo');
  const [selectedMedicine, setSelectedMedicine] = useState<Medicine | null>(MEDICINE_CATALOG[0]);
  const [allowAlternatives, setAllowAlternatives] = useState<boolean>(false); // Default: FALSE
  const [searchRadius, setSearchRadius] = useState<SearchRadius>('3km');
  const [status, setStatus] = useState<SimulatorStatus>('IDLE');
  const [timerSeconds, setTimerSeconds] = useState<number>(60);
  const [activeOffer, setActiveOffer] = useState<ActiveOffer | null>(null);
  const [pickupCode] = useState<string>('4829');

  // Real Prescription Camera & Image Upload State
  const [prescriptionImage, setPrescriptionImage] = useState<string | null>(null);

  // Language state (Default: 'en')
  const [language, setLanguage] = useState<Language>('en');

  // Outer Workspace Theme (Default: false / light mode)
  const [isNightMode, setIsNightMode] = useState<boolean>(false);

  // Intro Splash State (Patient Mobile Scope)
  const [showSplash, setShowSplash] = useState<boolean>(true);

  // Just-In-Time Auth State
  const [userProfile, setUserProfile] = useState<UserProfile | null>(null);
  const [isAuthModalOpen, setIsAuthModalOpen] = useState<boolean>(false);
  const [authStep, setAuthStep] = useState<'PHONE' | 'OTP'>('PHONE');
  const [phoneInput, setPhoneInput] = useState<string>('9876543210');
  const [otpInput, setOtpInput] = useState<string[]>(['', '', '', '']);
  const [authError, setAuthError] = useState<string>('');

  // Pharmacist Panel Collapsible State (Default: expanded false)
  const [isTerminalCollapsed, setIsTerminalCollapsed] = useState<boolean>(false);

  // Excel / CSV Inventory State (Default: pre-loaded sample inventory for immediate delight)
  const [uploadedInventory, setUploadedInventory] = useState<UploadedInventory | null>(DEFAULT_SAMPLE_INVENTORY);
  const [isInventoryDrawerOpen, setIsInventoryDrawerOpen] = useState<boolean>(false);
  
  // Multi-request Queues (Array-based)
  const [incomingInquiries, setIncomingInquiries] = useState<IncomingInquiry[]>([]);
  const [reservations, setReservations] = useState<HoldReservation[]>([]);
  const [verificationFeedback, setVerificationFeedback] = useState<VerificationResult | null>(null);

  const [activityLogs, setActivityLogs] = useState<ActivityLogItem[]>([]);
  const [isMuted, setIsMuted] = useState<boolean>(false);
  const [isDirectionsOpen, setIsDirectionsOpen] = useState<boolean>(false);
  const [savedUntilTimeStr, setSavedUntilTimeStr] = useState<string>('4:15 PM');

  const t = TRANSLATIONS[language];

  const clearPrescriptionImage = useCallback(() => {
    setPrescriptionImage(null);
  }, []);

  const toggleLanguage = useCallback(() => {
    setLanguage(prev => (prev === 'en' ? 'hi' : 'en'));
  }, []);

  const toggleNightMode = useCallback(() => {
    setIsNightMode(prev => !prev);
  }, []);

  const addLog = useCallback((type: ActivityLogItem['type'], title: string, description: string, badge?: string) => {
    const now = new Date();
    const timeStr = now.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit', second: '2-digit' });
    const newLog: ActivityLogItem = {
      id: `log_${Date.now()}_${Math.random().toString(36).substring(2, 6)}`,
      time: timeStr,
      type,
      title,
      description,
      badge
    };
    setActivityLogs(prev => [newLog, ...prev.slice(0, 40)]);
  }, []);

  const updateSavedUntilTime = useCallback(() => {
    const target = new Date(Date.now() + 30 * 60 * 1000);
    const formatted = target.toLocaleTimeString([], { hour: 'numeric', minute: '2-digit', hour12: true });
    setSavedUntilTimeStr(formatted);
    return formatted;
  }, []);

  const availableStores = searchRadius === '3km' ? NEARBY_STORES_3KM : EXPANDED_STORES_8KM;
  const activeStoreCount = availableStores.length;

  const toggleMute = useCallback(() => {
    setIsMuted(prev => {
      const next = !prev;
      sound.setMuted(next);
      return next;
    });
  }, []);

  const toggleTerminalCollapse = useCallback(() => {
    setIsTerminalCollapsed(prev => !prev);
  }, []);

  const replaySplash = useCallback(() => {
    setShowSplash(true);
  }, []);

  // Match finder in uploaded inventory
  const findInventoryMatch = useCallback((medName: string, activeFormula?: string): InventoryItem | undefined => {
    if (!uploadedInventory) return undefined;
    const cleanSearch = medName.toLowerCase().replace(/[^a-z0-9]/g, '');
    
    return uploadedInventory.items.find(item => {
      const cleanItemName = item.medicineName.toLowerCase().replace(/[^a-z0-9]/g, '');
      const cleanGenericName = (item.genericName || '').toLowerCase().replace(/[^a-z0-9]/g, '');
      
      if (cleanItemName.includes(cleanSearch) || cleanSearch.includes(cleanItemName)) return true;
      if (cleanGenericName && (cleanGenericName.includes(cleanSearch) || cleanSearch.includes(cleanGenericName))) return true;
      if (activeFormula && item.saltComposition.toLowerCase().includes(activeFormula.toLowerCase().slice(0, 8))) return true;
      return false;
    });
  }, [uploadedInventory]);

  // Load sample inventory demo
  const loadSampleInventory = useCallback(() => {
    setUploadedInventory(DEFAULT_SAMPLE_INVENTORY);
    addLog(
      'STORE_PING',
      'Inventory Spreadsheet Loaded',
      `Loaded ${SAMPLE_INVENTORY_ITEMS.length} indexed medicine SKUs from Apollo_Indiranagar_Live_Stock.xlsx`,
      `${SAMPLE_INVENTORY_ITEMS.length} SKUs`
    );
  }, [addLog]);

  // Parse uploaded CSV / Spreadsheet file
  const handleFileUpload = useCallback((file: File) => {
    const reader = new FileReader();
    reader.onload = (e) => {
      const text = e.target?.result as string;
      if (!text) return;

      const lines = text.split('\n').map(l => l.trim()).filter(Boolean);
      const parsedItems: InventoryItem[] = [];

      if (lines.length > 1) {
        for (let i = 1; i < lines.length; i++) {
          const cols = lines[i].split(',').map(c => c.trim().replace(/^["']|["']$/g, ''));
          if (cols.length >= 3) {
            parsedItems.push({
              id: `csv_inv_${i}`,
              medicineName: cols[0] || `Medicine ${i}`,
              genericName: cols[1] || '',
              saltComposition: cols[2] || cols[1] || 'Active Formula',
              packSize: cols[3] || '10 Tablets',
              stockQty: parseInt(cols[4] || '20', 10) || 20,
              unitMrp: parseFloat(cols[5] || '100') || 100,
              shelfLocation: cols[6] || `Shelf ${String.fromCharCode(65 + (i % 5))}-${(i % 4) + 1}`,
              batchNumber: cols[7] || `BATCH-2026-${i * 10}`
            });
          }
        }
      }

      const finalItems = parsedItems.length > 0 ? parsedItems : SAMPLE_INVENTORY_ITEMS;
      const uploaded: UploadedInventory = {
        fileName: file.name,
        uploadedAt: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }),
        rowCount: finalItems.length,
        items: finalItems
      };

      setUploadedInventory(uploaded);
      addLog(
        'STORE_PING',
        `Custom Inventory Uploaded: ${file.name}`,
        `Successfully indexed ${finalItems.length} store items and shelf coordinates from uploaded file.`,
        `${finalItems.length} SKUs`
      );
    };

    reader.readAsText(file);
  }, [addLog]);

  const removeUploadedInventory = useCallback(() => {
    setUploadedInventory(null);
    addLog('STORE_PING', 'Inventory Unloaded', 'Offline inventory catalog cleared from terminal.');
  }, [addLog]);

  // Start Store Check (Radar Mode & Broadcast to Inquiries Queue with allowAlternatives flag & prescription image)
  const startStoreCheck = useCallback(() => {
    const medToSearch = selectedMedicine || {
      id: 'med_rx_custom',
      brandName: searchQuery.trim() || (prescriptionImage ? 'Prescription Upload' : 'Prescribed Medicine'),
      activeFormula: 'Active Doctor Prescription',
      dosageForm: 'Prescription Item',
      brandPrice: 150,
      genericEquivalent: {
        name: 'Generic Equivalent Formulation',
        price: 55,
        savingsPercent: 63
      }
    };

    setStatus('CHECKING_STORES');
    setTimerSeconds(60);
    setActiveOffer(null);

    const inquiryId = `inq_${Date.now()}`;
    const newInquiry: IncomingInquiry = {
      id: inquiryId,
      patientId: 'patient_current',
      isCurrentPatient: true,
      medicine: medToSearch,
      allowAlternatives,
      distance: '800m away',
      customerLocation: 'Sunrise Junction (800m)',
      timerSeconds: 60,
      createdAt: Date.now(),
      status: 'PENDING',
      prescriptionImage: prescriptionImage || undefined
    };

    setIncomingInquiries(prev => [newInquiry, ...prev.filter(i => !i.isCurrentPatient)]);

    sound.playInquiryChime();
    addLog(
      'SEARCH_INIT',
      `Reverse-demand inquiry broadcasted${prescriptionImage ? ' (with Photo Rx)' : ''}`,
      `Pinging ${searchRadius === '3km' ? '3' : '6'} pharmacies within ${searchRadius} for ${medToSearch.brandName} (${allowAlternatives ? 'Generic Accepted' : 'Exact Brand Only'})`,
      `${searchRadius} Radius`
    );
  }, [selectedMedicine, searchQuery, prescriptionImage, allowAlternatives, searchRadius, addLog]);

  // Timer countdown during CHECKING_STORES
  useEffect(() => {
    let interval: ReturnType<typeof setInterval>;
    if (status === 'CHECKING_STORES' && timerSeconds > 0) {
      interval = setInterval(() => {
        setTimerSeconds(prev => {
          if (prev <= 1) {
            setStatus('NO_STORES_FOUND');
            setIncomingInquiries(iqs => iqs.map(i => i.isCurrentPatient ? { ...i, status: 'TIMEOUT' } : i));
            addLog('OUT_OF_STOCK', '60s Timeout reached', 'No nearby stores verified stock within response window.');
            return 0;
          }
          return prev - 1;
        });
      }, 1000);
    }
    return () => clearInterval(interval);
  }, [status, timerSeconds, addLog]);

  // Radius expansion
  const expandRadius = useCallback(() => {
    setSearchRadius('8km');
    setStatus('CHECKING_STORES');
    setTimerSeconds(60);
    setActiveOffer(null);

    const medToSearch = selectedMedicine || {
      id: 'med_rx_custom',
      brandName: searchQuery.trim() || (prescriptionImage ? 'Prescription Upload' : 'Prescribed Medicine'),
      activeFormula: 'Active Doctor Prescription',
      dosageForm: 'Prescription Item',
      brandPrice: 150,
      genericEquivalent: {
        name: 'Generic Equivalent Formulation',
        price: 55,
        savingsPercent: 63
      }
    };

    const inquiryId = `inq_${Date.now()}`;
    const newInquiry: IncomingInquiry = {
      id: inquiryId,
      patientId: 'patient_current',
      isCurrentPatient: true,
      medicine: medToSearch,
      allowAlternatives,
      distance: '800m away',
      customerLocation: 'Sunrise Junction (800m)',
      timerSeconds: 60,
      createdAt: Date.now(),
      status: 'PENDING',
      prescriptionImage: prescriptionImage || undefined
    };
    setIncomingInquiries(prev => [newInquiry, ...prev.filter(i => !i.isCurrentPatient)]);

    sound.playInquiryChime();
    addLog(
      'RADIUS_EXPANDED',
      'Search radius expanded to 8 km',
      `Now asking 6 medical stores including 24x7 hubs for ${medToSearch.brandName}`,
      '8km Radius'
    );
  }, [selectedMedicine, searchQuery, prescriptionImage, allowAlternatives, addLog]);

  // Unified Pharmacist Response Handler with Optional Quoted Price
  const respondToInquiry = useCallback((inquiryId: string, choice: 'EXACT' | 'GENERIC' | 'OUT_OF_STOCK', customPrice?: number) => {
    setIncomingInquiries(prev => {
      const target = prev.find(i => i.id === inquiryId) || prev.find(i => i.isCurrentPatient);
      if (!target) return prev;

      const med = target.medicine;

      if (choice === 'EXACT') {
        const quotedPrice = (customPrice && customPrice > 0) ? customPrice : med.brandPrice;
        if (target.isCurrentPatient) {
          const offer: ActiveOffer = {
            storeId: PRIMARY_STORE.id,
            pharmacyName: PRIMARY_STORE.name,
            distance: PRIMARY_STORE.distance,
            address: PRIMARY_STORE.address,
            phone: PRIMARY_STORE.phone,
            medicineName: med.brandName,
            activeFormula: med.activeFormula,
            price: quotedPrice,
            originalBrandPrice: med.brandPrice,
            isGeneric: false,
            savingsAmount: 0,
            savingsPercent: 0,
            timestamp: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }),
            claimedAt: Date.now(),
            prescriptionImage: target.prescriptionImage
          };
          setActiveOffer(offer);
          setStatus('STORE_FOUND');
        }
        sound.playMatchVerified();
        addLog(
          'OFFER_CLAIM',
          `Exact Brand Verified by ${PRIMARY_STORE.name}`,
          `Quoted ₹${quotedPrice.toFixed(2)} for ${med.brandName}`,
          'Exact Brand'
        );
        return prev.filter(i => i.id !== target.id);
      }

      if (choice === 'GENERIC') {
        const generic = med.genericEquivalent;
        const quotedPrice = (customPrice && customPrice > 0) ? customPrice : generic.price;
        const savings = Math.max(0, med.brandPrice - quotedPrice);
        const savingsPercent = Math.round((savings / med.brandPrice) * 100);

        if (target.isCurrentPatient) {
          const offer: ActiveOffer = {
            storeId: PRIMARY_STORE.id,
            pharmacyName: PRIMARY_STORE.name,
            distance: PRIMARY_STORE.distance,
            address: PRIMARY_STORE.address,
            phone: PRIMARY_STORE.phone,
            medicineName: generic.name,
            activeFormula: med.activeFormula,
            price: quotedPrice,
            originalBrandPrice: med.brandPrice,
            isGeneric: true,
            savingsAmount: savings,
            savingsPercent: savingsPercent > 0 ? savingsPercent : generic.savingsPercent,
            timestamp: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }),
            claimedAt: Date.now(),
            prescriptionImage: target.prescriptionImage
          };
          setActiveOffer(offer);
          setStatus('STORE_FOUND');
        }
        sound.playMatchVerified();
        addLog(
          'OFFER_CLAIM',
          `Same Formula Substitute Offered by ${PRIMARY_STORE.name}`,
          `Quoted ₹${quotedPrice.toFixed(2)} for ${generic.name}`,
          `₹${quotedPrice.toFixed(0)} Quoted`
        );
        return prev.filter(i => i.id !== target.id);
      }

      if (choice === 'OUT_OF_STOCK') {
        if (target.isCurrentPatient) {
          setActiveOffer(null);
          setStatus('NO_STORES_FOUND');
        }
        addLog(
          'OUT_OF_STOCK',
          `${PRIMARY_STORE.name} declined inquiry`,
          `Item marked out of stock for ${med.brandName}`,
          'Out of Stock'
        );
        return prev.filter(i => i.id !== target.id);
      }

      return prev;
    });
  }, [addLog]);

  const pharmacistClaimExact = useCallback((inquiryId?: string, customPrice?: number) => {
    const targetId = inquiryId || incomingInquiries.find(i => i.isCurrentPatient)?.id || incomingInquiries[0]?.id;
    if (targetId) {
      respondToInquiry(targetId, 'EXACT', customPrice);
    }
  }, [incomingInquiries, respondToInquiry]);

  const pharmacistClaimGeneric = useCallback((inquiryId?: string, customPrice?: number) => {
    const targetId = inquiryId || incomingInquiries.find(i => i.isCurrentPatient)?.id || incomingInquiries[0]?.id;
    if (targetId) {
      respondToInquiry(targetId, 'GENERIC', customPrice);
    }
  }, [incomingInquiries, respondToInquiry]);

  const pharmacistDeclineStock = useCallback((inquiryId?: string) => {
    const targetId = inquiryId || incomingInquiries.find(i => i.isCurrentPatient)?.id || incomingInquiries[0]?.id;
    if (targetId) {
      respondToInquiry(targetId, 'OUT_OF_STOCK');
    }
  }, [incomingInquiries, respondToInquiry]);

  // Complete Reservation helper
  const completeReservation = useCallback((verifiedPhone: string) => {
    if (!activeOffer) return;
    const formattedTime = updateSavedUntilTime();

    // Format phone nicely: 98765-XXXXX
    const cleanDigits = verifiedPhone.replace(/\D/g, '');
    const prefix5 = cleanDigits.slice(0, 5) || '98765';
    const maskedPhone = `${prefix5}-XXXXX`;

    const newReservation: HoldReservation = {
      id: `res_${Date.now()}`,
      token: pickupCode,
      medicineName: activeOffer.medicineName,
      activeFormula: activeOffer.activeFormula,
      isGeneric: activeOffer.isGeneric,
      price: activeOffer.price,
      originalBrandPrice: activeOffer.originalBrandPrice,
      savingsPercent: activeOffer.savingsPercent,
      customerPhoneMasked: maskedPhone,
      savedUntil: formattedTime,
      savedUntilTimestamp: Date.now() + 30 * 60 * 1000,
      storeName: activeOffer.pharmacyName,
      storeId: activeOffer.storeId,
      status: 'HELD',
      createdAt: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }),
      isCurrentPatient: true,
      prescriptionImage: activeOffer.prescriptionImage
    };

    setReservations(prev => [newReservation, ...prev.filter(r => r.token !== pickupCode)]);
    setStatus('RESERVED');
    sound.playMatchVerified();
    addLog(
      'HOLD_PLACED',
      `Token #${pickupCode} Reserved at Counter`,
      `Customer (${maskedPhone}) placed 30-min hold for ${newReservation.medicineName} (₹${newReservation.price.toFixed(2)})`,
      `Token #${pickupCode}`
    );
  }, [activeOffer, pickupCode, updateSavedUntilTime, addLog]);

  // Triggered when clicking "Hold Item for Me"
  const handleHoldItemClick = useCallback(() => {
    if (userProfile?.isVerified) {
      completeReservation(userProfile.phone);
    } else {
      setAuthStep('PHONE');
      setAuthError('');
      setIsAuthModalOpen(true);
    }
  }, [userProfile, completeReservation]);

  // Step 1: Send OTP
  const handleSendOtp = useCallback((e?: React.FormEvent) => {
    if (e) e.preventDefault();
    const clean = phoneInput.replace(/\D/g, '');
    if (clean.length !== 10) {
      setAuthError(t.enterValidPhone);
      return;
    }
    setAuthError('');
    setAuthStep('OTP');
  }, [phoneInput, t]);

  // Step 2: Verify OTP & Complete Hold
  const handleVerifyOtp = useCallback((e?: React.FormEvent) => {
    if (e) e.preventDefault();
    const enteredOtp = otpInput.join('');

    if (enteredOtp.length === 4) {
      const verifiedUser: UserProfile = { phone: phoneInput, isVerified: true };
      setUserProfile(verifiedUser);
      setIsAuthModalOpen(false);
      completeReservation(phoneInput);
    } else {
      setAuthError(t.enterValidOtp);
    }
  }, [otpInput, phoneInput, completeReservation, t]);

  // Demo helper: Auto-fill OTP 1234
  const handleAutoFillOtp = useCallback(() => {
    setOtpInput(['1', '2', '3', '4']);
    setAuthError('');
  }, []);

  const closeAuthModal = useCallback(() => {
    setIsAuthModalOpen(false);
    setAuthError('');
  }, []);

  // Cancel Hold
  const cancelHold = useCallback((token?: string) => {
    const targetToken = token || pickupCode;
    setReservations(prev => prev.filter(r => r.token !== targetToken));
    if (targetToken === pickupCode) {
      setStatus('IDLE');
      setActiveOffer(null);
    }
    addLog(
      'HOLD_CANCELLED',
      `Hold Token #${targetToken} released`,
      'Customer reservation cancelled. Counter stock freed.',
      'Released'
    );
  }, [pickupCode, addLog]);

  // Strict PIN Verification
  const verifyAndHandover = useCallback((inputToken: string): VerificationResult => {
    const cleanInput = inputToken.trim();

    if (!cleanInput) {
      const result: VerificationResult = {
        success: false,
        message: "Please enter customer's 4-digit token code."
      };
      setVerificationFeedback(result);
      return result;
    }

    const matchedHold = reservations.find(r => r.token === cleanInput && r.status === 'HELD');

    if (!matchedHold) {
      const result: VerificationResult = {
        success: false,
        message: "Invalid Code. Please check customer's token pass."
      };
      setVerificationFeedback(result);
      return result;
    }

    setReservations(prev =>
      prev.map(r => r.id === matchedHold.id ? { ...r, status: 'VERIFIED_HANDED_OVER' } : r)
    );

    if (matchedHold.isCurrentPatient || matchedHold.token === pickupCode) {
      setStatus('COMPLETED');
    }

    sound.playSuccessFanfare();

    try {
      confetti({
        particleCount: 90,
        spread: 70,
        origin: { y: 0.6 }
      });
    } catch {}

    const successResult: VerificationResult = {
      success: true,
      message: `Token #${matchedHold.token} Verified Successfully - Handover Complete`,
      token: matchedHold.token
    };

    setVerificationFeedback(successResult);

    addLog(
      'HANDOVER_COMPLETE',
      `Prescription Verified & Handed Over!`,
      `Token #${matchedHold.token} verified by ${PRIMARY_STORE.name}. Patient transaction completed.`,
      'Completed'
    );

    return successResult;
  }, [reservations, pickupCode, addLog]);

  const clearVerificationFeedback = useCallback(() => {
    setVerificationFeedback(null);
  }, []);

  // Reset entire simulator
  const resetSimulator = useCallback(() => {
    setSearchQuery('Augmentin 625 Duo');
    setSelectedMedicine(MEDICINE_CATALOG[0]);
    setPrescriptionImage(null);
    setAllowAlternatives(false);
    setSearchRadius('3km');
    setStatus('IDLE');
    setTimerSeconds(60);
    setActiveOffer(null);
    setUserProfile(null);
    setIsAuthModalOpen(false);
    setAuthStep('PHONE');
    setPhoneInput('9876543210');
    setOtpInput(['', '', '', '']);
    setAuthError('');
    setIncomingInquiries([]);
    setReservations([]);
    setVerificationFeedback(null);
    setIsDirectionsOpen(false);
    addLog('SEARCH_INIT', 'Simulator Reset', 'All queues, auth states, and verification states reset.');
  }, [addLog]);

  const fastForwardTimer = useCallback(() => {
    setTimerSeconds(5);
  }, []);

  const selectMedicine = useCallback((med: Medicine | null) => {
    setSelectedMedicine(med);
    if (med) {
      setSearchQuery(med.brandName);
    }
  }, []);

  return (
    <SimulatorContext.Provider
      value={{
        searchQuery,
        selectedMedicine,
        allowAlternatives,
        searchRadius,
        status,
        timerSeconds,
        activeOffer,
        pickupCode,
        isDirectionsOpen,
        savedUntilTimeStr,
        prescriptionImage,
        setPrescriptionImage,
        clearPrescriptionImage,
        language,
        setLanguage,
        toggleLanguage,
        t,
        isNightMode,
        setIsNightMode,
        toggleNightMode,
        showSplash,
        setShowSplash,
        replaySplash,
        userProfile,
        isAuthModalOpen,
        authStep,
        phoneInput,
        otpInput,
        authError,
        incomingInquiries,
        reservations,
        verificationFeedback,
        isMuted,
        activeStoreCount,
        availableStores,
        activityLogs,
        isTerminalCollapsed,
        uploadedInventory,
        isInventoryDrawerOpen,
        setSearchQuery,
        selectMedicine,
        setAllowAlternatives,
        startStoreCheck,
        expandRadius,
        pharmacistClaimExact,
        pharmacistClaimGeneric,
        pharmacistDeclineStock,
        respondToInquiry,
        handleHoldItemClick,
        handleSendOtp,
        handleVerifyOtp,
        handleAutoFillOtp,
        setPhoneInput,
        setOtpInput,
        closeAuthModal,
        cancelHold,
        setIsTerminalCollapsed,
        toggleTerminalCollapse,
        loadSampleInventory,
        handleFileUpload,
        removeUploadedInventory,
        setIsInventoryDrawerOpen,
        findInventoryMatch,
        verifyAndHandover,
        clearVerificationFeedback,
        resetSimulator,
        toggleMute,
        setIsDirectionsOpen,
        fastForwardTimer
      }}
    >
      {children}
    </SimulatorContext.Provider>
  );
};

export const useSimulator = () => {
  const context = useContext(SimulatorContext);
  if (!context) {
    throw new Error('useSimulator must be used within a SimulatorProvider');
  }
  return context;
};
