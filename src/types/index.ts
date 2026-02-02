export type UserStatus = 'pending' | 'approved' | 'rejected';

export type RentalStatus = 'requested' | 'approved' | 'rented' | 'returned' | 'rejected';

export type ItemCategory = 'cars' | 'houses' | 'bikes' | 'tools' | 'electronics' | 'other';

export type PricingType = 'hourly' | 'daily';

export interface User {
  id: string;
  email: string;
  name: string;
  avatar?: string;
  status: UserStatus;
  idCardFront?: string;
  idCardBack?: string;
  createdAt: Date;
}

export interface Item {
  id: string;
  ownerId: string;
  ownerName: string;
  title: string;
  description: string;
  category: ItemCategory;
  pricePerDay: number;
  pricePerHour?: number;
  pricingType: PricingType;
  images: string[];
  availableDates: { start: Date; end: Date }[];
  location: string;
  rating: number;
  reviewCount: number;
  createdAt: Date;
}

export interface Rental {
  id: string;
  itemId: string;
  item: Item;
  renterId: string;
  renterName: string;
  ownerId: string;
  status: RentalStatus;
  startDate: Date;
  endDate: Date;
  totalPrice: number;
  createdAt: Date;
  returnedAt?: Date;
  latePenalty?: number;
}

export interface Review {
  id: string;
  rentalId: string;
  reviewerId: string;
  reviewerName: string;
  rating: number;
  comment: string;
  createdAt: Date;
}
