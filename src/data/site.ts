// Hand-written site data: store links, colors and the site's own copy for each volume.
// Book text (names, subtitles, big ideas, excerpts) comes from ./generated/volumes.json,
// which `npm run content` builds from the manuscripts.
import generated from './generated/volumes.json';

export const SITE = {
  url: 'https://famousinstem.com',
  name: 'Famous in STEM',
  author: 'Javier Sanz',
  tagline: 'True stories of the people behind science, technology, engineering and math',
  description:
    'Famous in STEM is a seven-book series of short, true biographies of great scientists, mathematicians, inventors, doctors and engineers, written for curious readers 13 and up.',
  amazon: 'https://www.amazon.com',
  authorStore: 'https://www.amazon.com/stores/author/B0BHN7K527',
  seriesPage: 'https://www.amazon.com/dp/B0CBN56CKM',
  email: 'jsanzbooks@gmail.com',
  /** One line used everywhere (site, Amazon, Goodreads, press) so every source describes the series the same way. */
  oneLine:
    'Famous in STEM: seven short, true biography books about the scientists, inventors, doctors and engineers who shaped STEM, for readers 13 and up.',
  authorBio:
    'Javier Sanz is the author of the Famous in STEM series and of other nonfiction books, including 500 Careers and Salaries and 200 Jobs Explained.',
  authorWhy:
    'The 2026 editions were rewritten chapter by chapter for a particular first audience: Javier Sanz’s own children.',
  updated: generated.generated,
};

export type Format = 'paperback' | 'kindle' | 'hardcover';
export const FORMAT_LABEL: Record<Format, string> = { paperback: 'Paperback', kindle: 'Kindle', hardcover: 'Hardcover' };

export interface VolumeCopy {
  n: number;
  slug: string;
  title: string;
  field: string;
  short: string; // e.g. "physicists"
  tagline: string; // cover tagline
  accent: string; // cover color, used on dark backgrounds
  ink: string; // darker shade of the accent for text on light backgrounds
  asin: Partial<Record<Format, string>>;
  coverFace: string; // who is painted on the cover
  hook: string; // one-line pitch (site copy)
  pitch: string[]; // book page intro (site copy)
  interest: string; // for the "which book" chooser
  seoTitle: string;
  seoDescription: string;
  faq: { q: string; a: string }[];
}

