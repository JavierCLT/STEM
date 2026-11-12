// Books by other authors recommended on /reading-list/ and /what-to-read-after-who-was/.
// Every title, author, publisher, year, age range and award below was checked on November 11, 2026
// against the publisher, the award body or a library record (see `source`). Ages are the publisher's
// unless marked otherwise. Descriptions are this site's own words.

export interface Rec {
  title: string;
  author: string;
  publisher: string;
  year: number;
  ages: string;
  awards?: string[];
  about: string;
  note?: string;
  source: string;
}

export interface Subject {
  id: string;
  name: string;
  vol: number; // the matching Famous in STEM volume
  intro: string;
  books: Rec[];
}

export const CHECKED = 'November 2026';

export const SUBJECTS: Subject[] = [
  {
    id: 'physics-and-space',
    name: 'Physics and space',
    vol: 1,
    intro: 'True stories of the bomb, the Moon landings and the whole history of science, for readers who want to know how the universe works.',
    books: [
      {
        title: 'Bomb: The Race to Build—and Steal—the World’s Most Dangerous Weapon',
        author: 'Steve Sheinkin',
        publisher: 'Flash Point / Roaring Brook Press',
        year: 2012,
        ages: 'Ages 10–14',
        awards: ['Sibert Medal (2013)', 'Newbery Honor (2013)', 'YALSA Award for Excellence in Nonfiction (2013)', 'National Book Award finalist (2012)'],
        about: 'The Manhattan Project, Soviet atomic spies and the raids on Germany’s bomb program, told like a thriller.',
        source: 'https://www.ala.org/winner/bomb-race-build-and-steal-worlds-most-dangerous-weapon',
      },
      {
        title: 'How We Got to the Moon: The People, Technology, and Daring Feats of Science Behind Humanity’s Greatest Adventure',
        author: 'John Rocco',
        publisher: 'Crown Books for Young Readers',
        year: 2020,
        ages: 'Ages 10 and up',
        awards: ['Sibert Honor (2021)', 'YALSA Award for Excellence in Nonfiction finalist (2021)'],
        about: 'The engineers, mathematicians and machines behind the Apollo program, with detailed illustrations.',
        source: 'https://www.penguinrandomhouse.com/books/588478/how-we-got-to-the-moon-by-john-rocco/',
      },
      {
        title: 'A Short History of Nearly Everything',
        author: 'Bill Bryson',
        publisher: 'Broadway Books',
        year: 2003,
        ages: 'Adult; the publisher lists it for grades 9–12',
        awards: ['Aventis Prize for Science Books (2004)', 'Descartes Prize for Science Communication (2005)'],
        about: 'How scientists worked out the age of the Earth, the size of the universe and the history of life, told through the people who did it.',
        note: 'A shorter, illustrated version for ages 8–12, A Really Short History of Nearly Everything, came out in 2009.',
        source: 'https://www.penguinrandomhouse.com/books/20549/a-short-history-of-nearly-everything-by-bill-bryson/',
      },
    ],
  },
  {
    id: 'mathematics',
    name: 'Mathematics',
    vol: 2,
    intro: 'Codes, human computers and the ideas behind everyday math, for readers who like puzzles more than worksheets.',
    books: [
      {
        title: 'Hidden Figures: The American Dream and the Untold Story of the Black Women Mathematicians Who Helped Win the Space Race',
        author: 'Margot Lee Shetterly',
        publisher: 'William Morrow',
        year: 2016,
        ages: 'Adult',
        about: 'The Black women mathematicians, including Dorothy Vaughan, Mary Jackson and Katherine Johnson, who worked as human “computers” at NACA and NASA.',
        note: 'A Young Readers’ Edition (HarperCollins, 2016) is written for ages 8–12.',
        source: 'https://en.wikipedia.org/wiki/Hidden_Figures_(book)',
      },
      {
        title: 'The Code Book: The Secrets Behind Codebreaking',
        author: 'Simon Singh',
        publisher: 'Delacorte Press',
        year: 2002,
        ages: 'Ages 12 and up',
        about: 'The young-adult version of Singh’s history of codes and codebreaking, from the Caesar cipher and Enigma to modern encryption.',
        note: 'First published in 2002 as The Code Book: How to Make It, Break It, Hack It, Crack It.',
        source: 'https://www.penguinrandomhouse.com/books/168003/the-code-book-the-secrets-behind-codebreaking-by-simon-singh/',
      },
      {
        title: 'The Joy of x: A Guided Tour of Math, from One to Infinity',
        author: 'Steven Strogatz',
        publisher: 'Houghton Mifflin Harcourt',
        year: 2012,
        ages: 'Adult',
        awards: ['Euler Book Prize, Mathematical Association of America (2014)'],
        about: 'Short, friendly chapters that climb from counting to calculus and infinity, grown out of a New York Times column.',
        source: 'https://maa.org/euler-book-prize/',
      },
    ],
  },
  {
    id: 'computing',
    name: 'Computing and technology',
    vol: 3,
    intro: 'Where computers, the internet and algorithms came from, and how to start coding yourself.',
    books: [
      {
        title: 'The Innovators: How a Group of Hackers, Geniuses, and Geeks Created the Digital Revolution',
        author: 'Walter Isaacson',
        publisher: 'Simon & Schuster',
        year: 2014,
        ages: 'Adult',
        about: 'A group history of computing, from Ada Lovelace and Charles Babbage through the transistor and the PC to the internet and the web.',
        source: 'https://en.wikipedia.org/wiki/The_Innovators_(book)',
      },
      {
        title: 'Hello World: Being Human in the Age of Algorithms',
        author: 'Hannah Fry',
        publisher: 'W. W. Norton',
        year: 2018,
        ages: 'Adult',
        about: 'How algorithms are used, and where they go wrong, in courts, hospitals, policing, cars and art.',
        source: 'https://www.publishersweekly.com/9780393634990',
      },
      {
        title: 'Girls Who Code: Learn to Code and Change the World',
        author: 'Reshma Saujani',
        publisher: 'Viking Books for Young Readers',
        year: 2017,
        ages: 'Ages 10 and up',
        about: 'An illustrated introduction to programming ideas and tech careers, with stories of women in computing. A practical guide rather than a narrative.',
        source: 'https://www.penguinrandomhouse.com/books/537668/girls-who-code-by-reshma-saujani/',
      },
    ],
  },
  {
    id: 'chemistry',
    name: 'Chemistry',
    vol: 4,
    intro: 'Molecules that changed history, poisons and the elements, for readers who like experiments and a bit of danger.',
    books: [
      {
        title: 'Napoleon’s Buttons: How 17 Molecules Changed History',
        author: 'Penny Le Couteur and Jay Burreson',
        publisher: 'Jeremy P. Tarcher / Putnam',
        year: 2003,
        ages: 'Adult; the publisher lists it for grades 9–12',
        about: 'How molecules in spices, sugar, rubber, dyes and explosives shaped wars, trade and medicine.',
        source: 'https://www.penguinrandomhouse.com/books/288699/napoleons-buttons-by-penny-le-couteur/',
      },
      {
        title: 'The Poisoner’s Handbook: Murder and the Birth of Forensic Medicine in Jazz Age New York',
        author: 'Deborah Blum',
        publisher: 'Penguin Press',
        year: 2010,
        ages: 'Adult; the publisher lists it for grades 9–12',
        about: 'How New York’s first chief medical examiner and his toxicologist invented forensic chemistry, case by case.',
        source: 'https://www.penguinrandomhouse.com/books/301154/the-poisoners-handbook-by-deborah-blum/',
      },
      {
        title: 'The Disappearing Spoon (Young Readers Edition)',
        author: 'Sam Kean',
        publisher: 'Little, Brown Books for Young Readers',
        year: 2018,
        ages: 'Ages 10–13 when published',
        about: 'True stories about the elements and the people who discovered, used and misused them, organized around the periodic table.',
        note: 'Older teens can read the original adult edition.',
        source: 'https://www.hachettebookgroup.com/titles/sam-kean/the-disappearing-spoon/9780316388252/',
      },
    ],
  },
  {
    id: 'biology',
    name: 'Biology and nature',
    vol: 5,
    intro: 'Evolution, microbes and plants, from a marriage tested by Darwin’s theory to a scientist’s life in the lab.',
    books: [
      {
        title: 'Charles and Emma: The Darwins’ Leap of Faith',
        author: 'Deborah Heiligman',
        publisher: 'Henry Holt Books for Young Readers',
        year: 2009,
        ages: 'Ages 12 and up',
        awards: ['National Book Award finalist (2009)', 'Printz Honor (2010)', 'YALSA Award for Excellence in Nonfiction (2010)'],
        about: 'Charles Darwin and his wife Emma, and how his theory of evolution tested her religious faith and their marriage.',
        source: 'https://www.ala.org/winner/charles-and-emma-darwins-leap-faith-0',
      },
      {
        title: 'Lab Girl',
        author: 'Hope Jahren',
        publisher: 'Alfred A. Knopf',
        year: 2016,
        ages: 'Adult; the publisher lists it for grades 6–12',
        awards: ['National Book Critics Circle Award, Autobiography (2016)'],
        about: 'A geobiologist’s memoir of studying plants and of building a career in science.',
        source: 'https://www.penguinrandomhouse.com/books/248239/lab-girl-by-hope-jahren/',
      },
      {
        title: 'I Contain Multitudes: The Microbes Within Us and a Grander View of Life',
        author: 'Ed Yong',
        publisher: 'Ecco',
        year: 2016,
        ages: 'Adult',
        about: 'How the microbes living in and on animals, people included, shape their development, health and evolution.',
        source: 'https://openlibrary.org/books/OL26591085M',
      },
    ],
  },
  {
    id: 'medicine',
    name: 'Medicine',
    vol: 6,
    intro: 'Epidemics, a famous cell line and a heart operation that changed surgery, for readers who might want to become doctors.',
    books: [
      {
        title: 'The Immortal Life of Henrietta Lacks',
        author: 'Rebecca Skloot',
        publisher: 'Crown',
        year: 2010,
        ages: 'Adult; the publisher lists it for grades 9–12',
        awards: ['ALA Notable Books for Adults (2011)'],
        about: 'The story of Henrietta Lacks, whose cancer cells were taken without her consent in 1951 and became the HeLa cell line, and of her family.',
        source: 'https://www.penguinrandomhouse.com/books/168191/the-immortal-life-of-henrietta-lacks-by-rebecca-skloot/',
      },
      {
        title: 'An American Plague: The True and Terrifying Story of the Yellow Fever Epidemic of 1793',
        author: 'Jim Murphy',
        publisher: 'Clarion Books',
        year: 2003,
        ages: 'Written for young readers',
        awards: ['Sibert Medal (2004)', 'Newbery Honor (2004)', 'National Book Award finalist (2003)'],
        about: 'Philadelphia’s yellow fever epidemic of 1793, the doctors’ competing theories and how the city survived.',
        source: 'https://www.ala.org/winner/american-plague-true-and-terrifying-story-yellow-fever-epidemic-1793-1',
      },
      {
        title: 'Breakthrough!: How Three People Saved “Blue Babies” and Changed Medicine Forever',
        author: 'Jim Murphy',
        publisher: 'Clarion Books',
        year: 2015,
        ages: 'Ages 10–12',
        about: 'How Helen Taussig, Alfred Blalock and Vivien Thomas developed the 1944 operation for “blue baby” heart defects.',
        source: 'https://www.publishersweekly.com/9780547821832',
      },
    ],
  },
  {
    id: 'engineering',
    name: 'Engineering',
    vol: 7,
    intro: 'Rockets, bridges and a windmill built from scrap, for readers who build things.',
    books: [
      {
        title: 'Rocket Boys: A Memoir',
        author: 'Homer H. Hickam Jr.',
        publisher: 'Delacorte Press',
        year: 1998,
        ages: 'Adult; the publisher lists it for grades 9–12',
        awards: ['National Book Critics Circle finalist, Biography/Autobiography (1998)'],
        about: 'A coal-town teenager and his friends teach themselves to build rockets after Sputnik. The basis for the 1999 film October Sky.',
        source: 'https://www.penguinrandomhouse.com/books/79590/rocket-boys-by-homer-h-hickam-jr/9780385333214/teachers-guide/',
      },
      {
        title: 'Built: The Hidden Stories Behind Our Structures',
        author: 'Roma Agrawal',
        publisher: 'Bloomsbury',
        year: 2018,
        ages: 'Adult',
        awards: ['AAAS/Subaru SB&F Prize, Young Adult Science Book (2019)'],
        about: 'A structural engineer explains how buildings, bridges and tunnels stand up, drawing on history and on her own work on London’s Shard.',
        source: 'https://www.sbfprize.org/built',
      },
      {
        title: 'The Boy Who Harnessed the Wind (Young Readers Edition)',
        author: 'William Kamkwamba and Bryan Mealer',
        publisher: 'Dial Books for Young Readers',
        year: 2015,
        ages: 'Ages 10 and up',
        about: 'Kamkwamba’s memoir of building an electricity-making windmill from scrap as a teenager during a famine in Malawi.',
        source: 'https://www.penguinrandomhouse.com/books/314792/the-boy-who-harnessed-the-wind-movie-tie-in-edition-by-william-kamkwamba-and-bryan-mealer-illustrated-by-anna-hymas/',
      },
    ],
  },
];

