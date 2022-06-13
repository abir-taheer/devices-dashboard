import { memo } from "react";

type TextHighlightProps = {
  text: string;
  search: string;
};

const TextHighlight = memo(function TextHighlight({ text, search }: TextHighlightProps) {
  const wordsSet = new Set(search.toLowerCase().split(/\s+/).filter(Boolean));
  const regexSafeWords = Array.from(wordsSet).map((word) =>
    word.replace(/([^a-zA-Z0-9])/g, "\\$1")
  );

  const parts = text.split(new RegExp(`(${regexSafeWords.join("|")})`, "gi"));

  return (
    <span>
      {" "}
      {parts.map((part, i) => (
        <span
          key={i}
          style={wordsSet.has(part.toLowerCase()) ? { fontWeight: "bold", color: "#0984e3" } : {}}
        >
          {part}
        </span>
      ))}{" "}
    </span>
  );
});

export default TextHighlight;
