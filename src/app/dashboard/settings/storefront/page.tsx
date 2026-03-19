import { HiOutlineColorSwatch } from 'react-icons/hi';
import ComingSoon from '@/components/ui/ComingSoon';

export default function StorefrontPage() {
  return (
    <ComingSoon
      title="Storefront"
      description="Customise your WhatsApp storefront: logo, colours, banner, and product display layout."
      icon={HiOutlineColorSwatch}
    />
  );
}