export const COLLECTIVE: Rec = {
  title: 'Women in Science: 50 Fearless Pioneers Who Changed the World',
  author: 'Rachel Ignotofsky',
  publisher: 'Ten Speed Press',
  year: 2016,
  ages: 'Ages 10–17',
  about: 'Illustrated one-page profiles of 50 women scientists, with infographics.',
  source: 'https://www.penguinrandomhouse.com/books/534776/women-in-science-by-rachel-ignotofsky/',
};

// ---------------------------------------------------------------- Who Was?
export const WHO_WAS = {
  publisher: 'Penguin Workshop (Penguin Random House), originally Grosset & Dunlap',
  began: 2002,
  ages: 'Ages 8–12, grades 3–7',
  pages: 112,
  titles: 247,
  titlesNote: 'Who Was? and Who Is? titles on the publisher’s series page, November 2026',
  source: 'https://www.penguinrandomhouse.com/series/DWY/who-was/',
};

/** Who Was?/Who Is? titles about people who also have a chapter in Famous in STEM (checked November 2026). */
export const WHO_WAS_MATCHES: { vol: number; titles: { title: string; person: string }[] }[] = [
  {
    vol: 1,
    titles: [
      { title: 'Who Was Albert Einstein?', person: 'albert-einstein' },
      { title: 'Who Was Marie Curie?', person: 'marie-curie' },
      { title: 'Who Was Isaac Newton?', person: 'isaac-newton' },
      { title: 'Who Was Galileo?', person: 'galileo-galilei' },
      { title: 'Who Was Thomas Alva Edison?', person: 'thomas-edison' },
      { title: 'Who Was Nikola Tesla?', person: 'nikola-tesla' },
      { title: 'Who Was Ben Franklin?', person: 'benjamin-franklin' },
      { title: 'Who Was Stephen Hawking?', person: 'stephen-hawking' },
    ],
  },
  { vol: 2, titles: [{ title: 'Who Was Katherine Johnson?', person: 'katherine-johnson' }] },
  { vol: 3, titles: [{ title: 'Who Was Steve Jobs?', person: 'steve-jobs' }, { title: 'Who Is Bill Gates?', person: 'bill-gates' }] },
  {
    vol: 5,
    titles: [
      { title: 'Who Was Charles Darwin?', person: 'charles-darwin' },
      { title: 'Who Was Jane Goodall?', person: 'jane-goodall' },
      { title: 'Who Was Rachel Carson?', person: 'rachel-carson' },
      { title: 'Who Was George Washington Carver?', person: 'george-washington-carver' },
    ],
  },
  { vol: 7, titles: [{ title: 'Who Was Henry Ford?', person: 'henry-ford' }, { title: 'Where Is the Eiffel Tower?', person: 'gustave-eiffel' }] },
];

