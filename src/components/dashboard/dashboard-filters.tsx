"use client"

import { useState } from "react"
import { Button } from "@/components/ui/button"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Calendar } from "@/components/ui/calendar"
import { Popover, PopoverContent, PopoverTrigger } from "@/components/ui/popover"
import { CalendarIcon, Filter } from "lucide-react"
import { format } from "date-fns"
import { cn } from "@/lib/utils"

interface DashboardFiltersProps {
  onFilterChange?: (filters: FilterState) => void
}

export interface FilterState {
  role: string
  interviewer: string
  dateRange: {
    from: Date | undefined
    to: Date | undefined
  }
}

export function DashboardFilters({ onFilterChange }: DashboardFiltersProps) {
  const [role, setRole] = useState<string>("all")
  const [interviewer, setInterviewer] = useState<string>("all")
  const [dateRange, setDateRange] = useState<{ from: Date | undefined; to: Date | undefined }>({
    from: undefined,
    to: undefined,
  })

  const handleApplyFilters = () => {
    onFilterChange?.({ role, interviewer, dateRange })
  }

  const handleReset = () => {
    setRole("all")
    setInterviewer("all")
    setDateRange({ from: undefined, to: undefined })
    onFilterChange?.({ role: "all", interviewer: "all", dateRange: { from: undefined, to: undefined } })
  }

  return (
    <div className="flex flex-col sm:flex-row gap-3 p-4 bg-card border border-border rounded-lg">
      <div className="flex items-center gap-2 flex-1">
        <Filter className="h-4 w-4 text-muted-foreground" />
        <span className="text-sm font-medium">Filters:</span>
      </div>

      <div className="flex flex-col sm:flex-row gap-3 flex-wrap">
        <Select value={role} onValueChange={setRole}>
          <SelectTrigger className="w-full sm:w-[160px]">
            <SelectValue placeholder="Role" />
          </SelectTrigger>
          <SelectContent>
            <SelectItem value="all">All Roles</SelectItem>
            <SelectItem value="admin">Admin</SelectItem>
            <SelectItem value="ta_member">TA Member</SelectItem>
            <SelectItem value="panelist">Panelist</SelectItem>
          </SelectContent>
        </Select>

        <Select value={interviewer} onValueChange={setInterviewer}>
          <SelectTrigger className="w-full sm:w-[160px]">
            <SelectValue placeholder="Interviewer" />
          </SelectTrigger>
          <SelectContent>
            <SelectItem value="all">All Interviewers</SelectItem>
            <SelectItem value="john">John Doe</SelectItem>
            <SelectItem value="jane">Jane Smith</SelectItem>
            <SelectItem value="mike">Mike Johnson</SelectItem>
          </SelectContent>
        </Select>

        <Popover>
          <PopoverTrigger asChild>
            <Button
              variant="outline"
              className={cn(
                "w-full sm:w-[240px] justify-start text-left font-normal",
                !dateRange.from && "text-muted-foreground",
              )}
            >
              <CalendarIcon className="mr-2 h-4 w-4" />
              {dateRange.from ? (
                dateRange.to ? (
                  <>
                    {format(dateRange.from, "LLL dd")} - {format(dateRange.to, "LLL dd, y")}
                  </>
                ) : (
                  format(dateRange.from, "LLL dd, y")
                )
              ) : (
                <span>Pick a date range</span>
              )}
            </Button>
          </PopoverTrigger>
          <PopoverContent className="w-auto p-0" align="start">
            <Calendar
              initialFocus
              mode="range"
              defaultMonth={dateRange.from}
              selected={{ from: dateRange.from, to: dateRange.to }}
              onSelect={(range) => setDateRange({ from: range?.from, to: range?.to })}
              numberOfMonths={2}
            />
          </PopoverContent>
        </Popover>

        <div className="flex gap-2">
          <Button onClick={handleApplyFilters} size="sm" className="flex-1 sm:flex-none">
            Apply
          </Button>
          <Button onClick={handleReset} variant="outline" size="sm" className="flex-1 sm:flex-none bg-transparent">
            Reset
          </Button>
        </div>
      </div>
    </div>
  )
}
