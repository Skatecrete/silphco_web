import { useState } from 'react';
import { HelpDialog } from './HelpDialog';
import { getHelpContent } from '@/utils/helpContent';

interface HelpButtonProps {
  page: keyof typeof import('@/utils/helpContent').HELP_CONTENT;
  className?: string;
}

export function HelpButton({ page }: HelpButtonProps) {
  const [isOpen, setIsOpen] = useState(false);
  const { title, content } = getHelpContent(page);

  return (
    <>
      <button
        onClick={() => setIsOpen(true)}
        style={{
          position: 'fixed',
          bottom: '16px',
          right: '16px',
          zIndex: 40,
          padding: '8px 16px',
          backgroundColor: 'rgba(0, 0, 0, 0.2)',
          color: 'rgba(255, 255, 255, 0.5)',
          fontSize: '12px',
          borderRadius: '20px',
          backdropFilter: 'blur(8px)',
          border: 'none',
          cursor: 'pointer',
          fontFamily: 'inherit',
        }}
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