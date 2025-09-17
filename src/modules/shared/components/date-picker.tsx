"use client"

import * as React from "react"
import { useState } from "react"
import { format } from "date-fns"
import { Calendar as CalendarIcon } from "lucide-react"

import { cn } from "@/lib/utils"
import { Button } from "@/modules/ui/components/button"
import { Calendar } from "@/modules/ui/components/calendar"
import { Popover, PopoverContent, PopoverTrigger } from "@/modules/ui/components/popover"

interface DatePickerProps {
  selectedDate: Date | undefined
  onSelect: (date: Date | undefined) => void
  placeholder?: string
  className?: string
}

export function DatePicker({
  selectedDate,
  onSelect,
  placeholder = "Select date",
  className,
}: DatePickerProps) {
  const [open, setOpen] = useState(false)

  const handleDateChange = (date: Date | undefined) => {
    onSelect(date)
    setOpen(false)
  }

  return (
    <div className={cn("grid gap-2", className)}>
      <Popover open={open} onOpenChange={setOpen}>
        <PopoverTrigger asChild>
          <Button
            variant="outline"
            className={cn(
              "w-full justify-start text-left font-normal cursor-pointer rounded border-slate-300  ",
              !selectedDate && "text-black"
            )}
          >
            <CalendarIcon className="mr-2 h-8 w-8" />
            {selectedDate ? format(selectedDate, "PPP") : <span>{placeholder}</span>}
          </Button>
        </PopoverTrigger>
        <PopoverContent className="w-auto  bg-white" align="start">
          <Calendar
            mode="single"
            selected={selectedDate}
            onSelect={handleDateChange}
            initialFocus
          />
        </PopoverContent>
      </Popover>
    </div>
  )
}
