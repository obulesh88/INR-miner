import { UserDataProvider } from '@/contexts/user-data-context';
import { CryptoDashboard } from '@/components/crypto-dashboard';

export default function DashboardPage() {
  return (
    <UserDataProvider>
      <CryptoDashboard />
    </UserDataProvider>
  );
}
