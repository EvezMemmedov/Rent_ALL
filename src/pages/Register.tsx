import { useState } from 'react';
import { Link } from 'react-router-dom';
import { Package, Mail, Lock, Eye, EyeOff, User, Upload, CheckCircle2 } from 'lucide-react';
import { Button } from '@/components/ui/button';

type Step = 'info' | 'verification';

export default function Register() {
  const [step, setStep] = useState<Step>('info');
  const [showPassword, setShowPassword] = useState(false);
  const [formData, setFormData] = useState({
    name: '',
    email: '',
    password: '',
    confirmPassword: '',
  });
  const [idFront, setIdFront] = useState<File | null>(null);
  const [idBack, setIdBack] = useState<File | null>(null);

  const handleContinue = (e: React.FormEvent) => {
    e.preventDefault();
    setStep('verification');
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    // Navigate to pending approval
    window.location.href = '/pending-approval';
  };

  return (
    <div className="min-h-screen gradient-bg flex items-center justify-center p-4 py-12">
      <div className="w-full max-w-md animate-slide-up">
        {/* Logo */}
        <Link to="/" className="flex items-center justify-center gap-2 mb-8">
          <div className="w-10 h-10 rounded-lg bg-primary flex items-center justify-center">
            <Package className="w-6 h-6 text-primary-foreground" />
          </div>
          <span className="text-2xl font-semibold text-foreground">RentAll</span>
        </Link>

        {/* Progress Steps */}
        <div className="flex items-center justify-center gap-3 mb-8">
          <div className={`flex items-center gap-2 ${step === 'info' ? 'text-primary' : 'text-muted-foreground'}`}>
            <div className={`w-8 h-8 rounded-full flex items-center justify-center text-sm font-medium ${step === 'info' ? 'bg-primary text-primary-foreground' : 'bg-muted text-muted-foreground'}`}>
              {step === 'verification' ? <CheckCircle2 className="w-5 h-5" /> : '1'}
            </div>
            <span className="text-sm font-medium hidden sm:inline">Account Info</span>
          </div>
          <div className="w-8 h-px bg-border" />
          <div className={`flex items-center gap-2 ${step === 'verification' ? 'text-primary' : 'text-muted-foreground'}`}>
            <div className={`w-8 h-8 rounded-full flex items-center justify-center text-sm font-medium ${step === 'verification' ? 'bg-primary text-primary-foreground' : 'bg-muted text-muted-foreground'}`}>
              2
            </div>
            <span className="text-sm font-medium hidden sm:inline">ID Verification</span>
          </div>
        </div>

        {/* Card */}
        <div className="card-static p-8">
          {step === 'info' ? (
            <>
              <div className="text-center mb-8">
                <h1 className="text-2xl font-bold text-foreground mb-2">Create your account</h1>
                <p className="text-muted-foreground">Start renting or listing in minutes</p>
              </div>

              <form onSubmit={handleContinue} className="space-y-5">
                <div>
                  <label htmlFor="name" className="block text-sm font-medium text-foreground mb-2">
                    Full name
                  </label>
                  <div className="relative">
                    <User className="absolute left-3.5 top-1/2 -translate-y-1/2 w-5 h-5 text-muted-foreground" />
                    <input
                      id="name"
                      type="text"
                      value={formData.name}
                      onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                      placeholder="John Doe"
                      className="input-field pl-11"
                      required
                    />
                  </div>
                </div>

                <div>
                  <label htmlFor="email" className="block text-sm font-medium text-foreground mb-2">
                    Email address
                  </label>
                  <div className="relative">
                    <Mail className="absolute left-3.5 top-1/2 -translate-y-1/2 w-5 h-5 text-muted-foreground" />
                    <input
                      id="email"
                      type="email"
                      value={formData.email}
                      onChange={(e) => setFormData({ ...formData, email: e.target.value })}
                      placeholder="you@example.com"
                      className="input-field pl-11"
                      required
                    />
                  </div>
                </div>

                <div>
                  <label htmlFor="password" className="block text-sm font-medium text-foreground mb-2">
                    Password
                  </label>
                  <div className="relative">
                    <Lock className="absolute left-3.5 top-1/2 -translate-y-1/2 w-5 h-5 text-muted-foreground" />
                    <input
                      id="password"
                      type={showPassword ? 'text' : 'password'}
                      value={formData.password}
                      onChange={(e) => setFormData({ ...formData, password: e.target.value })}
                      placeholder="••••••••"
                      className="input-field pl-11 pr-11"
                      required
                    />
                    <button
                      type="button"
                      onClick={() => setShowPassword(!showPassword)}
                      className="absolute right-3.5 top-1/2 -translate-y-1/2 text-muted-foreground hover:text-foreground transition-colors"
                    >
                      {showPassword ? <EyeOff className="w-5 h-5" /> : <Eye className="w-5 h-5" />}
                    </button>
                  </div>
                </div>

                <div>
                  <label htmlFor="confirmPassword" className="block text-sm font-medium text-foreground mb-2">
                    Confirm password
                  </label>
                  <div className="relative">
                    <Lock className="absolute left-3.5 top-1/2 -translate-y-1/2 w-5 h-5 text-muted-foreground" />
                    <input
                      id="confirmPassword"
                      type="password"
                      value={formData.confirmPassword}
                      onChange={(e) => setFormData({ ...formData, confirmPassword: e.target.value })}
                      placeholder="••••••••"
                      className="input-field pl-11"
                      required
                    />
                  </div>
                </div>

                <Button type="submit" className="w-full" size="lg">
                  Continue
                </Button>
              </form>
            </>
          ) : (
            <>
              <div className="text-center mb-8">
                <h1 className="text-2xl font-bold text-foreground mb-2">Verify your identity</h1>
                <p className="text-muted-foreground">Upload your ID card to complete registration</p>
              </div>

              <form onSubmit={handleSubmit} className="space-y-5">
                <div>
                  <label className="block text-sm font-medium text-foreground mb-2">
                    ID Card - Front
                  </label>
                  <label className="flex flex-col items-center justify-center w-full h-32 border-2 border-dashed border-input rounded-lg cursor-pointer hover:bg-muted/50 transition-colors">
                    {idFront ? (
                      <div className="flex items-center gap-2 text-primary">
                        <CheckCircle2 className="w-5 h-5" />
                        <span className="text-sm font-medium">{idFront.name}</span>
                      </div>
                    ) : (
                      <div className="flex flex-col items-center gap-2 text-muted-foreground">
                        <Upload className="w-8 h-8" />
                        <span className="text-sm">Click to upload front of ID</span>
                      </div>
                    )}
                    <input
                      type="file"
                      accept="image/*"
                      className="hidden"
                      onChange={(e) => setIdFront(e.target.files?.[0] || null)}
                    />
                  </label>
                </div>

                <div>
                  <label className="block text-sm font-medium text-foreground mb-2">
                    ID Card - Back
                  </label>
                  <label className="flex flex-col items-center justify-center w-full h-32 border-2 border-dashed border-input rounded-lg cursor-pointer hover:bg-muted/50 transition-colors">
                    {idBack ? (
                      <div className="flex items-center gap-2 text-primary">
                        <CheckCircle2 className="w-5 h-5" />
                        <span className="text-sm font-medium">{idBack.name}</span>
                      </div>
                    ) : (
                      <div className="flex flex-col items-center gap-2 text-muted-foreground">
                        <Upload className="w-8 h-8" />
                        <span className="text-sm">Click to upload back of ID</span>
                      </div>
                    )}
                    <input
                      type="file"
                      accept="image/*"
                      className="hidden"
                      onChange={(e) => setIdBack(e.target.files?.[0] || null)}
                    />
                  </label>
                </div>

                <p className="text-xs text-muted-foreground text-center">
                  Your ID is securely stored and only used for verification purposes. 
                  We'll never share your information.
                </p>

                <div className="flex gap-3">
                  <Button type="button" variant="outline" className="flex-1" onClick={() => setStep('info')}>
                    Back
                  </Button>
                  <Button type="submit" className="flex-1">
                    Submit
                  </Button>
                </div>
              </form>
            </>
          )}

          <div className="mt-6 text-center">
            <p className="text-sm text-muted-foreground">
              Already have an account?{' '}
              <Link to="/login" className="text-primary font-medium hover:underline">
                Sign in
              </Link>
            </p>
          </div>
        </div>
      </div>
    </div>
  );
}
