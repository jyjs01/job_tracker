"use client";

import Link from "next/link";
import { useEffect, useState } from "react";
import { createPortal } from "react-dom";
import SideBarNav from "@/src/components/layout/SideBarNav";
import Button from "@/src/components/ui/Button";

type Props = {
  userName: string;
  userEmail: string;
};

export default function MobileSidebar({ userName, userEmail }: Props) {
  const [open, setOpen] = useState(false);

  useEffect(() => {
    if (!open) return;

    const onKeyDown = (e: KeyboardEvent) => {
      if (e.key === "Escape") setOpen(false);
    };

    document.addEventListener("keydown", onKeyDown);
    return () => document.removeEventListener("keydown", onKeyDown);
  }, [open]);

  useEffect(() => {
    document.body.style.overflow = open ? "hidden" : "";
    return () => {
      document.body.style.overflow = "";
    };
  }, [open]);

  return (
    <>
      <Button
        variant="outline"
        size="sm"
        className="bg-white"
        onClick={() => setOpen(true)}
        type="button"
      >
        메뉴
      </Button>

      {open &&
        typeof document !== "undefined" &&
        createPortal(
          <div
            className="fixed inset-0 z-99999 md:hidden"
            style={{ zIndex: 99999 }}
          >
            <Button
              variant="ghost"
              size="md"
              type="button"
              aria-label="Close"
              onClick={() => setOpen(false)}
              className="absolute! inset-0! h-full! w-full! rounded-none! p-0! font-normal! block! bg-black/40 hover:bg-black/40 text-transparent transition-opacity duration-200 ease-out"
              style={{
                position: "absolute",
                inset: 0,
                width: "100%",
                height: "100%",
                borderRadius: 0,
                padding: 0,
                zIndex: 99999,
              }}
            >
              닫기
            </Button>

            <aside
              className="absolute left-0 top-0 z-100000 h-full w-[78%] max-w-xs bg-slate-900 text-slate-100 shadow-xl transition-transform duration-200 ease-out"
              style={{
                zIndex: 100000,
                transform: "translateX(0)",
                animation: "jtSlideIn 180ms ease-out",
              }}
            >
              <style>
                {`
                @keyframes jtSlideIn {
                  from { transform: translateX(-15px); opacity: 0.98; }
                  to { transform: translateX(0); opacity: 1; }
                }
                @keyframes jtFadeIn {
                  from { opacity: 0; }
                  to { opacity: 1; }
                }
              `}
              </style>

              <div className="flex items-center justify-between px-5 py-5">
                <Link href="/dashboard" onClick={() => setOpen(false)}>
                  <div className="text-lg font-bold">JobTracker</div>
                </Link>

                <Button
                  variant="ghost"
                  size="sm"
                  className="text-slate-300 hover:bg-slate-800"
                  onClick={() => setOpen(false)}
                  type="button"
                >
                  닫기
                </Button>
              </div>

              <div className="px-5 pb-5" onClick={() => setOpen(false)}>
                <SideBarNav />
              </div>

              <div className="absolute bottom-0 w-full border-t border-slate-800 px-5 py-4 text-xs">
                <div className="font-semibold">{userName}</div>
                <div className="mt-1 text-slate-400">{userEmail}</div>
              </div>
            </aside>
          </div>,
          document.body
        )}
    </>
  );
}
