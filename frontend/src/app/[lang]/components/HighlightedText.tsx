import { createElement, ReactNode } from "react";

interface HighlightedTextProps {
  text: string;
  tag: string;
  className?: string;
  color?: string;
  secondColor?: string;
}

export default function HighlightedText({
  text,
  tag,
  className,
  color,
  secondColor
}: HighlightedTextProps) {
  const words = text.split(" ");
  const children: ReactNode[] = [];

  words.forEach((word: string, index: number) => {
    if (word.startsWith("[")) {
      const highlight = word.replace("[", "").replace("]", "");
      children.push(
        createElement("span", {
          key: index,
          className: color || "",
        }, highlight)
      );
      children.push(" ");
    } else if (word.startsWith("{")) {
      const highlight = word.replace("{", "").replace("}", "");
      children.push(
        createElement("span", {
          key: index,
          className: secondColor || "",
        }, highlight)
      );
      children.push(" ");
    } else {
      children.push(word);
      children.push(" ");
    }
  });

  return createElement(tag, { className: className || "" }, children);
}