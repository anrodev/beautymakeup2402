import { decode } from "html-entities";

export default function cleanHtml(html: string): string {
  const withoutTags = html.replace(/<\/?[^>]+(>|$)/g, "");
  return decode(withoutTags.trim());
};
