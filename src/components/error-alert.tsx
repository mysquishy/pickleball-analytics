import { Card, CardContent } from '@/components/ui/card';
import { Button } from '@/components/ui/button';

interface ErrorAlertProps {
  message: string;
  onRetry?: () => void;
  onDismiss?: () => void;
}

export function ErrorAlert({ message, onRetry, onDismiss }: ErrorAlertProps) {
  return (
    <Card className="border-red-200 bg-red-50">
      <CardContent className="pt-6">
        <div className="flex items-start justify-between">
          <div className="flex-1">
            <h3 className="font-semibold text-red-900 mb-2">Error</h3>
            <p className="text-sm text-red-700">{message}</p>
          </div>
          {onDismiss && (
            <Button
              variant="ghost"
              size="sm"
              onClick={onDismiss}
              className="text-red-700 hover:text-red-900"
            >
              ✕
            </Button>
          )}
        </div>
        {onRetry && (
          <div className="mt-4">
            <Button size="sm" variant="outline" onClick={onRetry}>
              Try Again
            </Button>
          </div>
        )}
      </CardContent>
    </Card>
  );
}

interface InlineErrorProps {
  message: string;
}

export function InlineError({ message }: InlineErrorProps) {
  return (
    <div className="bg-red-50 border border-red-200 text-red-700 px-4 py-3 rounded">
      <p className="text-sm">{message}</p>
    </div>
  );
}
