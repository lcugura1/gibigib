import { useId, useState } from 'react';
import type { CatalogDto, MemberDetailDto } from '@gibigib/types';
import { Dialog, type DialogPresentation } from '../../../../shared/components/dialog';
import { Highlight, Popup } from '../../../../shared/components/popup';
import { SegmentedControl } from '../../../../shared/components/segmented-control';
import { formatCurrency, formatDate, formatDays } from '../../../../shared/lib/format';
import { daysBetween } from '../../inactivity';
import { daysUntilEnd, firstName, isEnded, pauseState } from '../../membership-rules';
import { memberApi } from '../../services/member-api';
import { runMemberAction } from '../../services/member-state';
import styles from './member-dialogs.module.css';

const DAY_MS = 86_400_000;
const addDays = (iso: string, days: number) => new Date(new Date(iso).getTime() + days * DAY_MS).toISOString();
const startOfDay = (iso: string) => `${iso.slice(0, 10)}T00:00:00`;
const EXTEND_DAYS = [7, 14, 30] as const;
const YEAR_DAYS = 365;

interface MemberDialogProps {
  member: MemberDetailDto;
  presentation: DialogPresentation;
  onClose: () => void;
}

export function ExtendDialog({ member, catalog, presentation, onClose }: MemberDialogProps & { catalog: CatalogDto }) {
  const titleId = useId();
  const plans = catalog.plans.filter((plan) => plan.selfService);
  const [mode, setMode] = useState<'days' | 'plan'>('days');
  const [days, setDays] = useState<(typeof EXTEND_DAYS)[number]>(30);
  const [planSlug, setPlanSlug] = useState(member.membership.planSlug);
  const ended = isEnded(member) || daysUntilEnd(member) < 0;
  const base = ended ? startOfDay(member.asOf) : member.membership.endsAt;
  const plan = plans.find((p) => p.slug === planSlug) ?? plans[0];
  const added = mode === 'days' ? days : (plan?.durationDays ?? 0);
  const monthly = Math.min(...plans.filter((p) => p.durationDays < YEAR_DAYS).map((p) => p.price));
  const verb = ended ? 'Obnovi' : 'Produži';

  const describePlan = (durationDays: number, price: number) => {
    const savings = durationDays >= YEAR_DAYS ? monthly * 12 - price : 0;
    return savings > 0 ? `${durationDays} dana · uštedi ${formatCurrency(savings)}` : `${durationDays} dana`;
  };

  return (
    <Dialog presentation={presentation} labelledBy={titleId} onClose={onClose}>
      <Popup
        titleId={titleId}
        icon="calendarPlus"
        tone="accent"
        title={`${verb} članarinu`}
        description={`${member.name} · ${member.membership.planName} · ${ended ? 'istekla' : 'trenutno ističe'} ${formatDate(member.membership.endsAt)}`}
        confirm={{
          label: `${verb} članarinu`,
          busyLabel: 'Spremam…',
          errorMessage: 'Promjena nije spremljena. Pokušaj ponovno.',
          onConfirm: () =>
            runMemberAction(
              member.id,
              memberApi.extend(
                member.id,
                mode === 'days' ? { mode, days } : { mode, planSlug: plan?.slug ?? planSlug },
              ),
            ),
        }}
      >
        <SegmentedControl
          label="Način"
          options={[
            { value: 'days', label: 'Dodaj dane' },
            { value: 'plan', label: 'Promijeni plan' },
          ]}
          value={mode}
          onChange={setMode}
          fill
        />

        {mode === 'days' ? (
          <div className={styles.group}>
            <SegmentedControl
              label="Broj dana"
              options={EXTEND_DAYS.map((value) => ({ value: String(value), label: `+${value} dana` }))}
              value={String(days)}
              onChange={(value) => setDays(Number(value) as (typeof EXTEND_DAYS)[number])}
              size="small"
              fill
            />
            <p className={styles.hint}>Dani se dodaju na kraj članarine, bez naplate.</p>
          </div>
        ) : (
          <fieldset className={styles.options}>
            <legend className={styles.legend}>Novi plan</legend>
            {plans.map((option) => (
              <label key={option.slug} className={styles.option}>
                <input
                  type="radio"
                  name={`${titleId}-plan`}
                  value={option.slug}
                  checked={option.slug === plan?.slug}
                  onChange={() => setPlanSlug(option.slug)}
                />
                <span className={styles.optionText}>
                  <b>{option.name}</b>
                  <small>{describePlan(option.durationDays, option.price)}</small>
                </span>
                <span className={styles.price}>{formatCurrency(option.price)}</span>
              </label>
            ))}
          </fieldset>
        )}

        <Highlight
          label="Nova članarina vrijedi do"
          value={formatDate(addDays(base, added))}
          note={
            mode === 'days'
              ? ended
                ? `+${days} dana od danas`
                : `+${days} dana na trenutni kraj`
              : `${plan?.name} · član plaća ${formatCurrency(plan?.price ?? 0)} u aplikaciji`
          }
        />
      </Popup>
    </Dialog>
  );
}

const PAUSE_DAY_OPTIONS = (max: number) =>
  Array.from({ length: max }, (_, i) => ({ value: String(i + 1), label: String(i + 1) }));

