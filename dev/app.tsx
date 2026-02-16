import { useState } from 'react'
import { createRoot } from 'react-dom/client'
import { Tabs, TabsContent, TabsList, TabsTrigger } from './components/ui/tabs'
import { Badge } from './components/ui/badge'
import {
  EndpointSwitcher,
  endpoints,
  WidgetControls,
  ScriptTagPreview,
  VanillaJsPreview,
  ReactPreview,
  CodeExample,
  type WidgetConfig,
} from './components/shared'
import { Code2, FileCode, Component } from 'lucide-react'
import './globals.css'

const App = () => {
  const [config, setConfig] = useState<WidgetConfig>({
    runId: 'my-test-run-id',
    variant: 'trigger',
    position: 'top-left',
    triggerButtonText: 'Give Feedback',
    colorScheme: 'auto',
    apiEndpoint: endpoints.local,
  })

  const handleConfigChange = (updates: Partial<WidgetConfig>) => {
    setConfig((prev) => ({ ...prev, ...updates }))
  }

  return (
    <div className="min-h-screen bg-background">
      <main className="p-6">
        <div className="mb-6">
          <h1 className="text-2xl font-semibold tracking-tight">
            Feedback Widget
          </h1>
          <p className="text-muted-foreground text-sm mt-1">
            Development playground for testing widget integrations
          </p>
        </div>

        <Tabs defaultValue="script-tag" className="space-y-6">
          <TabsList className="grid w-full grid-cols-3">
            <TabsTrigger value="script-tag" className="flex items-center gap-2">
              <FileCode className="h-4 w-4" />
              <span className="hidden sm:inline">Script Tag</span>
              <span className="sm:hidden">HTML</span>
            </TabsTrigger>
            <TabsTrigger value="vanilla-js" className="flex items-center gap-2">
              <Code2 className="h-4 w-4" />
              <span className="hidden sm:inline">JavaScript</span>
              <span className="sm:hidden">JS</span>
            </TabsTrigger>
            <TabsTrigger value="react" className="flex items-center gap-2">
              <Component className="h-4 w-4" />
              React
            </TabsTrigger>
          </TabsList>

          {/* Script Tag Tab */}
          <TabsContent value="script-tag" className="space-y-6">
            <div className="flex items-center gap-2 text-sm text-muted-foreground">
              <Badge variant="secondary">HTML + JS</Badge>
              <span>Static sites, WordPress, Webflow</span>
            </div>
            <div className="grid md:grid-cols-2 gap-6">
              <div className="space-y-6">
                <EndpointSwitcher
                  value={config.apiEndpoint}
                  onChange={(value) =>
                    handleConfigChange({ apiEndpoint: value })
                  }
                />
                <WidgetControls config={config} onChange={handleConfigChange} />
              </div>
              <div className="space-y-6">
                <CodeExample config={config} type="script-tag" />
                <ScriptTagPreview config={config} />
              </div>
            </div>
          </TabsContent>

          {/* Vanilla JS Tab */}
          <TabsContent value="vanilla-js" className="space-y-6">
            <div className="flex items-center gap-2 text-sm text-muted-foreground">
              <Badge variant="secondary">JavaScript</Badge>
              <span>Programmatic control</span>
            </div>
            <div className="grid md:grid-cols-2 gap-6">
              <div className="space-y-6">
                <EndpointSwitcher
                  value={config.apiEndpoint}
                  onChange={(value) =>
                    handleConfigChange({ apiEndpoint: value })
                  }
                />
                <WidgetControls config={config} onChange={handleConfigChange} />
              </div>
              <div className="space-y-6">
                <CodeExample config={config} type="vanilla-js" />
                <VanillaJsPreview config={config} />
              </div>
            </div>
          </TabsContent>

          {/* React Tab */}
          <TabsContent value="react" className="space-y-6">
            <div className="flex items-center gap-2 text-sm text-muted-foreground">
              <Badge variant="secondary">React + TypeScript</Badge>
              <span>Component-based integration</span>
            </div>
            <div className="grid md:grid-cols-2 gap-6">
              <div className="space-y-6">
                <EndpointSwitcher
                  value={config.apiEndpoint}
                  onChange={(value) =>
                    handleConfigChange({ apiEndpoint: value })
                  }
                />
                <WidgetControls config={config} onChange={handleConfigChange} />
              </div>
              <div className="space-y-6">
                <CodeExample config={config} type="react" />
                <ReactPreview config={config} />
              </div>
            </div>
          </TabsContent>
        </Tabs>
      </main>
    </div>
  )
}

// Mount the app
const root = createRoot(document.getElementById('root')!)
root.render(<App />)
