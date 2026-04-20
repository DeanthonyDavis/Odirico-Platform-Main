"use client";

import { useEffect, useMemo, useState } from "react";

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
  id: "windows" | "macos" | "linux" | "iphone" | "android" | "browser";
  href: string;
};

type InstallCtaProps = {
  className?: string;
};

const GITHUB_RELEASES_URL = "https://github.com/DeanthonyDavis/Odirico-Platform-Main/releases";

function detectPlatform(): DetectedPlatform {
  if (typeof navigator === "undefined") {
    return { label: "Windows", family: "desktop", id: "windows", href: GITHUB_RELEASES_URL };
  }

  const userAgent = navigator.userAgent.toLowerCase();

  if (/iphone|ipad|ipod/.test(userAgent)) {
    return {
      label: "iPhone",
      family: "mobile",
      id: "iphone",
      href: process.env.NEXT_PUBLIC_IOS_STORE_URL ?? "#ios-guide",
    };
  }

  if (/android/.test(userAgent)) {
    return {
      label: "Android",
      family: "mobile",
      id: "android",
      href: process.env.NEXT_PUBLIC_ANDROID_STORE_URL ?? "#android-guide",
    };
  }

  if (/mac os x|macintosh/.test(userAgent)) {
    return {
      label: "macOS",
      family: "desktop",
      id: "macos",
      href: process.env.NEXT_PUBLIC_MAC_INSTALLER_URL ?? GITHUB_RELEASES_URL,
    };
  }

  if (/windows/.test(userAgent)) {
    return {
      label: "Windows",
      family: "desktop",
      id: "windows",
      href: process.env.NEXT_PUBLIC_WINDOWS_INSTALLER_URL ?? GITHUB_RELEASES_URL,
    };
  }

  if (/linux|x11/.test(userAgent)) {
    return {
      label: "Linux",
      family: "desktop",
      id: "linux",
      href: process.env.NEXT_PUBLIC_LINUX_INSTALLER_URL ?? GITHUB_RELEASES_URL,
    };
  }

  return { label: "browser", family: "browser", id: "browser", href: "/login?next=/overview" };
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

  if (platform.id === "windows" && platform.href === GITHUB_RELEASES_URL) {
    return "Open Windows release center";
  }

  if (platform.id === "macos" && platform.href === GITHUB_RELEASES_URL) {
    return "Open macOS release center";
  }

  if (platform.id === "linux" && platform.href === GITHUB_RELEASES_URL) {
    return "Open Linux release center";
  }

  if (platform.label === "iPhone") {
    return "Open iPhone install steps";
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