/** People with a Famous in STEM chapter but no title in the Who Was? series (publisher and series listings checked November 2026). */
export const NOT_IN_WHO_WAS = [
  'ada-lovelace', 'alan-turing', 'grace-hopper', 'tim-berners-lee', 'rosalind-franklin', 'louis-pasteur', 'alfred-nobel',
  'mary-anning', 'florence-nightingale', 'alexander-fleming', 'jonas-salk', 'elizabeth-blackwell', 'james-watt',
];

/** Bridge books: true stories pitched between Who Was? and adult nonfiction. */
export const BRIDGE: Rec[] = [
  {
    title: 'Bomb: The Race to Build—and Steal—the World’s Most Dangerous Weapon',
    author: 'Steve Sheinkin', publisher: 'Flash Point / Roaring Brook Press', year: 2012, ages: 'Ages 10–14',
    awards: ['Sibert Medal (2013)', 'Newbery Honor (2013)'],
    about: 'Narrative nonfiction that reads like a spy thriller; a natural step up in length and depth.',
    source: 'https://www.ala.org/winner/bomb-race-build-and-steal-worlds-most-dangerous-weapon',
  },
  {
    title: 'Hidden Figures: Young Readers’ Edition',
    author: 'Margot Lee Shetterly', publisher: 'HarperCollins', year: 2016, ages: 'Ages 8–12',
    about: 'The women mathematicians behind NASA’s early flights, told for younger readers.',
    source: 'https://www.ala.org/winner/hidden-figures-young-readers-edition-untold-true-story-four-african-american-women-who',
  },
  {
    title: 'The Disappearing Spoon (Young Readers Edition)',
    author: 'Sam Kean', publisher: 'Little, Brown Books for Young Readers', year: 2018, ages: 'Ages 10–13 when published',
    about: 'Stories of the elements and their discoverers, organized around the periodic table.',
    source: 'https://www.hachettebookgroup.com/titles/sam-kean/the-disappearing-spoon/9780316388252/',
  },
  {
    title: 'The Radium Girls: Young Readers’ Edition: The Scary but True Story of the Poison that Made People Glow in the Dark',
    author: 'Kate Moore', publisher: 'Sourcebooks eXplore', year: 2020, ages: 'Grades 5–8 (Junior Library Guild)',
    about: 'The young women poisoned by radium paint in watch factories, and their fight in court.',
    source: 'https://www.juniorlibraryguild.com/the-radium-girls-young-readers-edition-t-9781728210346j',
  },
  {
    title: 'How We Got to the Moon',
    author: 'John Rocco', publisher: 'Crown Books for Young Readers', year: 2020, ages: 'Ages 10 and up',
    awards: ['Sibert Honor (2021)'],
    about: 'The people and engineering behind Apollo, with richly detailed illustrations.',
    source: 'https://www.penguinrandomhouse.com/books/588478/how-we-got-to-the-moon-by-john-rocco/',
  },
  {
    title: 'Women in Science: 50 Fearless Pioneers Who Changed the World',
    author: 'Rachel Ignotofsky', publisher: 'Ten Speed Press', year: 2016, ages: 'Ages 10–17',
    about: 'One illustrated page per scientist: a quick, visual way to meet 50 women in science.',
    source: 'https://www.penguinrandomhouse.com/books/534776/women-in-science-by-rachel-ignotofsky/',
  },
  {
    title: 'Science Comics (series)',
    author: 'Various authors', publisher: 'First Second', year: 2016, ages: 'Ages 9–13',
    about: 'Graphic-novel introductions to one science topic each, such as coral reefs, volcanoes and dinosaurs. Good for reluctant readers.',
    source: 'https://www.publishersweekly.com/pw/by-topic/childrens/childrens-industry-news/article/69667-first-second-launches-series-of-science-comics.html',
  },
];
