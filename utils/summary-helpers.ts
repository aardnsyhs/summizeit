export function splitSummary(summary: string) {
  const regex = /^#+\s+(.*)$/gm;
  const sections: { title: string; content: string[] }[] = [];
  let match;
  let lastIndex = 0;
  let lastTitle = "";

  while ((match = regex.exec(summary)) !== null) {
    const title = match[1];
    const start = match.index;

    if (lastTitle) {
      const rawContent = summary.slice(lastIndex, start).trim();
      const content = rawContent
        .split(/\n+/)
        .map((line) => line.trim())
        .filter(Boolean);
      sections.push({ title: lastTitle, content });
    }

    lastTitle = title;
    lastIndex = regex.lastIndex;
  }

  // add the last section
  if (lastTitle) {
    const rawContent = summary.slice(lastIndex).trim();
    const content = rawContent
      .split(/\n+/)
      .map((line) => line.trim())
      .filter(Boolean);
    sections.push({ title: lastTitle, content });
  }

  return sections;
}

export function parsePoint(point: string) {
  const isNumbered = /^\d/.test(point);
  const isMainPoint = /^•/.test(point);

  const emojiRegex = /[\u{1F300}-\u{1F9FF}]|[\u2600-\u26FF]/u;
  const hasEmoji = emojiRegex.test(point);
  const isEmpty = !point.trim();

  return { isNumbered, isMainPoint, hasEmoji, isEmpty };
}

export function parseEmojiPoint(content: string) {
  const clearContent = content.replace(/^[•]\s*/, "").trim();
  const matches = clearContent.match(/^(\p{Emoji}+)(.+)$/u);
  if (!matches) {
    return null;
  }
  const [_, emoji, text] = matches;
  return {
    emoji: emoji.trim(),
    text: text.trim(),
  };
}
