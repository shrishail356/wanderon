'use client';

import { useEffect, useState, useRef } from 'react';
import { motion, useInView } from 'framer-motion';
import { useTheme } from 'next-themes';
import Image from 'next/image';
import StackIcon from 'tech-stack-icons';
import Marquee from '@/components/ui/marquee';
import { Badge } from '@/components/ui/badge';
import { FileIcon } from 'lucide-react';

const techStack = [
  { name: 'React', iconName: 'react', category: 'Frontend', type: 'stack' },
  { name: 'Next.js', iconName: 'nextjs', category: 'Framework', type: 'stack' },
  { name: 'TypeScript', iconName: 'typescript', category: 'Language', type: 'stack' },
  { name: 'Node.js', iconName: 'nodejs', category: 'Runtime', type: 'stack' },
  { name: 'Express', iconName: 'express', category: 'Backend', type: 'custom', iconPath: '/express.png' },
  { name: 'MongoDB', iconName: 'mongodb', category: 'Database', type: 'stack' },
  { name: 'Tailwind CSS', iconName: 'tailwindcss', category: 'Styling', type: 'stack' },
  { name: 'JavaScript', iconName: 'javascript', category: 'Language', type: 'custom', iconPath: '/js.png' },
  { name: 'Git', iconName: 'git', category: 'Version Control', type: 'stack' },
  { name: 'GitHub', iconName: 'github', category: 'Platform', type: 'stack' },
];

export default function TechStackMarquee() {
  const { resolvedTheme } = useTheme();
  const [mounted, setMounted] = useState(false);
  const [iconErrors, setIconErrors] = useState<Record<string, boolean>>({});
  const ref = useRef(null);
  const isInView = useInView(ref, { once: true, margin: '-100px' });

  useEffect(() => setMounted(true), []);

  if (!mounted) return null;

  const isDark = resolvedTheme === 'dark';

  const handleImageError = (techName: string) => {
    setIconErrors((prev) => ({ ...prev, [techName]: true }));
  };

  return (
    <section
      id='tech-stack'
      ref={ref}
      className='relative overflow-hidden bg-dark-gray-1 py-12'
    >
      <div className='mx-auto max-w-7xl px-4 sm:px-6 lg:px-8'>


        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6, delay: 0.4 }}
          className="mb-16"
        >
          <h2 className={`text-3xl font-bold mb-8 text-center ${isDark ? 'text-white' : 'text-gray-900'}`}>
            Technology Stack
          </h2>
          <div className="relative flex h-full w-full flex-col items-center justify-center overflow-hidden bg-transparent py-10">
            {/* Tech Stack Marquee */}
            <Marquee pauseOnHover className="select-none [--duration:25s]">
              {[
                { name: 'React', iconName: 'react', category: 'Frontend', type: 'stack' },
                { name: 'Next.js', iconName: 'nextjs', category: 'Framework', type: 'stack' },
                { name: 'TypeScript', iconName: 'typescript', category: 'Language', type: 'stack' },
                { name: 'Node.js', iconName: 'nodejs', category: 'Runtime', type: 'stack' },
                { name: 'Express', iconName: 'express', category: 'Backend', type: 'custom', iconPath: '/express.png' },
                { name: 'MongoDB', iconName: 'mongodb', category: 'Database', type: 'stack' },
                { name: 'Tailwind CSS', iconName: 'tailwindcss', category: 'Styling', type: 'stack' },
                { name: 'JavaScript', iconName: 'javascript', category: 'Language', type: 'custom', iconPath: '/js.png' },
                { name: 'Git', iconName: 'git', category: 'Version Control', type: 'stack' },
                { name: 'GitHub', iconName: 'github', category: 'Platform', type: 'stack' },
              ].map((tech, index) => (
                <div
                  key={`tech-${index}`}
                  className="relative mx-4 flex flex-col items-center gap-4 cursor-pointer transition-all duration-300 hover:scale-110"
                >
                  <div className="h-12 w-12">
                    {tech.type === "stack" ? (
                      <StackIcon name={tech.iconName} />
                    ) : tech.type === "custom" ? (
                      <Image
                        src={tech.iconPath || `/icons/${tech.iconName}.png`}
                        alt={tech.name}
                        width={48}
                        height={48}
                        className="h-12 w-12 object-contain"
                      />
                    ) : null}
                  </div>
                  <div className="text-center">
                    <h3 className={`text-lg font-bold whitespace-nowrap mb-2 ${isDark ? 'text-white' : 'text-gray-900'}`}>
                      {tech.name}
                    </h3>
                    <Badge 
                      variant="secondary" 
                      className="text-xs font-medium px-3 py-1 bg-primary/10 text-primary border-primary/20 hover:bg-primary/20 transition-colors"
                    >
                      {tech.category}
                    </Badge>
                  </div>
                </div>
              ))}
            </Marquee>
          </div>
        </motion.div>
      </div>
    </section>
  );
}
