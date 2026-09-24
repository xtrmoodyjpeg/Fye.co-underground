// Species profiles for the /exotics "ANIMAL CONTENT" section -- the broader
// field library of animals FYE.EXOTICS works with or is documenting, distinct
// from the for-sale LIVE ARCHIVE specimens (see app/lib/specimens.server.ts).
//
// `images` stays empty for species without a real photo on file yet -- per
// project policy this page never substitutes AI-generated animal imagery for
// a missing real photo, so those cards render a "field photo pending" state
// instead.

export type AnimalCategory = 'amphibian' | 'reptile' | 'arachnid';

export type AnimalStatus = 'Coming Soon' | 'In Our Care' | 'Breeding Project';

export interface AnimalProfile {
  id: string;
  commonName: string;
  scientificName: string | null;
  category: AnimalCategory;
  status: AnimalStatus;
  location: string;
  lifestyle: string;
  diet: string | null;
  behavior: string | null;
  funFact: string | null;
  breedingNote: string | null;
  images: string[];
}

export const animalContent: AnimalProfile[] = [
  {
    id: 'red-eye-tree-frog',
    commonName: 'Red-Eyed Tree Frog',
    scientificName: 'Agalychnis callidryas',
    category: 'amphibian',
    status: 'Coming Soon',
    location:
      'Found in the tropical lowland rainforests of southern Mexico, Central America (such as Costa Rica and Panama), and parts of northern South America.',
    lifestyle:
      'They are completely arboreal, meaning they live high in tall trees and only come down to mate rarely. They live about 5 years in the wild, up to 10 in captivity.',
    diet: 'They eat insects like moths, flies, grasshoppers, and crickets, also other small frogs -- showing off their cannibalistic side.',
    behavior: null,
    funFact: null,
    breedingNote:
      'Here @ fye.exotics we are working on a project for captive bred red eye tree frogs, available soon.',
    images: ['/exotics/animal-content/red-eye-tree-frog.webp'],
  },
  {
    id: 'veiled-chameleon',
    commonName: 'Veiled Chameleon',
    scientificName: 'Chamaeleo calyptratus',
    category: 'reptile',
    status: 'Coming Soon',
    location:
      'Found in the continental zone of Africa and the Northern hemisphere in countries such as Yemen and South Arabia. They are a high pet-trade reptile, so you can find a lot of wild chameleons in certain parts of Florida too, roaming wild.',
    lifestyle:
      'An arboreal reptile that spends its whole life in trees, thick vegetation, valleys, vegetated highlands, and super dry areas. Not your typical rainforest chameleon. They are not social, and prefer solitary living.',
    diet: 'Crickets, grasshoppers, spiders, silkworms, flies -- also one of the few chameleon species to eat leaves and plant matter if it needs extra nutrients.',
    behavior: null,
    funFact: 'Female veiled chameleons can lay eggs without mating.',
    breedingNote: 'Here @ fye.exotics we are working on captive bred chameleons.',
    images: ['/exotics/animal-content/veiled-chameleon.webp'],
  },
  {
    id: 'yellow-belly-mourning-gecko',
    commonName: 'Yellow Belly Mourning Gecko',
    scientificName: 'Lepidodactylus lugubris',
    category: 'reptile',
    status: 'Coming Soon',
    location: 'Native to and found in places like Hawaii, Southeast Asia, and more.',
    lifestyle:
      'A small, all-female arboreal lizard that thrives in groups -- they don’t need any males to reproduce. Some say they are all clones of one original mourning gecko.',
    diet: 'Pretty much any small insect that can fit in their mouth, since they’re only about 4-5 inches. Usually fruit flies, ants, and pinhead crickets.',
    behavior:
      'They are social, active in the evenings and at night, and communicate with soft chirping or clicking sounds.',
    funFact: null,
    breedingNote:
      'Here @ fye.exotics we are focusing on captive bred mourning geckos. Available soon.',
    images: ['/exotics/animal-content/yellow-belly-mourning-gecko.webp'],
  },
  {
    id: 'solomon-island-tree-boa',
    commonName: 'Solomon Island Tree Boa',
    scientificName: 'Candoia bibroni',
    category: 'reptile',
    status: 'In Our Care',
    location:
      'Solomon Islands and other southwestern Pacific islands. Found thriving in trees or on the ground.',
    lifestyle:
      'They are mostly nocturnal and arboreal/semi-arboreal. During the day they tend to stay concealed and inactive -- resting among branches, vegetation, tree hollows, or other protected areas. Once evening and nighttime arrive, they become more active and hunt.',
    diet: 'In the wild, pretty much anything they can fit in their mouth: rodents, birds, lizards, amphibians, even other small snakes.',
    behavior:
      'Arboreal / semi-arboreal, meaning they like to be on the ground and in the treetops.',
    funFact:
      'Female Solomon Island boas give live birth. They are different from your average boa -- some say they favor vipers because of their slender head, except they are harmless and non-venomous.',
    breedingNote:
      'Here @ fye.exotics we are working closely with this snake species -- one of the most difficult snakes to care for in captivity due to mostly being imported or wild caught. Hopefully one day we can launch a successful breeding program.',
    images: ['/exotics/animal-content/solomon-island-tree-boa.webp'],
  },
  {
    id: 'ocellated-skink',
    commonName: 'Ocellated Skink',
    scientificName: 'Chalcides ocellatus',
    category: 'reptile',
    status: 'In Our Care',
    location:
      'Very widespread around North Africa, the Mediterranean, and the Middle East, extending into parts of Asia. They’ve also established introduced populations in parts of the United States, including Florida.',
    lifestyle:
      'They’re semi-fossorial, meaning they spend a lot of time underneath substrate. They can essentially "swim" through loose sand and soil by moving their body side to side.',
    diet: 'Mostly insects and other arthropods -- beetles, crickets, insect larvae, isopods, spiders.',
    behavior:
      'They shift on their mood depending on temperature and the season. Super fast. They are more inclined to hide and burrow.',
    funFact:
      'They give live birth. The term "ocellated" refers to eye-like spots on the reptile, similar to an ocelot cat.',
    breedingNote:
      'Here @ fye.exotics we are caring for this species, hopefully one day we can establish a breeding program.',
    images: ['/exotics/animal-content/ocellated-skink.webp'],
  },
  {
    id: 'green-emerald-tree-skink',
    commonName: 'Green Emerald Tree Skink',
    scientificName: 'Lamprolepis smaragdina',
    category: 'reptile',
    status: 'Breeding Project',
    location:
      'A huge island distribution through parts of Indonesia, the Philippines, New Guinea, the Solomon Islands, Micronesia, and surrounding Pacific islands.',
    lifestyle:
      'Green Emerald Tree Skinks are strongly arboreal and spend most of their time climbing trunks and branches rather than walking around on the ground. They’re also diurnal, so they’re active during the day.',
    diet: 'Although primarily insectivorous, wild emerald skinks have also been documented eating ripe fruit. In captivity they will eat leftover fruit and Pangea diet -- I sometimes give mine mango and banana.',
    behavior:
      'They’re extremely quick climbers and can launch themselves between branches. An open enclosure door with an emerald skink can turn into a chase pretty quickly. One of the most social lizards I’ve ever owned -- they are super curious and always thrive in groups.',
    funFact:
      'Captive bred emeralds can live up to around 12 years with proper care. My favorite skink as well!',
    breedingNote:
      'Here @ fye.exotics we are working closely with this species to produce some captive bred offspring. Hopefully by 2027-early 2028 we have our first hatchlings!',
    images: ['/exotics/animal-content/green-emerald-tree-skink.webp'],
  },
  {
    id: 'papuan-carpet-python',
    commonName: 'Papuan Carpet Python',
    scientificName: 'Morelia spilota harrisoni',
    category: 'reptile',
    status: 'In Our Care',
    location: 'Native to Australia, New Guinea (formerly Papuan), and coastal areas of Northern Australia.',
    lifestyle:
      'Semi-arboreal -- these guys love climbing. They’ll use the ground but are excellent climbers, found resting in sturdy elevated branches and high trees, and will sometimes hide in spaces on the ground or in logs. Like other pythons, they have heat-sensitive pits around the mouth that help them detect warm-bodied prey. Their sense of smell/chemical detection through tongue-flicking is also extremely important.',
    diet: 'Strictly carnivorous, thriving on small mammals, birds, and other reptiles -- pretty much anything they can fit in their mouth when hungry.',
    behavior:
      'They’re generally very alert and visually aware snakes. Compared with something like a ball python, a carpet python will often watch what’s happening outside the enclosure, investigate changes, and actively explore. Babies generally are more snippy and show attitude, but proper handling and husbandry will improve the snake’s behavior. One of my favorite snakes to work with.',
    funFact:
      'If you like carpet pythons but don’t necessarily want the size of a big coastal, Papuans are generally slender, athletic, smaller, and better tempered. These are still constrictor species, so handle with care -- males average 3-5ft at most, females can get bigger, up to 6-8ft.',
    breedingNote:
      'Here @ fye.exotics we are taking our time and effort to care for our carpet python -- we started with one male so far, so hopefully in the future we can start a successful breeding program.',
    images: ['/exotics/animal-content/papuan-carpet-python.webp'],
  },
  {
    id: 'crested-gecko',
    commonName: 'Crested Gecko',
    scientificName: 'Correlophus ciliatus',
    category: 'reptile',
    status: 'In Our Care',
    location:
      'Native to New Caledonia, a tropical island nation in the Southwest Pacific, thriving in humid rainforests. They can live about 10-15 years in captivity.',
    lifestyle:
      'Usually calm, docile, solitary reptiles that are great with proper handling. They sometimes drop their tail if startled or frightened -- unfortunately, crested gecko tails don’t grow back like some other species. Crested geckos are usually nocturnal, so you’ll see more activity at night.',
    diet: 'In captivity they usually thrive on Pangea diet or any other premium fruit/insect mix. In the wild they are known to eat ripe fruit from trees or the forest floor, crickets, cockroaches, and any other small insect of their choice.',
    behavior: null,
    funFact: 'Crested geckos produce a variety of different genes and colorways, like Dalmatian, Lily White, and Axanthic.',
    breedingNote: null,
    images: ['/exotics/animal-content/crested-gecko.webp'],
  },
  {
    id: 'california-red-jumping-spider',
    commonName: 'California Red Jumping Spider',
    scientificName: 'Phidippus adumbratus',
    category: 'arachnid',
    status: 'In Our Care',
    location: 'Native to Western North America, such as Southern California, Baja California, and Mexico.',
    lifestyle:
      'This is a daytime visual hunter, not a spider that builds a traditional prey-catching web. Like other Phidippus, it watches its surroundings with excellent eyesight, stalks prey, and then pounces. Jumping spiders can even plan indirect approaches toward prey and repeatedly stop and reorient toward where they last saw it -- evidence of surprisingly sophisticated spatial memory for such a tiny animal.',
    diet: null,
    behavior:
      'They use silk very differently from orb-weavers. Besides safety lines, they construct little silken retreats/hammocks where they rest, hide, and molt. Females are usually bigger than males and differ in color. I’ve owned and handled a handful of these jumping spiders and I can say they are one of my favorites because they are very observant.',
    funFact: null,
    breedingNote: null,
    images: ['/exotics/animal-content/california-red-jumping-spider.webp'],
  },
  {
    id: 'green-keel-belly-lizard',
    commonName: 'Green Keel-Bellied Lizard',
    scientificName: 'Gastropholis prasina',
    category: 'reptile',
    status: 'In Our Care',
    location: 'Found in coastal areas and lowland forests of East Africa, including Kenya and Tanzania.',
    lifestyle:
      'They are diurnal (active during the day) and strictly arboreal, spending nearly all their time high up in trees, rarely coming down to the forest floor.',
    diet: 'Primarily insectivorous, feeding on various small insects such as crickets, cockroaches, and worms. I’ve even fed mine small minnows, and organic grain-free cat food -- usually the seafood options, in small amounts, as a fatty treat.',
    behavior:
      'They are incredibly fast, active predators that stalk, chase, and leap to catch moving insects. In the wild they are naturally timid and hide quickly under leaves, but in captivity they often become highly curious and inquisitive.',
    funFact: 'The keel lizard is basically a small monitor, and it also has a prehensile tail like a monkey.',
    breedingNote: null,
    images: ['/exotics/animal-content/green-keel-belly-lizard.webp'],
  },
];
