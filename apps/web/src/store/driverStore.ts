import { create } from 'zustand';
import { persist, createJSONStorage } from 'zustand/middleware';
import { Offer, EarningsSummary, Coordinates, ActiveRide } from '@/types';

export type SubscriptionStatus = 'active' | 'trialing' | 'past_due' | 'canceled' | 'inactive';

interface DriverStore {
  isOnline: boolean; currentLocation: Coordinates | null; activeTrip: ActiveRide | null;
  incomingOffer: ActiveRide | null; pendingOffers: Offer[]; subscriptionStatus: SubscriptionStatus;
  earnings: EarningsSummary | null; todayRides: number; showIncomingModal: boolean;
  setOnline: (v: boolean) => void; setCurrentLocation: (c: Coordinates | null) => void;
  setActiveTrip: (t: ActiveRide | null) => void; setIncomingOffer: (t: ActiveRide | null) => void;
  setShowIncomingModal: (v: boolean) => void; setSubscriptionStatus: (s: SubscriptionStatus) => void;
  addPendingOffer: (o: Offer) => void; removePendingOffer: (id: string) => void;
  updatePendingOffer: (id: string, u: Partial<Offer>) => void;
  setEarnings: (e: EarningsSummary) => void; incrementTodayRides: () => void; resetDriverState: () => void;
}

const init = { isOnline: false, currentLocation: null, activeTrip: null, incomingOffer: null, pendingOffers: [], subscriptionStatus: 'inactive' as SubscriptionStatus, earnings: null, todayRides: 0, showIncomingModal: false };

export const useDriverStore = create<DriverStore>()(
  persist(
    (set) => ({
      ...init,
      setOnline: (v) => set({ isOnline: v }),
      setCurrentLocation: (c) => set({ currentLocation: c }),
      setActiveTrip: (t) => set({ activeTrip: t }),
      setIncomingOffer: (t) => set({ incomingOffer: t, showIncomingModal: t !== null }),
      setShowIncomingModal: (v) => set({ showIncomingModal: v }),
      setSubscriptionStatus: (s) => set({ subscriptionStatus: s }),
      addPendingOffer: (o) => set((s) => ({ pendingOffers: [...s.pendingOffers, o] })),
      removePendingOffer: (id) => set((s) => ({ pendingOffers: s.pendingOffers.filter(o => o.id !== id) })),
      updatePendingOffer: (id, u) => set((s) => ({ pendingOffers: s.pendingOffers.map(o => o.id === id ? { ...o, ...u } : o) })),
      setEarnings: (e) => set({ earnings: e }),
      incrementTodayRides: () => set((s) => ({ todayRides: s.todayRides + 1 })),
      resetDriverState: () => set(init),
    }),
    { name: 'mobilidad-driver', storage: createJSONStorage(() => localStorage), partialize: (s) => ({ isOnline: s.isOnline, subscriptionStatus: s.subscriptionStatus, todayRides: s.todayRides }) }
  )
);