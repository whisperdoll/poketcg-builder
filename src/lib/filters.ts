import cards, { ICard } from "../resources/cards";
import sets from "../resources/sets";
import formats from "../resources/formats";

export const filterEnums = {
  superType: ["POKEMON", "TRAINER", "ENERGY"],
  subTypes: [
    "BASIC",
    "EVOLUTION",
    "STAGE2",
    "STAGE1",
    "BABY",
    "STADIUM",
    "ITEM",
    "SPECIAL_ENERGY",
    "BASIC_ENERGY",
    "FOSSIL",
    "DARK_POKEMON",
    "OWNERS_POKEMON",
    "POKEMON_TOOL",
    "SHINING_POKEMON",
    "LIGHT_POKEMON",
    "SUPPORTER",
    "TECHNICAL_MACHINE",
    "G_SPEC",
    "EX",
    "TEAM_AQUA",
    "TEAM_MAGMA",
    "ROCKETS_SECRET_MACHINE",
    "LVL_X",
    "LEGEND",
    "POKEMON_EX",
    "TEAM_PLASMA",
    "RESTORED",
    "ACE_SPEC",
    "MEGA_POKEMON",
    "BREAK",
    "FLARE",
    "POKEMON_GX",
    "TAG_TEAM",
    "ULTRA_BEAST",
    "PRISM_STAR",
    "POKEMON_V",
    "VMAX",
    "RAPID_STRIKE",
    "SINGLE_STRIKE",
  ],
  retreatCost: [0, 1, 2, 3, 4, 5],
  artist: [
    "Keiji Kinebuchi",
    "Ken Sugimori",
    "Toshinao Aoki",
    "Kagemaru Himeno",
    "Christopher Rush",
    "Benimaru Itoh",
    "Hiromichi Sugiyama",
    "Sumiyoshi Kizuki",
    "Kunihiko Yuyama",
    "Atsuko Nishida",
    "Gakuji Nomoto",
    "Tomokazu Komiya",
    "Hironobu Yoshida",
    "Hideki Kazama",
    "Shin-ichi Yoshida",
    "",
    "Miki Tanaka",
    "Craig Turvey",
    "Hajime Kusajima",
    "Mitsuhiro Arita",
    "Tomoaki Imakuni",
    "Takumi Akabane",
    "Hikaru Koike",
    "Milky Isobe",
    "Naoyo Kimura",
    "CR CG gangs",
    "Aya Kusube",
    "Kimiya Masago",
    "Yuka Morii",
    "Yukiko Baba",
    "Masako Yamashita",
    "Etsuya Hattori",
    "Imakuni?",
    "Kyoko Umemoto",
    "K.  Hoshiba",
    "Hiroaki Ito",
    "Yuichi Sawayama",
    "Asuka Iwashita",
    "Sachi Matoba",
    "Motofumi Fujiwara",
    "Satoshi Ohta",
    "Aimi Tomita",
    "Hideyuki Nakajima",
    '"Big Mama" Tagawa',
    "Kai Ishikawa",
    "Kouki Saitou",
    "Hisao Nakamura",
    "Keiko Fukuyama",
    "Midori Harada",
    "Hizuki Misono",
    "Mikio Menjo",
    "Shin-ichi Yoshikawa",
    "Kazuo Yazawa",
    "Jungo Suzuki",
    "Katsura Tabata",
    "Ken Ikuji",
    "“Big Mama” Tagawa",
    "Kent Kanetsuna",
    "Ryo Ueda",
    "5ban Graphics",
    "Unknown",
    "Noboyuki Habu",
    'R.J. "Arvalis" Palmer',
    "Joshua Dunlop",
    'Marika "MrRedButcher" Khammanivong',
    "DanteCyberMan",
    'Ross "RtRadke" Radke',
    'Sandra "Sadako-xD" Süsser',
    'Lesslie "MuddyTiger" Higgins',
    'Arya "Wintershades" Berglund',
    'Devin "TamberElla" Elle Kurtz',
    "Felis Glacialis",
    "Sushan Yue",
    "Lux-The-Umbreon",
    'Karolina "Twarda8" Twardosz',
    'Rafael "Kokiri-kun" Chiamenti',
    'Gavin "SoupAndButter" Mackey',
    "Amy Kim",
    'Matt "MGette86" Gette',
    'Jamie "catandcrown" Flack',
    "Miranda Meeks",
    'Vince "VincenzoNova" Marcellino',
    'Andrew "mysticaldonkey1" Olson',
    'Xanthe "XantheUnwinArt" Unwin',
    "Frozen-Wing",
    "ﾋｻｷﾁ (Hisakichi)",
    "ArtKitt-Creations",
    'Edward "TransformNightmare" Gallivan Jr.',
    "Michael Bollig",
    "fddt",
    "Tino Walter",
    "nyoruniru",
    'Enrique "CaymArtworks"',
    "Sam Peterson",
    "John Yau",
    'Christian "KrizEvil" Villacís',
    'Piper "Cryptid-Creations" Thibodeau',
    "Zafrean",
    "blueMangosteen",
    "kaminary-san",
    'Luis "MetaShinryu" Angel Payano',
    "Gibson Radsavanh",
    "Miyukitty",
    "Jazon19",
    'Ruth "Ruth-Tay" Taylor',
    "Gangl Simon",
    "Jamaal Raoof",
    "Mano Torres",
    'Stephen "Stephen-0akley" Oakley',
    'Kez "Kezrek" Laczin',
    "HumanForScale.com",
    'Tim "Duff5107" Duffy',
    'Jamie "superpsyduck" Chang',
    'Alysia "Leashe" Prosser',
    "Akshat Gosain",
    "Phil Gosch",
    "Lone Wolf",
    'Jasper "JappaWakka" Speelman',
    "Neo Dorakichi",
    'Jasper "JappaWakka" Speelman & ﾋｻｷﾁ (Hisakichi)',
    'Danni Martin & Francisco "KL45H" Cruz III',
    "Sinijax",
    "coward_lion",
    'Ceasar "Wizyakuza" Ian Muyuela',
    "furball891",
    "tsuaii",
    "Milhala",
    "ryanhuertas",
    "ネンド (Nendo)",
    "Freecolat a.k.a. Skitamine",
    'Janice "EternaLegend" Scott',
    "xXxCarcino-GenicxXx",
    'Cris "DelarasArt" Delara',
    "Evan Liaw",
    "sakimichan",
    'Jasper "JappaWakka" Speelman & R. J. "Arvalis" Palmer',
    'Jasper "JappaWakka" Speelman & Baltasar Vischi',
    "Sciamano240",
    "Ingmar Weseman",
    "AyyaSAP",
    "Sourabh Hamigi",
    "Allan Swart",
    "Carolina Carromic Stahlberg",
    "Rob Nelson",
    'Gideon "gidland" Land',
    "KRSatterwhite",
    "IndustryAndTravel",
    "Alex Caban",
    "Dwight Eschliman",
    "Ahmad Morshedi",
    "The Kao/scruballz & The Time Tunnel (1966)",
    'Edited screenshot from the game "Zero Escape"',
    "Good Smile Company",
    "Chinook Crafts",
    'Ross "RtRadke" Radke & sakkmesterke',
    'Valentin François & Marika "MrRedButcher" Khammanivong',
    "Dabarti CGI",
    "Hall Groat II",
    "Fun Handprint Art",
    'R. J. "Arvalis" Palmer',
    "Tim Foley",
    "Adam Rufino",
    "Piotr Dura & Jamaal Raoof",
    "OpenAI",
    "Juri Hahhaley",
    "Grupo Elron",
    "Alessandro Tognin",
    "Florian Seidel",
    'Fausto "faustogarmen" García',
    "Marc Sendra Martorell",
    "KJPargeterImages.com",
    "Heiko Achilles",
    "Romany WG",
    "Alex Makoto Simpson",
    "Mike Petrucci",
    "AnekaShu",
    "JUNK Brands",
    "Jiusion",
    "macrovector",
    "manalahmadkhan",
    "Antoine Van Bergen",
    "Shin-ichi Yoshidawa",
    "Daisuke Ito",
    '"Big Mama" Tagawa, CR CG gangs',
    "Rya Ueda",
    "R. J. “Arvalis” Palmer",
    "K. Hoshiba",
    "Nick Rain",
    "Tomokazu",
    "Zu-Ka",
    "K. Utsunomiya",
    "Nakaoka",
    "T. Honda",
    "Mt. TBT",
    "M. Akiyama",
    "Atsuko Ujiie",
    "Yosuke Da Silva",
    'Big Mama" Tagawa"',
    "Ken Ikugi",
    "MikiTanaka",
    "Masakazu Fukuda",
    "K Hoshiba",
    "Tokumi Akabane",
    "Emi Miwa",
    "Kyoko Koizumi",
    "Sachiko Adachi",
    "Midroi Harada",
    "Tomoko Wakai",
    "Takao Unno",
    "Kenkichi Toyama",
    "Hiroki Fuchino",
    "Kanako Eo",
    "Suwama Chiaki",
    "Shizurow",
    "Takabon",
    "Yasuki Watanabe",
    "Masahiko Ishii",
    "Yusuke Shimada",
    "Mikiko Takeda",
    "Kazuyuki Kano",
    "Emi Yoshida",
    "Yusuke Ohmura",
    "Lee HyunJung",
    "Saya Tsuruta",
    "Saya　Tsuruta",
    "Kazuaki Aihara",
    "Yusuke Ishikawa",
    "Makoto Imai",
    "Ryota Saito",
    "kawayoo",
    "Shin Nagasawa",
    "Wataru Kawahara",
    "TOKIYA",
    "Keiko Moritsugu",
    "Mana Ibe",
    "Nobuyuki Fujimoto",
    "Reiko Tanoue",
    "sui",
    "Naoki Saito",
    "match",
    "MAHOU",
    "Hideaki Hakozaki",
    "Takashi Yamaguchi",
    "Noriko Hotta",
    "Shinji Higuchi",
    "Shinji Higuchi + Sachiko Eba",
    "Shinji Higuchi + Noriko Takaya",
    "Kent Kanetsuna/Direc. Shinji Higuchi",
    "Wataru Kawahara/Direc. Shinji Higuchi",
    "Shinji Higuchi + Sachiko Eba/樋口真嗣 + 江場左知子",
    "Shinji Higuchi + Noriko Takaya/樋口真嗣+高屋法子",
    "Shinji Higuchi + Sachiko Eba/樋口真嗣+江場左知子",
    "Ayaka Yoshida",
    "Shigenori Negishi",
    "Daisuke Iwamoto",
    "Mizue",
    "Akira Komayama",
    "Yuri Umemura",
    "Eske Yoshinob",
    "HiRON",
    "BERUBURI",
    "Toyste Beach",
    "Illus.＆Direc.The Pokémon Company Art Team",
    "Megumi Mizutani",
    "James Turner",
    "Maiko Fujiwara",
    "Tomohiro Kitakaze",
    "hatachu",
    "Satoshi Shirai",
    "Hiroki Asanuma",
    "Kouji Tajima",
    "kirisAki",
    "Sanosuke Sakuma",
    "Hitoshi Ariga",
    "PLANETA",
    "You Iribi",
    "OOYAMA",
    "chibi",
    "Yoshinobu Saito",
    "Hasuno",
    "Ryota Murayama",
    "Emi Ando",
    "nagimiso",
    "GAME FREAK inc.",
    "miki kudo",
    "DemizuPosuka",
    "Hideki Ishikawa",
    "kodama",
    "Mina Nakai",
    "Shibuzoh.",
    "Eri Yamaki",
    "kanahei",
    "Yumi",
    "Anesaki Dynamic",
    "Dr.Ooyama",
    "Misa Tsutsui",
    "tetsuya koizumi",
    "2017 Pikachu Project",
    "0313",
    "Asako Ito",
    "Hiroyuki Yamamoto",
    "so-taro",
    "Sekio",
    "SATOSHI NAKAI",
    "take",
    "Studio Bora Inc.",
    "otumami",
    "sowsow",
    "PLANETA Otani",
    "PLANETA Igarashi",
    "SATOSHI NAKAI\\",
    "AKIRA EGAWA",
    "PLANETA Tsuji",
    "Yuu Nishida",
    "Mika Pikazo",
    "Souichirou Gunjima",
    "Ryuta Fuse",
    "Atsushi Furusawa",
    "NC Empire",
    "Taira Akitsu",
    "Narumi Sato",
    "KEIICHIRO ITO",
    "D.A.G Inc.",
    "HYOGONOSUKE",
    "OKACHEKE",
    "Megumi Higuchi",
    "Tika Matsuno",
    "Teeziro",
    "Uta",
    "aky CG Works",
    "Oswaldo KATO",
    "PLANETA Mochizuki",
    "Kazuma Koda",
    "ryoma uratsuka",
    "Nagomi Nijo",
    "Saki Hayashiro",
    "KIYOTAKA OSHIYAMA",
    "AYUMI ODASHIMA",
    "sadaji",
    "inose yukie",
    "En Morikura",
    "MUGENUP",
    "Yuya Oka",
    "Pani Kobayashi",
    "Hasegawa Saki",
    "n/a",
  ],
};

