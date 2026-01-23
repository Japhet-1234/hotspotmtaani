
// Shared data structures for the Mtaani Management system
export interface BundleRequest {
  id: string;
  customerName: string;
  customerPhone: string;
  paymentPhone: string;
  paymentName: string;
  planName: string;
  planPrice: number;
  requestedAt: string;
  status: 'pending' | 'approved' | 'rejected';
}

export interface Voucher {
  id: string;
  code: string;
  plan: string;
  price: number;
  dataLimit?: string;
  timeLimit?: string;
  status: 'available' | 'active' | 'used';
  createdAt: string;
  expiryDate?: string;
}

export interface Customer {
  id: string;
  name: string;
  phone: string;
  joinedAt: string;
}
