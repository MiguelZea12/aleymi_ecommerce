import Image from "next/image"
import Link from "next/link"

type LogoProps = {
  height?: number
  className?: string
  href?: string | null
  priority?: boolean
}

export function Logo({ height = 44, className = "", href = "/", priority = false }: LogoProps) {
  const img = (
    <Image
      src="/logo.png"
      alt="Aleymi — Delicias y Detalle"
      width={Math.round(height * 2.2)}
      height={height}
      className={`object-contain rounded-lg ${className}`}
      priority={priority}
    />
  )

  if (href) {
    return (
      <Link href={href} className="inline-flex shrink-0">
        {img}
      </Link>
    )
  }

  return img
}
