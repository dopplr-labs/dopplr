import { AlertDialogActionProps, AlertDialogCancelProps } from '@radix-ui/react-alert-dialog'
import { cloneElement } from 'react'
import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
  AlertDialogTrigger,
} from './alert-dialog'
import { Button } from './button'

type AlertProps = {
  className?: string
  style?: React.CSSProperties
  trigger: React.ReactElement
  title: string
  description?: string
  cancelText?: string
  okText?: string
  onCancel?: () => void
  cancelButtonProps?: Omit<AlertDialogCancelProps, 'asChild' | 'children' | 'onClick'>
  onOk?: () => void
  okButtonProps?: Omit<AlertDialogActionProps, 'asChild' | 'children' | 'onClick'>
}

export default function Alert({
  className,
  style,
  title,
  trigger,
  description,
  cancelText = 'Cancel',
  okText = 'Ok',
  onCancel,
  onOk,
  okButtonProps,
}: AlertProps) {
  return (
    <AlertDialog>
      <AlertDialogTrigger asChild>{cloneElement(trigger)}</AlertDialogTrigger>
      <AlertDialogContent className={className} style={style}>
        <AlertDialogHeader>
          <AlertDialogTitle>{title}</AlertDialogTitle>
          {!!description && <AlertDialogDescription>{description}</AlertDialogDescription>}
        </AlertDialogHeader>

        <AlertDialogFooter>
          <AlertDialogCancel onClick={onCancel}>{cancelText}</AlertDialogCancel>
          <AlertDialogAction asChild onClick={onOk} {...okButtonProps}>
            <Button>{okText}</Button>
          </AlertDialogAction>
        </AlertDialogFooter>
      </AlertDialogContent>
    </AlertDialog>
  )
}
