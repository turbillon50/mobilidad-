import { create } from 'zustand';
import { Offer, PaymentMethod, Place, Coordinates, ActiveRide } from '@/types';

interface TripStore {
  activeRide: ActiveRide | null; origin: Place | null; destination: Place | null;
  proposedPrice: number; paymentMethod: PaymentMethod; offers: Offer[];
  selectedOffer: Offer | null; driverLocation: Coordinates | null;
  isRequesting: boolean; isSearching: boolean; bottomSheetSnap: 'collapsed' | 'half' | 'full';
  setOrigin: (p: Place | null) => void; setDestination: (p: Place | null) => void;
  setProposedPrice: (n: number) => void; setPaymentMethod: (m: PaymentMethod) => void;
  setActiveRide: (r: ActiveRide | null) => void;
  addOffer: (o: Offer) => void; updateOffer: (id: string, u: Partial<Offer>) => void;
  removeOffer: (id: string) => void; clearOffers: () => void;
  setSelectedOffer: (o: Offer | null) => void; setDriverLocation: (c: Coordinates | null) => void;
  setIsRequesting: (v: boolean) => void; setIsSearching: (v: boolean) => void;
  setBottomSheetSnap: (s: 'collapsed' | 'half' | 'full') => void; resetTrip: () => void;
}

const init = { activeRide: null, origin: null, destination: null, proposedPrice: 10, paymentMethod: 'cash' as PaymentMethod, offers: [], selectedOffer: null, driverLocation: null, isRequesting: false, isSearching: false, bottomSheetSnap: 'half' as const };

export const useTripStore = create<TripStore>((set) => ({
  ...init,
  setOrigin: (p) => set({ origin: p }),
  setDestination: (p) => set({ destination: p }),
  setProposedPrice: (n) => set({ proposedPrice: n }),
  setPaymentMethod: (m) => set({ paymentMethod: m }),
  setActiveRide: (r) => set({ activeRide: r }),
  addOffer: (o) => set((s) => s.offers.find(x => x.id === o.id) ? s : { offers: [o, ...s.offers] }),
  updateOffer: (id, u) => set((s) => ({ offers: s.offers.map(o => o.id === id ? { ...o, ...u } : o) })),
  removeOffer: (id) => set((s) => ({ offers: s.offers.filter(o => o.id !== id) })),
  clearOffers: () => set({ offers: [] }),
  setSelectedOffer: (o) => set({ selectedOffer: o }),
  setDriverLocation: (c) => set({ driverLocation: c }),
  setIsRequesting: (v) => set({ isRequesting: v }),
  setIsSearching: (v) => set({ isSearching: v }),
  setBottomSheetSnap: (s) => set({ bottomSheetSnap: s }),
  resetTrip: () => set(init),
}));