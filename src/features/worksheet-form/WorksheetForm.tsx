import { useId } from 'react'
import { Printer, Sparkles } from 'lucide-react'
import { MAX_TITLE_LENGTH, type ExerciseConfig } from '@/domain/config'
import type { ExerciseType } from '@/domain/core'
import { getGenerator } from '@/domain/generators'
import { Button } from '@/components/ui/button'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { Input } from '@/components/ui/input'
import { Label } from '@/components/ui/label'
import { CopyLinkButton } from '@/features/share/CopyLinkButton'
import { issueMessage, nl } from '@/i18n/nl'
import { useWorksheetFormStore } from '@/stores/worksheet-form-store'
import { formLevelIssues } from './issues'
import { OptionsPanel, inlineFieldsFor } from './registry'

interface WorksheetFormProps {
  type: ExerciseType
  hasWorksheet: boolean
  onGenerate: (config: ExerciseConfig, title: string) => void
  onPrint: () => void
}

export function WorksheetForm({ type, hasWorksheet, onGenerate, onPrint }: WorksheetFormProps) {
  const titleId = useId()
  const config = useWorksheetFormStore((state) => state.config)
  const title = useWorksheetFormStore((state) => state.title)
  const setConfig = useWorksheetFormStore((state) => state.setConfig)
  const setTitle = useWorksheetFormStore((state) => state.setTitle)

  const validation = getGenerator(config.type).validate(config as never)
  const issues = validation.ok ? [] : validation.issues

  return (
    <Card className="print:hidden">
      <CardHeader>
        <CardTitle>{nl.form.options}</CardTitle>
      </CardHeader>
      <CardContent>
        <form
          className="grid gap-5"
          onSubmit={(event) => {
            event.preventDefault()
            if (validation.ok) onGenerate(config, title)
          }}
        >
          <div className="grid gap-1.5">
            <Label htmlFor={titleId}>{nl.form.title}</Label>
            <Input
              id={titleId}
              value={title}
              maxLength={MAX_TITLE_LENGTH}
              placeholder={nl.form.titlePlaceholder}
              onChange={(event) => setTitle(event.target.value)}
            />
          </div>

          <OptionsPanel config={config} onChange={setConfig} issues={issues} />

          {formLevelIssues(issues, inlineFieldsFor(config.type)).map((issue) => (
            <p key={issue.code} className="text-sm text-danger">
              {issueMessage(issue, type)}
            </p>
          ))}

          <div className="flex flex-wrap gap-2">
            <Button type="submit" disabled={!validation.ok}>
              <Sparkles />
              {nl.actions.generate}
            </Button>
            {hasWorksheet ? (
              <>
                <Button type="button" variant="outline" onClick={onPrint}>
                  <Printer />
                  {nl.actions.print}
                </Button>
                <CopyLinkButton />
              </>
            ) : null}
          </div>
        </form>
      </CardContent>
    </Card>
  )
}
