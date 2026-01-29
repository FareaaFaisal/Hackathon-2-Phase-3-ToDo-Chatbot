import LoginForm from '@/components/auth/LoginForm';
import CanvasBackground from '@/components/common/CanvasBackground';


export default function LoginPage() {
  return (
     <div className="w-screen flex items-center justify-center overflow-hidden">
      {/* Full-page animated background */}
      <CanvasBackground />

      {/* Login form */}
      <LoginForm/>
    </div>
  );
}

