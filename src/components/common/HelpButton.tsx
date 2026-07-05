import { useState } from 'react';
import { HelpDialog } from './HelpDialog';
import { getHelpContent } from '@/utils/helpContent';

interface HelpButtonProps {
  page: keyof typeof import('@/utils/helpContent').HELP_CONTENT;
  className?: string;
}

export function HelpButton({ page, className = '' }: HelpButtonProps) {
  const [isOpen, setIsOpen] = useState(false);
  const { title, content } = getHelpContent(page);

  return (
    <>
      <button
        onClick={() => setIsOpen(true)}
        className={`fixed bottom-4 right-4 z-40 px-4 py-2 bg-black/20 text-white/50 text-xs rounded-full backdrop-blur-sm hover:bg-black/40 transition-colors ${className}`}
      >
        ❓ Need Help?
      </button>

      <HelpDialog
        isOpen={isOpen}
        title={title}
        content={content}
        onClose={() => setIsOpen(false)}
      />
    </>
  );
}