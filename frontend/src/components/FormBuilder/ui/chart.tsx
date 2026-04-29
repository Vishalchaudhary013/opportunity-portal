import * as React from "react"
import * as RechartsPrimitive from "recharts"
import { cn } from "../../../lib/utils"

type ChartConfig = Record<
  string,
  {
    label?: React.ReactNode
    icon?: React.ComponentType
    color?: string
  }
>

type ChartContextProps = {
  config: ChartConfig
}

const ChartContext = React.createContext<ChartContextProps | null>(null)

function useChart() {
  const context = React.useContext(ChartContext)

  if (!context) {
    throw new Error("useChart must be used within ChartContainer")
  }

  return context
}

type ChartContainerProps = React.ComponentProps<"div"> & {
  config: ChartConfig
  children: React.ReactNode
}

export const ChartContainer = React.forwardRef<
  HTMLDivElement,
  ChartContainerProps
>(({ className, children, config, ...props }, ref) => {
  return (
    <ChartContext.Provider value={{ config }}>
      <div
        ref={ref}
        className={cn("flex aspect-video justify-center text-xs", className)}
        {...props}
      >
        <RechartsPrimitive.ResponsiveContainer>
          {children}
        </RechartsPrimitive.ResponsiveContainer>
      </div>
    </ChartContext.Provider>
  )
})

ChartContainer.displayName = "ChartContainer"

export const ChartTooltip = RechartsPrimitive.Tooltip

type TooltipContentProps = {
  active?: boolean
  payload?: any[]
  label?: string
  className?: string
}

export const ChartTooltipContent = React.forwardRef<
  HTMLDivElement,
  TooltipContentProps
>(({ active, payload, label, className }, ref) => {
  const { config } = useChart()

  if (!active || !payload || payload.length === 0) {
    return null
  }

  return (
    <div
      ref={ref}
      className={cn(
        "rounded-lg border bg-white p-2 text-xs shadow",
        className
      )}
    >
      {label && <div className="font-medium">{label}</div>}

      <div className="mt-1 space-y-1">
        {payload.map((item: any, index: number) => {
          const key = item.dataKey ?? "value"
          const itemConfig = config[key]

          return (
            <div
              key={index}
              className="flex items-center justify-between gap-2"
            >
              <span className="text-muted-foreground">
                {itemConfig?.label ?? key}
              </span>

              <span className="font-mono">
                {item.value?.toLocaleString?.() ?? item.value}
              </span>
            </div>
          )
        })}
      </div>
    </div>
  )
})

ChartTooltipContent.displayName = "ChartTooltipContent"

export const ChartLegend = RechartsPrimitive.Legend

type LegendContentProps = {
  payload?: any[]
  className?: string
}

export const ChartLegendContent = React.forwardRef<
  HTMLDivElement,
  LegendContentProps
>(({ payload, className }, ref) => {
  const { config } = useChart()

  if (!payload || payload.length === 0) {
    return null
  }

  return (
    <div
      ref={ref}
      className={cn("flex items-center justify-center gap-4", className)}
    >
      {payload.map((item: any, index: number) => {
        const key = item.dataKey ?? "value"
        const itemConfig = config[key]

        return (
          <div key={index} className="flex items-center gap-1.5">
            <div
              className="h-2 w-2 rounded-sm"
              style={{ backgroundColor: item.color }}
            />

            <span className="text-xs">
              {itemConfig?.label ?? item.value}
            </span>
          </div>
        )
      })}
    </div>
  )
})

ChartLegendContent.displayName = "ChartLegendContent"