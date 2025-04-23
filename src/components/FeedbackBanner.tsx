
import React, { useEffect, useState } from 'react';
import { Alert, AlertDescription } from "@/components/ui/alert";

export function FeedbackBanner() {
  const [showBanner, setShowBanner] = useState(false);

  useEffect(() => {
    const hasSeenBanner = localStorage.getItem('hasSeenFeedbackBanner');
    if (!hasSeenBanner) {
      setShowBanner(true);
      localStorage.setItem('hasSeenFeedbackBanner', 'true');
    }
  }, []);

  if (!showBanner) return null;

  return (
    <Alert className="fixed bottom-20 right-4 max-w-[300px] bg-white shadow-lg border border-purple-200 rounded-lg z-50">
      <AlertDescription className="text-sm text-purple-800">
        Think our agents got anything wrong or missed a company? Drop us some feedback!
      </AlertDescription>
    </Alert>
  );
}
