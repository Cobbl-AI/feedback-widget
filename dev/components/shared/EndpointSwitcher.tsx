import { Button } from '../ui/button'
import { ButtonGroup } from '../ui/button-group'
import { Input } from '../ui/input'
import { Label } from '../ui/label'

const endpoints = {
  local: 'http://127.0.0.1:5001/cobbl-prod/us-central1/publicApi',
  staging: 'https://staging-api.cobbl.ai',
  production: 'https://api.cobbl.ai',
} as const

type EndpointType = keyof typeof endpoints

interface EndpointSwitcherProps {
  value: string
  onChange: (value: string) => void
}

export const EndpointSwitcher = ({
  value,
  onChange,
}: EndpointSwitcherProps) => {
  const activeType = (Object.keys(endpoints) as EndpointType[]).find(
    (key) => endpoints[key] === value
  )

  return (
    <div className="space-y-3">
      <h3 className="font-medium text-sm">API Endpoint</h3>
      <ButtonGroup>
        {(Object.keys(endpoints) as EndpointType[]).map((type) => (
          <Button
            key={type}
            size="sm"
            variant={activeType === type ? 'default' : 'outline'}
            onClick={() => onChange(endpoints[type])}
          >
            {type.charAt(0).toUpperCase() + type.slice(1)}
          </Button>
        ))}
      </ButtonGroup>
      <Input
        value={value}
        onChange={(e) => onChange(e.target.value)}
        placeholder="Custom endpoint URL"
        className="font-mono text-xs"
      />
    </div>
  )
}

export { endpoints }
