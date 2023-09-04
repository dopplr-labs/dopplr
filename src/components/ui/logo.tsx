import { cn } from '@/lib/utils'

type LogoProps = {
  className?: string
  style?: React.CSSProperties
}

export function Logo({ className, style }: LogoProps) {
  return (
    <svg
      viewBox="0 0 512 512"
      fill="none"
      xmlns="http://www.w3.org/2000/svg"
      className={cn('text-foreground/50 dark:text-foreground', className)}
      style={style}
    >
      <path
        d="M256 429.501L255.964 429.483V429.501L112.5 346L109.5 348L106 350L34 391L256 512L478 391L404 346L256 429.501Z"
        fill="currentColor"
        fillOpacity="0.8"
      />
      <path
        d="M404.025 175.521V346.317L477.934 390.943V130.894L262.722 0.872192V90.1735L404.025 175.521Z"
        fill="currentColor"
        fillOpacity="0.9"
      />
      <path
        d="M34.1702 390.882L112.591 346.317L112.644 346.244V175.521L262.725 90.2301V90.1735V0.932956V0.872192L34.0634 130.894V390.943L34.1702 390.882Z"
        fill="currentColor"
      />
      <path
        d="M197.283 326.657L168.581 310.253V202.612L262.722 256.436V364.03L262.742 364.042V256.436L356.883 202.612L262.742 148.83L262.679 148.862L168.573 202.612V310.21V310.253L197.283 326.657Z"
        fill="currentColor"
        fillOpacity="0.8"
      />
      <path d="M262.722 256.451V364.042L356.877 310.26V202.633L262.722 256.451Z" fill="currentColor" />
      <path
        d="M168.573 202.633V310.26L197.28 326.662L262.728 364.042V364.03V256.451L168.573 202.633Z"
        fill="currentColor"
        fillOpacity="0.9"
      />
    </svg>
  )
}
