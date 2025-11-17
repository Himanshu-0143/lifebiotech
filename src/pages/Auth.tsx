import { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '@/contexts/AuthContext';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { useToast } from '@/hooks/use-toast';
import { supabase } from '@/integrations/supabase/client';
import { sendOTPEmail, generateOTP } from '@/lib/email';
import { z } from 'zod';

const signInSchema = z.object({
  email: z.string().email('Invalid email address'),
  password: z.string().min(6, 'Password must be at least 6 characters'),
});

const signUpSchema = signInSchema.extend({
  fullName: z.string().min(2, 'Full name must be at least 2 characters'),
  confirmPassword: z.string(),
}).refine((data) => data.password === data.confirmPassword, {
  message: "Passwords don't match",
  path: ['confirmPassword'],
});

export default function Auth() {
  const [activeTab, setActiveTab] = useState('signin');
  const [loading, setLoading] = useState(false);
  const [errors, setErrors] = useState<Record<string, string>>({});
  const [showOTPInput, setShowOTPInput] = useState(false);
  const [signupData, setSignupData] = useState<any>(null);
  const [otpSent, setOtpSent] = useState(false);
  const [showForgotPassword, setShowForgotPassword] = useState(false);
  const [resetEmail, setResetEmail] = useState('');
  const [showResetOTP, setShowResetOTP] = useState(false);
  const [newPassword, setNewPassword] = useState('');
  const [confirmNewPassword, setConfirmNewPassword] = useState('');
  const { signIn, signUp, user } = useAuth();
  const { toast } = useToast();
  const navigate = useNavigate();

  useEffect(() => {
    if (user) {
      navigate('/');
    }
  }, [user, navigate]);

  const handleSignIn = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    setErrors({});
    setLoading(true);

    const formData = new FormData(e.currentTarget);
    const data = {
      email: formData.get('email') as string,
      password: formData.get('password') as string,
    };

    try {
      signInSchema.parse(data);
      const { error } = await signIn(data.email, data.password);
      if (!error) {
        navigate('/');
      }
    } catch (error) {
      if (error instanceof z.ZodError) {
        const fieldErrors: Record<string, string> = {};
        error.errors.forEach((err) => {
          if (err.path[0]) {
            fieldErrors[err.path[0] as string] = err.message;
          }
        });
        setErrors(fieldErrors);
      }
    } finally {
      setLoading(false);
    }
  };



  const handleSignUp = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    setErrors({});
    setLoading(true);

    const formData = new FormData(e.currentTarget);
    const data = {
      email: formData.get('email') as string,
      password: formData.get('password') as string,
      fullName: formData.get('fullName') as string,
      confirmPassword: formData.get('confirmPassword') as string,
    };

    try {
      signUpSchema.parse(data);
      
      // Generate and send OTP
      const otp = generateOTP();
      
      // Store OTP in database
      const { error: otpError } = await (supabase as any)
        .from('email_otp')
        .insert({
          email: data.email,
          otp: otp,
        });

      if (otpError) {
        throw new Error('Failed to generate OTP');
      }

      // Send OTP email
      const emailResult = await sendOTPEmail(data.email, otp);
      
      if (!emailResult.success) {
        throw new Error(emailResult.error || 'Failed to send OTP email');
      }

      // Store signup data for later use
      setSignupData(data);
      setShowOTPInput(true);
      setOtpSent(true);
      
      toast({
        title: 'OTP Sent!',
        description: `Please check ${data.email} for your verification code.`,
      });
    } catch (error: any) {
      if (error instanceof z.ZodError) {
        const fieldErrors: Record<string, string> = {};
        error.errors.forEach((err) => {
          if (err.path[0]) {
            fieldErrors[err.path[0] as string] = err.message;
          }
        });
        setErrors(fieldErrors);
      } else {
        toast({
          title: 'Error',
          description: error.message || 'Failed to send OTP. Please try again.',
          variant: 'destructive',
        });
      }
    } finally {
      setLoading(false);
    }
  };

  const handleVerifyOTP = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    setLoading(true);
    setErrors({});

    const formData = new FormData(e.currentTarget);
    const enteredOTP = formData.get('otp') as string;

    try {
      // Verify OTP from database
      const { data: otpData, error: otpError } = await (supabase as any)
        .from('email_otp')
        .select('*')
        .eq('email', signupData.email)
        .eq('otp', enteredOTP)
        .eq('verified', false)
        .gt('expires_at', new Date().toISOString())
        .order('created_at', { ascending: false })
        .limit(1)
        .maybeSingle();

      if (otpError || !otpData) {
        throw new Error('Invalid or expired OTP');
      }

      // Mark OTP as verified
      await (supabase as any)
        .from('email_otp')
        .update({ verified: true })
        .eq('id', otpData.id);

      // Create user account
      const { error: signUpError } = await signUp(
        signupData.email,
        signupData.password,
        signupData.fullName
      );

      if (signUpError) {
        throw new Error(signUpError.message);
      }

      toast({
        title: 'Account Created!',
        description: 'Your email has been verified. You can now sign in.',
      });

      // Reset state and switch to sign in
      setShowOTPInput(false);
      setSignupData(null);
      setActiveTab('signin');
    } catch (error: any) {
      toast({
        title: 'Verification Failed',
        description: error.message || 'Invalid OTP. Please try again.',
        variant: 'destructive',
      });
    } finally {
      setLoading(false);
    }
  };

  const handleForgotPassword = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    setLoading(true);
    setErrors({});

    const formData = new FormData(e.currentTarget);
    const email = formData.get('resetEmail') as string;

    try {
      // Generate and send OTP (we'll send regardless of whether user exists for security)
      const otp = generateOTP();
      
      const { error: otpError } = await (supabase as any)
        .from('email_otp')
        .insert({
          email: email,
          otp: otp,
        });

      if (otpError) {
        throw new Error('Failed to generate OTP');
      }

      const emailResult = await sendOTPEmail(email, otp);
      
      if (!emailResult.success) {
        throw new Error(emailResult.error || 'Failed to send OTP email');
      }

      setResetEmail(email);
      setShowResetOTP(true);
      
      toast({
        title: 'OTP Sent!',
        description: `Please check ${email} for your verification code.`,
      });
    } catch (error: any) {
      toast({
        title: 'Error',
        description: 'Failed to send reset code. Please check your email and try again.',
        variant: 'destructive',
      });
    } finally {
      setLoading(false);
    }
  };

  const handleVerifyResetOTP = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    setLoading(true);
    setErrors({});

    const formData = new FormData(e.currentTarget);
    const enteredOTP = formData.get('resetOtp') as string;
    const newPass = formData.get('newPassword') as string;
    const confirmPass = formData.get('confirmNewPassword') as string;

    try {
      if (newPass !== confirmPass) {
        throw new Error('Passwords do not match');
      }

      if (newPass.length < 6) {
        throw new Error('Password must be at least 6 characters');
      }

      // Verify OTP
      const { data: otpData, error: otpError } = await (supabase as any)
        .from('email_otp')
        .select('*')
        .eq('email', resetEmail)
        .eq('otp', enteredOTP)
        .eq('verified', false)
        .gt('expires_at', new Date().toISOString())
        .order('created_at', { ascending: false })
        .limit(1)
        .maybeSingle();

      if (otpError || !otpData) {
        throw new Error('Invalid or expired OTP');
      }

      // Mark OTP as verified
      await (supabase as any)
        .from('email_otp')
        .update({ verified: true })
        .eq('id', otpData.id);

      // Use Supabase password recovery flow
      const { error: resetError } = await supabase.auth.resetPasswordForEmail(resetEmail, {
        redirectTo: `${window.location.origin}/auth?reset=true`,
      });

      if (resetError) {
        throw new Error('Failed to send password reset link');
      }

      toast({
        title: 'Reset Link Sent!',
        description: 'Please check your email for a password reset link.',
      });

      // Reset state
      setShowForgotPassword(false);
      setShowResetOTP(false);
      setResetEmail('');
      setNewPassword('');
      setConfirmNewPassword('');
      setActiveTab('signin');
    } catch (error: any) {
      toast({
        title: 'Reset Failed',
        description: error.message || 'Failed to reset password. Please try again.',
        variant: 'destructive',
      });
    } finally {
      setLoading(false);
    }
  };

  

  return (
    <div className="min-h-[calc(100vh-200px)] flex items-center justify-center py-12">
      <div className="container-custom max-w-md">
        <div className="text-center mb-8">
          <h1 className="text-3xl font-bold gradient-text mb-2">Welcome to Life Biotech</h1>
          <p className="text-muted-foreground">Sign in to manage your orders and profile</p>
        </div>

        {showForgotPassword ? (
          <Card>
            <CardHeader>
              <CardTitle>{showResetOTP ? 'Reset Password' : 'Forgot Password'}</CardTitle>
              <CardDescription>
                {showResetOTP 
                  ? 'Enter the OTP and your new password'
                  : 'Enter your email to receive a verification code'}
              </CardDescription>
            </CardHeader>
            <CardContent>
              {showResetOTP ? (
                <form onSubmit={handleVerifyResetOTP} className="space-y-4">
                  <div>
                    <Label htmlFor="resetOtp">Verification Code</Label>
                    <Input
                      id="resetOtp"
                      name="resetOtp"
                      type="text"
                      placeholder="123456"
                      maxLength={6}
                      required
                      className="text-center text-2xl tracking-widest"
                    />
                  </div>
                  <div>
                    <Label htmlFor="newPassword">New Password</Label>
                    <Input
                      id="newPassword"
                      name="newPassword"
                      type="password"
                      placeholder="••••••••"
                      required
                      value={newPassword}
                      onChange={(e) => setNewPassword(e.target.value)}
                    />
                  </div>
                  <div>
                    <Label htmlFor="confirmNewPassword">Confirm New Password</Label>
                    <Input
                      id="confirmNewPassword"
                      name="confirmNewPassword"
                      type="password"
                      placeholder="••••••••"
                      required
                      value={confirmNewPassword}
                      onChange={(e) => setConfirmNewPassword(e.target.value)}
                    />
                  </div>
                  <div className="flex gap-2">
                    <Button type="submit" className="flex-1 btn-primary" disabled={loading}>
                      {loading ? 'Resetting...' : 'Reset Password'}
                    </Button>
                    <Button 
                      type="button" 
                      variant="outline" 
                      onClick={() => {
                        setShowResetOTP(false);
                        setShowForgotPassword(false);
                      }}
                    >
                      Back
                    </Button>
                  </div>
                </form>
              ) : (
                <form onSubmit={handleForgotPassword} className="space-y-4">
                  <div>
                    <Label htmlFor="resetEmail">Email</Label>
                    <Input
                      id="resetEmail"
                      name="resetEmail"
                      type="email"
                      placeholder="your@email.com"
                      required
                      value={resetEmail}
                      onChange={(e) => setResetEmail(e.target.value)}
                    />
                  </div>
                  <div className="flex gap-2">
                    <Button type="submit" className="flex-1 btn-primary" disabled={loading}>
                      {loading ? 'Sending...' : 'Send Verification Code'}
                    </Button>
                    <Button 
                      type="button" 
                      variant="outline" 
                      onClick={() => setShowForgotPassword(false)}
                    >
                      Back
                    </Button>
                  </div>
                </form>
              )}
            </CardContent>
          </Card>
        ) : (
          <Tabs value={activeTab} onValueChange={setActiveTab}>
          <TabsList className="grid w-full grid-cols-2">
            <TabsTrigger value="signin">Sign In</TabsTrigger>
            <TabsTrigger value="signup">Sign Up</TabsTrigger>
          </TabsList>

          <TabsContent value="signin">
            <Card>
              <CardHeader>
                <CardTitle>Sign In</CardTitle>
                <CardDescription>Enter your credentials to access your account</CardDescription>
              </CardHeader>
              <CardContent>
                <form onSubmit={handleSignIn} className="space-y-4">
                  <div>
                    <Label htmlFor="signin-email">Email</Label>
                    <Input
                      id="signin-email"
                      name="email"
                      type="email"
                      placeholder="your@email.com"
                      required
                    />
                    {errors.email && (
                      <p className="text-sm text-destructive mt-1">{errors.email}</p>
                    )}
                  </div>
                  <div>
                    <Label htmlFor="signin-password">Password</Label>
                    <Input
                      id="signin-password"
                      name="password"
                      type="password"
                      placeholder="••••••••"
                      required
                    />
                    {errors.password && (
                      <p className="text-sm text-destructive mt-1">{errors.password}</p>
                    )}
                  </div>
                  <Button type="submit" className="w-full btn-primary" disabled={loading}>
                    {loading ? 'Signing in...' : 'Sign In'}
                  </Button>
                  <div className="text-center mt-4">
                    <button
                      type="button"
                      onClick={() => setShowForgotPassword(true)}
                      className="text-sm text-primary hover:underline"
                    >
                      Forgot Password?
                    </button>
                  </div>
                </form>
              </CardContent>
            </Card>
          </TabsContent>

          <TabsContent value="signup">
            <Card>
              <CardHeader>
                <CardTitle>{showOTPInput ? 'Verify Email' : 'Create Account'}</CardTitle>
                <CardDescription>
                  {showOTPInput 
                    ? 'Enter the 6-digit code sent to your email'
                    : 'Sign up to start ordering quality medicines'}
                </CardDescription>
              </CardHeader>
              <CardContent>
                {showOTPInput ? (
                  <form onSubmit={handleVerifyOTP} className="space-y-4">
                    <div>
                      <Label htmlFor="otp">Verification Code</Label>
                      <Input
                        id="otp"
                        name="otp"
                        type="text"
                        placeholder="123456"
                        maxLength={6}
                        required
                        className="text-center text-2xl tracking-widest"
                      />
                      <p className="text-sm text-muted-foreground mt-2">
                        Check your email for the 6-digit verification code
                      </p>
                    </div>
                    <div className="flex gap-2">
                      <Button type="submit" className="flex-1 btn-primary" disabled={loading}>
                        {loading ? 'Verifying...' : 'Verify OTP'}
                      </Button>
                      <Button 
                        type="button" 
                        variant="outline" 
                        onClick={() => {
                          setShowOTPInput(false);
                          setSignupData(null);
                        }}
                      >
                        Back
                      </Button>
                    </div>
                  </form>
                ) : (
                  <form onSubmit={handleSignUp} className="space-y-4">
                  <div>
                    <Label htmlFor="signup-name">Full Name</Label>
                    <Input
                      id="signup-name"
                      name="fullName"
                      type="text"
                      placeholder="John Doe"
                      required
                    />
                    {errors.fullName && (
                      <p className="text-sm text-destructive mt-1">{errors.fullName}</p>
                    )}
                  </div>
                  <div>
                    <Label htmlFor="signup-email">Email</Label>
                    <Input
                      id="signup-email"
                      name="email"
                      type="email"
                      placeholder="your@email.com"
                      required
                    />
                    {errors.email && (
                      <p className="text-sm text-destructive mt-1">{errors.email}</p>
                    )}
                  </div>
                  <div>
                    <Label htmlFor="signup-password">Password</Label>
                    <Input
                      id="signup-password"
                      name="password"
                      type="password"
                      placeholder="••••••••"
                      required
                    />
                    {errors.password && (
                      <p className="text-sm text-destructive mt-1">{errors.password}</p>
                    )}
                  </div>
                  <div>
                    <Label htmlFor="signup-confirm">Confirm Password</Label>
                    <Input
                      id="signup-confirm"
                      name="confirmPassword"
                      type="password"
                      placeholder="••••••••"
                      required
                    />
                    {errors.confirmPassword && (
                      <p className="text-sm text-destructive mt-1">{errors.confirmPassword}</p>
                    )}
                  </div>
                  <Button type="submit" className="w-full btn-primary" disabled={loading}>
                    {loading ? 'Sending OTP...' : 'Send Verification Code'}
                  </Button>
                </form>
                )}
              </CardContent>
            </Card>
          </TabsContent>
        </Tabs>
        )}
      </div>
    </div>
  );
}
