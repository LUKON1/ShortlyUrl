import { useMemo } from "react";
import { motion } from "motion/react";

const BetaBanner = () => {
  const items = useMemo(() => {
    let arr = new Array(29).fill("Beta Test");
    arr.splice(Math.floor(Math.random() * 30), 0, " Kribzdy ");
    return arr;
  }, []);
  return (
    <div className="relative z-0 w-full overflow-hidden bg-slate-900 py-3 dark:bg-slate-800">
      {/* Decorative Gradient Strips */}
      <div className="absolute top-0 left-0 h-px w-full bg-linear-to-r from-transparent via-cyan-500/50 to-transparent" />
      <div className="absolute bottom-0 left-0 h-px w-full bg-linear-to-r from-transparent via-cyan-500/50 to-transparent" />

      <div className="flex w-max">
        <div className="animate-infinite-scroll flex w-max shrink-0 transition-none! will-change-transform">
          {/* TRACK 1 */}
          <div className="flex shrink-0 items-center gap-12 pr-12">
            {items.map((text, idx) => (
              <div key={`t1-${idx}`} className="flex items-center gap-12">
                <motion.span
                  className="motion-safe notranslate cursor-default text-sm font-bold tracking-[0.2em] text-cyan-400 uppercase opacity-80"
                  translate="no"
                  whileHover={{
                    scale: 1.2,
                    color: "#22d3ee",
                    textShadow: "0px 0px 8px rgba(34, 211, 238, 0.6)",
                    opacity: 1,
                  }}
                  transition={{ duration: 0.2 }}
                >
                  {text}
                </motion.span>
                <div className="h-1.5 w-1.5 rounded-full bg-slate-600" />
              </div>
            ))}
          </div>

          {/* TRACK 2 (Duplicate) */}
          <div className="flex shrink-0 items-center gap-12 pr-12">
            {items.map((text, idx) => (
              <div key={`t2-${idx}`} className="flex items-center gap-12">
                <motion.span
                  className="motion-safe notranslate cursor-default text-sm font-bold tracking-[0.2em] text-cyan-400 uppercase opacity-80"
                  translate="no"
                  whileHover={{
                    scale: 1.2,
                    color: "#22d3ee",
                    textShadow: "0px 0px 8px rgba(34, 211, 238, 0.6)",
                    opacity: 1,
                  }}
                  transition={{ duration: 0.2 }}
                >
                  {text}
                </motion.span>
                <div className="h-1.5 w-1.5 rounded-full bg-slate-600" />
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
};

export default BetaBanner;
