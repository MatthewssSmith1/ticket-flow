import { Card, CardContent, CardHeader } from "@/components/ui/card"
import { Separator } from "@/components/ui/separator"
import { Link } from "@tanstack/react-router"
import { z } from 'zod'

export const authSchema = z.object({
  email: z.string().email('Please enter a valid email'),
  password: z.string()
    .refine((val) => {
      // If password is empty, it's for magic link flow
      if (!val) return true

      return val.length >= 6
    }, 'Password must be at least 6 characters')
})

export type Credentials = z.infer<typeof authSchema>

interface AuthProps {
  children: React.ReactNode
  title: string
}

export default function Auth({ children, title }: AuthProps) {
  return (
    <main className="min-h-screen grid place-items-center p-4">
      <Card className="w-full max-w-sm">
        <CardHeader>
          <h1 className="text-2xl font-semibold text-center">{title}</h1>
        </CardHeader>
        <CardContent className="[&>form]:space-y-4">
          {children}
        </CardContent>
      </Card>
    </main>
  )
}

export function Divider() {
  return <div className="relative">
    <div className="absolute inset-0 flex items-center">
      <Separator />
    </div>
    <div className="relative flex justify-center text-xs uppercase">
      <span className="bg-background px-2 text-muted-foreground">or</span>
    </div>
  </div>
}

interface NavTextProps {
  text: string
  to: string
  linkText: string
}

export function NavText({ text, to, linkText }: NavTextProps) {
  return (
    <p className="text-center text-sm text-muted-foreground mt-6">
      {text}{' '}
      <Link to={to} className="font-medium underline underline-offset-4 hover:text-primary">
        {linkText}
      </Link>
    </p>
  )
} 