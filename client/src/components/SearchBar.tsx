"use client";

import { useState } from "react";
import { HiOutlineSearch, HiX } from "react-icons/hi";
import { motion } from "motion/react";

interface Props {
  value: string;
  onChange: (v: string) => void;
  onSubmit: (v: string) => void;
  placeholder?: string;
}

export default function SearchBar({
  value,
  onChange,
  onSubmit,
  placeholder = "Search products...",
}: Props) {
  const [focused, setFocused] = useState(false);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    onSubmit(value);
  };

  return (
    <form onSubmit={handleSubmit} className="relative flex-1">
      <motion.div
        animate={{ boxShadow: focused ? "0 0 0 3px rgba(16,185,129,0.15)" : "none" }}
        transition={{ duration: 0.2 }}
        className="flex items-center bg-surface border border-border rounded-xl overflow-hidden"
      >
        <span className="pl-3 text-text-muted shrink-0">
          <HiOutlineSearch size={18} />
        </span>
        <input
          type="text"
          value={value}
          onChange={(e) => onChange(e.target.value)}
          onFocus={() => setFocused(true)}
          onBlur={() => setFocused(false)}
          placeholder={placeholder}
          className="flex-1 px-3 py-2.5 text-sm text-text-primary bg-transparent outline-none"
        />
        {value && (
          <button
            type="button"
            onClick={() => { onChange(""); onSubmit(""); }}
            className="pr-2 text-text-muted hover:text-text-primary transition-colors"
          >
            <HiX size={16} />
          </button>
        )}
        <motion.button
          type="submit"
          whileTap={{ scale: 0.95 }}
          className="m-1 px-4 py-1.5 bg-secondary text-white rounded-lg text-sm font-semibold hover:bg-secondary/90 transition-colors shrink-0"
        >
          Search
        </motion.button>
      </motion.div>
    </form>
  );
}
