import { LegalPage, LegalSection } from "@/components/LegalPage";

const CONTACT_EMAIL = "support@pixovid.local";

export function RefundPage() {
  return (
    <LegalPage title="Refund & Cancellation Policy" updated="July 21, 2026">
      <p className="text-sm leading-7 text-muted-foreground">
        This Refund &amp; Cancellation Policy explains how purchases of credits on Pixovid are
        handled. Please read it carefully before making a payment.
      </p>

      <LegalSection heading="Credits and digital goods">
        <p>
          Pixovid sells prepaid <strong>credits</strong> that are consumed when you generate
          videos, images, or template renders. Credits are digital goods delivered to your account
          immediately after a successful payment. Unused credits are not exchangeable for cash.
        </p>
      </LegalSection>

      <LegalSection heading="Cancellation">
        <p>
          Because credits are delivered instantly, a purchase cannot be cancelled once the payment
          is completed and the credits have been added to your account. You may stop using the
          service at any time; unused credits remain in your account subject to this policy and any
          expiry rules we publish in-product.
        </p>
      </LegalSection>

      <LegalSection heading="Refunds">
        <ul className="list-disc space-y-1 pl-5">
          <li>
            Credits that have already been <strong>used</strong> for a successful generation are
            non-refundable as cash.
          </li>
          <li>
            If a generation <strong>fails</strong> due to a provider or platform fault after credits
            were deducted, those credits are <strong>automatically restored</strong> to your balance
            (service credit, not a bank refund).
          </li>
          <li>
            If you were charged but credits were <strong>not added</strong> due to a technical or
            payment error, you are eligible for a full refund or credit top-up.
          </li>
          <li>
            Unused promotional / welcome credits are non-refundable and may be revoked if abuse is
            detected.
          </li>
        </ul>
      </LegalSection>

      <LegalSection heading="How to request a refund">
        <p>
          To request a cash refund for a billing error, email us at{" "}
          <a className="text-primary hover:underline" href={`mailto:${CONTACT_EMAIL}`}>
            {CONTACT_EMAIL}
          </a>{" "}
          within <strong>7 days</strong> of the transaction with your account email and the payment
          reference / order ID. Approved refunds are processed to the original payment method via
          Razorpay, typically within <strong>5&ndash;7 business days</strong>.
        </p>
      </LegalSection>

      <LegalSection heading="Contact us">
        <p>
          For any billing questions, reach us at{" "}
          <a className="text-primary hover:underline" href={`mailto:${CONTACT_EMAIL}`}>
            {CONTACT_EMAIL}
          </a>
          .
        </p>
      </LegalSection>
    </LegalPage>
  );
}
