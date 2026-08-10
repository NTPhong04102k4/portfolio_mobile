/**
 * Icon layer.
 *
 * The app renders `lucide-react` components rather than emoji glyphs: emoji
 * render differently per OS/font, cannot inherit `currentColor`, and are read
 * aloud by screen readers with their unicode name. Lucide icons are plain SVG,
 * inherit colour and sizing from CSS, and tree-shake per icon.
 *
 * Content modules (`content/`, `modules/**\/data`) store an icon as a component
 * reference typed `AppIcon`; the rendering component decides the size.
 */
import type { LucideIcon } from 'lucide-react';

/** An icon slot held in a data/content module and rendered by a component. */
export type AppIcon = LucideIcon;

/** Shared sizes so icons stay visually consistent across the app. */
export const ICON_SIZE = {
  /** Inline with small caption text — carets, badges. */
  sm: 14,
  /** Default: inline with body text and buttons. */
  md: 16,
  /** Section and card headings. */
  lg: 18,
} as const;
