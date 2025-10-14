import { PaymentStatus, PaymentType } from '../enum/payment.status.enum';

export const paymentData = {
  id: 1,
  doctorBookId: 1,
  pateintsName: 'Ali',
  doctorName: 'Vali',
  paymentType: PaymentType.CARD,
  meetingDate: '2025-10-01T12:30:00Z',
  description: "TO'LOV",
  amount: 70000,
  status: PaymentStatus.PAID,
  createdAt: '2025-10-01T12:30:00Z',
  updatedAt: '2025-10-02T12:30:00Z',
};
