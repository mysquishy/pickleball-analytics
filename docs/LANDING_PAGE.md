# Landing Page Customization Guide

The landing page (`src/app/page.tsx`) contains **46 TODO placeholders** that you should customize for your SaaS product.

## How to Customize

### 1. Update Brand Identity

**Line 13-14:** Logo

```tsx
{/* TODO: Replace with your logo */}
Your Logo
```

**Replace with:**

```tsx
<Image src="/logo.svg" alt="Your Company" width={120} height={40} />
```

### 2. Craft Your Value Proposition

**Line 33-34:** Headline

```tsx
{/* TODO: Replace with your value proposition (8-12 words, benefit-driven) */}
Build Your SaaS Faster Than Ever
```

**Tips:**

- Keep it 8-12 words
- Focus on benefits, not features
- Use active language
- Example: "Automate Your Workflow in Minutes, Not Months"

**Line 39-41:** Subheadline

```tsx
{/* TODO: Explain what your SaaS does and the main benefit */}
Complete authentication, billing, and multi-tenancy foundation...
```

**Tips:**

- Expand on the headline
- Mention 2-3 key benefits
- Keep under 20 words

### 3. Add Social Proof

**Line 62:** Trust Badge

```tsx
{
  /* TODO: Add trust signal */
}
```

**Examples:**

- "Trusted by 10,000+ companies"
- "SOC 2 Compliant"
- "GDPR Ready"

**Line 72:** Social Proof Metric

```tsx
{
  /* TODO: Add social proof metric */
}
```

**Examples:**

- "Join 5,000+ happy customers"
- "4.9/5 rating on G2"
- "Used by teams at Google, Meta, Amazon"

**Line 78:** Company Logos

```tsx
{
  /* TODO: Replace with actual company logos */
}
```

**Action:** Add logos of customer companies or integrations

### 4. Problem Statement (Lines 93, 99)

**Line 93:** Problem Headline

```tsx
{
  /* TODO: Highlight the main problem your SaaS solves */
}
```

**Line 99:** Pain Points

```tsx
{
  /* TODO: Describe the pain points your target audience faces */
}
```

**Framework:**

1. Identify the problem
2. Agitate the pain
3. Paint a picture of the consequences

### 5. How It Works (Lines 122-156)

**Three steps to explain your product:**

**Step 1 (Lines 122-126)**

```tsx
{
  /* TODO: First step */
}
{
  /* TODO: Describe first step */
}
```

**Step 2 (Lines 137-141)**

```tsx
{
  /* TODO: Second step */
}
{
  /* TODO: Describe second step */
}
```

**Step 3 (Lines 152-156)**

```tsx
{
  /* TODO: Third step */
}
{
  /* TODO: Describe third step */
}
```

**Examples:**

1. "Sign up" → "Create account in 30 seconds"
2. "Connect" → "Integrate with your tools"
3. "Launch" → "Go live instantly"

### 6. Features Section (Lines 168-252)

**For each of the 6 features:**

**Feature Name (Lines 183, 196, 209, 222, 235, 248)**

```tsx
{
  /* TODO: Feature name */
}
```

**Feature Benefit (Lines 187, 200, 213, 226, 239, 252)**

```tsx
{
  /* TODO: Describe benefit, not just feature */
}
```

**Tips:**

- Focus on outcomes, not functionality
- Use the "Feature → Benefit" formula
- Example: "Real-time analytics" → "Make data-driven decisions instantly"

### 7. Demo Section (Lines 265-271)

**Line 265:** Demo Headline

```tsx
{
  /* TODO: Demo headline */
}
```

**Line 271:** Screenshot/Video

```tsx
{
  /* TODO: Replace with actual product screenshot or embed video */
}
```

**Action:**

- Add product screenshot: `<Image src="/demo.png" ... />`
- Or embed video: Use your video component

### 8. Metrics Section (Lines 287-314)

**4 Metrics to add (Lines 287, 296, 305, 314)**

```tsx
{
  /* TODO: Add real metric */
}
```

**Examples:**

- "10x faster"
- "99.9% uptime"
- "24/7 support"
- "50+ integrations"

### 9. Testimonials (Lines 327-376)

**3 testimonial placeholders (Lines 338, 357, 376)**

```tsx
{
  /* TODO: Add real customer testimonial */
}
```

**For each testimonial, include:**

- Customer name
- Customer title/company
- Photo (optional)
- Quote
- Star rating (optional)

**Example:**

```tsx
"This tool saved us 20 hours per week. Absolutely game-changing!"
— Jane Doe, CEO at Acme Corp
```

### 10. Pricing Section (Lines 396-402)

**Line 396:** Pricing Headline

```tsx
{
  /* TODO: Customize pricing headline */
}
```

**Line 402:** Pricing Subheadline

```tsx
{
  /* TODO: Pricing subheadline */
}
```

**Tips:**

- Keep it simple
- Highlight the most popular plan
- Mention annual savings

### 11. FAQ Section (Line 494)

**Line 494:** FAQ Headline

```tsx
{
  /* TODO: FAQ headline */
}
```

**FAQs are in `src/components/faq-item.tsx`** - update there

### 12. Final CTA (Lines 532-536)

**Line 532:** Final CTA Headline

```tsx
{
  /* TODO: Final CTA headline */
}
```

**Line 536:** Final CTA Subheadline

```tsx
{
  /* TODO: Final CTA subheadline */
}
```

**Make it compelling:**

- "Ready to get started?"
- "Join 10,000+ teams today"
- "Start your free trial"

### 13. Footer (Lines 556-560)

**Line 556:** Logo

```tsx
{
  /* TODO: Your logo/brand */
}
```

**Line 560:** Company Description

```tsx
{
  /* TODO: Company description */
}
```

**Keep it brief:**
"Your company description goes here. A sentence or two about what you do and why."

## Quick Start Checklist

- [ ] Replace logo
- [ ] Update headline & subheadline
- [ ] Add trust badges & metrics
- [ ] Customize 3-step process
- [ ] Update 6 feature benefits
- [ ] Add demo screenshot/video
- [ ] Insert real metrics
- [ ] Add 3 customer testimonials
- [ ] Customize pricing copy
- [ ] Update footer

## Design Tips

1. **Keep headlines under 12 words**
2. **Focus on benefits, not features**
3. **Use social proof liberally**
4. **Make CTAs action-oriented**
5. **Test different variations**

## Resources

- [Copywriting Formulas](https://www.nielsbach.com/articles/copywriting-formulas)
- [Landing Page Examples](https://landingpageexamples.com/)
- [Value Proposition Examples](https://www.convertlab.com/value-proposition-examples/)

---

**Total TODOs to fix: 46**

**Estimated time: 1-2 hours**
