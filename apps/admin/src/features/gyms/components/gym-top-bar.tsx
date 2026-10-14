import type { CatalogDto } from '@gibigib/types';
import { useNavigate } from 'react-router';
import { SearchField } from '../../../shared/components/search-field';
import { SegmentedControl } from '../../../shared/components/segmented-control';
import { SelectField } from '../../../shared/components/select-field';
import { gymColor } from '../../../shared/domain/palette';
import { BackBar } from '../../../shared/layout/back-bar';
import { memberSearch$, setMemberSearch } from '../../../shared/layout/member-search';
import { GYMS_NAV, MEMBERS_HREF } from '../../../shared/layout/navigation';
import { ProfileButton } from '../../../shared/layout/page-header';
import { useViewport } from '../../../shared/layout/viewport';
import { useObservable } from '../../../shared/lib/use-observable';
import styles from './gym-top-bar.module.css';

interface GymTopBarProps {
  catalog: CatalogDto;
  gymId: string;
}

export function GymTopBar({ catalog, gymId }: GymTopBarProps) {
  const viewport = useViewport();
  const navigate = useNavigate();
  const search = useObservable(memberSearch$, memberSearch$.value);
  const options = catalog.gyms.map((gym) => ({ value: gym.id, label: gym.name }));
  const select = (id: string) => navigate(`${GYMS_NAV.href}/${id}`);

  if (viewport === 'phone') {
    return (
      <div className={styles.phone}>
        <BackBar to="/" label="Pregled" phoneTitle="Teretane" />
        <SelectField
          label="Teretana"
          value={gymId}
          options={options}
          onChange={select}
          dotColor={gymColor(
            options.map((o) => o.value),
            gymId,
          )}
        />
      </div>
    );
  }

  return (
    <div className={styles.bar}>
      <SegmentedControl
        label="Teretana"
        options={options}
        value={gymId}
        onChange={select}
        size={viewport === 'tablet' ? 'small' : 'regular'}
      />
      <SearchField
        className={styles.search}
        value={search}
        onChange={setMemberSearch}
        onSubmit={() => navigate(MEMBERS_HREF)}
      />
      <ProfileButton />
    </div>
  );
}
