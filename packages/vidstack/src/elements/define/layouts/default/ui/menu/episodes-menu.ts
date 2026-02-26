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
    // Let the host app know the menu opened so it can populate content
    window.dispatchEvent(new CustomEvent('episodes-menu-open'));
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
      <div
        class="episode-list-container"
        style="width: 350px; height: 500px; display: flex; flex-direction: column; overflow: hidden; background: rgba(0,0,0,0.8); backdrop-filter: blur(20px);"
      >
        <div class="sidebar-header">
          <div class="sidebar-title-row">
            <div style="display: flex; align-items: center; gap: 8px;">
              <h3 class="sidebar-title">选集</h3>
              <span class="sidebar-ep-count">共 0 集</span>
            </div>
            <div style="display: flex; align-items: center; gap: 6px;">
              <button
                id="view-toggle-episodes-player"
                class="sidebar-tool-btn-mini"
                title="切换视图"
              >
                <svg
                  id="view-grid-icon-player"
                  style="width: 16px; height: 16px;"
                  fill="none"
                  stroke="currentColor"
                  viewBox="0 0 24 24"
                >
                  <path
                    stroke-linecap="round"
                    stroke-linejoin="round"
                    stroke-width="2"
                    d="M4 6a2 2 0 012-2h2a2 2 0 012 2v2a2 2 0 01-2 2H6a2 2 0 01-2-2V6zM14 6a2 2 0 012-2h2a2 2 0 012 2v2a2 2 0 01-2 2h-2a2 2 0 01-2-2V6zM4 16a2 2 0 012-2h2a2 2 0 012 2v2a2 2 0 01-2 2H6a2 2 0 01-2-2v-2zM14 16a2 2 0 012-2h2a2 2 0 012 2v2a2 2 0 01-2 2h-2a2 2 0 01-2-2v-2z"
                  ></path>
                </svg>
                <svg
                  id="view-list-icon-player"
                  class="hidden"
                  style="width: 16px; height: 16px;"
                  fill="none"
                  stroke="currentColor"
                  viewBox="0 0 24 24"
                >
                  <path
                    stroke-linecap="round"
                    stroke-linejoin="round"
                    stroke-width="2"
                    d="M4 6h16M4 12h16M4 18h16"
                  ></path>
                </svg>
              </button>
              <button id="sort-episodes-player" class="sidebar-tool-btn-mini" title="反转顺序">
                <svg
                  id="sort-icon-player"
                  style="width: 16px; height: 16px;"
                  fill="none"
                  stroke="currentColor"
                  viewBox="0 0 24 24"
                >
                  <path
                    stroke-linecap="round"
                    stroke-linejoin="round"
                    stroke-width="2"
                    d="M7 16V4m0 0L3 8m4-4l4 4m6 0v12m0 0l4-4m-4 4l-4-4"
                  ></path>
                </svg>
              </button>
            </div>
          </div>
        </div>
        <div style="flex: 1; overflow-y: auto;" class="custom-scrollbar">
          <div class="ep-grid" id="player-ep-grid">
            <!-- Populated by SidebarManager.render() -->
          </div>
        </div>
      </div>
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
