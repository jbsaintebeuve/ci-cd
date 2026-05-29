import * as React from "react"
import { DayPicker } from "react-day-picker"

import { cn } from "../../lib/utils"
import { buttonVariants } from "./button"

export type CalendarProps = React.ComponentProps<typeof DayPicker>

export function Calendar({
  className,
  classNames,
  showOutsideDays = true,
  ...props
}: CalendarProps) {
  return (
    <DayPicker
      showOutsideDays={showOutsideDays}
      className={cn("p-3", className)}
      classNames={{
        months: "flex flex-col sm:flex-row space-y-4 sm:space-x-4 sm:space-y-0 relative",
        month: "space-y-4",
        month_caption: "flex justify-center pt-1 relative items-center mx-9",
        caption_label: "inline-flex items-center gap-1 text-sm font-medium",
        dropdowns: "flex items-center justify-center gap-1",
        dropdown: "absolute inset-0 w-full opacity-0 cursor-pointer",
        dropdown_root: "relative inline-flex items-center",
        nav: "absolute top-0 left-0 right-0 flex items-center justify-between w-full",
        button_previous: cn(
          buttonVariants({ variant: "outline", size: "icon" }),
          "h-7 w-7 bg-transparent p-0 opacity-50 hover:opacity-100"
        ),
        button_next: cn(
          buttonVariants({ variant: "outline", size: "icon" }),
          "h-7 w-7 bg-transparent p-0 opacity-50 hover:opacity-100"
        ),
        month_grid: "w-full border-collapse space-y-1",
        weekdays: "flex",
        weekday:
          "text-slate-500 rounded-md w-9 font-normal text-[0.8rem]",
        week: "flex w-full mt-2",
        day: "h-9 w-9 text-center text-sm p-0 relative [&:has([aria-selected])]:bg-slate-100 first:[&:has([aria-selected])]:rounded-l-md last:[&:has([aria-selected])]:rounded-r-md focus-within:relative focus-within:z-20",
        day_button: cn(
          buttonVariants({ variant: "outline" }),
          "h-9 w-9 p-0 font-normal border-0 aria-selected:opacity-100"
        ),
        selected:
          "bg-slate-900 text-white hover:bg-slate-900 hover:text-white focus:bg-slate-900 focus:text-white",
        today: "bg-slate-100 text-slate-900",
        outside: "text-slate-400 opacity-50",
        disabled: "text-slate-400 opacity-50",
        range_middle:
          "aria-selected:bg-slate-100 aria-selected:text-slate-900",
        hidden: "invisible",
        ...classNames,
      }}
      {...props}
    />
  )
}
