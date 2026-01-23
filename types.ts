
export type Status = 'active' | 'expired' | 'available';

export interface Voucher {
  id: string;
  code: string;
  plan: string;
  price: number;
  dataLimit: string;
  timeLimit: string;
  status: Status;
  createdAt: string;
  expiryDate?: string;
}

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

export interface Customer {
  id: string;
  name: string;
  macAddress: string;
  ipAddress: string;
  connectedAt: string;
  totalDataUsed: string;
  currentVoucher: string;
  status: 'online' | 'offline';
}

export interface RouterStats {
  cpuUsage: number;
  memoryUsage: number;
  activeUsers: number;
  uptime: string;
  throughput: string;
  ipPool: string;
}
