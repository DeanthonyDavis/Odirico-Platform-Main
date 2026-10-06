"use client";
import Link from "next/link";
import { useId, useState } from "react";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { ArrowUpRight, LoaderCircle, Check } from "lucide-react";
import {
  emptyInquiry,
  inquirySchema,
  revenueRanges,
  type Inquiry,
  type InquiryKind,
} from "@/lib/inquiry-schema";
type FieldName = Exclude<keyof Inquiry, "kind" | "consent" | "website">;
type FormField = {
  name: FieldName;
  label: string;
  type?: string;
  required?: boolean;
  full?: boolean;
  options?: readonly string[];
  autoComplete?: string;
  maxLength?: number;
};
export function InquiryForm({
  kind,
  mode = "disabled",
}: {
  kind: InquiryKind;
  mode?: string;
}) {
  const id = useId();
  const [status, setStatus] = useState<{
    type: "success" | "preview" | "error";
    message: string;
  } | null>(null);
  const {
    register,
    handleSubmit,
    formState: { errors, isSubmitting },
    reset,
    setError,
  } = useForm<Inquiry>({
    resolver: zodResolver(inquirySchema),
    defaultValues: emptyInquiry(kind),
    mode: "onBlur",
  });
  function field({
    name,
    label,
    type = "text",
    required = false,
    full = false,
    options,
    autoComplete,
    maxLength,
  }: FormField) {
    const error = errors[name];
    const fieldId = `${id}-${name}`;
    const props = {
      id: fieldId,
      "aria-invalid": Boolean(error),
      "aria-describedby": error ? `${fieldId}-error` : undefined,
      "aria-required": required,
      autoComplete,
      ...register(name),
    };
    return (
      <div className={`field${full ? " field--full" : ""}`} key={name}>
        <label htmlFor={fieldId}>
          {label}
          {required && (
            <span className="required" aria-hidden="true">
              {" "}
              *
            </span>
          )}
        </label>
        {options ? (
          <select {...props}>
            <option value="">Select an option</option>
            {options.map((o) => (
              <option key={o} value={o}>
                {o}
              </option>
            ))}
          </select>
        ) : type === "textarea" ? (
          <textarea {...props} rows={5} maxLength={maxLength || 4000} />
        ) : (
          <input
            {...props}
            type={type}
            maxLength={maxLength || 180}
            inputMode={
              name === "yearsOperating" || name === "employees"
                ? "numeric"
                : undefined
            }
          />
        )}
        {error && (
          <span id={`${fieldId}-error`} className="field-error">
            {error.message}
          </span>
        )}
      </div>
    );
  }
  const submit = handleSubmit(async (data) => {
    setStatus(null);
    try {
      const response = await fetch("/api/inquiries", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(data),
        signal: AbortSignal.timeout(20000),
      });
      const result = await response.json();
      if (!response.ok) {
        if (result.fields)
          for (const [key, value] of Object.entries(result.fields))
            setError(key as keyof Inquiry, {
              type: "server",
              message: String(value),
            });
        setStatus({
          type: "error",
          message:
            result.message ||
            "We couldn’t submit your inquiry. Please try again.",
        });
        return;
      }
      setStatus({
        type: result.status === "preview" ? "preview" : "success",
        message: result.message,
      });
      if (result.status !== "preview") reset(emptyInquiry(kind));
    } catch {
      setStatus({
        type: "error",
        message:
          "We couldn’t confirm your submission. Please check your connection and try again.",
      });
    }
  });
  if (status?.type === "success")
    return (
      <div className="form-success" role="status">
        <Check size={32} aria-hidden="true" />
        <h3>Thank you for reaching out.</h3>
        <p>{status.message}</p>
        <button
          type="button"
          className="button button--outline"
          onClick={() => setStatus(null)}
        >
          Send another inquiry
        </button>
      </div>
    );
  return (
    <form
      onSubmit={submit}
      noValidate
      className="inquiry-form"
      aria-label={`${kind} inquiry`}
    >
      {mode !== "live" && (
        <div className="form-notice">
          {mode === "preview"
            ? "Preview mode. You can test this form; no inquiry is sent or saved."
            : "Inquiry delivery is not active yet. Submissions will not be sent or saved."}
        </div>
      )}
      <p className="form-small" style={{ marginTop: 0, marginBottom: 24 }}>
        Fields marked * are required.
      </p>
      <fieldset>
        <legend>Your introduction</legend>
        <div className="form-grid">
          {field({
            name: "fullName",
            label: "Full name",
            required: true,
            autoComplete: "name",
            maxLength: 100,
          })}
          {field({
            name: "email",
            label: "Email address",
            type: "email",
            required: true,
            autoComplete: "email",
            maxLength: 254,
          })}
          {field({
            name: "companyName",
            label: "Company",
            autoComplete: "organization",
            full: kind !== "acquisition",
          })}
          {kind === "acquisition" && (
            <>
              {field({
                name: "companyWebsite",
                label: "Company website",
                type: "url",
                autoComplete: "url",
                maxLength: 500,
              })}
              {field({ name: "industry", label: "Industry", maxLength: 160 })}
              {field({
                name: "location",
                label: "Location (city, state / country)",
              })}
              {field({
                name: "revenueRange",
                label: "Approximate annual revenue (USD)",
                options: revenueRanges,
              })}
              {field({
                name: "reasonForSale",
                label: "Reason for contact",
                maxLength: 2000,
              })}
            </>
          )}
          {field({
            name: "message",
            label: kind === "acquisition" ? "Message" : "How can we help?",
            type: "textarea",
            full: true,
            required: true,
          })}
        </div>
      </fieldset>
      <div className="honeypot" aria-hidden="true">
        <label htmlFor={`${id}-website`}>Leave this field blank</label>
        <input
          id={`${id}-website`}
          {...register("website")}
          tabIndex={-1}
          autoComplete="off"
        />
      </div>
      <label className="form-consent">
        <input
          type="checkbox"
          {...register("consent")}
          aria-invalid={Boolean(errors.consent)}
          aria-describedby={errors.consent ? `${id}-consent-error` : undefined}
        />
        <span>
          I have read the <Link href="/privacy">privacy notice</Link> and
          understand that my details will be used to respond to this inquiry. *
        </span>
      </label>
      {errors.consent && (
        <p id={`${id}-consent-error`} className="field-error">
          {errors.consent.message}
        </p>
      )}
      <button
        className="button button--dark form-submit"
        type="submit"
        disabled={isSubmitting}
        aria-busy={isSubmitting}
      >
        {isSubmitting
          ? "Submitting…"
          : mode === "preview"
            ? "Test inquiry"
            : "Send inquiry"}
        {isSubmitting ? (
          <LoaderCircle className="spin" size={18} aria-hidden="true" />
        ) : (
          <ArrowUpRight size={18} aria-hidden="true" />
        )}
      </button>
      <p className="form-small">
        Please do not include financial records, personal identification
        documents, account details, or other sensitive information. Submitting
        this form does not establish a confidential relationship.
      </p>
      {status && (
        <div
          className="form-message"
          role={status.type === "error" ? "alert" : "status"}
        >
          {status.message}
        </div>
      )}
      <noscript>
        <p className="form-message">
          This form needs JavaScript to validate and submit your inquiry. Enable
          JavaScript to use the form.
        </p>
      </noscript>
    </form>
  );
}
