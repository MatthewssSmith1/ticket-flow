import Auth, { Divider, NavText, authSchema, Credentials } from "@/components/auth/Auth"
import { zodResolver } from '@hookform/resolvers/zod'
import { useNavigate } from "@tanstack/react-router"
import { useState } from 'react'
import { useForm } from 'react-hook-form'
import { Button } from "@ui/button"
import { Input } from "@ui/input"
import { Label } from "@ui/label"
import supabase from '@/lib/supabase'
import { useToast } from "@/hooks/use-toast"

export default function Login() {
  const [loading, setLoading] = useState(false)
  const [isPasswordLogin, setIsPasswordLogin] = useState(true)
  const navigate = useNavigate()  
  const { toast } = useToast()

  const form = useForm<Credentials>({
    resolver: zodResolver(authSchema),
    defaultValues: {
      email: '@example.com',
      password: 'password'
    }
  })

  const handleLogin = async (data: Credentials) => {
    setLoading(true)

    try {
      const { error } = isPasswordLogin
        ? await supabase.auth.signInWithPassword({
            email: data.email,
            password: data.password || ''
          })
        : await supabase.auth.signInWithOtp({ 
            email: data.email 
          })

      if (error) throw error

      if (isPasswordLogin) {
        navigate({ to: '/tickets' })
      } else {
        toast({
          title: "Success",
          description: 'Check your email for the login link!'
        })
      }
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
    <Auth title="Welcome back">
      <form onSubmit={form.handleSubmit(handleLogin)}>
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

        {isPasswordLogin && (
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
            ? (isPasswordLogin ? 'Signing in...' : 'Sending magic link...') 
            : (isPasswordLogin ? 'Sign in' : 'Send magic link')}
        </Button>

        <Divider />

        <Button
          type="button"
          variant="outline"
          className="w-full"
          onClick={() => setIsPasswordLogin(!isPasswordLogin)}
        >
          {isPasswordLogin ? 'Sign in with magic link' : 'Sign in with password'}
        </Button>
      </form>
      <NavText 
        text="Don't have an account?"
        to="/signup"
        linkText="Sign up"
      />
    </Auth>
  )
}
