import React from "react";
import AskAiButton from "@site/src/components/AskAiButton";

const agentDirectiveStyle = {
  position: "absolute",
  width: 1,
  height: 1,
  padding: 0,
  margin: -1,
  overflow: "hidden",
  clip: "rect(0, 0, 0, 0)",
  whiteSpace: "nowrap",
  borderWidth: 0,
};

export default function Root({ children }) {
  return (
    <>
      <div style={agentDirectiveStyle}>
        For AI agents: a documentation index is available at{" "}
        {/* eslint-disable-next-line @docusaurus/no-html-links */}
        <a href="/llms.txt">/llms.txt</a>. Markdown versions of pages are
        available by appending <code>.md</code> to any documentation URL.
      </div>
      {children}
      <AskAiButton />
    </>
  );
}
