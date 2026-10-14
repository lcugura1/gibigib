import { EmptyState } from '../shared/components/empty-state';
import { PageHeader } from '../shared/layout/page-header';

export function ComingSoonScreen() {
  return (
    <>
      <PageHeader title="U izradi" subtitle="Ovaj dio administracije još nije dostupan." />
      <EmptyState icon="doc" title="Stranica još nije gotova.">
        Vrati se na Pregled ili Članove dok ovaj dio ne bude spreman.
      </EmptyState>
    </>
  );
}
