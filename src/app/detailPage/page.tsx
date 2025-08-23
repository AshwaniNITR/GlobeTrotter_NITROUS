import { Suspense } from 'react';
import TripSectionsPage from './TripSectionsPage';

export default function DetailPage() {
  return (
    <Suspense fallback={
      <div className="min-h-screen bg-gradient-to-br from-indigo-900 via-purple-900 to-pink-900 flex items-center justify-center">
        <div className="text-white">Loading trip details...</div>
      </div>
    }>
      <TripSectionsPage />
    </Suspense>
  );
}