import CatalogPage from '@/pages/catalog';
import { createFileRoute } from '@tanstack/react-router';

export const Route = createFileRoute('/catalog/')({
  component: CatalogComponent,
});

function CatalogComponent() {

  return <CatalogPage />

}
