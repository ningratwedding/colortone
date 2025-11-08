
'use client';

import { Suspense } from 'react';
import ConfirmationClient from '../confirmation-client';

function ConfirmationPageContent() {
  return <ConfirmationClient />;
}

export default function ConfirmationPage() {
  return (
    <div className="container mx-auto px-4 py-8">
      <Suspense fallback={<div className="text-center">Memuat pesanan...</div>}>
        <ConfirmationPageContent />
      </Suspense>
    </div>
  );
}