export function PauseDialog({ member, presentation, onClose }: MemberDialogProps) {
  const titleId = useId();
  const state = pauseState(member);
  const { maxDays, cooldownDays, history } = member.pause;
  const [days, setDays] = useState(maxDays);
  const today = startOfDay(member.asOf);
  const intro = `${member.name} · ${member.membership.planName}.`;

  if (state.kind === 'paused') {
    const current = member.pause.current;
    const planned = current ? daysBetween(current.from, current.until) : 0;
    const used = current ? Math.max(1, daysBetween(current.from, today)) : 0;
    const unused = Math.max(0, planned - used);
    return (
      <Dialog presentation={presentation} labelledBy={titleId} onClose={onClose}>
        <Popup
          titleId={titleId}
          icon="play"
          tone="accent"
          title="Nastavi članarinu?"
          description={`${intro} Pauza završava danas, a neiskorišteni dani pauze ne dodaju se na kraj.`}
          confirm={{
            label: 'Nastavi članarinu',
            busyLabel: 'Spremam…',
            errorMessage: 'Članarina nije nastavljena. Pokušaj ponovno.',
            onConfirm: () => runMemberAction(member.id, memberApi.resume(member.id)),
          }}
        >
          <Highlight
            label="Članarina vrijedi do"
            value={formatDate(addDays(member.membership.endsAt, -unused))}
            note={`Iskorišteno ${used} od ${formatDays(planned)} pauze`}
          />
        </Popup>
      </Dialog>
    );
  }

  if (state.kind === 'cooldown') {
    const lastEnd = history[0]?.until;
    return (
      <Dialog presentation={presentation} labelledBy={titleId} onClose={onClose}>
        <Popup
          titleId={titleId}
          icon="pause"
          tone="muted"
          title="Pauza još nije moguća"
          description={`${intro}${lastEnd ? ` Zadnja pauza završila je ${formatDate(lastEnd)},` : ''} a nakon pauze vrijedi ${formatDays(cooldownDays)} čekanja.`}
          dismissLabel="Zatvori"
          confirm={{
            label: 'Pauziraj',
            busyLabel: 'Pauziraj',
            errorMessage: '',
            disabled: true,
            onConfirm: async () => undefined,
          }}
        >
          <Highlight
            label="Sljedeća pauza moguća od"
            value={formatDate(state.from)}
            note={`Za ${formatDays(state.daysLeft)}`}
          />
          <div className={styles.group}>
            <p className={styles.limit}>
              <span>Najviše po pauzi</span>
              <span>{formatDays(maxDays)}</span>
            </p>
            <div className={styles.segments} aria-hidden="true">
              {Array.from({ length: maxDays }, (_, i) => (
                <span key={i} />
              ))}
            </div>
          </div>
        </Popup>
      </Dialog>
    );
  }

  return (
    <Dialog presentation={presentation} labelledBy={titleId} onClose={onClose}>
      <Popup
        titleId={titleId}
        icon="pause"
        tone="accent"
        title="Pauziraj članarinu"
        description={`${intro} Pauza počinje danas, a dani pauze dodaju se na kraj članarine.`}
        confirm={{
          label: `Pauziraj ${formatDays(days)}`,
          busyLabel: 'Pauziram…',
          errorMessage: 'Pauza nije spremljena. Pokušaj ponovno.',
          onConfirm: () => runMemberAction(member.id, memberApi.pause(member.id, { days })),
        }}
      >
        <div className={styles.group}>
          <p className={styles.limit}>
            <span>Trajanje pauze</span>
            <span>najviše {formatDays(maxDays)}</span>
          </p>
          <SegmentedControl
            label="Trajanje pauze u danima"
            options={PAUSE_DAY_OPTIONS(maxDays)}
            value={String(days)}
            onChange={(value) => setDays(Number(value))}
            size="small"
            fill
          />
        </div>
        <Highlight
          label="Članarina se produžuje do"
          value={formatDate(addDays(member.membership.endsAt, days))}
          note={`Pauza traje do ${formatDate(addDays(today, days))}`}
        />
      </Popup>
    </Dialog>
  );
}

export function CancelDialog({ member, presentation, onClose }: MemberDialogProps) {
  const titleId = useId();
  const unused = Math.max(0, daysUntilEnd(member));
  const compact = presentation === 'sheet';
  const consequence = compact
    ? `${firstName(member.name)} više ne može ući.`
    : `${firstName(member.name)} više ne može ući ni u jednu teretanu.`;

  return (
    <Dialog presentation={presentation} labelledBy={titleId} onClose={onClose}>
      <Popup
        titleId={titleId}
        icon="xCircle"
        tone="danger"
        title="Otkaži članarinu?"
        description={`${member.name} · ${member.membership.planName}. Članarina prestaje odmah i ${consequence} Ovo se ne može poništiti.`}
        confirm={{
          label: 'Otkaži članarinu',
          busyLabel: 'Otkazujem…',
          errorMessage: 'Članarina nije otkazana. Pokušaj ponovno.',
          tone: 'danger',
          onConfirm: () => runMemberAction(member.id, memberApi.cancel(member.id)),
        }}
      >
        <Highlight
          label="Članarina završava"
          value={formatDate(member.asOf)}
          note={
            compact
              ? `Neiskorišteno: ${formatDays(unused)}`
              : `Neiskorišteno: ${formatDays(unused)} · povrat ide ručno kroz Stripe`
          }
        />
      </Popup>
    </Dialog>
  );
}
