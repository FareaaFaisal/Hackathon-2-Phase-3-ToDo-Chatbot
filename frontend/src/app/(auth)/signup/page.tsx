// frontend/src/app/(auth)/signup/page.tsx
import SignupForm from '@/components/auth/SignupForm';
import CanvasBackground from '@/components/common/CanvasBackground';


export default function SignupPage() {
  return (
     <div className="w-screen flex items-center justify-center overflow-hidden">
      {/* Full-page animated background */}
      <CanvasBackground />

      {/* Login form */}
      <SignupForm />
    </div>
  );
}
