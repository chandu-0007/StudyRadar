import { LoginForm } from '../../src/components/auth/LoginForm';
import { Card } from '../../src/components/ui/Card';

export default function LoginPage() {
  return (
    <main className="min-h-screen flex items-center justify-center bg-gray-50 px-4 sm:px-6 lg:px-8 bg-gradient-to-br from-indigo-50 to-white">
      <Card className="w-full max-w-md flex flex-col items-center">
        <div className="mb-6 flex justify-center">
          <div className="w-16 h-16 bg-indigo-600 rounded-2xl flex items-center justify-center shadow-lg transform -rotate-6 transition-transform hover:rotate-0">
            <span className="text-3xl font-bold text-white">📚</span>
          </div>
        </div>
        <LoginForm />
      </Card>
    </main>
  );
}
