import Link from 'next/link';
import { Zap, Lock, BarChart3, Users, Plug, MessageCircle, Play } from 'lucide-react';
import { FadeInUp, FadeIn } from '@/components/animations/FadeInUp';
import { FAQItem } from '@/components/faq-item';
import { STRIPE_PLANS } from '@/lib/stripe';

export default function HomePage() {
  return (
    <div className="min-h-screen bg-gradient-to-b from-gray-50 to-white">
      {/* Navigation */}
      <nav className="container mx-auto px-4 py-6 flex justify-between items-center">
        <div className="text-2xl font-bold">
          {/* TODO: Replace with your logo */}
          Your Logo
        </div>
        <div className="space-x-4">
          <Link href="/login" className="text-gray-600 hover:text-gray-900">
            Login
          </Link>
          <Link
            href="/signup"
            className="bg-black text-white px-4 py-2 rounded-lg hover:bg-gray-800"
          >
            Get Started
          </Link>
        </div>
      </nav>

      {/* Hero Section */}
      <section className="container mx-auto px-4 py-20 text-center">
        <FadeInUp>
          <h1 className="text-5xl md:text-6xl font-bold mb-6 max-w-4xl mx-auto">
            {/* TODO: Replace with your value proposition (8-12 words, benefit-driven) */}
            Build Your SaaS Faster Than Ever
          </h1>
        </FadeInUp>
        <FadeInUp delay={0.1}>
          <p className="text-xl text-gray-600 mb-8 max-w-2xl mx-auto">
            {/* TODO: Explain what your SaaS does and the main benefit */}
            Complete authentication, billing, and multi-tenancy foundation. Focus on building
            features, not infrastructure.
          </p>
        </FadeInUp>
        <FadeInUp delay={0.2}>
          <div className="flex justify-center gap-4">
            <Link
              href="/signup"
              className="inline-block bg-black text-white px-8 py-4 rounded-lg text-lg font-semibold hover:bg-gray-800 transition-colors"
            >
              Start Free Trial
            </Link>
            <Link
              href="#demo"
              className="inline-block border-2 border-black text-black px-8 py-4 rounded-lg text-lg font-semibold hover:bg-gray-50 transition-colors"
            >
              Watch Demo
            </Link>
          </div>
        </FadeInUp>
        <FadeIn delay={0.3}>
          <p className="text-sm text-gray-500 mt-4">
            {/* TODO: Add trust signal */}
            No credit card required • 14-day free trial • Cancel anytime
          </p>
        </FadeIn>
      </section>

      {/* Social Proof Section */}
      <section className="container mx-auto px-4 py-12">
        <FadeIn>
          <p className="text-center text-gray-600 mb-8">
            {/* TODO: Add social proof metric */}
            Trusted by 10,000+ teams worldwide
          </p>
        </FadeIn>
        <FadeIn delay={0.1}>
          <div className="flex justify-center items-center gap-12 flex-wrap opacity-50">
            {/* TODO: Replace with actual company logos */}
            <div className="text-2xl font-bold text-gray-400">Company 1</div>
            <div className="text-2xl font-bold text-gray-400">Company 2</div>
            <div className="text-2xl font-bold text-gray-400">Company 3</div>
            <div className="text-2xl font-bold text-gray-400">Company 4</div>
            <div className="text-2xl font-bold text-gray-400">Company 5</div>
          </div>
        </FadeIn>
      </section>

      {/* Problem Section */}
      <section className="container mx-auto px-4 py-20">
        <div className="max-w-3xl mx-auto text-center">
          <FadeInUp>
            <h2 className="text-3xl font-bold mb-6">
              {/* TODO: Highlight the main problem your SaaS solves */}
              Stop Wasting Time on Boilerplate
            </h2>
          </FadeInUp>
          <FadeInUp delay={0.1}>
            <p className="text-xl text-gray-600 mb-8">
              {/* TODO: Describe the pain points your target audience faces */}
              Building authentication, billing, and team management from scratch takes months. You
              should be focusing on what makes your product unique, not reinventing the wheel.
            </p>
          </FadeInUp>
        </div>
      </section>

      {/* How It Works Section */}
      <section className="container mx-auto px-4 py-20 bg-gray-50">
        <FadeInUp>
          <h2 className="text-3xl font-bold text-center mb-16">
            {/* TODO: Customize headline */}
            Get Started in 3 Simple Steps
          </h2>
        </FadeInUp>
        <div className="grid md:grid-cols-3 gap-12 max-w-5xl mx-auto">
          <FadeInUp delay={0.1}>
            <div className="text-center">
              <div className="bg-black text-white w-16 h-16 rounded-full flex items-center justify-center text-2xl font-bold mx-auto mb-4">
                1
              </div>
              <h3 className="text-xl font-semibold mb-3">
                {/* TODO: First step */}
                Sign Up
              </h3>
              <p className="text-gray-600">
                {/* TODO: Describe first step */}
                Create your account in seconds. No credit card required for the free trial.
              </p>
            </div>
          </FadeInUp>
          <FadeInUp delay={0.2}>
            <div className="text-center">
              <div className="bg-black text-white w-16 h-16 rounded-full flex items-center justify-center text-2xl font-bold mx-auto mb-4">
                2
              </div>
              <h3 className="text-xl font-semibold mb-3">
                {/* TODO: Second step */}
                Configure
              </h3>
              <p className="text-gray-600">
                {/* TODO: Describe second step */}
                Set up your workspace and invite your team members to collaborate.
              </p>
            </div>
          </FadeInUp>
          <FadeInUp delay={0.3}>
            <div className="text-center">
              <div className="bg-black text-white w-16 h-16 rounded-full flex items-center justify-center text-2xl font-bold mx-auto mb-4">
                3
              </div>
              <h3 className="text-xl font-semibold mb-3">
                {/* TODO: Third step */}
                Launch
              </h3>
              <p className="text-gray-600">
                {/* TODO: Describe third step */}
                Start using the platform immediately. Scale as your needs grow.
              </p>
            </div>
          </FadeInUp>
        </div>
      </section>

      {/* Features Section */}
      <section className="container mx-auto px-4 py-20">
        <FadeInUp>
          <h2 className="text-3xl font-bold text-center mb-4">
            {/* TODO: Add your key features headline */}
            Everything You Need to Succeed
          </h2>
        </FadeInUp>
        <FadeInUp delay={0.1}>
          <p className="text-center text-gray-600 mb-16 max-w-2xl mx-auto">
            {/* TODO: Add features subheadline */}
            Powerful features designed to help you build, launch, and scale your SaaS faster.
          </p>
        </FadeInUp>
        <div className="grid md:grid-cols-3 gap-8">
          <FadeInUp delay={0.1}>
            <div className="p-6 border rounded-lg hover:shadow-lg transition-shadow">
              <Zap className="w-12 h-12 mb-4 text-black" />
              <h3 className="text-xl font-semibold mb-3">
                {/* TODO: Feature name */}
                Lightning Fast
              </h3>
              <p className="text-gray-600">
                {/* TODO: Describe benefit, not just feature */}
                Built on modern infrastructure to deliver the best performance for your users.
              </p>
            </div>
          </FadeInUp>
          <FadeInUp delay={0.2}>
            <div className="p-6 border rounded-lg hover:shadow-lg transition-shadow">
              <Lock className="w-12 h-12 mb-4 text-black" />
              <h3 className="text-xl font-semibold mb-3">
                {/* TODO: Feature name */}
                Secure by Default
              </h3>
              <p className="text-gray-600">
                {/* TODO: Describe benefit, not just feature */}
                Enterprise-grade security with encryption, auth, and compliance built-in.
              </p>
            </div>
          </FadeInUp>
          <FadeInUp delay={0.3}>
            <div className="p-6 border rounded-lg hover:shadow-lg transition-shadow">
              <BarChart3 className="w-12 h-12 mb-4 text-black" />
              <h3 className="text-xl font-semibold mb-3">
                {/* TODO: Feature name */}
                Analytics Included
              </h3>
              <p className="text-gray-600">
                {/* TODO: Describe benefit, not just feature */}
                Track what matters with built-in analytics and detailed insights.
              </p>
            </div>
          </FadeInUp>
          <FadeInUp delay={0.4}>
            <div className="p-6 border rounded-lg hover:shadow-lg transition-shadow">
              <Users className="w-12 h-12 mb-4 text-black" />
              <h3 className="text-xl font-semibold mb-3">
                {/* TODO: Feature name */}
                Team Collaboration
              </h3>
              <p className="text-gray-600">
                {/* TODO: Describe benefit, not just feature */}
                Invite unlimited team members with role-based permissions.
              </p>
            </div>
          </FadeInUp>
          <FadeInUp delay={0.5}>
            <div className="p-6 border rounded-lg hover:shadow-lg transition-shadow">
              <Plug className="w-12 h-12 mb-4 text-black" />
              <h3 className="text-xl font-semibold mb-3">
                {/* TODO: Feature name */}
                API First
              </h3>
              <p className="text-gray-600">
                {/* TODO: Describe benefit, not just feature */}
                Integrate with your existing tools using our powerful API.
              </p>
            </div>
          </FadeInUp>
          <FadeInUp delay={0.6}>
            <div className="p-6 border rounded-lg hover:shadow-lg transition-shadow">
              <MessageCircle className="w-12 h-12 mb-4 text-black" />
              <h3 className="text-xl font-semibold mb-3">
                {/* TODO: Feature name */}
                24/7 Support
              </h3>
              <p className="text-gray-600">
                {/* TODO: Describe benefit, not just feature */}
                Our team is always here to help you succeed, day or night.
              </p>
            </div>
          </FadeInUp>
        </div>
      </section>

      {/* Product Demo Section */}
      <section id="demo" className="container mx-auto px-4 py-20 bg-gray-50">
        <div className="max-w-5xl mx-auto">
          <FadeInUp>
            <h2 className="text-3xl font-bold text-center mb-12">
              {/* TODO: Demo headline */}
              See It In Action
            </h2>
          </FadeInUp>
          <FadeInUp delay={0.1}>
            <div className="aspect-video bg-gray-200 rounded-lg flex items-center justify-center">
              {/* TODO: Replace with actual product screenshot or embed video */}
              <div className="text-center">
                <Play className="w-16 h-16 mb-4 mx-auto text-gray-600" />
                <p className="text-gray-600">Product Demo Video / Screenshot</p>
              </div>
            </div>
          </FadeInUp>
        </div>
      </section>

      {/* Stats Section */}
      <section className="container mx-auto px-4 py-20">
        <div className="grid md:grid-cols-4 gap-8 text-center">
          <FadeInUp delay={0.1}>
            <div>
              <div className="text-4xl font-bold mb-2">
                {/* TODO: Add real metric */}
                10K+
              </div>
              <p className="text-gray-600">Active Users</p>
            </div>
          </FadeInUp>
          <FadeInUp delay={0.2}>
            <div>
              <div className="text-4xl font-bold mb-2">
                {/* TODO: Add real metric */}
                99.9%
              </div>
              <p className="text-gray-600">Uptime</p>
            </div>
          </FadeInUp>
          <FadeInUp delay={0.3}>
            <div>
              <div className="text-4xl font-bold mb-2">
                {/* TODO: Add real metric */}
                50M+
              </div>
              <p className="text-gray-600">API Requests</p>
            </div>
          </FadeInUp>
          <FadeInUp delay={0.4}>
            <div>
              <div className="text-4xl font-bold mb-2">
                {/* TODO: Add real metric */}
                4.9/5
              </div>
              <p className="text-gray-600">Customer Rating</p>
            </div>
          </FadeInUp>
        </div>
      </section>

      {/* Testimonials Section */}
      <section className="container mx-auto px-4 py-20 bg-gray-50">
        <FadeInUp>
          <h2 className="text-3xl font-bold text-center mb-16">
            {/* TODO: Testimonials headline */}
            Loved by Thousands of Teams
          </h2>
        </FadeInUp>
        <div className="grid md:grid-cols-3 gap-8 max-w-6xl mx-auto">
          <FadeInUp delay={0.1}>
            <div className="bg-white p-8 rounded-lg shadow">
              <div className="flex mb-4">
                <span className="text-yellow-400">★★★★★</span>
              </div>
              <p className="text-gray-700 mb-6">
                {/* TODO: Add real customer testimonial */}
                &quot;This platform saved us months of development time. The team collaboration
                features are exactly what we needed.&quot;
              </p>
              <div className="flex items-center gap-3">
                <div className="w-12 h-12 bg-gray-200 rounded-full"></div>
                <div>
                  <div className="font-semibold">Sarah Johnson</div>
                  <div className="text-sm text-gray-600">CEO, TechCorp</div>
                </div>
              </div>
            </div>
          </FadeInUp>
          <FadeInUp delay={0.2}>
            <div className="bg-white p-8 rounded-lg shadow">
              <div className="flex mb-4">
                <span className="text-yellow-400">★★★★★</span>
              </div>
              <p className="text-gray-700 mb-6">
                {/* TODO: Add real customer testimonial */}
                &quot;The best investment we made this year. Simple to use, powerful features, and
                excellent support team.&quot;
              </p>
              <div className="flex items-center gap-3">
                <div className="w-12 h-12 bg-gray-200 rounded-full"></div>
                <div>
                  <div className="font-semibold">Michael Chen</div>
                  <div className="text-sm text-gray-600">Founder, StartupXYZ</div>
                </div>
              </div>
            </div>
          </FadeInUp>
          <FadeInUp delay={0.3}>
            <div className="bg-white p-8 rounded-lg shadow">
              <div className="flex mb-4">
                <span className="text-yellow-400">★★★★★</span>
              </div>
              <p className="text-gray-700 mb-6">
                {/* TODO: Add real customer testimonial */}
                &quot;Finally, a solution that just works. We switched from our old system and
                haven&apos;t looked back.&quot;
              </p>
              <div className="flex items-center gap-3">
                <div className="w-12 h-12 bg-gray-200 rounded-full"></div>
                <div>
                  <div className="font-semibold">Emily Rodriguez</div>
                  <div className="text-sm text-gray-600">CTO, GrowthLab</div>
                </div>
              </div>
            </div>
          </FadeInUp>
        </div>
      </section>

      {/* Pricing Section */}
      <section className="container mx-auto px-4 py-20">
        <FadeInUp>
          <h2 className="text-3xl font-bold text-center mb-4">
            {/* TODO: Customize pricing headline */}
            Simple, Transparent Pricing
          </h2>
        </FadeInUp>
        <FadeInUp delay={0.1}>
          <p className="text-center text-gray-600 mb-16 max-w-2xl mx-auto">
            {/* TODO: Pricing subheadline */}
            Start free, scale as you grow. No hidden fees.
          </p>
        </FadeInUp>
        <div className="grid md:grid-cols-3 gap-8 max-w-5xl mx-auto">
          {/* Hobby Plan */}
          <FadeInUp delay={0.1}>
            <div className="bg-white p-8 rounded-lg border-2 hover:border-gray-300 transition-colors">
              <h3 className="text-2xl font-bold mb-2">{STRIPE_PLANS.HOBBY.name}</h3>
              <div className="text-4xl font-bold mb-4">
                ${STRIPE_PLANS.HOBBY.price}
                <span className="text-lg text-gray-600">/mo</span>
              </div>
              <p className="text-gray-600 mb-6">Perfect for side projects and testing</p>
              <ul className="space-y-3 mb-8">
                {STRIPE_PLANS.HOBBY.features.map((feature, i) => (
                  <li key={i} className="flex items-start">
                    <span className="text-green-500 mr-2">✓</span>
                    <span>{feature}</span>
                  </li>
                ))}
              </ul>
              <Link
                href="/signup"
                className="block w-full bg-gray-100 text-center py-3 rounded-lg hover:bg-gray-200 font-semibold transition-colors"
              >
                Get Started
              </Link>
            </div>
          </FadeInUp>

          {/* Pro Plan */}
          <FadeInUp delay={0.2}>
            <div className="bg-white p-8 rounded-lg border-2 border-black relative transform scale-105">
              <div className="absolute -top-4 left-1/2 -translate-x-1/2 bg-black text-white px-4 py-1 text-sm rounded-full">
                Most Popular
              </div>
              <h3 className="text-2xl font-bold mb-2">{STRIPE_PLANS.PRO.name}</h3>
              <div className="text-4xl font-bold mb-4">
                ${STRIPE_PLANS.PRO.price}
                <span className="text-lg text-gray-600">/mo</span>
              </div>
              <p className="text-gray-600 mb-6">For growing teams and businesses</p>
              <ul className="space-y-3 mb-8">
                {STRIPE_PLANS.PRO.features.map((feature, i) => (
                  <li key={i} className="flex items-start">
                    <span className="text-green-500 mr-2">✓</span>
                    <span>{feature}</span>
                  </li>
                ))}
              </ul>
              <Link
                href="/signup"
                className="block w-full bg-black text-white text-center py-3 rounded-lg hover:bg-gray-800 font-semibold transition-colors"
              >
                Get Started
              </Link>
            </div>
          </FadeInUp>

          {/* Enterprise Plan */}
          <FadeInUp delay={0.3}>
            <div className="bg-white p-8 rounded-lg border-2 hover:border-gray-300 transition-colors">
              <h3 className="text-2xl font-bold mb-2">{STRIPE_PLANS.ENTERPRISE.name}</h3>
              <div className="text-4xl font-bold mb-4">
                ${STRIPE_PLANS.ENTERPRISE.price}
                <span className="text-lg text-gray-600">/mo</span>
              </div>
              <p className="text-gray-600 mb-6">For large organizations with custom needs</p>
              <ul className="space-y-3 mb-8">
                {STRIPE_PLANS.ENTERPRISE.features.map((feature, i) => (
                  <li key={i} className="flex items-start">
                    <span className="text-green-500 mr-2">✓</span>
                    <span>{feature}</span>
                  </li>
                ))}
              </ul>
              <Link
                href="/signup"
                className="block w-full bg-gray-100 text-center py-3 rounded-lg hover:bg-gray-200 font-semibold transition-colors"
              >
                Contact Sales
              </Link>
            </div>
          </FadeInUp>
        </div>
      </section>

      {/* FAQ Section */}
      <section className="container mx-auto px-4 py-20 bg-gray-50">
        <FadeInUp>
          <h2 className="text-3xl font-bold text-center mb-16">
            {/* TODO: FAQ headline */}
            Frequently Asked Questions
          </h2>
        </FadeInUp>
        <div className="max-w-3xl mx-auto space-y-6">
          <FAQItem
            question="What's included in the free trial?"
            answer="You get full access to all Pro features for 14 days. No credit card required. Cancel anytime during the trial period."
            delay={0.1}
          />
          <FAQItem
            question="Can I change plans later?"
            answer="Yes! You can upgrade or downgrade your plan at any time. Changes are prorated and reflected in your next billing cycle."
            delay={0.2}
          />
          <FAQItem
            question="What payment methods do you accept?"
            answer="We accept all major credit cards (Visa, Mastercard, American Express) and support invoicing for annual plans."
            delay={0.3}
          />
          <FAQItem
            question="Is my data secure?"
            answer="Absolutely. We use industry-standard encryption, regular security audits, and are SOC 2 compliant."
            delay={0.4}
          />
          <FAQItem
            question="Do you offer refunds?"
            answer="Yes, we offer a 30-day money-back guarantee. If you're not satisfied, contact us for a full refund."
            delay={0.5}
          />
        </div>
      </section>

      {/* Final CTA Section */}
      <section className="container mx-auto px-4 py-20">
        <FadeInUp>
          <div className="bg-black text-white rounded-2xl p-12 text-center max-w-4xl mx-auto">
            <h2 className="text-4xl font-bold mb-4">
              {/* TODO: Final CTA headline */}
              Ready to Get Started?
            </h2>
            <p className="text-xl mb-8 opacity-90">
              {/* TODO: Final CTA subheadline */}
              Join thousands of teams already building with our platform.
            </p>
            <Link
              href="/signup"
              className="inline-block bg-white text-black px-8 py-4 rounded-lg text-lg font-semibold hover:bg-gray-100 transition-colors"
            >
              Start Your Free Trial
            </Link>
            <p className="text-sm mt-4 opacity-75">No credit card required • 14-day free trial</p>
          </div>
        </FadeInUp>
      </section>

      {/* Footer */}
      <footer className="bg-gray-900 text-gray-400 py-12">
        <div className="container mx-auto px-4">
          <div className="grid md:grid-cols-4 gap-8 mb-8">
            <div>
              <div className="text-white text-xl font-bold mb-4">
                {/* TODO: Your logo/brand */}
                Your Logo
              </div>
              <p className="text-sm">
                {/* TODO: Company description */}
                Building the future of SaaS, one feature at a time.
              </p>
            </div>
            <div>
              <h3 className="text-white font-semibold mb-4">Product</h3>
              <ul className="space-y-2 text-sm">
                <li>
                  <Link href="#features" className="hover:text-white">
                    Features
                  </Link>
                </li>
                <li>
                  <Link href="#pricing" className="hover:text-white">
                    Pricing
                  </Link>
                </li>
                <li>
                  <Link href="#demo" className="hover:text-white">
                    Demo
                  </Link>
                </li>
                <li>
                  <Link href="/docs" className="hover:text-white">
                    Documentation
                  </Link>
                </li>
              </ul>
            </div>
            <div>
              <h3 className="text-white font-semibold mb-4">Company</h3>
              <ul className="space-y-2 text-sm">
                <li>
                  <Link href="/about" className="hover:text-white">
                    About
                  </Link>
                </li>
                <li>
                  <Link href="/blog" className="hover:text-white">
                    Blog
                  </Link>
                </li>
                <li>
                  <Link href="/careers" className="hover:text-white">
                    Careers
                  </Link>
                </li>
                <li>
                  <Link href="/contact" className="hover:text-white">
                    Contact
                  </Link>
                </li>
              </ul>
            </div>
            <div>
              <h3 className="text-white font-semibold mb-4">Legal</h3>
              <ul className="space-y-2 text-sm">
                <li>
                  <Link href="/privacy" className="hover:text-white">
                    Privacy
                  </Link>
                </li>
                <li>
                  <Link href="/terms" className="hover:text-white">
                    Terms
                  </Link>
                </li>
                <li>
                  <Link href="/security" className="hover:text-white">
                    Security
                  </Link>
                </li>
              </ul>
            </div>
          </div>
          <div className="border-t border-gray-800 pt-8 text-center text-sm">
            <p>© 2025 Your SaaS. All rights reserved.</p>
          </div>
        </div>
      </footer>
    </div>
  );
}
