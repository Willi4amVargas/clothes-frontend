import type { LinkProps } from '@tanstack/react-router'
import { Link } from '@tanstack/react-router'
import {
  Breadcrumb,
  BreadcrumbItem,
  BreadcrumbLink,
  BreadcrumbList,
  BreadcrumbSeparator,
} from './ui/breadcrumb'

interface LinkPropsExtend extends LinkProps {
  name: string
}

export const BreadcrumbMain = ({
  routes,
  main,
}: {
  routes: ReadonlyArray<LinkPropsExtend>
  main: string
}) => {
  return (
    <Breadcrumb className="mt-1">
      <BreadcrumbList>
        {routes.map((route) => (
          <>
            <BreadcrumbItem key={route.to}>
              <BreadcrumbLink asChild>
                <Link {...route}>{route.name}</Link>
              </BreadcrumbLink>
            </BreadcrumbItem>
            <BreadcrumbSeparator />
          </>
        ))}
        <BreadcrumbItem>
          <BreadcrumbLink>{main}</BreadcrumbLink>
        </BreadcrumbItem>
      </BreadcrumbList>
    </Breadcrumb>
  )
}
