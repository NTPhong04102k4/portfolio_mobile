import { CONTACT_CHANNELS } from '@/config/contact';
import { ICON_SIZE } from '@/config/icons';

/**
 * Row of direct contact links (Zalo / Telegram / Gmail).
 *
 * Renders nothing when no channel has a handle configured, so the hero never
 * shows an empty "Liên hệ" heading with no options under it.
 */
export function ContactChannels() {
  if (CONTACT_CHANNELS.length === 0) return null;

  return (
    <section className="contact-channels" aria-labelledby="contact-channels-title">
      <h3 id="contact-channels-title" className="contact-channels__title">
        Liên hệ trực tiếp
      </h3>

      <ul className="contact-channels__list">
        {CONTACT_CHANNELS.map(({ id, label, description, href, icon: Icon, external }) => (
          <li key={id}>
            <a
              href={href}
              className={`contact-channel contact-channel--${id}`}
              title={description}
              {...(external ? { target: '_blank', rel: 'noreferrer' } : {})}
            >
              <Icon size={ICON_SIZE.md} aria-hidden="true" />
              <span>{label}</span>
            </a>
          </li>
        ))}
      </ul>
    </section>
  );
}
