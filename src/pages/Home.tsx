import { useState } from "react";
import { AnimatePresence } from "framer-motion";

import Intro from "@/components/world/Intro";
import StarMap from "@/components/world/StarMap";

import StoryView from "@/components/views/StoryView";
import MemoriesView from "@/components/views/MemoriesView";
import LettersView from "@/components/views/LettersView";
import SongView from "@/components/views/SongView";
import QuizView from "@/components/views/QuizView";
import SecretView from "@/components/views/SecretView";
import FinalView from "@/components/views/FinalView";

type View =
  | "story"
  | "memories"
  | "letters"
  | "song"
  | "game"
  | "secret"
  | "final"
  | null;

export default function Home() {
  const [entered, setEntered] =
    useState<boolean>(false);

  const [view, setView] =
    useState<View | string>(null);

  const back = () => {
    setView(null);
  };

  return (
    <main className="relative min-h-screen bg-[#020617] text-[#F8FAFC]">
      <AnimatePresence>
        {!entered && (
          <Intro
            key="intro"
            onEnter={() => setEntered(true)}
          />
        )}
      </AnimatePresence>

      {entered && (
        <>
          <StarMap
            onSelect={setView}
          />

          <AnimatePresence>
            {view === "story" && (
              <StoryView
                key="story"
                onBack={back}
              />
            )}

            {view === "memories" && (
              <MemoriesView
                key="memories"
                onBack={back}
              />
            )}

            {view === "letters" && (
              <LettersView
                key="letters"
                onBack={back}
              />
            )}

            {view === "song" && (
              <SongView
                key="song"
                onBack={back}
              />
            )}

            {view === "game" && (
              <QuizView
                key="game"
                onBack={back}
                onUnlock={() =>
                  setView("secret")
                }
              />
            )}

            {view === "secret" && (
              <SecretView
                key="secret"
                onBack={back}
                onGoToGame={() =>
                  setView("game")
                }
              />
            )}

            {view === "final" && (
              <FinalView
                key="final"
                onBack={back}
              />
            )}
          </AnimatePresence>
        </>
      )}
    </main>
  );
}