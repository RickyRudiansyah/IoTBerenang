import type { VisualEvidenceEvent } from "../types";

export type CvEvent =
  | { type: "heartbeat"; data: unknown }
  | { type: "visual_evidence"; data: VisualEvidenceEvent };

type CvEventHandler = (event: CvEvent) => void;

const DEFAULT_CV_SERVICE_URL = "http://127.0.0.1:8000";

/** Base URL of the CV service, configurable via VITE_CV_SERVICE_URL. */
export const CV_SERVICE_URL: string =
  import.meta.env.VITE_CV_SERVICE_URL ?? DEFAULT_CV_SERVICE_URL;

/** SSE endpoint resolved from the CV service base URL. */
export const CV_EVENTS_URL = `${CV_SERVICE_URL.replace(/\/$/, "")}/events`;

export function connectCvEvents(
  onEvent: CvEventHandler,
  url = CV_EVENTS_URL,
): () => void {
  const source = new EventSource(url);

  source.addEventListener("heartbeat", (event) => {
    const message = event as MessageEvent<string>;
    onEvent({ type: "heartbeat", data: JSON.parse(message.data) });
  });

  source.addEventListener("visual_evidence", (event) => {
    const message = event as MessageEvent<string>;
    onEvent({
      type: "visual_evidence",
      data: JSON.parse(message.data) as VisualEvidenceEvent,
    });
  });

  source.onerror = () => {
    if (
      window.location.hostname === "localhost" ||
      window.location.hostname === "127.0.0.1"
    ) {
      console.debug("CV SSE connection waiting or unavailable");
    }
  };

  return () => source.close();
}