function cmp(s1: string | undefined, s2: string | undefined) {
  const l1 = s1?.toLowerCase();
  const l2 = s2?.toLowerCase();

  return (
    (l1 === undefined && l2 === "none") ||
    (l2 === undefined && l1 === "none") ||
    l1 === l2
  );
}

function tryParseInt(s: string) {
  try {
    const parsed = parseInt(s);
    if (isNaN(parsed)) return 0;
    return parsed;
  } catch (e) {
    return 0;
  }
}

function numericCompare(n: number | undefined, s: string) {
  if (n === undefined) {
    return s.toLowerCase() === "none";
  }

  if (s.startsWith(">=")) {
    const parsed = tryParseInt(s.substr(2));
    return n >= parsed;
  } else if (s.startsWith("<=")) {
    const parsed = tryParseInt(s.substr(2));
    return n <= parsed;
  } else if (s.startsWith(">")) {
    const parsed = tryParseInt(s.substr(1));
    return n > parsed;
  } else if (s.startsWith("<")) {
    const parsed = tryParseInt(s.substr(1));
    return n < parsed;
  } else if (s.startsWith("=")) {
    const parsed = tryParseInt(s.substr(1));
    return n === parsed;
  }

  return tryParseInt(s) === n;
}

function collectionCompare(collection: string[] | undefined, s: string) {
  const l = s.toLowerCase();
  if (l === "none") {
    return collection === undefined || collection.length === 0;
  }

  return !!collection && collection.some((cs) => cs.toLowerCase() === l);
}

