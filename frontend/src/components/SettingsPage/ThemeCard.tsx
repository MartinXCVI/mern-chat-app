// React imports
import type { JSX } from 'react'


interface IThemeCardProps {
  theme: string;
  isActive: boolean;
  onClick: (theme: string) => void;
}

const ThemeCard = ({ theme, isActive, onClick }: IThemeCardProps): JSX.Element => (
  <button
    aria-label={`Set theme to ${theme}`}
    className={`
      group flex flex-col items-center gap-1.5 p-2 rounded-lg transition-colors
      ${isActive ? "bg-base-200" : "hover:bg-base-200/50"}
    `}
    onClick={() => onClick(theme)}
  >
    <div className="relative h-8 w-full rounded-md overflow-hidden" data-theme={theme}>
      <div className="absolute inset-0 grid grid-cols-4 gap-px p-1">
        <div className="rounded bg-primary"></div>
        <div className="rounded bg-secondary"></div>
        <div className="rounded bg-accent"></div>
        <div className="rounded bg-neutral"></div>
      </div>
    </div>
    <span className="text-[11px] font-medium truncate w-full text-center">
      {theme.charAt(0).toUpperCase() + theme.slice(1)}
    </span>
  </button>
)

export default ThemeCard