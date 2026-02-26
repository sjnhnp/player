import { html } from 'lit-html';

import { useDefaultLayoutContext } from '../../../../../components/layouts/default/context';
import { useMediaState } from '../../../../../core/api/media-context';
import { $signal } from '../../../../lit/directives/signal';
import { $i18n } from './utils';

export function DefaultVideoStats() {
  return $signal(() => {
    const { isStatsVisible, translations } = useDefaultLayoutContext();

    if (!isStatsVisible()) return null;

    const { source, volume, currentTime, duration, mediaWidth, mediaHeight, quality } =
      useMediaState();

    return html`
      <div class="vds-video-stats">
        <div class="vds-stats-row">
          <span class="vds-stats-label">${$i18n(translations, 'Player version')}:</span>
          <span class="vds-stats-value">1.12.13</span>
        </div>
        <div class="vds-stats-row">
          <span class="vds-stats-label">${$i18n(translations, 'Video url')}:</span>
          <span class="vds-stats-value">${$signal(() => source().src)}</span>
        </div>
        <div class="vds-stats-row">
          <span class="vds-stats-label">${$i18n(translations, 'Video volume')}:</span>
          <span class="vds-stats-value">${$signal(() => volume().toFixed(2))}</span>
        </div>
        <div class="vds-stats-row">
          <span class="vds-stats-label">${$i18n(translations, 'Video time')}:</span>
          <span class="vds-stats-value">${$signal(() => currentTime().toFixed(2))}</span>
        </div>
        <div class="vds-stats-row">
          <span class="vds-stats-label">${$i18n(translations, 'Video duration')}:</span>
          <span class="vds-stats-value">${$signal(() => duration().toFixed(2))}</span>
        </div>
        <div class="vds-stats-row">
          <span class="vds-stats-label">${$i18n(translations, 'Video resolution')}:</span>
          <span class="vds-stats-value"
            >${$signal(() => {
              const q = quality();
              const intrinsic = q ? `${q.width}x${q.height}` : '';
              const rendered = `${mediaWidth()}x${mediaHeight()}`;
              return intrinsic && intrinsic !== '0x0'
                ? `${intrinsic} (rendered: ${rendered})`
                : rendered;
            })}</span
          >
        </div>
      </div>
    `;
  });
}