export const VOLUME_COPY: VolumeCopy[] = [
  {
    n: 1,
    slug: 'the-greatest-physicists',
    title: 'The Greatest Physicists',
    field: 'Physics',
    short: 'physicists',
    tagline: '26 minds who cracked the laws of the universe',
    accent: '#FFCB2B',
    ink: '#7A5A00',
    asin: { paperback: 'B0C9SJ2S22', kindle: 'B0CBNG3L48' },
    coverFace: 'Albert Einstein',
    hook: 'Gravity, electricity, radioactivity, relativity and black holes, told through the people who figured them out.',
    pitch: [
      'A patent clerk who rewrote space and time. A bookbinder’s apprentice who found electricity in a magnet. A woman who boiled down tons of rock in a leaking shed to find a glow. The Greatest Physicists tells the true stories of 26 people who worked out the rules the universe runs on, from Archimedes to Stephen Hawking.',
      'Each chapter is a short biography with one real piece of physics at its heart, explained in plain words: why the Moon stays up, how a battery works, why light takes time to reach you, what a chain reaction is. Many end with something to try at the kitchen table.',
    ],
    interest: 'Space, energy and how the universe works',
    seoTitle: 'The Greatest Physicists: Famous in STEM, Vol. 1',
    seoDescription:
      'True stories of 26 great physicists, from Newton, Curie and Einstein to Feynman and Hawking, with the science explained in plain words. For readers 13 and up.',
    faq: [
      { q: 'Which physicists are in the book?', a: 'Isaac Newton, Nikola Tesla, Marie Curie, Albert Einstein, Daniel Bernoulli, Galileo Galilei, Michael Faraday, Max Planck, Stephen Hawking, Niels Bohr, James Clerk Maxwell, Ole Rømer, Ernest Rutherford, Richard Feynman, Alessandro Volta, Benjamin Franklin, Archimedes, Heinrich Hertz, Johannes Kepler, Georg Ohm, J. Robert Oppenheimer, Enrico Fermi, James Chadwick, Henri Becquerel, J. J. Thomson and Thomas Edison: 26 in all.' },
      { q: 'Does my teen need to know physics first?', a: 'No. Every idea is explained from scratch, in plain language, through the story of the person who found it.' },
    ],
  },
  {
    n: 2,
    slug: 'mathematical-masterminds',
    title: 'Mathematical Masterminds',
    field: 'Mathematics',
    short: 'mathematicians',
    tagline: '23 minds who found the patterns behind everything',
    accent: '#F0489F',
    ink: '#A8155F',
    asin: { paperback: 'B0CDJZ8X8Z', kindle: 'B0CDM6LPYX' },
    coverFace: 'Katherine Johnson',
    hook: 'Code-breaking, infinity, prime numbers and flight paths to orbit, told through the people who found the patterns.',
    pitch: [
      'A boy who, the story goes, added up the numbers from 1 to 100 in a flash. A code-breaker racing the clock every midnight at Bletchley Park. A clerk in India whose letter of formulas astonished Cambridge. The mathematician John Glenn asked to check the computer’s numbers before he flew. Mathematical Masterminds tells the true stories of 23 people who found the patterns behind everything, from Pythagoras and Euclid to Terence Tao.',
      'Every chapter explains one beautiful idea in plain words, with no exam pressure: why some infinities are bigger than others, how a computer counts in ones and zeros, how two shadows measured the Earth. Many chapters end with a puzzle or a trick to try with a pencil.',
    ],
    interest: 'Puzzles, codes and numbers',
    seoTitle: 'Mathematical Masterminds: Famous in STEM, Vol. 2',
    seoDescription:
      'True stories of 23 great mathematicians, from Pythagoras and Gauss to Alan Turing, Ada Lovelace and Katherine Johnson, with puzzles to try. For readers 13 and up.',
    faq: [
      { q: 'Which mathematicians are in the book?', a: 'Carl Friedrich Gauss, Blaise Pascal, Alan Turing, Leonhard Euler, Paul Erdős, Eratosthenes, Pythagoras, Fibonacci, Euclid, Girolamo Cardano, Srinivasa Ramanujan, Pierre-Simon Laplace, Bernhard Riemann, Pierre de Fermat, Katherine Johnson, Henri Poincaré, Gottfried Wilhelm Leibniz, Ada Lovelace, Terence Tao, John Nash, Georg Cantor, John von Neumann and Joseph-Louis Lagrange: 23 in all.' },
      { q: 'Is it good for a teen who says they hate math?', a: 'It was written for exactly that reader. The book is about people first: rivalries, wars, prizes and lucky accidents. The math comes in small, clear pieces, often as a puzzle or trick you can try in a minute.' },
    ],
  },
  {
    n: 3,
    slug: 'tech-titans-of-silicon-valley',
    title: 'Tech Titans of Silicon Valley',
    field: 'Computing and technology',
    short: 'tech pioneers',
    tagline: 'The rebels and coders who built the digital world',
    accent: '#26D6E6',
    ink: '#00707C',
    asin: { paperback: 'B0CVTVKYX7', kindle: 'B0CW1KC8FD' },
    coverFace: 'Steve Jobs',
    hook: 'The chip, the internet, the web and the companies built on them, told through the rebels and coders who made them.',
    pitch: [
      'A computer that stopped working because of a moth. A student’s “just a hobby” operating system that now runs most of the servers behind the internet. A rocket that came back down and landed standing up. Tech Titans of Silicon Valley tells the true stories of the rebels and coders who built the digital world, from Grace Hopper and Gordon Moore to the founders of Apple, Microsoft, Google, Amazon and Wikipedia.',
      'Each chapter explains the idea underneath the fame in plain words: what a compiler does, how packets cross the internet, why a link works like a vote, how a web page reaches your screen. Try-this boxes turn the ideas into quick experiments on any phone or laptop.',
    ],
    interest: 'Coding, gadgets and the internet',
    seoTitle: 'Tech Titans of Silicon Valley: Famous in STEM, Vol. 3',
    seoDescription:
      'True stories of the people who built computing and the internet: Grace Hopper, Steve Jobs, Bill Gates, Tim Berners-Lee, Linus Torvalds and more. For readers 13 and up.',
    faq: [
      { q: 'Who is in the book?', a: 'Steve Jobs, Bill Gates, Steve Wozniak, Mark Zuckerberg, Kevin Mitnick, Linus Torvalds, Tim Berners-Lee, Grace Hopper, Gordon Moore, Robert Noyce, Bob Kahn and Vint Cerf, Edsger Dijkstra, Jack Dorsey, Peter Thiel, Elon Musk, Marc Andreessen, Shawn Fanning, James Gosling, Guido van Rossum, Michael Dell, Richard Stallman, Jeff Bezos, Larry Page and Sergey Brin, Jimmy Wales and Larry Ellison: 27 people in 25 chapters.' },
      { q: 'Is it a business book?', a: 'No. It is a book about ideas and the people who had them. Each chapter explains one piece of computing (a compiler, a database, a search ranking, an operating system) through the story of how it was invented.' },
    ],
  },
  {
    n: 4,
    slug: 'explosive-chemists',
    title: 'Explosive Chemists',
    field: 'Chemistry',
    short: 'chemists',
    tagline: '24 daring minds who changed what the world is made of',
    accent: '#CCA4F6',
    ink: '#6B3BB0',
    asin: { paperback: 'B0GQTGPBCP', kindle: 'B0GR4DSSXP' },
    coverFace: 'Alfred Nobel',
    hook: 'Dynamite, the periodic table, DNA, plastics and Kevlar, told through the chemists who made them.',
    pitch: [
      'A man who, the story goes, opened a newspaper and read his own obituary. A chemist whose home was bombed while he made medicines from soybeans. A scientist who found a malaria drug in a remedy written down 1,600 years earlier. Explosive Chemists tells the true stories of 24 daring minds who changed what the world is made of, from Lavoisier and Mendeleev to Rosalind Franklin, Percy Julian and Tu Youyou.',
      'Each chapter explains one big idea in plain words: what really happens in a reaction, why the periodic table repeats, how X-rays revealed the shape of DNA, why Kevlar is stronger than steel for its weight. Kitchen experiments, like turning red cabbage into a color-changing indicator, bring the chemistry home.',
    ],
    interest: 'Experiments, elements and things that go bang',
    seoTitle: 'Explosive Chemists: Famous in STEM, Vol. 4',
    seoDescription:
      'True stories of 24 great chemists, from Nobel, Lavoisier and Mendeleev to Rosalind Franklin, Percy Julian and Tu Youyou, with kitchen experiments. For readers 13 and up.',
    faq: [
      { q: 'Which chemists are in the book?', a: 'Alfred Nobel, Antoine Lavoisier, Dmitri Mendeleev, Robert Boyle, Adolf von Baeyer, Fritz Haber, Rosalind Franklin, Mario Molina, Alice Ball, Linus Pauling, Dorothy Hodgkin, Percy Julian, Humphry Davy, August Kekulé, Louis Pasteur, Gertrude Elion, Svante Arrhenius, Leo Baekeland, Carl Scheele, Amedeo Avogadro, Tu Youyou, Stephanie Kwolek, Henry Cavendish and Ahmed Zewail: 24 in all.' },
      { q: 'Are the experiments safe?', a: 'The try-this activities use kitchen materials such as red cabbage, paper clips, a candle in a dish or a cold spoon, and the ones involving heat or flame say to do them with an adult.' },
    ],
  },
  {
    n: 5,
    slug: 'brilliant-biologists',
    title: 'Brilliant Biologists',
    field: 'Biology',
    short: 'biologists',
    tagline: '21 explorers who revealed how life works',
    accent: '#78D857',
    ink: '#2C6E14',
    asin: { paperback: 'B0GQZNZJTY', kindle: 'B0GR3PP5VQ' },
    coverFace: 'Charles Darwin',
    hook: 'Evolution, genes, chimpanzees, ants and the double helix, told through the explorers who revealed how life works.',
    pitch: [
      'A naturalist who worked on his great idea for twenty years, telling only a few friends, until a letter arrived from the other side of the world. A young woman crouched in the grass watching a chimpanzee use a tool. A cloth merchant who scraped his own teeth and found a hidden world under his lens. Brilliant Biologists tells the true stories of 21 explorers who revealed how life works, from Darwin and Mendel to Jane Goodall, Rachel Carson and Wangari Maathai.',
      'Each chapter explains one big idea of biology in plain words, from natural selection and genes to food chains and the double helix, with things to notice outside and simple experiments with coins, sugar water and a magnifying glass.',
    ],
    interest: 'Animals, nature and evolution',
    seoTitle: 'Brilliant Biologists: Famous in STEM, Vol. 5',
    seoDescription:
      'True stories of 21 great biologists and naturalists, from Darwin, Mendel and Mary Anning to Jane Goodall, Rachel Carson and David Attenborough. For readers 13 and up.',
    faq: [
      { q: 'Which biologists are in the book?', a: 'Charles Darwin, Gregor Mendel, Jane Goodall, Rachel Carson, Carl Linnaeus, Barbara McClintock, Alexander von Humboldt, Alfred Russel Wallace, Antonie van Leeuwenhoek, E. O. Wilson, Dian Fossey, George Washington Carver, Lynn Margulis, Thomas Hunt Morgan, Wangari Maathai, David Attenborough, Robert Hooke, Mary Anning, James Watson and Francis Crick, and Charles Henry Turner: 21 people in 20 chapters.' },
      { q: 'Is it about evolution?', a: 'Evolution is one thread, through Darwin and Wallace, but the book covers the whole of biology: genetics, microbes, ecology, animal behavior, fossils, cells and DNA.' },
    ],
  },
  {
    n: 6,
    slug: 'medical-pioneers',
    title: 'Medical Pioneers',
    field: 'Medicine',
    short: 'medical pioneers',
    tagline: '20 healers who beat disease and saved millions',
    accent: '#FC606C',
    ink: '#B0202F',
    asin: { paperback: 'B0GR4NCBD7' },
    coverFace: 'Alexander Fleming',
    hook: 'Vaccines, antibiotics, hand-washing, blood banks and heart surgery, told through the healers who fought for them.',
    pitch: [
      'A doctor who realized he and his colleagues were carrying death on their own hands. A mold on a forgotten dish that turned into penicillin. A surgeon who mended a wound beside a beating heart in 1893. Medical Pioneers tells the true stories of 20 healers who beat disease and saved millions, from Hippocrates and Ibn Sina to Florence Nightingale, Jonas Salk and Virginia Apgar.',
      'Each chapter explains one medical idea in plain words: how a vaccine teaches the body, why germs cause infection, how blood circulates, why a newborn gets an Apgar score. Hands-on boxes include taking your own pulse and doing William Harvey’s arithmetic.',
    ],
    interest: 'Medicine, the human body and becoming a doctor',
    seoTitle: 'Medical Pioneers: Famous in STEM, Vol. 6',
    seoDescription:
      'True stories of 20 medical pioneers, from Hippocrates and Jenner to Nightingale, Fleming, Salk and Apgar: how modern medicine began. For readers 13 and up.',
    faq: [
      { q: 'Who is in the book?', a: 'Alexander Fleming, Edward Jenner, Florence Nightingale, Jonas Salk, Hippocrates, Elizabeth Blackwell, Joseph Lister, Virginia Apgar, William Harvey, Andreas Vesalius, Daniel Hale Williams, Christiaan Barnard, Ignaz Semmelweis, Charles Drew, Helen Taussig, Rebecca Lee Crumpler, Harvey Cushing, Paul Ehrlich, Galen and Ibn Sina (Avicenna): 20 in all.' },
      { q: 'Is it good for a teen who wants to be a doctor?', a: 'Yes. It shows how medicine learned what it knows, often against fierce opposition, and how much of it depends on careful observation, counting and testing, which is the heart of the job today.' },
    ],
  },
  {
    n: 7,
    slug: 'extraordinary-engineers',
    title: 'Extraordinary Engineers',
    field: 'Engineering',
    short: 'engineers',
    tagline: '20 builders who engineered the modern world',
    accent: '#FCA82C',
    ink: '#9A5200',
    asin: { paperback: 'B0GR5HN2R4' },
    coverFace: 'Isambard Kingdom Brunel',
    hook: 'Bridges, towers, tunnels, railways, rockets and the bit, told through the builders who engineered the modern world.',
    pitch: [
      'A 21-year-old swept off his feet when the Thames burst into his tunnel. The first person to ride across the Brooklyn Bridge: the woman many people assumed was its real engineer. A rocket designer whose metal ball circled the Earth every 96 minutes. Extraordinary Engineers tells the true stories of 20 builders who engineered the modern world, from James Watt and Gustave Eiffel to Claude Shannon and Fazlur Rahman Khan.',
      'Each chapter explains one engineering idea in plain words: why bigger ships are cheaper to run, how a suspension bridge holds up a road, why a tube makes a skyscraper stand, what an orbit really is. Try-this boxes use drink cans, balloons and paper to show the ideas at work.',
    ],
    interest: 'Building, machines, bridges and rockets',
    seoTitle: 'Extraordinary Engineers: Famous in STEM, Vol. 7',
    seoDescription:
      'True stories of 20 great engineers, from Watt, Brunel and Eiffel to Emily Roebling, Claude Shannon and Fazlur Rahman Khan, with hands-on ideas. For readers 13 and up.',
    faq: [
      { q: 'Which engineers are in the book?', a: 'Isambard Kingdom Brunel, Gustave Eiffel, James Watt, Fazlur Rahman Khan, Emily Warren Roebling, Wernher von Braun, George Stephenson, Lillian Gilbreth, Sergei Korolev, John Smeaton, Hertha Ayrton, Claude Shannon, Norbert Rillieux, Henry Ford, Marc Isambard Brunel, Granville Woods, Ellen Swallow Richards, Rudolf Diesel, Mokshagundam Visvesvaraya and Lee de Forest: 20 in all.' },
      { q: 'Is it only about bridges and buildings?', a: 'No. Alongside towers, bridges, tunnels and railways, the book covers steam and diesel engines, rockets and orbits, radio, the assembly line, clean water and the bit, the unit of information.' },
    ],
  },
];

