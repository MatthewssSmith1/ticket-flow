import Auth, { Divider, NavText, authSchema, Credentials } from "@/components/auth/Auth"
import { zodResolver } from '@hookform/resolvers/zod'
import { useState } from 'react'
import { useForm } from 'react-hook-form'
import { Button } from "@ui/button"
import { Input } from "@ui/input"
import { Label } from "@ui/label"
import supabase from '@/lib/supabase'
import { useToast } from "@/hooks/use-toast"

export default function Signup() {
  const [loading, setLoading] = useState(false)
  const [isPasswordSignup, setIsPasswordSignup] = useState(true)
  const { toast } = useToast()
  
  const form = useForm<Credentials>({
    resolver: zodResolver(authSchema),
    defaultValues: {
      email: '@example.com',
      password: 'password'
    }
  })

  const handleSignup = async (data: Credentials) => {
    setLoading(true)

    try {
      const { error } = isPasswordSignup
        ? await supabase.auth.signUp({
            email: data.email,
            password: data.password || ''
          })
        : await supabase.auth.signInWithOtp({ 
            email: data.email 
          })

      if (error) throw error
      toast({
        title: "Success",
        description: isPasswordSignup 
          ? 'Check your email to confirm your account!' 
          : 'Check your email for the magic link!'
      })
    } catch (error) {
      console.log(error)
      toast({
        title: "Error",
        description: error instanceof Error ? error.message : "Something went wrong",
        variant: "destructive"
      })
    } finally {
      setLoading(false)
    }
  }

  return (
    <Auth title="Create an account">
      <form onSubmit={form.handleSubmit(handleSignup)}>
        <div className="space-y-2">
          <Label htmlFor="email">Email address</Label>
          <Input
            {...form.register('email')}
            id="email"
            type="email"
            placeholder="you@example.com"
          />
          {form.formState.errors.email && (
            <p className="text-sm text-destructive">{form.formState.errors.email.message}</p>
          )}
        </div>

        {isPasswordSignup && (
          <div className="space-y-2">
            <Label htmlFor="password">Password</Label>
            <Input
              {...form.register('password')}
              id="password"
              type="password"
            />
            {form.formState.errors.password && (
              <p className="text-sm text-destructive">{form.formState.errors.password.message}</p>
            )}
          </div>
        )}

        <Button type="submit" className="w-full" disabled={loading}>
          {loading 
            ? (isPasswordSignup ? 'Creating account...' : 'Sending magic link...') 
            : (isPasswordSignup ? 'Create account' : 'Send magic link')}
        </Button>

        <Divider />

        <Button
          type="button"
          variant="outline"
          className="w-full"
          onClick={() => setIsPasswordSignup(!isPasswordSignup)}
        >
          {isPasswordSignup ? 'Sign up with magic link' : 'Sign up with password'}
        </Button>
      </form>
      <NavText 
        text="Already have an account?"
        to="/login"
        linkText="Log in"
      />
    </Auth>
  )
} 