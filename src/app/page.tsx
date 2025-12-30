import Link from 'next/link';
import { Target, Trophy, TrendingUp, Users, Calendar, BarChart3 } from 'lucide-react';
import { FadeInUp, FadeIn } from '@/components/animations/FadeInUp';
import { FAQItem } from '@/components/faq-item';
import { STRIPE_PLANS } from '@/lib/stripe';

export default function HomePage() {
  return (
    <div className="min-h-screen bg-gradient-to-b from-gray-50 to-white">
      {/* Navigation */}
      <nav className="container mx-auto px-4 py-6 flex justify-between items-center">
        <div className="flex items-center gap-2">
          <Trophy className="w-8 h-8 text-green-600" />
          <div className="text-2xl font-bold">Pickleball Analytics</div>
        </div>
        <div className="space-x-4">
          <Link href="/login" className="text-gray-600 hover:text-gray-900">
            Login
          </Link>
          <Link
            href="/signup"
            className="bg-green-600 text-white px-4 py-2 rounded-lg hover:bg-green-700"
          >
            Start Free Trial
          </Link>
        </div>
      </nav>

      {/* Hero Section */}
      <section className="container mx-auto px-4 py-20 text-center">
        <FadeInUp>
          <h1 className="text-5xl md:text-6xl font-bold mb-6 max-w-4xl mx-auto">
            Track Leagues, Matches & Player Stats with Ease
          </h1>
        </FadeInUp>
        <FadeInUp delay={0.1}>
          <p className="text-xl text-gray-600 mb-8 max-w-2xl mx-auto">
            The simplest way for pickleball clubs to organize leagues, log matches, and track player
            performance. Save hours of admin work every week.
          </p>
        </FadeInUp>
        <FadeInUp delay={0.2}>
          <div className="flex justify-center gap-4">
            <Link
              href="/signup"
              className="inline-block bg-green-600 text-white px-8 py-4 rounded-lg text-lg font-semibold hover:bg-green-700 transition-colors"
            >
              Start Free Trial
            </Link>
            <Link
              href="#features"
              className="inline-block border-2 border-green-600 text-green-600 px-8 py-4 rounded-lg text-lg font-semibold hover:bg-green-50 transition-colors"
            >
              See How It Works
            </Link>
          </div>
        </FadeInUp>
        <FadeIn delay={0.3}>
          <p className="text-sm text-gray-500 mt-4">
            No credit card required • 14-day free trial • Cancel anytime
          </p>
        </FadeIn>
      </section>

      {/* Social Proof Section */}
      <section className="container mx-auto px-4 py-12">
        <FadeIn>
          <p className="text-center text-gray-600 mb-8">
            Used by pickleball clubs across the country to manage their communities
          </p>
        </FadeIn>
        <FadeIn delay={0.1}>
          <div className="flex justify-center items-center gap-12 flex-wrap opacity-50">
            <div className="text-2xl font-bold text-gray-400">Pickleball Club A</div>
            <div className="text-2xl font-bold text-gray-400">City Courts</div>
            <div className="text-2xl font-bold text-gray-400">PBL Association</div>
            <div className="text-2xl font-bold text-gray-400">Tennis & Pickleball</div>
            <div className="text-2xl font-bold text-gray-400">Community Club</div>
          </div>
        </FadeIn>
      </section>

      {/* Problem Section */}
      <section className="container mx-auto px-4 py-20">
        <div className="max-w-3xl mx-auto text-center">
          <FadeInUp>
            <h2 className="text-3xl font-bold mb-6">Stop Managing Your Club with Spreadsheets</h2>
          </FadeInUp>
          <FadeInUp delay={0.1}>
            <p className="text-xl text-gray-600 mb-8">
              Tracking matches, calculating rankings, and organizing leagues manually takes hours
              every week. You should be focusing on growing your pickleball community, not buried in
              spreadsheets and paperwork.
            </p>
          </FadeInUp>
        </div>
      </section>

      {/* How It Works Section */}
      <section className="container mx-auto px-4 py-20 bg-gray-50">
        <FadeInUp>
          <h2 className="text-3xl font-bold text-center mb-16">Get Started in 3 Simple Steps</h2>
        </FadeInUp>
        <div className="grid md:grid-cols-3 gap-12 max-w-5xl mx-auto">
          <FadeInUp delay={0.1}>
            <div className="text-center">
              <div className="bg-green-600 text-white w-16 h-16 rounded-full flex items-center justify-center text-2xl font-bold mx-auto mb-4">
                1
              </div>
              <h3 className="text-xl font-semibold mb-3">Create Your Club</h3>
              <p className="text-gray-600">
                Sign up and set up your pickleball club profile in seconds. Add your courts and
                facilities.
              </p>
            </div>
          </FadeInUp>
          <FadeInUp delay={0.2}>
            <div className="text-center">
              <div className="bg-green-600 text-white w-16 h-16 rounded-full flex items-center justify-center text-2xl font-bold mx-auto mb-4">
                2
              </div>
              <h3 className="text-xl font-semibold mb-3">Add Players</h3>
              <p className="text-gray-600">
                Import your member roster and track player profiles with skill ratings from 1.0 to
                5.0.
              </p>
            </div>
          </FadeInUp>
          <FadeInUp delay={0.3}>
            <div className="text-center">
              <div className="bg-green-600 text-white w-16 h-16 rounded-full flex items-center justify-center text-2xl font-bold mx-auto mb-4">
                3
              </div>
              <h3 className="text-xl font-semibold mb-3">Start Playing</h3>
              <p className="text-gray-600">
                Log matches, create leagues, and watch leaderboards update automatically. It&apos;s
                that simple!
              </p>
            </div>
          </FadeInUp>
        </div>
      </section>

      {/* Features Section */}
      <section id="features" className="container mx-auto px-4 py-20">
        <FadeInUp>
          <h2 className="text-3xl font-bold text-center mb-4">
            Everything You Need to Run Your Club
          </h2>
        </FadeInUp>
        <FadeInUp delay={0.1}>
          <p className="text-center text-gray-600 mb-16 max-w-2xl mx-auto">
            Powerful features designed specifically for pickleball club management.
          </p>
        </FadeInUp>
        <div className="grid md:grid-cols-3 gap-8">
          <FadeInUp delay={0.1}>
            <div className="p-6 border rounded-lg hover:shadow-lg transition-shadow">
              <Target className="w-12 h-12 mb-4 text-green-600" />
              <h3 className="text-xl font-semibold mb-3">Match Logging</h3>
              <p className="text-gray-600">
                Record match scores in seconds with our intuitive interface. Track singles and
                doubles matches effortlessly.
              </p>
            </div>
          </FadeInUp>
          <FadeInUp delay={0.2}>
            <div className="p-6 border rounded-lg hover:shadow-lg transition-shadow">
              <Trophy className="w-12 h-12 mb-4 text-green-600" />
              <h3 className="text-xl font-semibold mb-3">Leaderboards</h3>
              <p className="text-gray-600">
                Automatic ranking calculations based on match results. Players can see their stats
                and track improvement over time.
              </p>
            </div>
          </FadeInUp>
          <FadeInUp delay={0.3}>
            <div className="p-6 border rounded-lg hover:shadow-lg transition-shadow">
              <TrendingUp className="w-12 h-12 mb-4 text-green-600" />
              <h3 className="text-xl font-semibold mb-3">Player Statistics</h3>
              <p className="text-gray-600">
                Track win rates, skill ratings (1.0-5.0), and performance history for every player
                in your club.
              </p>
            </div>
          </FadeInUp>
          <FadeInUp delay={0.4}>
            <div className="p-6 border rounded-lg hover:shadow-lg transition-shadow">
              <Users className="w-12 h-12 mb-4 text-green-600" />
              <h3 className="text-xl font-semibold mb-3">League Management</h3>
              <p className="text-gray-600">
                Create and manage organized leagues with scheduling, standings, and playoffs. Keep
                your members engaged all season long.
              </p>
            </div>
          </FadeInUp>
          <FadeInUp delay={0.5}>
            <div className="p-6 border rounded-lg hover:shadow-lg transition-shadow">
              <Calendar className="w-12 h-12 mb-4 text-green-600" />
              <h3 className="text-xl font-semibold mb-3">Court Management</h3>
              <p className="text-gray-600">
                Manage courts, surfaces, and facilities all in one place. Track court usage and
                maintenance schedules.
              </p>
            </div>
          </FadeInUp>
          <FadeInUp delay={0.6}>
            <div className="p-6 border rounded-lg hover:shadow-lg transition-shadow">
              <BarChart3 className="w-12 h-12 mb-4 text-green-600" />
              <h3 className="text-xl font-semibold mb-3">Admin Dashboard</h3>
              <p className="text-gray-600">
                Get insights into club activity, member engagement, and growth. Make data-driven
                decisions for your club.
              </p>
            </div>
          </FadeInUp>
        </div>
      </section>

      {/* Product Demo Section */}
      <section id="demo" className="container mx-auto px-4 py-20 bg-gray-50">
        <div className="max-w-5xl mx-auto">
          <FadeInUp>
            <h2 className="text-3xl font-bold text-center mb-12">Built for Pickleball Clubs</h2>
          </FadeInUp>
          <FadeInUp delay={0.1}>
            <div className="aspect-video bg-gradient-to-br from-green-100 to-green-200 rounded-lg flex items-center justify-center border-4 border-green-600">
              <div className="text-center">
                <Trophy className="w-24 h-24 mb-4 mx-auto text-green-600" />
                <p className="text-xl font-semibold text-green-800">Your Club Dashboard Awaits</p>
                <p className="text-green-700 mt-2">Sign up to see the full platform</p>
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
              <div className="text-4xl font-bold mb-2 text-green-600">50K+</div>
              <p className="text-gray-600">Matches Tracked</p>
            </div>
          </FadeInUp>
          <FadeInUp delay={0.2}>
            <div>
              <div className="text-4xl font-bold mb-2 text-green-600">500+</div>
              <p className="text-gray-600">Clubs Using Platform</p>
            </div>
          </FadeInUp>
          <FadeInUp delay={0.3}>
            <div>
              <div className="text-4xl font-bold mb-2 text-green-600">99.9%</div>
              <p className="text-gray-600">Uptime SLA</p>
            </div>
          </FadeInUp>
          <FadeInUp delay={0.4}>
            <div>
              <div className="text-4xl font-bold mb-2 text-green-600">4.9/5</div>
              <p className="text-gray-600">Club Manager Rating</p>
            </div>
          </FadeInUp>
        </div>
      </section>

      {/* Testimonials Section */}
      <section className="container mx-auto px-4 py-20 bg-gray-50">
        <FadeInUp>
          <h2 className="text-3xl font-bold text-center mb-16">
            Trusted by Club Managers Nationwide
          </h2>
        </FadeInUp>
        <div className="grid md:grid-cols-3 gap-8 max-w-6xl mx-auto">
          <FadeInUp delay={0.1}>
            <div className="bg-white p-8 rounded-lg shadow">
              <div className="flex mb-4">
                <span className="text-yellow-400">★★★★★</span>
              </div>
              <p className="text-gray-700 mb-6">
                &quot;We used to spend hours every week manually calculating rankings. Now our
                leaderboard updates automatically after every match. The players love it!&quot;
              </p>
              <div className="flex items-center gap-3">
                <div className="w-12 h-12 bg-green-100 rounded-full flex items-center justify-center">
                  <Trophy className="w-6 h-6 text-green-600" />
                </div>
                <div>
                  <div className="font-semibold">Sarah Martinez</div>
                  <div className="text-sm text-gray-600">Club Director, Metro Pickleball</div>
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
                &quot;The league management features are incredible. We run 12 concurrent leagues
                and scheduling used to be a nightmare. Now it&apos;s effortless.&quot;
              </p>
              <div className="flex items-center gap-3">
                <div className="w-12 h-12 bg-green-100 rounded-full flex items-center justify-center">
                  <Trophy className="w-6 h-6 text-green-600" />
                </div>
                <div>
                  <div className="font-semibold">James Wilson</div>
                  <div className="text-sm text-gray-600">President, Valley Pickleball Club</div>
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
                &quot;Our player engagement doubled after we started tracking stats. Members love
                seeing their improvement over time and compete to climb the rankings.&quot;
              </p>
              <div className="flex items-center gap-3">
                <div className="w-12 h-12 bg-green-100 rounded-full flex items-center justify-center">
                  <Trophy className="w-6 h-6 text-green-600" />
                </div>
                <div>
                  <div className="font-semibold">Emily Chen</div>
                  <div className="text-sm text-gray-600">Manager, Community Courts</div>
                </div>
              </div>
            </div>
          </FadeInUp>
        </div>
      </section>

      {/* Pricing Section */}
      <section id="pricing" className="container mx-auto px-4 py-20">
        <FadeInUp>
          <h2 className="text-3xl font-bold text-center mb-4">Simple, Transparent Pricing</h2>
        </FadeInUp>
        <FadeInUp delay={0.1}>
          <p className="text-center text-gray-600 mb-16 max-w-2xl mx-auto">
            Choose the plan that fits your club. All plans include a 14-day free trial.
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
              <p className="text-gray-600 mb-6">Perfect for small clubs and casual leagues</p>
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
              <p className="text-gray-600 mb-6">For active clubs with multiple leagues</p>
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
              <p className="text-gray-600 mb-6">For large facilities and tournament organizers</p>
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
          <h2 className="text-3xl font-bold text-center mb-16">Frequently Asked Questions</h2>
        </FadeInUp>
        <div className="max-w-3xl mx-auto space-y-6">
          <FAQItem
            question="How long does it take to set up?"
            answer="Most clubs are up and running in under 30 minutes. Import your player roster, add your courts, and you're ready to start logging matches."
            delay={0.1}
          />
          <FAQItem
            question="Can I import my existing match data?"
            answer="Yes! We support CSV imports for matches, players, and leagues. Our team can help you migrate from spreadsheets or other systems."
            delay={0.2}
          />
          <FAQItem
            question="Do players need to create accounts?"
            answer="Players can view leaderboards and stats without accounts. They only need accounts if you want them to log their own matches or manage their profiles."
            delay={0.3}
          />
          <FAQItem
            question="What if I need help getting started?"
            answer="Every plan includes access to our knowledge base and email support. Pro and Enterprise plans include priority support and onboarding calls."
            delay={0.4}
          />
          <FAQItem
            question="Can I cancel anytime?"
            answer="Absolutely. There are no long-term contracts. You can upgrade, downgrade, or cancel your subscription at any time with no penalties."
            delay={0.5}
          />
        </div>
      </section>

      {/* Final CTA Section */}
      <section className="container mx-auto px-4 py-20">
        <FadeInUp>
          <div className="bg-gradient-to-br from-green-600 to-green-700 text-white rounded-2xl p-12 text-center max-w-4xl mx-auto">
            <h2 className="text-4xl font-bold mb-4">Ready to Transform Your Club?</h2>
            <p className="text-xl mb-8 opacity-90">
              Join hundreds of pickleball clubs already using our platform to save time and engage
              players.
            </p>
            <Link
              href="/signup"
              className="inline-block bg-white text-green-700 px-8 py-4 rounded-lg text-lg font-semibold hover:bg-gray-100 transition-colors"
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
              <div className="flex items-center gap-2 text-white text-xl font-bold mb-4">
                <Trophy className="w-6 h-6 text-green-500" />
                <span>Pickleball Analytics</span>
              </div>
              <p className="text-sm">
                The simplest way for pickleball clubs to track leagues, matches, and player stats.
                Focus on growing your community, not spreadsheets.
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
                  <Link href="/docs" className="hover:text-white">
                    Documentation
                  </Link>
                </li>
                <li>
                  <Link href="/login" className="hover:text-white">
                    Login
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
                    Privacy Policy
                  </Link>
                </li>
                <li>
                  <Link href="/terms" className="hover:text-white">
                    Terms of Service
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
            <p>© 2025 Pickleball Analytics. All rights reserved.</p>
          </div>
        </div>
      </footer>
    </div>
  );
}
