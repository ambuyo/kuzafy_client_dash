import { HiOutlineUsers } from 'react-icons/hi';
import ComingSoon from '@/components/ui/ComingSoon';

export default function UsersPage() {
  return (
    <ComingSoon
      title="Users"
      description="Manage team members, assign roles, and control access permissions for your store."
      icon={HiOutlineUsers}
    />
  );
}
