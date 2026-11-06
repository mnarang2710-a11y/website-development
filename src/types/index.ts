export type BookingStatus = 'Pending' | 'Confirmed' | 'Completed' | 'Cancelled';

export interface Booking {
  id: string;
  customerName: string;
  phoneNumber: string;
  email?: string;
  date: string;
  timeSlot: string;
  guestsCount: number;
  serviceName: string;
  specialRequests?: string;
  status: BookingStatus;
  estimatedAmount: number;
  createdAt: string;
}

export type MenuCategory = 
  | 'all'
  | 'chaat'
  | 'mains'
  | 'breakfast'
  | 'desserts'
  | 'experiences';

export interface MenuItem {
  id: string;
  name: string;
  regionalOrigin: string;
  category: MenuCategory;
  price: number;
  duration: string;
  dietary: 'veg' | 'non-veg' | 'vegan';
  description: string;
  highlights: string[];
  isSignature?: boolean;
  image?: string;
}

export interface ReviewItem {
  id: string;
  author: string;
  rating: number;
  relativeTime: string;
  reviewText: string;
  favoriteDish: string;
  visitType: string;
}
