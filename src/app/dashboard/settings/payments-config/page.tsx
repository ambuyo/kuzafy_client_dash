import { HiOutlineCog } from 'react-icons/hi';
import ComingSoon from '@/components/ui/ComingSoon';

export default function PaymentsConfigPage() {
  return (
    <ComingSoon
      title="Payments Settings"
      description="Configure M-Pesa Daraja credentials, paybill numbers, and payment reconciliation rules."
      icon={HiOutlineCog}
    />
  );
}
