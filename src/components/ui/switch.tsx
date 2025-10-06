"use client"

import * as React from "react"

interface SwitchProps extends React.InputHTMLAttributes<HTMLInputElement> {
  checked: boolean
  onCheckedChange?: (checked: boolean) => void
}

export function Switch({ checked, onCheckedChange, className, ...props }: SwitchProps) {
  return (
    <label className={"inline-flex items-center cursor-pointer select-none " + (className || "") }>
      <input
        type="checkbox"
        className="sr-only"
        checked={checked}
        onChange={(e) => onCheckedChange?.(e.target.checked)}
        {...props}
      />
      <span
        className={
          "relative inline-block h-5 w-9 rounded-full transition-colors " +
          (checked ? "bg-primary" : "bg-muted-foreground/30")
        }
      >
        <span
          className={
            "absolute top-0.5 left-0.5 h-4 w-4 rounded-full bg-background transition-transform " +
            (checked ? "translate-x-4" : "translate-x-0")
          }
        />
      </span>
    </label>
  )
}


