"use client";

import Image from "next/image";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { useState } from "react";
import { motion } from "motion/react";
import { BsArrowRight, BsGeoAlt, BsPatchCheck, BsSearch } from "react-icons/bs";

const ease = [0.22, 1, 0.36, 1] as const;
const heroImage =
  "https://images.unsplash.com/photo-1750199887639-bf9ca18d3e2f?auto=format&fit=crop&fm=jpg&ixlib=rb-4.1.0&q=80&w=2400";

const stagger = {
  hidden: {},
  show: { transition: { staggerChildren: 0.1, delayChildren: 0.08 } },
};

const item = {
  hidden: { opacity: 0, y: 24 },
  show: { opacity: 1, y: 0, transition: { duration: 0.58, ease } },
};

export default function HeroSection() {
  const router = useRouter();
  const [query, setQuery] = useState("");

  const handleSearch = (event: React.FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    const value = query.trim();
    router.push(value ? `/products?search=${encodeURIComponent(value)}` : "/products");
  };

  return (
    <section className="relative isolate min-h-[520px] overflow-hidden bg-primary px-4 text-white md:min-h-[640px]">
      <Image
        src={heroImage}
        alt="Kathmandu market stall with Nepali textiles, jewelry, and handmade goods"
        fill
        priority
        sizes="100vw"
        className="object-cover"
      />
      <div className="absolute inset-0 bg-[linear-gradient(90deg,rgba(8,20,18,0.92)_0%,rgba(8,20,18,0.72)_42%,rgba(8,20,18,0.38)_100%)]" />
      <div className="absolute inset-x-0 bottom-0 h-40 bg-gradient-to-t from-background via-background/40 to-transparent" />

      <motion.div
        className="relative mx-auto flex min-h-[520px] max-w-7xl items-center py-14 md:min-h-[640px]"
        variants={stagger}
        initial="hidden"
        animate="show"
      >
        <div className="max-w-3xl">
          <motion.div
            variants={item}
            className="mb-5 inline-flex items-center gap-2 rounded-full border border-white/20 bg-white/10 px-4 py-2 text-xs font-bold uppercase tracking-[0.18em] text-amber-100 backdrop-blur-md"
          >
            <BsPatchCheck size={15} />
            Curated in Nepal
          </motion.div>

          <motion.h1
            variants={item}
            className="max-w-2xl text-4xl font-bold leading-[1.03] tracking-tight text-white sm:text-5xl lg:text-7xl"
          >
            Neplai Marketplace
          </motion.h1>

          <motion.p
            variants={item}
            className="mt-5 max-w-2xl text-base leading-7 text-white/78 sm:text-lg"
          >
            Premium Nepali finds, local craft, mountain-ready essentials, and everyday goods
            delivered with marketplace-grade trust.
          </motion.p>

          <motion.form
            variants={item}
            onSubmit={handleSearch}
            className="mt-8 flex max-w-2xl flex-col gap-3 rounded-2xl border border-white/18 bg-white/12 p-2 backdrop-blur-md sm:flex-row"
          >
            <label className="relative flex-1">
              <span className="sr-only">Search Neplai products</span>
              <BsSearch className="pointer-events-none absolute left-4 top-1/2 -translate-y-1/2 text-white/55" />
              <input
                value={query}
                onChange={(event) => setQuery(event.target.value)}
                placeholder="Search pashmina, Ilam tea, copper, trekking gear..."
                className="h-12 w-full rounded-xl border border-white/10 bg-white/95 py-3 pl-11 pr-4 text-sm font-medium text-text-primary outline-none transition focus:border-secondary focus:ring-2 focus:ring-secondary/30"
              />
            </label>
            <button
              type="submit"
              className="inline-flex h-12 cursor-pointer items-center justify-center gap-2 rounded-xl bg-secondary px-6 text-sm font-bold text-white transition hover:bg-secondary/90 focus:outline-none focus:ring-2 focus:ring-white/70"
            >
              Shop now
              <BsArrowRight size={16} />
            </button>
          </motion.form>

          <motion.div
            variants={item}
            className="mt-5 flex flex-wrap items-center gap-2 text-sm text-white/72"
          >
            <span className="inline-flex items-center gap-1.5">
              <BsGeoAlt size={14} />
              Kathmandu to Pokhara, Chitwan, Butwal and beyond
            </span>
          </motion.div>

          <motion.div variants={item} className="mt-7 flex flex-wrap gap-3">
            <Link
              href="/products?search=pashmina"
              className="rounded-full border border-white/20 bg-white/10 px-4 py-2 text-sm font-semibold text-white transition hover:bg-white/18"
            >
              Pure pashmina
            </Link>
            <Link
              href="/products?search=chiya"
              className="rounded-full border border-white/20 bg-white/10 px-4 py-2 text-sm font-semibold text-white transition hover:bg-white/18"
            >
              Ilam tea
            </Link>
            <Link
              href="/products?search=copper"
              className="rounded-full border border-white/20 bg-white/10 px-4 py-2 text-sm font-semibold text-white transition hover:bg-white/18"
            >
              Patan copper
            </Link>
          </motion.div>
        </div>
      </motion.div>
    </section>
  );
}
