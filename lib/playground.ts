// Off-work frames for the "Dive in" spiral. Order is a fixed shuffle so
// categories are mixed (and the server and browser agree on it).
export type Category = "Digital Art" | "Hand Sketches" | "Photography" | "Vibe Coding";

export type Frame = {
  slug: string;
  caption: string;
  category: Category;
  kind: "image" | "video";
  /** full-size file shown in the pop-out */
  src: string;
  /** 4:5 crop used on the spiral frame + thumbnails */
  thumb: string;
  /** still for videos before they play */
  poster?: string;
};

export const categoryStyle: Record<Category, { bg: string; fg: string }> = {
  "Digital Art": { bg: "#2e3bff", fg: "#f2eee3" },
  "Hand Sketches": { bg: "#ff8fcf", fg: "#121110" },
  Photography: { bg: "#c8f53c", fg: "#0e3a22" },
  "Vibe Coding": { bg: "#ffc22e", fg: "#121110" },
};

const P = "playground/";
const img = (slug: string, caption: string, category: Category): Frame => ({
  slug,
  caption,
  category,
  kind: "image",
  src: `${P}${slug}.jpg`,
  thumb: `${P}${slug}-t.jpg`,
});
const vid = (slug: string, caption: string): Frame => ({
  slug,
  caption,
  category: "Vibe Coding",
  kind: "video",
  src: `${P}${slug}.mp4`,
  thumb: `${P}${slug}-t.jpg`,
  poster: `${P}${slug}-p.jpg`,
});

export const frames: Frame[] = [
  img("kapu-sunset", "Kapu Sunset", "Photography"),
  img("canyon-light", "Canyon Light", "Digital Art"),
  img("khmer-sushi", "Khmer Sushi", "Photography"),
  vid("ascendant-studio", "Ascendant Studio"),
  img("aloe-shadows", "Aloe Shadows", "Photography"),
  img("whale-bloom", "Whale & Bloom", "Hand Sketches"),
  img("concrete-verse", "Concrete Verse", "Photography"),
  img("coastal-dusk", "Coastal Dusk", "Digital Art"),
  img("snuffed-candle", "Snuffed Candle", "Photography"),
  vid("festival-flythrough", "Festival Flythrough"),
  img("hillside-powerhouse", "Hillside Powerhouse", "Photography"),
  img("swish-shot", "Swish Shot", "Photography"),
  img("fractured-faces", "Fractured Faces", "Hand Sketches"),
  img("field-verse", "Field Verse", "Photography"),
  img("desert-footprints", "Desert Footprints", "Digital Art"),
  img("raindrop-leaf", "Raindrop Leaf", "Photography"),
  vid("speaker-spot", "Speaker Spot"),
  img("cocoa-foam", "Cocoa Foam", "Photography"),
  img("south-city", "South City", "Photography"),
  img("forest-stream", "Forest Stream", "Digital Art"),
  img("misty-shoreline", "Misty Shoreline", "Photography"),
  vid("everyday-objects", "Everyday Objects"),
  img("fiction-stairs", "Fiction Stairs", "Photography"),
  img("succulent-bloom", "Succulent Bloom", "Photography"),
];
