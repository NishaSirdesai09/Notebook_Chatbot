"use client";

import * as React from "react";
import { PageContainer, PageHeader } from "@/components/app/PageHeader";
import { Button } from "@/components/ui/Button";
import { Card, Select, Badge } from "@/components/ui/primitives";
import { Icon } from "@/components/icons";
import { useToast } from "@/components/ui/Toast";
import { flashcards as seed, notebooks } from "@/lib/mock-data";
import type { Flashcard } from "@/lib/types";
import { cn } from "@/lib/utils";

export default function FlashcardsPage() {
  const toast = useToast();
  const [cards, setCards] = React.useState<Flashcard[]>(seed);
  const [deck, setDeck] = React.useState("All decks");
  const [flipped, setFlipped] = React.useState<Record<string, boolean>>({});
  const [generating, setGenerating] = React.useState(false);

  const decks = ["All decks", ...Array.from(new Set(seed.map((c) => c.deck)))];
  const filtered = deck === "All decks" ? cards : cards.filter((c) => c.deck === deck);
  const known = cards.filter((c) => c.known).length;

  function toggleFlip(id: string) {
    setFlipped((f) => ({ ...f, [id]: !f[id] }));
  }

  function markKnown(id: string, known: boolean) {
    setCards((c) => c.map((card) => (card.id === id ? { ...card, known } : card)));
    toast.success(known ? "Marked as known" : "Marked for review");
  }

  function generate() {
    setGenerating(true);
    setTimeout(() => {
      const newCard: Flashcard = {
        id: `f-${Date.now()}`,
        front: "What stabilizes a carbocation intermediate?",
        back: "Hyperconjugation and inductive electron donation from adjacent alkyl groups, plus resonance where available.",
        deck: notebooks[0].title,
        known: false,
      };
      setCards((c) => [newCard, ...c]);
      setGenerating(false);
      toast.success("Generated 1 new flashcard");
    }, 1200);
  }

  return (
    <PageContainer>
      <PageHeader
        title="Flashcards"
        description="Generate flip cards from your material and track what you know."
        actions={
          <Button loading={generating} onClick={generate}>
            <Icon.Sparkles className="h-4 w-4" /> Generate Flashcards
          </Button>
        }
      />

      <div className="mt-6 flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-between">
        <Select className="sm:w-56" value={deck} onChange={(e) => setDeck(e.target.value)}>
          {decks.map((d) => (
            <option key={d} value={d}>{d}</option>
          ))}
        </Select>
        <div className="flex items-center gap-3 text-sm">
          <Badge tone="green"><Icon.Check className="h-3.5 w-3.5" /> {known} known</Badge>
          <Badge tone="amber">{cards.length - known} to review</Badge>
        </div>
      </div>

      <div className="mt-6 grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
        {filtered.map((card) => {
          const isFlipped = !!flipped[card.id];
          return (
            <div key={card.id}>
              <div className={cn("flip-card h-52", isFlipped && "flipped")}>
                <div className="flip-card-inner">
                  {/* Front */}
                  <button
                    onClick={() => toggleFlip(card.id)}
                    className="flip-face card flex h-full w-full flex-col p-5 text-left"
                  >
                    <div className="flex items-center justify-between">
                      <Badge tone="brand">{card.deck}</Badge>
                      {card.known && <Icon.CheckCircle className="h-4 w-4 text-emerald-500" />}
                    </div>
                    <div className="flex flex-1 items-center">
                      <p className="text-base font-semibold text-ink-900">{card.front}</p>
                    </div>
                    <p className="flex items-center gap-1.5 text-xs text-ink-400">
                      <Icon.Refresh className="h-3.5 w-3.5" /> Tap to flip
                    </p>
                  </button>
                  {/* Back */}
                  <button
                    onClick={() => toggleFlip(card.id)}
                    className="flip-face flip-back card flex h-full w-full flex-col bg-gradient-to-br from-brand-600 to-accent-purple p-5 text-left text-white"
                  >
                    <p className="text-xs font-semibold uppercase tracking-wide text-white/70">Answer</p>
                    <div className="flex flex-1 items-center">
                      <p className="text-sm leading-relaxed">{card.back}</p>
                    </div>
                    <p className="flex items-center gap-1.5 text-xs text-white/70">
                      <Icon.Refresh className="h-3.5 w-3.5" /> Tap to flip back
                    </p>
                  </button>
                </div>
              </div>
              <div className="mt-2 flex gap-2">
                <Button
                  variant={card.known ? "secondary" : "primary"}
                  size="sm"
                  fullWidth
                  onClick={() => markKnown(card.id, true)}
                >
                  <Icon.Check className="h-4 w-4" /> Known
                </Button>
                <Button variant="secondary" size="sm" fullWidth onClick={() => markKnown(card.id, false)}>
                  <Icon.Refresh className="h-4 w-4" /> Review
                </Button>
              </div>
            </div>
          );
        })}
      </div>
    </PageContainer>
  );
}
