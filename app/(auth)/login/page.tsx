'use client';

import { useState } from 'react';
import Link from 'next/link';
import { useRouter } from 'next/navigation';
import { Package, Eye, EyeOff } from 'lucide-react';
import { Formik, Form, Field } from 'formik';
import * as Yup from 'yup';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from '@/components/ui/card';
import { Separator } from '@/components/ui/separator';
import { toast } from 'sonner';
import { supabase } from '@/lib/supabase/client';
import { handleAuthError } from '@/lib/supabase/error-handler';

const LoginSchema = Yup.object().shape({
  email: Yup.string()
    .email('Invalid email address')
    .required('Email is required'),
  password: Yup.string().required('Password is required'),
});

interface LoginFormValues {
  email: string;
  password: string;
}

export default function LoginPage() {
  const router = useRouter();
  const [showPassword, setShowPassword] = useState(false);
  const [isResendingEmail, setIsResendingEmail] = useState(false);
  const [unconfirmedEmail, setUnconfirmedEmail] = useState('');
  const [loginAttempts, setLoginAttempts] = useState(0);

  const initialValues: LoginFormValues = {
    email: '',
    password: '',
  };

  const handleResendConfirmation = async () => {
    if (!unconfirmedEmail) return;

    setIsResendingEmail(true);
    try {
      const { error } = await supabase.auth.resend({
        type: 'signup',
        email: unconfirmedEmail,
      });

      if (error) {
        throw error;
      }

      toast.success('Confirmation email sent', {
        description: 'Please check your inbox for the confirmation link',
        duration: 5000,
      });
    } catch (error: any) {
      handleAuthError(error);
    } finally {
      setIsResendingEmail(false);
    }
  };

  const handleSubmit = async (
    values: LoginFormValues,
    { setSubmitting, setFieldError }: any
  ) => {
    try {
      const { data, error } = await supabase.auth.signInWithPassword({
        email: values.email,
        password: values.password,
      });

      if (error) {
        setLoginAttempts((prev) => prev + 1);

        if (error.message === 'Email not confirmed') {
          setUnconfirmedEmail(values.email);
        }

        if (
          error.message === 'Invalid login credentials' &&
          loginAttempts >= 2
        ) {
          setFieldError('email', 'Too many failed attempts');
          setFieldError('password', 'Too many failed attempts');
          toast.error('Too many failed attempts', {
            description: 'Please try resetting your password',
            duration: 5000,
            action: {
              label: 'Reset password',
              onClick: () => router.push('/forgot-password'),
            },
          });
          return;
        }

        handleAuthError(error);
        return;
      }

      if (data.user) {
        // Wait for the session to be established
        const {
          data: { session },
          error: sessionError,
        } = await supabase.auth.getSession();

        if (sessionError) {
          throw sessionError;
        }

        if (session) {
          toast.success('Welcome back!', {
            description: 'You have successfully signed in',
          });

          // Use replace instead of push to prevent back navigation to login
          router.replace('/dashboard');
        }
      }
    } catch (error: any) {
      handleAuthError(error);
    } finally {
      setSubmitting(false);
    }
  };

  return (
    <Card className="border-none shadow-lg">
      <CardHeader className="space-y-4">
        <div className="flex items-center justify-center">
          <div className="bg-primary/10 p-3 rounded-xl">
            <Package className="h-6 w-6 text-primary" />
          </div>
        </div>
        <div className="space-y-2 text-center">
          <CardTitle className="text-2xl font-bold">Welcome back</CardTitle>
          <CardDescription>
            Enter your email to sign in to your account
          </CardDescription>
        </div>
      </CardHeader>
      <CardContent>
        <Formik
          initialValues={initialValues}
          validationSchema={LoginSchema}
          onSubmit={handleSubmit}
        >
          {({ errors, touched, isSubmitting }) => (
            <Form className="space-y-4">
              <div className="space-y-2">
                <Label htmlFor="email">Email</Label>
                <Field
                  as={Input}
                  id="email"
                  name="email"
                  placeholder="name@example.com"
                  type="email"
                  autoCapitalize="none"
                  autoComplete="email"
                  autoCorrect="off"
                />
                {errors.email && touched.email && (
                  <p className="text-sm text-destructive">{errors.email}</p>
                )}
              </div>
              <div className="space-y-2">
                <div className="flex items-center justify-between">
                  <Label htmlFor="password">Password</Label>
                  <Link
                    href="/forgot-password"
                    className="text-sm text-primary hover:underline"
                  >
                    Forgot password?
                  </Link>
                </div>
                <div className="relative">
                  <Field
                    as={Input}
                    id="password"
                    name="password"
                    type={showPassword ? 'text' : 'password'}
                  />
                  <Button
                    type="button"
                    variant="ghost"
                    size="icon"
                    className="absolute right-0 top-0 h-full px-3 py-2 hover:bg-transparent"
                    onClick={() => setShowPassword(!showPassword)}
                  >
                    {showPassword ? (
                      <EyeOff className="h-4 w-4 text-muted-foreground" />
                    ) : (
                      <Eye className="h-4 w-4 text-muted-foreground" />
                    )}
                    <span className="sr-only">
                      {showPassword ? 'Hide password' : 'Show password'}
                    </span>
                  </Button>
                </div>
                {errors.password && touched.password && (
                  <p className="text-sm text-destructive">{errors.password}</p>
                )}
              </div>
              {unconfirmedEmail && (
                <div className="p-4 border rounded-lg bg-yellow-50 dark:bg-yellow-900/10">
                  <p className="text-sm text-yellow-800 dark:text-yellow-200 mb-2">
                    Please confirm your email address before signing in.
                  </p>
                  <Button
                    type="button"
                    variant="outline"
                    size="sm"
                    onClick={handleResendConfirmation}
                    disabled={isResendingEmail}
                  >
                    {isResendingEmail
                      ? 'Sending...'
                      : 'Resend confirmation email'}
                  </Button>
                </div>
              )}
              {loginAttempts >= 2 && (
                <div className="p-4 border rounded-lg bg-red-50 dark:bg-red-900/10">
                  <p className="text-sm text-red-800 dark:text-red-200">
                    Multiple failed login attempts detected. Consider resetting
                    your password if you're having trouble.
                  </p>
                  <Link href="/forgot-password">
                    <Button
                      type="button"
                      variant="outline"
                      size="sm"
                      className="mt-2"
                    >
                      Reset Password
                    </Button>
                  </Link>
                </div>
              )}
              <Button className="w-full" type="submit" disabled={isSubmitting}>
                {isSubmitting ? 'Signing in...' : 'Sign in'}
              </Button>
            </Form>
          )}
        </Formik>

        <div className="mt-6">
          <div className="relative">
            <div className="absolute inset-0 flex items-center">
              <Separator />
            </div>
            <div className="relative flex justify-center text-xs uppercase">
              <span className="bg-background px-2 text-muted-foreground">
                Or continue with
              </span>
            </div>
          </div>

          <div className="mt-4 space-y-3">
            <Button variant="outline" className="w-full" type="button">
              <svg role="img" viewBox="0 0 24 24" className="mr-2 h-4 w-4">
                <path
                  fill="currentColor"
                  d="M12.48 10.92v3.28h7.84c-.24 1.84-.853 3.187-1.787 4.133-1.147 1.147-2.933 2.4-6.053 2.4-4.827 0-8.6-3.893-8.6-8.72s3.773-8.72 8.6-8.72c2.6 0 4.507 1.027 5.907 2.347l2.307-2.307C18.747 1.44 16.133 0 12.48 0 5.867 0 .307 5.387.307 12s5.56 12 12.173 12c3.573 0 6.267-1.173 8.373-3.36 2.16-2.16 2.84-5.213 2.84-7.667 0-.76-.053-1.467-.173-2.053H12.48z"
                />
              </svg>
              Google
            </Button>
            <Button variant="outline" className="w-full" type="button">
              <svg role="img" viewBox="0 0 24 24" className="mr-2 h-4 w-4">
                <path
                  fill="currentColor"
                  d="M24 12.073c0-6.627-5.373-12-12-12s-12 5.373-12 12c0 5.99 4.388 10.954 10.125 11.854v-8.385H7.078v-3.47h3.047V9.43c0-3.007 1.792-4.669 4.533-4.669 1.312 0 2.686.235 2.686.235v2.953H15.83c-1.491 0-1.956.925-1.956 1.874v2.25h3.328l-.532 3.47h-2.796v8.385C19.612 23.027 24 18.062 24 12.073z"
                />
              </svg>
              Facebook
            </Button>
          </div>
        </div>

        <div className="mt-6 text-center text-sm">
          Don't have an account?{' '}
          <Link href="/signup" className="text-primary hover:underline">
            Sign up
          </Link>
        </div>
      </CardContent>
    </Card>
  );
}