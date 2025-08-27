import {
  Card,
  CardContent,
  CardHeader,
  CardTitle,
} from '@/components/ui/card';
import { Newspaper } from 'lucide-react';

const mockNews = [
  {
    id: 1,
    headline: 'Bitcoin Hits New All-Time High Amid Market Frenzy',
    source: 'CryptoNews',
    age: '2h ago',
  },
  {
    id: 2,
    headline: 'Ethereum Merge Successfully Completed, Proof-of-Stake is Live',
    source: 'CoinDesk',
    age: '8h ago',
  },
  {
    id: 3,
    headline: 'Dogecoin Rallies as Elon Musk Mentions it on Social Media',
    source: 'The Crypto Times',
    age: '1d ago',
  },
  {
    id: 4,
    headline: 'DeFi Sector Surpasses $100 Billion in Total Value Locked',
    source: 'DeFi Pulse',
    age: '2d ago',
  },
   {
    id: 5,
    headline: 'NFT Market Sees Resurgence with New Digital Art Collections',
    source: 'NFT Plaza',
    age: '3d ago',
  },
];

export default function NewsFeed() {
  return (
    <Card>
      <CardHeader className="flex flex-row items-center gap-2">
        <Newspaper className="h-5 w-5 text-primary" />
        <CardTitle>News Feed</CardTitle>
      </CardHeader>
      <CardContent className="space-y-4">
        {mockNews.map((item) => (
          <div key={item.id} className="border-b border-border/50 pb-3 last:border-b-0 last:pb-0">
            <h4 className="font-semibold text-sm leading-snug">
              {item.headline}
            </h4>
            <div className="flex justify-between items-center mt-2">
              <p className="text-xs text-muted-foreground font-medium">{item.source}</p>
              <p className="text-xs text-muted-foreground">{item.age}</p>
            </div>
          </div>
        ))}
      </CardContent>
    </Card>
  );
}
