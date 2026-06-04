export type UserRole = 'passenger' | 'driver' | 'admin';
export interface User { id: string; email: string; phone: string; name: string; avatar?: string; role: UserRole; rating: number; ratingCount: number; createdAt: string; updatedAt: string; }
export interface AuthTokens { accessToken: string; refreshToken: string; expiresAt: number; }
export interface Coordinates { lat: number; lng: number; }
export interface Place { id: string; name: string; address: string; coordinates: Coordinates; }
export type PaymentMethod = 'cash' | 'card';
export type OfferStatus = 'pending' | 'accepted' | 'rejected' | 'expired';
export type OfferType = 'accept' | 'counter';
export interface OfferDriver { id: string; firstName: string; lastName: string; avatarUrl?: string; ratingAverage: number; totalTrips: number; vehicle?: { make: string; model: string; color: string; plateNumber: string; }; }
export interface Offer { id: string; tripId: string; offeredPrice: number; offerType: OfferType; driverEtaSeconds?: number; message?: string; status: OfferStatus; expiresAt: string; createdAt: string; driver?: OfferDriver; }
export type TripStatus = 'searching' | 'negotiating' | 'accepted' | 'driver_arriving' | 'in_progress' | 'completed' | 'cancelled';
export interface ActiveRide { id: string; status: string; origin_address: string; destination_address: string; proposed_price: number; final_price: number | null; offer_expiry_at?: string; payment_method: PaymentMethod; driver_name?: string; driver_rating?: string | number; vehicle_make?: string; vehicle_model?: string; plate_number?: string; passenger_name?: string; [key: string]: unknown; }
export type SubscriptionStatus = 'active' | 'inactive' | 'trial' | 'expired';
export interface EarningsSummary { today: number; thisWeek: number; thisMonth: number; total: number; byDay: Array<{ date: string; amount: number; rides: number }>; }
export interface PaymentCard { id: string; brand: string; last4: string; expMonth: number; expYear: number; isDefault: boolean; }
export interface SubscriptionPlan { id: string; name: string; price: number; currency: string; interval: 'month' | 'year'; features: string[]; stripePriceId: string; }
export interface SocketOffer { offer: Offer; }
export interface SocketTripUpdate { tripId: string; status: TripStatus; }
export interface SocketDriverLocation { driverId: string; location: Coordinates; heading?: number; }
export interface ApiResponse<T> { data: T; message?: string; }
export interface PaginatedResponse<T> { data: T[]; total: number; page: number; limit: number; hasMore: boolean; }