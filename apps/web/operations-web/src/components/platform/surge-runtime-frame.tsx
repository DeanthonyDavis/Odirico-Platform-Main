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
      <section className="panel">
        <div className="panel-header">
          <div>
            <p className="sidebar-label">Live runtime</p>
            <h3>Surge is now running inside the platform route</h3>
          </div>
          <div className="access-link-row access-link-row-compact">
            <a className="access-link access-link-live" href={standaloneSrc} rel="noreferrer" target="_blank">
              <span>Open full screen</span>
              <small>Live</small>
            </a>
          </div>
        </div>
        <p className="muted">
          Browser-capture links sent to <code>/surge</code> are forwarded into the live runtime. If
          you used the old standalone localhost version, export a backup there once and import it
          here because browser storage does not carry across different origins.
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
