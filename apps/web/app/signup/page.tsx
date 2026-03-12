import { SignupStepper } from '../../src/components/auth/SignupStepper';
import { Card } from '../../src/components/ui/Card';

export default function SignupPage() {
  return (
    <main className="min-h-screen flex items-center justify-center bg-gray-50 px-4 sm:px-6 lg:px-8 bg-gradient-to-tr from-gray-100 to-indigo-50">
      <Card className="w-full max-w-xl">
        <SignupStepper />
      </Card>
    </main>
  );
}
