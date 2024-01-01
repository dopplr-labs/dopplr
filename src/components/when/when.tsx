type WhenProps = {
  truthy: boolean
  children: React.ReactNode
}

export default function When({ truthy, children }: WhenProps) {
  return truthy ? children : null
}
