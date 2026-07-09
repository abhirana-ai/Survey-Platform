import { ClipboardSignature } from 'lucide-react';

const Footer = () => {
  return (
    <footer className="border-t border-slate-200 bg-white py-12">
      <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
        <div className="flex flex-col items-center justify-between gap-6 sm:flex-row">
          <div className="flex items-center gap-2">
            <div className="flex h-7 w-7 items-center justify-center rounded-lg bg-violet-600 text-white shadow-sm">
              <ClipboardSignature size={14} className="stroke-[2.5]" />
            </div>
            <span className="text-sm font-semibold tracking-tight text-slate-900">
              Insight<span className="text-violet-600">Flow</span>
            </span>
          </div>
          <p className="text-xs text-slate-500">
            &copy; {new Date().getFullYear()} InsightFlow. All rights reserved. Designed for simple and secure academic & enterprise survey management.
          </p>
        </div>
      </div>
    </footer>
  );
};

export default Footer;
