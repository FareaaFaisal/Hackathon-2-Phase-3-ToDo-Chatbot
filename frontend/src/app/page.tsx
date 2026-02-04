'use client';
import { useEffect, useRef, useState } from 'react';
import ChatIcon from "@/components/common/ChatIcon";
import Toast from '@/components/common/Toast';
import Link from 'next/link';

export default function LandingPage() {
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const [chatToast, setChatToast] = useState<string | null>(null);

  // Particle animation
  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;
    const ctx = canvas.getContext('2d');
    if (!ctx) return;

    let width = (canvas.width = window.innerWidth);
    let height = (canvas.height = window.innerHeight);

    window.addEventListener('resize', () => {
      width = canvas.width = window.innerWidth;
      height = canvas.height = window.innerHeight;
    });

    class Particle {
      x: number;
      y: number;
      vx: number;
      vy: number;
      radius: number;
      hue: number;
      glow: number;

      constructor() {
        this.x = Math.random() * width;
        this.y = Math.random() * height;
        this.vx = (Math.random() - 0.5) * 1.2;
        this.vy = (Math.random() - 0.5) * 1.2;
        this.radius = Math.random() * 3 + 1.5;
        this.hue = Math.random() * 360;
        this.glow = Math.random() * 15 + 5;
      }

      update() {
        this.x += this.vx;
        this.y += this.vy;
        if (this.x < 0 || this.x > width) this.vx *= -1;
        if (this.y < 0 || this.y > height) this.vy *= -1;
      }

      draw(ctx: CanvasRenderingContext2D) {
        const gradient = ctx.createRadialGradient(
          this.x,
          this.y,
          0,
          this.x,
          this.y,
          this.radius + this.glow
        );
        gradient.addColorStop(0, `hsla(${this.hue}, 80%, 60%, 1)`);
        gradient.addColorStop(0.5, `hsla(${this.hue}, 80%, 60%, 0.5)`);
        gradient.addColorStop(1, `hsla(${this.hue}, 80%, 60%, 0)`);

        ctx.fillStyle = gradient;
        ctx.beginPath();
        ctx.arc(this.x, this.y, this.radius + this.glow, 0, Math.PI * 2);
        ctx.fill();
      }
    }

    const particles: Particle[] = [];
    for (let i = 0; i < 120; i++) particles.push(new Particle());

    const connectParticles = () => {
      for (let i = 0; i < particles.length; i++) {
        for (let j = i + 1; j < particles.length; j++) {
          const dx = particles[i].x - particles[j].x;
          const dy = particles[i].y - particles[j].y;
          const dist = Math.sqrt(dx * dx + dy * dy);
          if (dist < 120) {
            ctx.strokeStyle = `hsla(${particles[i].hue}, 80%, 60%, ${1 - dist / 120})`;
            ctx.lineWidth = 0.5;
            ctx.beginPath();
            ctx.moveTo(particles[i].x, particles[i].y);
            ctx.lineTo(particles[j].x, particles[j].y);
            ctx.stroke();
          }
        }
      }
    };

    let animationId: number;
    const animate = () => {
      ctx.clearRect(0, 0, width, height);

      const bgGradient = ctx.createLinearGradient(0, 0, width, height);
      bgGradient.addColorStop(0, '#0a0a0a');
      bgGradient.addColorStop(1, '#1a1a2e');
      ctx.fillStyle = bgGradient;
      ctx.fillRect(0, 0, width, height);

      particles.forEach((p) => {
        p.update();
        p.draw(ctx);
      });

      connectParticles();

      animationId = requestAnimationFrame(animate);
    };

    animate();
    return () => cancelAnimationFrame(animationId);
  }, []);

  return (
    <div className="relative min-h-screen font-sans text-white overflow-hidden">
      {/* Canvas Background */}
      <canvas ref={canvasRef} className="absolute inset-0 -z-10 w-full h-full" />

      {/* Header */}
      <header className="w-full z-20 bg-black/40 border-b border-white/10 ">
        <div className="max-w-7xl mx-auto px-6 py-4 flex justify-between items-center">
          <span className="text-xl font-bold text-white">
            TODO<span className="text-pink-500">X</span>
          </span>
          <nav className="hidden md:flex gap-8 text-white/70">
            <a href="#features" className="hover:text-white">
              Features
            </a>
            <a href="#workflow" className="hover:text-white">
              Workflow
            </a>
          </nav>
          <Link
            href="/signup"
            className="px-5 py-2 rounded-full bg-gradient-to-r from-purple-500 to-pink-500 text-white font-medium hover:opacity-90"
          >
            Get Started
          </Link>
        </div>
      </header>

      <main className="relative z-20">
        {/* Hero */}
        <section className="relative flex flex-col justify-center items-center text-center h-screen px-6">
          <div className="bg-black/50 backdrop-blur-md rounded-xl p-10 max-w-3xl shadow-2xl">
            <h1 className="text-5xl md:text-7xl font-extrabold mb-4">
              Organize Your Life
              <span className="block bg-gradient-to-r from-purple-400 to-pink-500 bg-clip-text text-transparent">
                Effortlessly
              </span>
            </h1>
            <p className="text-white/80 text-lg md:text-xl mb-8 mt-4">
              Next-gen TO-DO App to supercharge your productivity and stay on top of every task.
            </p>
            <div className="flex flex-col sm:flex-row gap-4 justify-center">
              <Link
                href="/signup"
                className="px-8 py-4 rounded-xl bg-gradient-to-r from-purple-500 to-pink-500 text-black font-semibold hover:opacity-90 transition"
              >
                Get Started
              </Link>
              <Link
                href="/login"
                className="px-8 py-4 rounded-xl border border-white/20 text-white hover:bg-white/10 transition"
              >
                Sign In
              </Link>
            </div>
          </div>
        </section>

         {/* Features */}
        <section id="features" className="py-32 max-w-7xl mx-auto px-6 pt-32">
          <h2 className="text-5xl font-bold text-center mb-16">
            Why You'll Love TODOX
          </h2>
          <div className="grid md:grid-cols-3 gap-8">
            {[
              ['Smart Lists', 'Automatically organize tasks by priority and deadlines.'],
              ['Zero Distraction', 'Minimal interface for deep focus and productivity.'],
              ['Cloud Sync', 'Access your tasks anywhere, anytime.'],
              ['Reminders', 'Never miss a task with smart notifications.'],
              ['Analytics', 'Track your progress and improve daily habits.'],
              ['Collaboration', 'Share your task lists and work together effortlessly.'],
            ].map(([title, desc]) => (
              <div
                key={title}
                className="bg-white/5 border-2 border-gradient rounded-2xl p-8 backdrop-blur-xl hover:scale-105 transition-transform duration-300 shadow-xl"
              >
                <h3 className="text-xl font-semibold mb-3">{title}</h3>
                <p className="text-white/70">{desc}</p>
              </div>
            ))}
          </div>
        </section>


        {/* Workflow */}
        <section className="pt-28 pb-32 max-w-7xl mx-auto px-6">
          <h2 id="workflow" className="text-5xl font-bold text-center mb-16 mt-4">
            How It Works
          </h2>
          <div className="grid md:grid-cols-3 gap-12">
            {[
              ['Add Tasks', 'Quickly jot down your tasks in a clean and intuitive interface.'],
              ['Organize', 'Automatically sort tasks by priority, deadlines, and categories.'],
              ['Track Progress', 'Mark tasks complete and visualize your productivity trends.'],
              ['Set Reminders', 'Get timely notifications so you never miss a task.'],
              ['Collaborate', 'Share lists and work seamlessly with your team or friends.'],
              ['Analyze', 'Review performance and optimize your workflow over time.'],
            ].map(([title, desc], idx) => (
              <div
                key={title}
                className="bg-black/30 rounded-2xl p-8 backdrop-blur-md hover:scale-105 transition-transform duration-300 shadow-lg flex flex-col items-center text-center"
              >
                <div className="w-12 h-12 flex items-center justify-center rounded-full bg-purple-600 text-white font-bold mb-4">
                  {idx + 1}
                </div>
                <h3 className="text-xl font-semibold mb-3">{title}</h3>
                <p className="text-white/70">{desc}</p>
              </div>
            ))}
          </div>
        </section>

        {/* CTA */}
        <section className="py-32 text-center px-6">
          <div className="inline-block bg-black/30 backdrop-blur-md rounded-2xl p-24 shadow-xl">
            <h3 className="text-5xl md:text-4xl font-bold mb-8">
              Ready to Get Things Done?
            </h3>
            <p className="text-white/70 mb-12">
              Join thousands who’ve simplified their daily workflow.
            </p>
            <Link
              href="/signup"
              className="px-8 py-4 rounded-xl bg-gradient-to-r from-purple-500 to-pink-500 text-black font-semibold hover:opacity-90 transition"
            >
              Create Your Free Account
            </Link>
          </div>
        </section>

        {/* Footer */}
        <footer className="border-t border-white/10 py-10 text-center text-white/50">
          © {new Date().getFullYear()} TODOX | Built by Fareaa Faisal
        </footer>
        
{/* Floating chatbot icon */}
<div className="fixed bottom-6 right-6 z-50">
  <ChatIcon
    onClick={() => {
      if (!localStorage.getItem('token')) {
        setChatToast("Please Sign In first to access the chatbot");
      }
    }}
    isOpen={false}
  />
</div>

{/* Toast for chatbot warning */}
{chatToast && (
  <Toast
    message={chatToast}
    variant="error" // red or colorful error style
    onClose={() => setChatToast(null)}
  />
)}

      </main>
    </div>
  );
}
