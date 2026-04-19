"use client";

import { useEffect, useMemo, useState } from "react";

import { WINDOWS_PORTABLE_RELEASE } from "@/components/marketing/ecosystem-data";

type BeforeInstallPromptEvent = Event & {
  prompt: () => Promise<void>;
  userChoice: Promise<{
    outcome: "accepted" | "dismissed";
    platform: string;
  }>;
};

type DetectedPlatform = {
  label: string;
  family: "desktop" | "mobile" | "browser";
  href: string;
};

type InstallCtaProps = {
  className?: string;
};

function detectPlatform(): DetectedPlatform {
  if (typeof navigator === "undefined") {
    return { label: "desktop", family: "desktop", href: "#desktop-guide" };
  }

  const userAgent = navigator.userAgent.toLowerCase();

  if (/iphone|ipad|ipod/.test(userAgent)) {
    return { label: "iPhone", family: "mobile", href: "#ios-guide" };
  }

  if (/android/.test(userAgent)) {
    return { label: "Android", family: "mobile", href: "#android-guide" };
  }

  if (/mac os x|macintosh/.test(userAgent)) {
    return { label: "macOS", family: "desktop", href: "#desktop-guide" };
  }

  if (/windows/.test(userAgent)) {
    return { label: "Windows", family: "desktop", href: WINDOWS_PORTABLE_RELEASE.href };
  }

  if (/linux|x11/.test(userAgent)) {
    return { label: "Linux", family: "desktop", href: "#desktop-guide" };
  }

  return { label: "browser", family: "browser", href: "/login?next=/overview" };
}

function buildLabel(platform: DetectedPlatform, installReady: boolean, installed: boolean) {
  if (installed) {
    return "Installed";
  }

  if (installReady) {
    if (platform.family === "desktop") {
      return `Install for ${platform.label}`;
    }

    if (platform.label === "Android") {
      return "Install for Android";
    }
  }

  if (platform.label === "iPhone") {
    return "Open iPhone install steps";
  }

  if (platform.label === "Windows") {
    return "Download for Windows";
  }

  if (platform.family === "desktop") {
    return `Open ${platform.label} install steps`;
  }

  if (platform.family === "browser") {
    return "Open in browser";
  }

  return "Open install steps";
}

export function InstallCta({ className }: InstallCtaProps) {
  const [deferredPrompt, setDeferredPrompt] = useState<BeforeInstallPromptEvent | null>(null);
  const [isInstalled, setIsInstalled] = useState(false);
  const [isInstalling, setIsInstalling] = useState(false);
  const platform = useMemo(detectPlatform, []);

  useEffect(() => {
    function onBeforeInstallPrompt(event: Event) {
      event.preventDefault();
      setDeferredPrompt(event as BeforeInstallPromptEvent);
    }

    function onInstalled() {
      setIsInstalled(true);
      setDeferredPrompt(null);
    }

    window.addEventListener("beforeinstallprompt", onBeforeInstallPrompt);
    window.addEventListener("appinstalled", onInstalled);

    return () => {
      window.removeEventListener("beforeinstallprompt", onBeforeInstallPrompt);
      window.removeEventListener("appinstalled", onInstalled);
    };
  }, []);

  async function handleClick() {
    if (deferredPrompt) {
      setIsInstalling(true);

      try {
        await deferredPrompt.prompt();
        const outcome = await deferredPrompt.userChoice;

        if (outcome.outcome === "accepted") {
          setIsInstalled(true);
        }
      } finally {
        setIsInstalling(false);
        setDeferredPrompt(null);
      }

      return;
    }

    window.location.assign(platform.href);
  }

  const buttonClassName = className ? `marketing-button marketing-button-primary ${className}` : "marketing-button marketing-button-primary";

  return (
    <button
      className={buttonClassName}
      disabled={isInstalled || isInstalling}
      onClick={handleClick}
      type="button"
    >
      {isInstalling ? "Preparing install..." : buildLabel(platform, deferredPrompt !== null, isInstalled)}
    </button>
  );
}
