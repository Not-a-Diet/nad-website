import { ReactElement, lazy, createElement, Suspense } from 'react';
import Loader from '../components/Loader';
import SectionErrorBoundary from '../components/SectionErrorBoundary';

export default function componentResolver(section: any, index: number): ReactElement {
  const names: string[] = section.__component.split('.')
  const category = names[0]
  const component = names[1]

  const parts: string[] = component.split('-')
  let componentName = ''
  parts.forEach(s => {
    componentName += capitalizeFirstLetter(s)
  })

  let module = lazy(() => import(`../components/${componentName}`))

  const reactElement = createElement(module, { data: section, key: index })

  return (
    <SectionErrorBoundary key={index}>
      <Suspense fallback={<Loader />}>
        {reactElement}
      </Suspense>
    </SectionErrorBoundary>
  )
}

function capitalizeFirstLetter(s: string) {
  return s.charAt(0).toUpperCase() + s.slice(1);
}