type Generated = (typeof generated.volumes)[number];
export type Volume = VolumeCopy & Generated & { url: string; fullTitle: string };

export const VOLUMES: Volume[] = VOLUME_COPY.map((c) => {
  const g = generated.volumes.find((v) => v.n === c.n)!;
  return { ...g, ...c, url: `/books/${c.slug}/`, fullTitle: `Famous in STEM, Vol. ${c.n}: ${c.title}` };
});

export const TOTALS = {
  books: VOLUMES.length,
  chapters: VOLUMES.reduce((s, v) => s + v.chapters, 0),
  people: VOLUMES.reduce((s, v) => s + v.peopleCount, 0),
};

export const amazonUrl = (asin: string) => `${SITE.amazon}/dp/${asin}`;

/** Every person in the series, in book order, with the volume they appear in. */
export const PEOPLE = VOLUMES.flatMap((v) =>
  v.people.map((p) => ({ ...p, vol: v.n, volTitle: v.title, volUrl: v.url, accent: v.accent, ink: v.ink })),
);

export const SERIES_FAQ = [
  {
    q: 'What is Famous in STEM?',
    a: `A series of seven nonfiction books by Javier Sanz. Each book tells the true stories of 20 to 27 people from one field (physics, mathematics, computing, chemistry, biology, medicine or engineering) in short chapters that explain the science in plain language. ${TOTALS.chapters} chapters and ${TOTALS.people} people in all.`,
  },
  {
    q: 'What age is it for?',
    a: 'Readers 13 and up: teens, curious adults and anyone who prefers stories to textbooks. Confident younger readers who love science can read them too: the chapters are short and explain every idea from scratch.',
  },
  {
    q: 'Do the books have to be read in order?',
    a: 'No. Every volume stands on its own, and so does every chapter. Start with the field your reader loves most.',
  },
  {
    q: 'What is inside each chapter?',
    a: 'A short biography of one person (a few chapters cover two people who worked together), opening with a true scene from their life. Each starts with a fact box (born, died and the big idea in one or two sentences), explains one real piece of science, and most include a "Try this", "Look around you" or "Think about it" box. Many chapters have an illustration of the science.',
  },
  {
    q: 'Are the books accurate?',
    a: 'The 2026 editions were rewritten chapter by chapter and fact-checked against published sources. Where an anecdote rests on a single account, the books say so ("the story goes") rather than presenting legend as fact.',
  },
  {
    q: 'Can they be used for school biography projects?',
    a: 'Yes. Each chapter gives a student a person, dates, the key idea and a story to build on, in a few pages, which makes the series a good starting point for choosing a scientist and planning a report.',
  },
  {
    q: 'Where can I buy them?',
    a: 'On Amazon, in paperback and Kindle editions (hardcover editions are listed on Amazon where available). Each book page on this site links straight to its Amazon listing.',
  },
];
