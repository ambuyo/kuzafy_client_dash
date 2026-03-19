import { HiOutlineCreditCard } from 'react-icons/hi';
import ComingSoon from '@/components/ui/ComingSoon';

export default function CheckoutPage() {
  return (
    <ComingSoon
      title="Checkout"
      description="Configure your checkout flow, payment methods, and M-Pesa STK Push settings."
      icon={HiOutlineCreditCard}
    />
  );
}
