import { html } from 'lit-html';
import { computed, type ReadSignal } from 'maverick.js';
import { isFunction } from 'maverick.js/std';

import { useDefaultLayoutContext } from '../../../../../../components/layouts/default/context';
import type { MenuPlacement } from '../../../../../../components/ui/menu/menu-items';
import type { TooltipPlacement } from '../../../../../../components/ui/tooltip/tooltip-content';
import { $signal } from '../../../../../lit/directives/signal';
import { IconSlot } from '../../slots';
import { $i18n } from '../utils';

/**
 * Episodes button — dispatches a `toggle-episodes-sidebar` event on `window`
 * so the host application can show/hide its own sidebar UI.
 * No internal menu rendering needed.
 */
export function DefaultEpisodesMenu({
  tooltip,
}: {
  portal?: boolean;
  placement: MenuPlacement | ReadSignal<MenuPlacement | null>;
  tooltip: TooltipPlacement | ReadSignal<TooltipPlacement>;
}) {
  const { translations, episodes } = useDefaultLayoutContext();

  const $disabled = computed(() => !episodes()?.length);

  if ($disabled()) return null;

  function onClick(e: Event) {
    if (e) {
      e.preventDefault();
      e.stopPropagation();
    }
    window.dispatchEvent(
      new CustomEvent('toggle-episodes-sidebar', {
        detail: e,
        bubbles: true,
        composed: true,
      }),
    );
  }

  return html`
    <media-tooltip class="vds-episodes-tooltip vds-tooltip">
      <media-tooltip-trigger>
        <button
          class="vds-episodes-button vds-button"
          aria-label=${$i18n(translations, 'Episodes')}
          style="pointer-events: auto;"
          @pointerup=${onClick}
        >
          ${IconSlot('menu-chapters')}
        </button>
      </media-tooltip-trigger>
      <media-tooltip-content
        class="vds-tooltip-content"
        placement=${isFunction(tooltip) ? $signal(tooltip) : tooltip}
      >
        ${$i18n(translations, 'Episodes')}
      </media-tooltip-content>
    </media-tooltip>
  `;
}
