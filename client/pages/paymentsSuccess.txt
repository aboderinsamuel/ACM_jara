import React, { useState } from 'react';
import { useSearchParams, useNavigate, useLocation } from 'react-router-dom';
import { Card, CardContent } from '../components/ui/Card';
import { Button } from '../components/ui/Button';
import { CheckCircle, Home, Copy } from 'lucide-react';
import toast from 'react-hot-toast';

export function PaymentSuccess() {
  const [searchParams] = useSearchParams();
  const navigate = useNavigate();
  const location = useLocation();

  // Get the access token from the success message passed via navigation state
  const accessToken = location.state?.message || '67889jara';
  const message = `Your movie rental is confirmed! Use this access code to watch the movie:`;

  const handleCopyToken = async () => {
    try {
      await navigator.clipboard.writeText(accessToken);
      toast.success('Access code copied to clipboard!');
    } catch (error) {
      // Fallback for older browsers
      const textArea = document.createElement('textarea');
      textArea.value = accessToken;
      document.body.appendChild(textArea);
      textArea.select();
      document.execCommand('copy');
      document.body.removeChild(textArea);
      toast.success('Access code copied to clipboard!');
    }
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-gray-50 p-4">
      <Card className="max-w-md w-full">
        <CardContent className="text-center p-8">
          <CheckCircle className="w-16 h-16 text-green-500 mx-auto mb-4" />
          <h1 className="text-2xl font-bold text-gray-900 mb-2">Movie Rental Successful!</h1>
          <p className="text-gray-600 mb-4">{message}</p>

          {/* Access Token Display */}
          <div className="bg-gray-50 p-4 rounded-lg mb-6">
            <p className="text-sm text-gray-600 mb-2">Your Access Code:</p>
            <div className="flex items-center justify-center space-x-3">
              <code className="bg-white px-4 py-2 rounded border font-mono text-lg font-bold text-gray-900">
                {accessToken}
              </code>
              <Button
                onClick={handleCopyToken}
                variant="outline"
                size="sm"
                className="px-3 py-2"
                leftIcon={<Copy className="w-4 h-4" />}
              >
                Copy
              </Button>
            </div>
          </div>

          <div className="space-y-3">
            <Button onClick={() => navigate('/')} className="w-full">
              <Home className="w-4 h-4 mr-2" />
              Return Home
            </Button>
          </div>
        </CardContent>
      </Card>
    </div>
  );
}