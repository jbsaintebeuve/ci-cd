import { useMemo, useState } from "react"
import { format } from "date-fns"
import { fr } from "date-fns/locale"
import { CalendarIcon } from "lucide-react"
import { toast } from "sonner"

import { cn } from "../lib/utils"
import { Button } from "./ui/button"
import { Input } from "./ui/input"
import { Label } from "./ui/label"
import { Popover, PopoverContent, PopoverTrigger } from "./ui/popover"
import { Calendar } from "./ui/calendar"
import { validateForm, type FormData } from "../utils/validation"
import { saveUser } from "../services/storageService"

const INITIAL_FORM: FormData = {
  lastName: "",
  firstName: "",
  email: "",
  birthDate: undefined,
  city: "",
  postalCode: "",
}

export default function RegistrationForm() {
  const [form, setForm] = useState<FormData>(INITIAL_FORM)
  const [submitted, setSubmitted] = useState(false)

  const errors = useMemo(() => validateForm(form), [form])
  const isValid = Object.keys(errors).length === 0

  function showError(field: keyof FormData) {
    return submitted && Boolean(errors[field])
  }

  const birthDateLabel = useMemo(() => {
    if (!form.birthDate) return "Choisir une date"
    return format(form.birthDate, "PPP", { locale: fr })
  }, [form.birthDate])

  function onSubmit(e: React.FormEvent) {
    e.preventDefault()
    setSubmitted(true)
    if (!isValid) return

    saveUser({
      lastName: form.lastName.trim(),
      firstName: form.firstName.trim(),
      email: form.email.trim(),
      birthDate: form.birthDate!.toISOString(),
      city: form.city.trim(),
      postalCode: form.postalCode.trim(),
    })
    toast.success("Sauvegardé.")
    setSubmitted(false)
    setForm(INITIAL_FORM)
  }

  return (
    <section className="mx-auto w-full max-w-xl p-6">
      <h2 className="text-xl font-semibold text-slate-900">
        Formulaire d'inscription
      </h2>
      <p className="mt-1 text-sm text-slate-600">
        Renseigne tes informations puis clique sur "Sauvegarder".
      </p>

      <form className="mt-6 space-y-4" onSubmit={onSubmit}>
        <div className="grid grid-cols-1 gap-4 sm:grid-cols-2">
          <div className="space-y-2">
            <Label htmlFor="lastName">Nom</Label>
            <Input
              id="lastName"
              value={form.lastName}
              onChange={(ev) => {
                const lastName = ev.target.value
                setForm((s) => ({ ...s, lastName }))
              }}
              aria-invalid={showError("lastName")}
            />
            {showError("lastName") ? (
              <p className="text-sm text-red-600">{errors.lastName}</p>
            ) : null}
          </div>

          <div className="space-y-2">
            <Label htmlFor="firstName">Prénom</Label>
            <Input
              id="firstName"
              value={form.firstName}
              onChange={(ev) => {
                const firstName = ev.target.value
                setForm((s) => ({ ...s, firstName }))
              }}
              aria-invalid={showError("firstName")}
            />
            {showError("firstName") ? (
              <p className="text-sm text-red-600">{errors.firstName}</p>
            ) : null}
          </div>
        </div>

        <div className="space-y-2">
          <Label htmlFor="email">Mail</Label>
          <Input
            id="email"
            type="email"
            value={form.email}
            onChange={(ev) => {
              const email = ev.target.value
              setForm((s) => ({ ...s, email }))
            }}
            aria-invalid={showError("email")}
          />
          {showError("email") ? (
            <p className="text-sm text-red-600">{errors.email}</p>
          ) : null}
        </div>

        <div className="space-y-2">
          <Label>Date de naissance</Label>
          <Popover>
            <PopoverTrigger asChild>
              <Button
                type="button"
                variant="outline"
                className={cn(
                  "w-full justify-start text-left font-normal",
                  !form.birthDate && "text-slate-500"
                )}
                aria-invalid={showError("birthDate")}
              >
                <CalendarIcon />
                {birthDateLabel}
              </Button>
            </PopoverTrigger>
            <PopoverContent className="p-0" align="start">
              <Calendar
                mode="single"
                selected={form.birthDate}
                onSelect={(birthDate) => {
                  setForm((s) => ({ ...s, birthDate: birthDate ?? undefined }))
                }}
                captionLayout="dropdown"
              />
            </PopoverContent>
          </Popover>
          {showError("birthDate") ? (
            <p className="text-sm text-red-600">{errors.birthDate}</p>
          ) : null}
        </div>

        <div className="grid grid-cols-1 gap-4 sm:grid-cols-2">
          <div className="space-y-2">
            <Label htmlFor="city">Ville</Label>
            <Input
              id="city"
              value={form.city}
              onChange={(ev) => {
                const city = ev.target.value
                setForm((s) => ({ ...s, city }))
              }}
              aria-invalid={showError("city")}
            />
            {showError("city") ? (
              <p className="text-sm text-red-600">{errors.city}</p>
            ) : null}
          </div>

          <div className="space-y-2">
            <Label htmlFor="postalCode">Code postal</Label>
            <Input
              id="postalCode"
              inputMode="numeric"
              autoComplete="postal-code"
              value={form.postalCode}
              onChange={(ev) => {
                const postalCode = ev.target.value
                setForm((s) => ({ ...s, postalCode }))
              }}
              aria-invalid={showError("postalCode")}
            />
            {showError("postalCode") ? (
              <p className="text-sm text-red-600">{errors.postalCode}</p>
            ) : null}
          </div>
        </div>

        <div className="pt-2">
          <Button type="submit" className="w-full">
            Sauvegarder
          </Button>
        </div>
      </form>
    </section>
  )
}
