import { useState } from "react";
import { createFileRoute } from "@tanstack/react-router";
import { ToolShell, Field, inputClass, OutputCard } from "@/components/site/ToolShell";
import { formatInr } from "@/lib/plans";

export const Route = createFileRoute("/tools/invoice-generator")({
  head: () => ({
    meta: [
      { title: "Free invoice generator for freelancers | WorkIQHub" },
      {
        name: "description",
        content:
          "Create a clean freelance invoice in your browser. Add line items, tax and payment terms, then print or save it as a PDF. Nothing is stored.",
      },
      { property: "og:title", content: "Free invoice generator for freelancers — WorkIQHub" },
      {
        property: "og:description",
        content: "Line items, tax and totals calculated, printable straight from the page.",
      },
      { property: "og:type", content: "website" },
      { name: "twitter:card", content: "summary_large_image" },
    ],
    links: [{ rel: "canonical", href: "/tools/invoice-generator" }],
  }),
  component: InvoiceGenerator,
});

type Line = { description: string; qty: number; rate: number };

function InvoiceGenerator() {
  const [from, setFrom] = useState("");
  const [to, setTo] = useState("");
  const [number, setNumber] = useState("INV-001");
  const [date, setDate] = useState(new Date().toISOString().slice(0, 10));
  const [terms, setTerms] = useState("Payable within 14 days");
  const [taxPct, setTaxPct] = useState(18);
  const [lines, setLines] = useState<Line[]>([{ description: "", qty: 1, rate: 0 }]);

  const subtotal = lines.reduce((n, l) => n + l.qty * l.rate, 0);
  const tax = Math.round((subtotal * taxPct) / 100);
  const total = subtotal + tax;

  function update(i: number, patch: Partial<Line>) {
    setLines((ls) => ls.map((l, idx) => (idx === i ? { ...l, ...patch } : l)));
  }

  return (
    <ToolShell
      name="Invoice generator"
      title="Invoice generator"
      lead="Build a clear invoice with line items, tax and totals, then print it or save it as a PDF from the print dialog."
      form={
        <>
          <div className="grid gap-5 sm:grid-cols-2">
            <Field label="From (you)">
              <textarea
                rows={3}
                value={from}
                onChange={(e) => setFrom(e.target.value)}
                placeholder={"Your name\nAddress\nTax ID"}
                className={inputClass}
              />
            </Field>
            <Field label="Bill to (client)">
              <textarea
                rows={3}
                value={to}
                onChange={(e) => setTo(e.target.value)}
                placeholder={"Client name\nAddress"}
                className={inputClass}
              />
            </Field>
          </div>
          <div className="grid gap-5 sm:grid-cols-3">
            <Field label="Invoice number">
              <input
                value={number}
                onChange={(e) => setNumber(e.target.value)}
                className={inputClass}
              />
            </Field>
            <Field label="Date">
              <input
                type="date"
                value={date}
                onChange={(e) => setDate(e.target.value)}
                className={inputClass}
              />
            </Field>
            <Field label="Tax (%)">
              <input
                type="number"
                min={0}
                max={50}
                value={taxPct}
                onChange={(e) => setTaxPct(Number(e.target.value))}
                className={inputClass}
              />
            </Field>
          </div>

          <div>
            <span className="label-mono">Line items</span>
            <div className="mt-3 space-y-3">
              {lines.map((l, i) => (
                <div key={i} className="grid gap-2 sm:grid-cols-6">
                  <input
                    aria-label={`Description ${i + 1}`}
                    value={l.description}
                    onChange={(e) => update(i, { description: e.target.value })}
                    placeholder="Description"
                    className="rounded-lg border border-border bg-background px-3 py-2 text-sm outline-none focus:border-primary sm:col-span-3"
                  />
                  <input
                    aria-label={`Quantity ${i + 1}`}
                    type="number"
                    min={0}
                    value={l.qty}
                    onChange={(e) => update(i, { qty: Number(e.target.value) })}
                    className="rounded-lg border border-border bg-background px-3 py-2 text-sm outline-none focus:border-primary"
                  />
                  <input
                    aria-label={`Rate ${i + 1}`}
                    type="number"
                    min={0}
                    value={l.rate}
                    onChange={(e) => update(i, { rate: Number(e.target.value) })}
                    className="rounded-lg border border-border bg-background px-3 py-2 text-sm outline-none focus:border-primary"
                  />
                  <button
                    type="button"
                    onClick={() => setLines((ls) => ls.filter((_, idx) => idx !== i))}
                    className="rounded-lg px-3 py-2 text-sm text-muted-foreground ring-1 ring-border"
                  >
                    Remove
                  </button>
                </div>
              ))}
            </div>
            <button
              type="button"
              onClick={() => setLines((ls) => [...ls, { description: "", qty: 1, rate: 0 }])}
              className="mt-3 rounded-lg glass px-4 py-2 text-sm font-medium ring-1 ring-border"
            >
              Add line
            </button>
          </div>

          <Field label="Payment terms">
            <input value={terms} onChange={(e) => setTerms(e.target.value)} className={inputClass} />
          </Field>
        </>
      }
      output={
        <OutputCard title="Totals">
          <dl className="space-y-3 text-sm">
            <div className="flex justify-between">
              <dt className="text-muted-foreground">Subtotal</dt>
              <dd className="font-medium">{formatInr(subtotal)}</dd>
            </div>
            <div className="flex justify-between">
              <dt className="text-muted-foreground">Tax ({taxPct}%)</dt>
              <dd className="font-medium">{formatInr(tax)}</dd>
            </div>
            <div className="flex justify-between border-t border-border pt-3">
              <dt className="font-medium">Total due</dt>
              <dd className="font-display text-2xl text-primary">{formatInr(total)}</dd>
            </div>
          </dl>
          <button
            type="button"
            onClick={() => window.print()}
            className="mt-6 w-full rounded-lg bg-primary px-4 py-2.5 text-sm font-semibold text-primary-foreground"
          >
            Print / save as PDF
          </button>
        </OutputCard>
      }
      how={[
        "Each line multiplies quantity by rate; tax is applied to the subtotal.",
        "Printing uses your browser's print dialog, where you can choose Save as PDF.",
        "Nothing you type leaves your browser — this page has no server component.",
      ]}
      faqs={[
        {
          q: "Is this a legally compliant tax invoice?",
          a: "It produces a standard invoice layout, but tax invoice requirements vary by country. Check what your jurisdiction requires — for example a tax registration number or specific wording.",
        },
        {
          q: "Can I save invoices to my account?",
          a: "Not from this tool. It is deliberately storage-free so it can be used without signing in.",
        },
      ]}
    >
      <section className="border-t border-border py-12">
        <h2 className="font-display text-3xl uppercase tracking-tight">Preview</h2>
        <div className="mt-6 rounded-2xl border border-border bg-background p-8">
          <div className="flex flex-wrap justify-between gap-6">
            <div>
              <p className="label-mono">From</p>
              <p className="mt-2 whitespace-pre-line text-sm">{from || "—"}</p>
            </div>
            <div>
              <p className="label-mono">Bill to</p>
              <p className="mt-2 whitespace-pre-line text-sm">{to || "—"}</p>
            </div>
            <div className="text-right">
              <p className="font-display text-2xl uppercase tracking-tight">Invoice</p>
              <p className="mt-1 font-mono text-xs text-muted-foreground">{number}</p>
              <p className="font-mono text-xs text-muted-foreground">{date}</p>
            </div>
          </div>

          <table className="mt-8 w-full text-left text-sm">
            <thead>
              <tr className="border-b border-border">
                <th className="py-2 font-medium">Description</th>
                <th className="py-2 text-right font-medium">Qty</th>
                <th className="py-2 text-right font-medium">Rate</th>
                <th className="py-2 text-right font-medium">Amount</th>
              </tr>
            </thead>
            <tbody>
              {lines.map((l, i) => (
                <tr key={i} className="border-b border-border/60">
                  <td className="py-2">{l.description || "—"}</td>
                  <td className="py-2 text-right">{l.qty}</td>
                  <td className="py-2 text-right">{formatInr(l.rate)}</td>
                  <td className="py-2 text-right">{formatInr(l.qty * l.rate)}</td>
                </tr>
              ))}
            </tbody>
          </table>

          <div className="mt-6 flex justify-end">
            <dl className="w-56 space-y-2 text-sm">
              <div className="flex justify-between">
                <dt className="text-muted-foreground">Subtotal</dt>
                <dd>{formatInr(subtotal)}</dd>
              </div>
              <div className="flex justify-between">
                <dt className="text-muted-foreground">Tax</dt>
                <dd>{formatInr(tax)}</dd>
              </div>
              <div className="flex justify-between border-t border-border pt-2 font-medium">
                <dt>Total</dt>
                <dd>{formatInr(total)}</dd>
              </div>
            </dl>
          </div>
          <p className="mt-6 text-xs text-muted-foreground">{terms}</p>
        </div>
      </section>
    </ToolShell>
  );
}
