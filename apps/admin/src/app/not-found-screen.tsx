import { useNavigate } from 'react-router';
import { EmptyState } from '../shared/components/empty-state';
import { PageHeader } from '../shared/layout/page-header';

export function NotFoundScreen() {
  const navigate = useNavigate();
  return (
    <>
      <PageHeader title="Nije pronađeno" subtitle="Ova stranica ne postoji." />
      <EmptyState
        icon="doc"
        title="Stranica nije pronađena."
        action={{ label: 'Natrag na Pregled', onClick: () => navigate('/') }}
      >
        Poveznica je možda zastarjela ili pogrešno upisana.
      </EmptyState>
    </>
  );
}
