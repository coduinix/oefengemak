import { Link2 } from 'lucide-react'
import { toast } from 'sonner'
import { Button } from '@/components/ui/button'
import { nl } from '@/i18n/nl'

export function CopyLinkButton() {
  const copy = async () => {
    try {
      await navigator.clipboard.writeText(window.location.href)
      toast.success(nl.toast.linkCopied)
    } catch {
      toast.error(nl.toast.linkFailed)
    }
  }

  return (
    <Button type="button" variant="outline" onClick={() => void copy()}>
      <Link2 />
      {nl.actions.copyLink}
    </Button>
  )
}
