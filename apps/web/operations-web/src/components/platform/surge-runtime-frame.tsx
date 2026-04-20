"use client";

import { useEffect, useState } from "react";

const RUNTIME_BASE = "/surge-runtime/job_tracker_v2.html?embedded=1";
const RUNTIME_STANDALONE_BASE = "/surge-runtime/job_tracker_v2.html";

function buildRuntimeSrc(hash: string) {
  return `${RUNTIME_BASE}${hash || ""}`;
}

function buildStandaloneSrc(hash: string) {
  return `${RUNTIME_STANDALONE_BASE}${hash || ""}`;
}

export function SurgeRuntimeFrame() {
  const [frameSrc, setFrameSrc] = useState(RUNTIME_BASE);
  const [standaloneSrc, setStandaloneSrc] = useState(RUNTIME_STANDALONE_BASE);

  useEffect(() => {
    const syncHash = () => {
      const hash = window.location.hash;
      setFrameSrc(buildRuntimeSrc(hash));
      setStandaloneSrc(buildStandaloneSrc(hash));
    };

    syncHash();
    window.addEventListener("hashchange", syncHash);

    return () => window.removeEventListener("hashchange", syncHash);
  }, []);

  return (
    <div className="surge-runtime-stack">
      <section className="panel surge-runtime-header">
        <div className="panel-header">
          <div>
            <p className="sidebar-label">Live workspace</p>
            <h3>Operate the full application system without leaving Surge</h3>
          </div>
          <div className="access-link-row access-link-row-compact">
            <a className="access-link access-link-live" href={standaloneSrc} rel="noreferrer" target="_blank">
              <span>Open full screen</span>
              <small>Live</small>
            </a>
          </div>
        </div>
        <p className="muted">
          The embedded workspace is where you can review pipeline state, imported signals, and updates in one continuous view.
        </p>
      </section>

      <section className="panel surge-runtime-panel">
        <iframe
          className="surge-runtime-frame"
          src={frameSrc}
          title="Surge application command center"
        />
      </section>
    </div>
  );
}
