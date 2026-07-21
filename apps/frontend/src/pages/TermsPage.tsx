import { LegalPage, LegalSection } from "@/components/LegalPage";

const CONTACT_EMAIL = "support@pixovid.local";

export function TermsPage() {
  return (
    <LegalPage title="Terms of Service" updated="July 21, 2026">
      <p className="text-sm leading-7 text-muted-foreground">
        These Terms of Service (&ldquo;Terms&rdquo;) govern your access to and use of Pixovid.
        By creating an account or using the service, you agree to these Terms.
      </p>

      <LegalSection heading="Eligibility & accounts">
        <p>
          You must be at least 18 years old to use Pixovid. You are responsible for keeping your
          account credentials secure and for all activity under your account. We may limit or
          suspend accounts that abuse free credits, automate signups, or attempt to circumvent
          rate limits.
        </p>
      </LegalSection>

      <LegalSection heading="Acceptable use">
        <ul className="list-disc space-y-1 pl-5">
          <li>Do not generate content that is illegal, harmful, or infringes others&rsquo; rights.</li>
          <li>
            Do not upload photos of people without their consent, or create deceptive or harmful
            likenesses of real individuals.
          </li>
          <li>Do not attempt to disrupt, reverse engineer, or abuse the service.</li>
        </ul>
      </LegalSection>

      <LegalSection heading="Credits & payments">
        <p>
          Paid features are accessed using prepaid credits purchased through Razorpay (or other
          payment providers we enable). Credits are{" "}
          <strong>non-transferable</strong>, have no cash value outside the service, and are not
          redeemable for cash. All purchases are subject to our{" "}
          <a className="text-primary hover:underline" href="/refund">
            Refund &amp; Cancellation Policy
          </a>
          .
        </p>
        <p className="mt-3">
          New accounts may receive a one-time promotional credit grant. Promotional credits may be
          limited per network or device and may produce watermarked outputs until a paid credit pack
          is purchased.
        </p>
      </LegalSection>

      <LegalSection heading="Free tier & watermarks">
        <p>
          Outputs generated while your account has never completed a paid credit purchase may
          include a visible Pixovid watermark. After a successful paid purchase, new generations are
          delivered without that watermark. Removing watermarks by re-encoding or cropping does not
          grant commercial rights beyond these Terms.
        </p>
      </LegalSection>

      <LegalSection heading="Commercial use">
        <p>
          Subject to these Terms and applicable law, you may use media you generate for commercial
          purposes once it was produced with a paid account (post-purchase, non-watermarked
          exports). You remain solely responsible for rights clearances on any music, faces, brands,
          or third-party material you include.
        </p>
      </LegalSection>

      <LegalSection heading="Content & ownership">
        <p>
          You retain rights to the content you upload and, subject to these Terms and applicable
          law, to the media you generate. You grant Pixovid a limited license to store, process, and
          display your inputs/outputs solely to operate the service. You are responsible for
          ensuring you have the rights to any inputs you provide.
        </p>
      </LegalSection>

      <LegalSection heading="Disclaimer & liability">
        <p>
          The service is provided &ldquo;as is&rdquo; without warranties of any kind. AI outputs may
          be imperfect or unexpected. To the maximum extent permitted by law, Pixovid is not liable
          for any indirect or consequential damages arising from your use of the service.
        </p>
      </LegalSection>

      <LegalSection heading="Contact us">
        <p>
          Questions about these Terms? Email{" "}
          <a className="text-primary hover:underline" href={`mailto:${CONTACT_EMAIL}`}>
            {CONTACT_EMAIL}
          </a>
          .
        </p>
      </LegalSection>
    </LegalPage>
  );
}
