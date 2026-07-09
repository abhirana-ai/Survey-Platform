import { useState } from 'react';
import { Link } from 'react-router-dom';
import Button from '../../components/common/Button.jsx';
import Navbar from '../../components/common/Navbar.jsx';
import Footer from '../../components/common/Footer.jsx';
import { useAuth } from '../../context/AuthContext.jsx';
import { 
  ArrowRight, 
  Layers, 
  ShieldCheck, 
  BarChart3, 
  CheckCircle, 
  Sparkles, 
  Check, 
  Star,
  Compass
} from 'lucide-react';

const LandingPage = () => {
  const { isAuthenticated } = useAuth();
  
  // Interactive Survey Card Preview State
  const [selectedOption, setSelectedOption] = useState(null);
  const [votes, setVotes] = useState({
    'Advanced Analytics Charts': 142,
    'Custom Domain Branding': 98,
    'Instant CSV/PDF Export': 74
  });
  const [totalVotes, setTotalVotes] = useState(314);

  const handleVote = (option) => {
    if (selectedOption) return; // Only allow one vote in preview
    setSelectedOption(option);
    setVotes(prev => ({
      ...prev,
      [option]: prev[option] + 1
    }));
    setTotalVotes(prev => prev + 1);
  };

  const getPercentage = (option) => {
    return Math.round((votes[option] / totalVotes) * 100);
  };

  return (
    <div className="min-h-screen flex flex-col bg-slate-50 text-slate-900 overflow-x-hidden">
      <Navbar />

      <main className="flex-1 relative">
        {/* Ambient Glowing Motion Blobs (Soft Light Theme) */}
        <div className="absolute top-[-10%] left-[-10%] h-[500px] w-[500px] rounded-full bg-violet-400/5 blur-[120px] animate-float pointer-events-none"></div>
        <div className="absolute top-[20%] right-[-10%] h-[600px] w-[600px] rounded-full bg-indigo-400/5 blur-[130px] animate-float-reverse pointer-events-none"></div>
        <div className="absolute bottom-[10%] left-[20%] h-[400px] w-[400px] rounded-full bg-emerald-450/5 blur-[100px] pointer-events-none"></div>

        {/* Hero & Interactive Preview Split */}
        <section className="relative mx-auto max-w-7xl px-6 py-16 sm:px-8 lg:px-10 lg:py-24 grid gap-12 lg:grid-cols-12 items-center">
          <div className="lg:col-span-7 space-y-6 text-center lg:text-left">
            <span className="inline-flex items-center gap-1.5 rounded-full bg-violet-50 border border-violet-100 px-3.5 py-1 text-xs font-semibold text-violet-700">
              <Sparkles size={12} className="text-violet-600 animate-pulse" />
              Grow Insights 10x Faster
            </span>
            
            <h1 className="text-4xl font-extrabold tracking-tight text-slate-950 sm:text-6xl leading-[1.15]">
              Create High-Engagement Surveys in Seconds.
            </h1>
            
            <p className="text-base sm:text-lg leading-relaxed text-slate-600 max-w-2xl mx-auto lg:mx-0">
              Stop guessing. Capture valuable student reviews, client suggestions, or user feedback with high-engagement survey cards. **Get up to 94% response rates** using our distraction-free, responsive form structures.
            </p>

            {/* Direct Focus Call to Actions */}
            <div className="flex flex-wrap justify-center lg:justify-start gap-4 pt-2">
              <Link to={isAuthenticated ? "/surveys/create" : "/register"}>
                <Button className="h-12 px-7 text-sm font-bold bg-violet-600 hover:bg-violet-750 text-white border-none rounded-xl shadow-lg shadow-violet-550/20 group transition">
                  Create Survey - Free
                  <ArrowRight size={16} className="ml-2 transition-transform group-hover:translate-x-1" />
                </Button>
              </Link>
              <Link to={isAuthenticated ? "/surveys" : "/login"}>
                <Button variant="secondary" className="h-12 px-7 text-sm font-bold bg-white border-slate-200 text-slate-700 hover:bg-slate-50 rounded-xl">
                  Explore Active Surveys
                </Button>
              </Link>
            </div>

            {/* Social Proof Badges */}
            <div className="flex flex-wrap justify-center lg:justify-start items-center gap-6 pt-6 text-slate-500 text-xs">
              <div className="flex items-center gap-1">
                <CheckCircle size={14} className="text-emerald-600" />
                <span>No Credit Card Required</span>
              </div>
              <div className="flex items-center gap-1">
                <CheckCircle size={14} className="text-emerald-600" />
                <span>Publish Instantly</span>
              </div>
              <div className="flex items-center gap-1">
                <CheckCircle size={14} className="text-emerald-600" />
                <span>Dynamic Dashboard</span>
              </div>
            </div>
          </div>

          {/* Interactive Survey Widget (Light Theme) */}
          <div className="lg:col-span-5 flex justify-center">
            <div className="w-full max-w-md rounded-2xl border border-slate-200 bg-white p-6 shadow-md relative overflow-hidden group hover:border-violet-300 transition duration-300">
              {/* Card top gradient line */}
              <div className="absolute top-0 left-0 right-0 h-1 bg-gradient-to-r from-violet-600 via-indigo-600 to-emerald-500"></div>

              <div className="flex items-center justify-between mb-4">
                <span className="inline-flex items-center gap-1 rounded-full bg-violet-50 border border-violet-100 px-2.5 py-0.5 text-[10px] font-bold text-violet-750">
                  <Compass size={10} />
                  Interactive Demo
                </span>
                <span className="text-[10px] text-slate-550 font-semibold">{totalVotes} Responses</span>
              </div>

              <h3 className="font-bold text-slate-900 text-md mb-2">
                Which pro upgrade feature do you want integrated next?
              </h3>
              <p className="text-xs text-slate-500 mb-4">Click an option to see live mock survey response animations in real time.</p>

              {/* Options lists / Results anims */}
              <div className="space-y-2.5">
                {Object.keys(votes).map((opt) => {
                  const isPicked = selectedOption === opt;
                  const percent = getPercentage(opt);

                  return (
                    <div 
                      key={opt}
                      onClick={() => handleVote(opt)}
                      className={`relative rounded-xl border p-3.5 text-xs text-slate-700 cursor-pointer select-none overflow-hidden transition-all duration-205
                        ${isPicked ? 'border-violet-500 bg-violet-50/30' : 'border-slate-200 bg-slate-50/50 hover:bg-slate-50 hover:border-slate-300'}
                        ${selectedOption && !isPicked ? 'opacity-70 pointer-events-none' : ''}`}
                    >
                      {/* Background animated progress filler */}
                      {selectedOption && (
                        <div 
                          className="absolute inset-y-0 left-0 bg-violet-500/10 transition-all duration-550 ease-out"
                          style={{ width: `${percent}%` }}
                        ></div>
                      )}

                      <div className="relative flex items-center justify-between font-semibold">
                        <span>{opt}</span>
                        {selectedOption ? (
                          <span className="text-violet-700 font-bold">{percent}%</span>
                        ) : (
                          <div className="h-4 w-4 rounded-full border border-slate-300 flex items-center justify-center shrink-0 bg-white">
                            <div className="h-1.5 w-1.5 rounded-full bg-transparent"></div>
                          </div>
                        )}
                      </div>
                    </div>
                  );
                })}
              </div>

              {selectedOption && (
                <div className="mt-4 text-center text-[10px] text-emerald-600 font-semibold flex items-center justify-center gap-1 animate-in fade-in duration-200">
                  <Check size={12} className="stroke-[2.5]" />
                  <span>Success! Response animation complete.</span>
                </div>
              )}
            </div>
          </div>
        </section>

        {/* How Easy is it to Create & Deploy Section */}
        <section className="border-y border-slate-200/80 bg-slate-50/50 py-20 px-6 sm:px-8 lg:px-10">
          <div className="mx-auto max-w-7xl">
            <div className="text-center max-w-3xl mx-auto mb-16">
              <span className="text-xs font-bold uppercase tracking-wider text-violet-600">Zero Friction</span>
              <h2 className="text-3xl font-bold tracking-tight text-slate-950 mt-1.5">Launch Surveys in 3 Simple Clicks</h2>
              <p className="mt-3 text-sm text-slate-650">
                You don't need coding skills or complex setups. InsightFlow is streamlined for instant action.
              </p>
            </div>

            <div className="grid gap-8 md:grid-cols-3">
              <div className="rounded-2xl border border-slate-200 bg-white p-6 relative shadow-sm">
                <div className="flex h-11 w-11 items-center justify-center rounded-xl bg-violet-50 text-violet-600 border border-violet-100 mb-5">
                  <Layers size={20} />
                </div>
                <h3 className="text-lg font-bold text-slate-900">1. Design Form</h3>
                <p className="mt-2 text-xs leading-relaxed text-slate-650">
                  Enter title, descriptions, and drop as many text or choice questions as needed. No drag-and-drop complexity.
                </p>
              </div>

              <div className="rounded-2xl border border-slate-200 bg-white p-6 relative shadow-sm">
                <div className="flex h-11 w-11 items-center justify-center rounded-xl bg-indigo-50 text-indigo-650 border border-indigo-100 mb-5">
                  <Compass size={20} />
                </div>
                <h3 className="text-lg font-bold text-slate-900">2. Deploy Link</h3>
                <p className="mt-2 text-xs leading-relaxed text-slate-650">
                  Generate a shareable survey link instantly. Your survey page is lightweight, responsive, and loads in &lt;100ms.
                </p>
              </div>

              <div className="rounded-2xl border border-slate-200 bg-white p-6 relative shadow-sm">
                <div className="flex h-11 w-11 items-center justify-center rounded-xl bg-emerald-50 text-emerald-650 border border-emerald-100 mb-5">
                  <BarChart3 size={20} />
                </div>
                <h3 className="text-lg font-bold text-slate-900">3. Collect Data</h3>
                <p className="mt-2 text-xs leading-relaxed text-slate-650">
                  Check live percentages and comments on your dashboard immediately. Export datasets for grading, report research or feedback reviews.
                </p>
              </div>
            </div>
          </div>
        </section>

        {/* Customer Reviews Section */}
        <section className="py-20 px-6 sm:px-8 lg:px-10 bg-white">
          <div className="mx-auto max-w-7xl">
            <div className="text-center max-w-3xl mx-auto mb-16">
              <span className="text-xs font-bold uppercase tracking-wider text-violet-600">Loved by Researchers</span>
              <h2 className="text-3xl font-bold tracking-tight text-slate-950 mt-1.5">What Our Users Say</h2>
              <p className="mt-3 text-sm text-slate-650">
                Join thousands of workspace admins gathering reliable data every day.
              </p>
            </div>

            <div className="grid gap-6 md:grid-cols-3">
              {[
                {
                  quote: "We collected over 840 curriculum reviews from CS students in less than 24 hours. The interface is clean, distraction-free, and response completion rates reached a whopping 94%.",
                  author: "Dr. Sarah Jenkins",
                  role: "Head of CS Department",
                  rating: 5
                },
                {
                  quote: "InsightFlow helped me validate my SaaS product idea before coding. I set up a multiple choice option poll, shared it, and got exactly the roadmap validation I needed.",
                  author: "Alex Mercer",
                  role: "Indie Software Developer",
                  rating: 5
                },
                {
                  quote: "As a student working on my research thesis, I needed a fast way to collect 200 answers. I launched the survey, shared the URL, and had all analytics parsed automatically.",
                  author: "Marcus Chen",
                  role: "Graduate Researcher",
                  rating: 5
                }
              ].map((item, idx) => (
                <div key={idx} className="rounded-2xl border border-slate-200 bg-slate-50/50 p-6 flex flex-col justify-between shadow-sm">
                  <div className="space-y-4">
                    <div className="flex gap-1 text-amber-500">
                      {[...Array(item.rating)].map((_, i) => <Star key={i} size={14} className="fill-amber-500 text-amber-500" />)}
                    </div>
                    <p className="text-xs italic leading-relaxed text-slate-700">"{item.quote}"</p>
                  </div>
                  <div className="mt-6 flex items-center gap-3 border-t border-slate-100 pt-4">
                    <div className="h-8 w-8 rounded-full bg-violet-100 flex items-center justify-center font-bold text-xs text-violet-750">
                      {item.author[0]}
                    </div>
                    <div>
                      <p className="text-xs font-bold text-slate-900">{item.author}</p>
                      <p className="text-[10px] text-slate-500 font-semibold">{item.role}</p>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </section>

        {/* Pricing Tiers Section - Built for future payment upgrade */}
        <section className="border-t border-slate-200 bg-slate-50/50 py-20 px-6 sm:px-8 lg:px-10">
          <div className="mx-auto max-w-7xl">
            <div className="text-center max-w-3xl mx-auto mb-16">
              <span className="text-xs font-bold uppercase tracking-wider text-violet-600 font-sans">Transparent Tiers</span>
              <h2 className="text-3xl font-bold tracking-tight text-slate-950 mt-1.5">SaaS Pricing Options</h2>
              <p className="mt-3 text-sm text-slate-655">
                Unlock higher limits and custom branding. Payments coming in a future upgrade!
              </p>
            </div>

            <div className="grid gap-8 md:grid-cols-3 max-w-5xl mx-auto">
              {/* Basic Free */}
              <div className="rounded-2xl border border-slate-200 bg-white p-6 flex flex-col justify-between relative overflow-hidden shadow-sm">
                <div>
                  <h3 className="font-bold text-slate-900 text-md">Free Plan</h3>
                  <p className="text-xs text-slate-500 mt-1">Perfect for simple academic studies.</p>
                  <p className="mt-4 text-3xl font-extrabold text-slate-900">$0 <span className="text-xs text-slate-550 font-normal">/ month</span></p>
                  <ul className="mt-6 space-y-2.5 text-xs text-slate-700">
                    <li className="flex items-center gap-2"><Check size={14} className="text-emerald-600" /> 3 Survey Templates</li>
                    <li className="flex items-center gap-2"><Check size={14} className="text-emerald-600" /> 100 Responses / survey</li>
                    <li className="flex items-center gap-2"><Check size={14} className="text-emerald-600" /> 4 Question Input Types</li>
                    <li className="flex items-center gap-2"><Check size={14} className="text-emerald-600" /> Visual Dashboards</li>
                  </ul>
                </div>
                <Link to="/register" className="mt-8">
                  <Button className="w-full h-10 text-xs bg-slate-50 border-slate-200 hover:bg-slate-100 text-slate-700 rounded-xl">
                    Get Started Free
                  </Button>
                </Link>
              </div>

              {/* Creator Pro */}
              <div className="rounded-2xl border border-violet-200 bg-violet-50/30 p-6 flex flex-col justify-between relative overflow-hidden shadow-md">
                <div className="absolute top-0 right-0 bg-violet-600 text-white text-[9px] font-bold uppercase tracking-wider py-1 px-3.5 rounded-bl-xl">
                  Popular
                </div>
                <div>
                  <h3 className="font-bold text-slate-900 text-md">Creator Pro</h3>
                  <p className="text-xs text-slate-600 mt-1">For advanced researchers & startups.</p>
                  <p className="mt-4 text-3xl font-extrabold text-slate-900">$19 <span className="text-xs text-slate-550 font-normal">/ month</span></p>
                  <span className="inline-block mt-2 rounded bg-amber-500/10 border border-amber-500/20 text-amber-600 px-2 py-0.5 text-[9px] font-semibold">
                    Upgrade Coming Soon
                  </span>
                  <ul className="mt-6 space-y-2.5 text-xs text-slate-750">
                    <li className="flex items-center gap-2"><Check size={14} className="text-violet-600" /> Unlimited Surveys</li>
                    <li className="flex items-center gap-2"><Check size={14} className="text-violet-600" /> Unlimited Responses</li>
                    <li className="flex items-center gap-2"><Check size={14} className="text-violet-600" /> Custom Domain Branding</li>
                    <li className="flex items-center gap-2"><Check size={14} className="text-violet-600" /> CSV & PDF Export</li>
                    <li className="flex items-center gap-2"><Check size={14} className="text-violet-600" /> Priority Support Link</li>
                  </ul>
                </div>
                <Button disabled className="w-full h-10 text-xs bg-violet-600 text-white rounded-xl mt-8 cursor-not-allowed opacity-60">
                  Upgrade Pending
                </Button>
              </div>

              {/* Enterprise */}
              <div className="rounded-2xl border border-slate-200 bg-white p-6 flex flex-col justify-between relative overflow-hidden shadow-sm">
                <div>
                  <h3 className="font-bold text-slate-900 text-md">Enterprise</h3>
                  <p className="text-xs text-slate-500 mt-1">For whole departments & colleges.</p>
                  <p className="mt-4 text-3xl font-extrabold text-slate-900">Custom <span className="text-xs text-slate-555 font-normal">pricing</span></p>
                  <span className="inline-block mt-2 rounded bg-amber-500/10 border border-amber-500/20 text-amber-600 px-2 py-0.5 text-[9px] font-semibold">
                    Upgrade Coming Soon
                  </span>
                  <ul className="mt-6 space-y-2.5 text-xs text-slate-700">
                    <li className="flex items-center gap-2"><Check size={14} className="text-emerald-600" /> Everything in Pro</li>
                    <li className="flex items-center gap-2"><Check size={14} className="text-emerald-600" /> Multi-user Team Roles</li>
                    <li className="flex items-center gap-2"><Check size={14} className="text-emerald-600" /> Custom SLA Agreements</li>
                    <li className="flex items-center gap-2"><Check size={14} className="text-emerald-600" /> 1-on-1 Admin Training</li>
                  </ul>
                </div>
                <Button disabled className="w-full h-10 text-xs bg-slate-50 border-slate-200 text-slate-700 rounded-xl mt-8 cursor-not-allowed opacity-60">
                  Contact Sales
                </Button>
              </div>
            </div>
          </div>
        </section>

        {/* CTA Bottom Section */}
        <section className="relative overflow-hidden py-20 px-6 sm:px-8 lg:px-10 text-center border-t border-slate-200">
          <div className="absolute inset-0 bg-[radial-gradient(circle_at_center,_rgba(139,92,246,0.03),_transparent_60%)] pointer-events-none"></div>
          <div className="mx-auto max-w-4xl space-y-6 relative z-10">
            <h2 className="text-3xl font-extrabold tracking-tight text-slate-950 sm:text-4xl">
              Ready to Collect Actionable Audience Data?
            </h2>
            <p className="text-sm text-slate-600 max-w-xl mx-auto">
              Join thousands of creators who build surveys, collect responses, and make growth-oriented decisions.
            </p>
            <div className="flex justify-center gap-4 pt-2">
              <Link to="/register">
                <Button className="h-11 px-6 text-xs font-bold bg-violet-600 hover:bg-violet-750 text-white border-none rounded-xl shadow-md shadow-violet-550/15">
                  Get Started Free
                </Button>
              </Link>
            </div>
          </div>
        </section>
      </main>

      <Footer />
    </div>
  );
};

export default LandingPage;
