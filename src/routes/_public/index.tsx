import { createFileRoute } from '@tanstack/react-router'

export const Route = createFileRoute('/_public/')({
  component: Index,
})

function Index() {
  return <div className="p-2">Index</div>
}
