import { createFileRoute, redirect } from '@tanstack/react-router'

export const Route = createFileRoute('/')({
  beforeLoad: () => {
    throw redirect({
      to: '/portal',
    })
  },
  component: RouteComponent,
  head: () => ({
    links: [
      {
        rel: 'icon',
        href: '/favicon.ico',
      },
    ],
  })
})

function RouteComponent() {
  return <div>Hello "/"!</div>
}
