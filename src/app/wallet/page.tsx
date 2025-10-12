import { UserDataProvider } from '@/contexts/user-data-context';
import { WalletPage } from '@/components/wallet-page';
import BottomNav from '@/components/bottom-nav';

export default function Wallet() {
  return (
    <UserDataProvider>
      <WalletPage />
      <BottomNav />
    </UserDataProvider>
  );
}
