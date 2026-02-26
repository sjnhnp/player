import { html } from 'lit-html';
import { computed, signal, type ReadSignal } from 'maverick.js';
import { isFunction, unwrap } from 'maverick.js/std';

import { useDefaultLayoutContext } from '../../../../../../components/layouts/default/context';
import type { MenuPlacement } from '../../../../../../components/ui/menu/menu-items';
import type { TooltipPlacement } from '../../../../../../components/ui/tooltip/tooltip-content';
import { useMediaState } from '../../../../../../core/api/media-context';
import { $signal } from '../../../../../lit/directives/signal';
import { IconSlot } from '../../slots';
import { $i18n } from '../utils';
import { MenuPortal } from './menu-portal';

export function DefaultEpisodesMenu({
  placement,
  tooltip,
  portal,
}: {
  portal?: boolean;
  placement: MenuPlacement | ReadSignal<MenuPlacement | null>;
  tooltip: TooltipPlacement | ReadSignal<TooltipPlacement>;
}) {
  const { viewType } = useMediaState(),
    {
      translations,
      menuPortal,
      noModal,
      menuGroup,
      smallWhen: smWhen,
      episodes,
    } = useDefaultLayoutContext();

  const $disabled = computed(() => !episodes()?.length);

  if ($disabled()) return null;

  const $placement = computed(() =>
      noModal() ? unwrap(placement) : !smWhen() ? unwrap(placement) : null,
    ),
    $offset = computed(() =>
      !smWhen() && menuGroup() === 'bottom' && viewType() === 'video' ? 26 : 0,
    ),
    $isOpen = signal(false);

  function onOpen() {
    $isOpen.set(true);
  }

  function onClose() {
    $isOpen.set(false);
  }

  const items = html`
    <media-menu-items
      class="vds-episodes-menu-items vds-menu-items"
      placement=${$signal($placement)}
      offset=${$signal($offset)}
    >
      ${$signal(() => {
        if (!$isOpen()) return null;
        return html`
          <media-radio-group
            class="vds-episodes-radio-group vds-radio-group"
            value="-1"
            @change=${(e: CustomEvent) => {
              const index = parseInt(e.detail);
              const player = document.querySelector('media-player');
              player?.dispatchEvent(
                new CustomEvent('change-episode', { detail: index, bubbles: true, composed: true }),
              );
            }}
          >
            ${episodes()?.map(
              (ep) => html`
                <media-radio class="vds-episode-radio vds-radio" value=${ep.index}>
                  <div class="vds-radio-label" data-part="label">${ep.title}</div>
                  ${IconSlot('menu-radio-check')}
                </media-radio>
              `,
            )}
          </media-radio-group>
        `;
      })}
    </media-menu-items>
  `;

  return html`
    <media-menu class="vds-episodes-menu vds-menu" @open=${onOpen} @close=${onClose}>
      <media-tooltip class="vds-tooltip">
        <media-tooltip-trigger>
          <media-menu-button
            class="vds-menu-button vds-button"
            aria-label=${$i18n(translations, 'Episodes')}
          >
            ${IconSlot('menu-chapters')}
          </media-menu-button>
        </media-tooltip-trigger>
        <media-tooltip-content
          class="vds-tooltip-content"
          placement=${isFunction(tooltip) ? $signal(tooltip) : tooltip}
        >
          ${$i18n(translations, 'Episodes')}
        </media-tooltip-content>
      </media-tooltip>
      ${portal ? MenuPortal(menuPortal, items) : items}
    </media-menu>
  `;
}
