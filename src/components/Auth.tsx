import { Card, CardContent, CardHeader } from "@/components/ui/card"
import { FormEvent } from "react"

interface AuthProps {
  children: React.ReactNode
  title: string
  onSubmit: (e: FormEvent<HTMLFormElement>) => void
}

export default function Auth({ children, title, onSubmit }: AuthProps) {
  return (
    <main className="min-h-screen grid place-items-center p-4">
      <Card className="w-full max-w-md">
        <CardHeader>
          <h1 className="text-2xl font-semibold text-center">{title}</h1>
        </CardHeader>
        <CardContent>
          <form onSubmit={onSubmit} className="space-y-4">
            {children}
          </form>
        </CardContent>
      </Card>
    </main>
  )
}
