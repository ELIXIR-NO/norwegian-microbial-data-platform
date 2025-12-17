import { useState } from 'react'
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from '@/components/ui/dialog'
import { Button } from '@/components/ui/button'
import { Textarea } from '@/components/ui/textarea'
import { MessageSquare } from 'lucide-react'
import { useRouterState } from '@tanstack/react-router'

const GOOGLE_WEBAPP_URL = '/feedback'

export default function FeedbackButton() {
  const [feedback, setFeedback] = useState('')
  const [loading, setLoading] = useState(false)
  const [sent, setSent] = useState(false)
  const [open, setOpen] = useState(false)

  const routerState = useRouterState()
  const currentPath = routerState.location.pathname

  async function handleSubmit() {
    if (!feedback.trim()) return
    setLoading(true)

    try {
      await fetch(GOOGLE_WEBAPP_URL, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          sheet: 'NMDP',
          page: currentPath,
          feedback,
        }),
      })
      setSent(true)
      setFeedback('')
      setTimeout(() => {
        setOpen(false)
        setSent(false)
      }, 1000)
    } catch (error) {
      console.error('Error to send feedback', error)
    } finally {
      setLoading(false)
    }
  }

  return (
    <Dialog open={open} onOpenChange={setOpen}>
      <DialogTrigger asChild>
        <Button
          variant="outline"
          className="fixed right-4 bottom-18 z-50 rounded-full p-3 shadow-lg"
        >
          <MessageSquare size={48} />
        </Button>
      </DialogTrigger>

      <DialogContent>
        <DialogHeader>
          <DialogTitle>What did you think of this page?</DialogTitle>
        </DialogHeader>

        {sent ? (
          <p className="text-green-600">✅ Thank you for your feedback!</p>
        ) : (
          <>
            <Textarea
              placeholder="Type your comments..."
              value={feedback}
              onChange={(e) => setFeedback(e.target.value)}
            />
            <Button onClick={handleSubmit} disabled={loading}>
              {loading ? 'Sending...' : 'Send'}
            </Button>
          </>
        )}
      </DialogContent>
    </Dialog>
  )
}