export const COLUMNS: Record<string, (card: ICard, value: string) => boolean> =
  {
    name: (card, value) => cmp(card.name, value),
    type: (card, value) => collectionCompare(card.types, value),
    superType: (card, value) => cmp(card.superType, value),
    subType: (card, value) => collectionCompare(card.subTypes, value),
    evolvesTo: (card, value) => collectionCompare(card.evolvesTo, value),
    evolvesFrom: (card, value) => cmp(card.evolvesFrom, value),
    hp: (card, value) => numericCompare(card.hp, value),
    retreatCost: (card, value) => numericCompare(card.retreatCost, value),
    weakness: (card, value) =>
      collectionCompare(card.weaknesses?.map((w) => w.type), value),
    set: (card, value) => cmp(card.id.split("-")[0], value),
  };

export interface Filters {
  searchText: string;
  format?: string;
  superType?: string;
  subType?: string;
  type?: string;
  hp: { comparator: ">" | "<" | ">=" | "<=" | "="; value: string };
  moveType: { type: string; includeColorless: boolean };
}

export const DEFAULT_FILTERS: Filters = {
  searchText: "",
  hp: { comparator: "=", value: "" },
  moveType: { type: "", includeColorless: false },
};

export function filteredCards(filters: Filters) {
  // format
  const format = filters.format && formats[filters.format];
  const type = filters.type;

  return Object.values(cards).filter((card) => {
    const s = (str: string | number) =>
      str.toString().toLowerCase().replace(/é/g, "e");

    const e = (array: any[] | undefined, ...keys: string[]) => {
      if (!array) return [];

      if (keys.length === 0) {
        return array.map(s);
      }

      const ret: string[] = [];

      array.forEach((item) => {
        keys.forEach((key) => {
          if (item[key]) {
            ret.push(s(item[key]));
          }
        });
      });

      return ret;
    };

    let matchesSearchText: boolean = true;

    if (filters.searchText) {
      const searchTexts = [
        s(card.name),
        ...e(card.moves, "name", "text"),
        ...e(card.abilities, "type", "name", "text"),
        ...e(card.text),
      ];
      const filterSearchText = s(filters.searchText);
      matchesSearchText = searchTexts.some((t) => t.includes(filterSearchText));
    }

    const set = sets[card.id.split("-")[0]];

    const matchesFormat =
      !format ||
      (!format.excludes.includes(card.id) &&
        (format.expansions.map((e) => e.toString()).includes(set.id) ||
          format.includes.includes(card.id)));

    const matchesSuperType =
      !filters.superType || cmp(card.superType, filters.superType);

    const matchesSubType =
      !filters.subType || collectionCompare(card.subTypes, filters.subType);

    const matchesType = !type || card.types?.includes(type.toUpperCase());

    const matchesHp =
      !filters.hp.value ||
      numericCompare(card.hp, `${filters.hp.comparator}${filters.hp.value}`);

    let matchesMoveType = true;

    if (filters.moveType.type) {
      const moveTypes = new Set((card.moves || []).map((m) => m.cost).flat());
      matchesMoveType =
        (filters.moveType.includeColorless && moveTypes.has("C")) ||
        moveTypes.has(filters.moveType.type.toUpperCase());
    }

    return (
      matchesSearchText &&
      matchesFormat &&
      matchesSuperType &&
      matchesSubType &&
      matchesType &&
      matchesHp &&
      matchesMoveType
    );
  });
}
