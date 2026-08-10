/**
 * Contact channels shown in the About hero.
 *
 * Fill in the handle for each channel below. A channel with an empty handle is
 * skipped entirely by `CONTACT_CHANNELS`, so a half-configured build never ships
 * a dead "Zalo" button that goes nowhere — it simply shows one less option.
 */
import { Mail, MessageCircle, Send } from 'lucide-react'

import type { AppIcon } from './icons'

/** Zalo phone number, digits only, e.g. '0987654321'. */
const ZALO_PHONE = '0365022794'

/** Telegram username without the leading '@', e.g. 'ntphong'. */
const TELEGRAM_USERNAME = 'PhongNguyen2004'

/** Address used for the mailto: link. */
const EMAIL = 'phongnguyenphong267@gmail.com'

export type ContactChannel = {
  id: 'zalo' | 'telegram' | 'email'
  label: string
  /** Shown as the link title / accessible name. */
  description: string
  href: string
  icon: AppIcon
  /** Mail opens in the same tab; the chat apps open in a new one. */
  external: boolean
}

const ALL_CHANNELS: (ContactChannel & { handle: string })[] = [
  {
    id: 'zalo',
    handle: ZALO_PHONE,
    label: 'Zalo',
    description: 'Nhắn tin qua Zalo',
    href: `https://zalo.me/${ZALO_PHONE}`,
    icon: MessageCircle,
    external: true,
  },
  {
    id: 'telegram',
    handle: TELEGRAM_USERNAME,
    label: 'Telegram',
    description: 'Nhắn tin qua Telegram',
    href: `https://t.me/${TELEGRAM_USERNAME}`,
    icon: Send,
    external: true,
  },
  {
    id: 'email',
    handle: EMAIL,
    label: 'Gmail',
    description: `Gửi email tới ${EMAIL}`,
    href: `mailto:${EMAIL}`,
    icon: Mail,
    external: false,
  },
]

/** Only the channels that actually have a handle configured. */
export const CONTACT_CHANNELS: ContactChannel[] = ALL_CHANNELS.filter(
  (channel) => channel.handle.trim() !== '',
).map(({ handle: _handle, ...channel }) => channel)
