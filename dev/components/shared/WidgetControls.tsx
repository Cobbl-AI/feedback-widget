import { Input } from '../ui/input'
import { Label } from '../ui/label'
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '../ui/select'

export type Variant = 'trigger' | 'thumbs' | 'inline'
export type Position =
  | 'top-left'
  | 'top'
  | 'top-right'
  | 'right'
  | 'bottom-right'
  | 'bottom'
  | 'bottom-left'
  | 'left'
export type ColorScheme = 'auto' | 'light' | 'dark'

export interface WidgetConfig {
  runId: string
  variant: Variant
  position: Position
  triggerButtonText: string
  apiEndpoint: string
  colorScheme: ColorScheme
}

interface WidgetControlsProps {
  config: WidgetConfig
  onChange: (updates: Partial<WidgetConfig>) => void
}

const positions: { value: Position; label: string }[] = [
  { value: 'top-left', label: 'Top Left' },
  { value: 'top', label: 'Top (Centered)' },
  { value: 'top-right', label: 'Top Right' },
  { value: 'right', label: 'Right (Centered)' },
  { value: 'bottom-right', label: 'Bottom Right' },
  { value: 'bottom', label: 'Bottom (Centered)' },
  { value: 'bottom-left', label: 'Bottom Left' },
  { value: 'left', label: 'Left (Centered)' },
]

export const WidgetControls = ({ config, onChange }: WidgetControlsProps) => {
  return (
    <div className="space-y-4">
      {/* Run ID */}
      <div className="space-y-2">
        <Label htmlFor="runId">Run ID</Label>
        <Input
          id="runId"
          value={config.runId}
          onChange={(e) => onChange({ runId: e.target.value })}
          placeholder="Enter runId"
        />
      </div>

      {/* Variant */}
      <div className="space-y-2">
        <Label>Variant</Label>
        <Select
          value={config.variant}
          onValueChange={(value: Variant) => onChange({ variant: value })}
        >
          <SelectTrigger>
            <SelectValue />
          </SelectTrigger>
          <SelectContent>
            <SelectItem value="trigger">Trigger</SelectItem>
            <SelectItem value="thumbs">Thumbs</SelectItem>
            <SelectItem value="inline">Inline</SelectItem>
          </SelectContent>
        </Select>
      </div>

      {/* Trigger Button Text - Only for trigger variant */}
      {config.variant === 'trigger' && (
        <div className="space-y-2">
          <Label htmlFor="triggerButtonText">Trigger Button Text</Label>
          <Input
            id="triggerButtonText"
            value={config.triggerButtonText}
            onChange={(e) => onChange({ triggerButtonText: e.target.value })}
            placeholder="Button text"
          />
        </div>
      )}

      {/* Position - Only for trigger and thumbs variants (has flyout) */}
      {config.variant !== 'inline' && (
        <div className="space-y-2">
          <Label>Flyout Position</Label>
          <Select
            value={config.position}
            onValueChange={(value: Position) => onChange({ position: value })}
          >
            <SelectTrigger>
              <SelectValue />
            </SelectTrigger>
            <SelectContent>
              {positions.map((pos) => (
                <SelectItem key={pos.value} value={pos.value}>
                  {pos.label}
                </SelectItem>
              ))}
            </SelectContent>
          </Select>
        </div>
      )}

      {/* Color Scheme */}
      <div className="space-y-2">
        <Label>Color Scheme</Label>
        <Select
          value={config.colorScheme}
          onValueChange={(value: ColorScheme) =>
            onChange({ colorScheme: value })
          }
        >
          <SelectTrigger>
            <SelectValue />
          </SelectTrigger>
          <SelectContent>
            <SelectItem value="auto">Auto (System)</SelectItem>
            <SelectItem value="light">Light</SelectItem>
            <SelectItem value="dark">Dark</SelectItem>
          </SelectContent>
        </Select>
      </div>
    </div>
  )
}
