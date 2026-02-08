import { StaticFeedRule } from "./StaticFeedRule";

/**
 * All known NYT RSS feeds organized by category.
 */
export const NYT_FEEDS = [
  // News
  {
    url: "https://rss.nytimes.com/services/xml/rss/nyt/HomePage.xml",
    title: "Home Page",
  },
  {
    url: "https://rss.nytimes.com/services/xml/rss/nyt/World.xml",
    title: "World",
  },
  {
    url: "https://rss.nytimes.com/services/xml/rss/nyt/Africa.xml",
    title: "Africa",
  },
  {
    url: "https://rss.nytimes.com/services/xml/rss/nyt/Americas.xml",
    title: "Americas",
  },
  {
    url: "https://rss.nytimes.com/services/xml/rss/nyt/AsiaPacific.xml",
    title: "Asia Pacific",
  },
  {
    url: "https://rss.nytimes.com/services/xml/rss/nyt/Europe.xml",
    title: "Europe",
  },
  {
    url: "https://rss.nytimes.com/services/xml/rss/nyt/MiddleEast.xml",
    title: "Middle East",
  },
  {
    url: "https://rss.nytimes.com/services/xml/rss/nyt/US.xml",
    title: "U.S.",
  },
  {
    url: "https://rss.nytimes.com/services/xml/rss/nyt/Education.xml",
    title: "Education",
  },
  {
    url: "https://rss.nytimes.com/services/xml/rss/nyt/Politics.xml",
    title: "Politics",
  },
  {
    url: "https://rss.nytimes.com/services/xml/rss/nyt/Upshot.xml",
    title: "The Upshot",
  },
  {
    url: "https://rss.nytimes.com/services/xml/rss/nyt/NYRegion.xml",
    title: "N.Y./Region",
  },
  // Business
  {
    url: "https://rss.nytimes.com/services/xml/rss/nyt/Business.xml",
    title: "Business",
  },
  {
    url: "https://rss.nytimes.com/services/xml/rss/nyt/EnergyEnvironment.xml",
    title: "Energy & Environment",
  },
  {
    url: "https://rss.nytimes.com/services/xml/rss/nyt/SmallBusiness.xml",
    title: "Small Business",
  },
  {
    url: "https://rss.nytimes.com/services/xml/rss/nyt/Economy.xml",
    title: "Economy",
  },
  {
    url: "https://rss.nytimes.com/services/xml/rss/nyt/Dealbook.xml",
    title: "DealBook",
  },
  {
    url: "https://rss.nytimes.com/services/xml/rss/nyt/MediaandAdvertising.xml",
    title: "Media & Advertising",
  },
  {
    url: "https://rss.nytimes.com/services/xml/rss/nyt/YourMoney.xml",
    title: "Your Money",
  },
  // Technology
  {
    url: "https://rss.nytimes.com/services/xml/rss/nyt/Technology.xml",
    title: "Technology",
  },
  {
    url: "https://rss.nytimes.com/services/xml/rss/nyt/PersonalTech.xml",
    title: "Personal Tech",
  },
  // Sports
  {
    url: "https://rss.nytimes.com/services/xml/rss/nyt/Sports.xml",
    title: "Sports",
  },
  {
    url: "https://rss.nytimes.com/services/xml/rss/nyt/Baseball.xml",
    title: "Baseball",
  },
  {
    url: "https://rss.nytimes.com/services/xml/rss/nyt/CollegeBasketball.xml",
    title: "College Basketball",
  },
  {
    url: "https://rss.nytimes.com/services/xml/rss/nyt/CollegeFootball.xml",
    title: "College Football",
  },
  {
    url: "https://rss.nytimes.com/services/xml/rss/nyt/Golf.xml",
    title: "Golf",
  },
  {
    url: "https://rss.nytimes.com/services/xml/rss/nyt/Hockey.xml",
    title: "Hockey",
  },
  {
    url: "https://rss.nytimes.com/services/xml/rss/nyt/ProBasketball.xml",
    title: "Pro-Basketball",
  },
  {
    url: "https://rss.nytimes.com/services/xml/rss/nyt/ProFootball.xml",
    title: "Pro-Football",
  },
  {
    url: "https://rss.nytimes.com/services/xml/rss/nyt/Soccer.xml",
    title: "Soccer",
  },
  {
    url: "https://rss.nytimes.com/services/xml/rss/nyt/Tennis.xml",
    title: "Tennis",
  },
  // Science
  {
    url: "https://rss.nytimes.com/services/xml/rss/nyt/Science.xml",
    title: "Science",
  },
  {
    url: "https://rss.nytimes.com/services/xml/rss/nyt/Climate.xml",
    title: "Climate",
  },
  {
    url: "https://rss.nytimes.com/services/xml/rss/nyt/Space.xml",
    title: "Space & Cosmos",
  },
  // Health
  {
    url: "https://rss.nytimes.com/services/xml/rss/nyt/Health.xml",
    title: "Health",
  },
  {
    url: "https://rss.nytimes.com/services/xml/rss/nyt/Well.xml",
    title: "Well Blog",
  },
  // Weather
  {
    url: "https://rss.nytimes.com/services/xml/rss/nyt/Weather.xml",
    title: "Weather",
  },
  // Arts
  {
    url: "https://rss.nytimes.com/services/xml/rss/nyt/Arts.xml",
    title: "Arts",
  },
  {
    url: "https://rss.nytimes.com/services/xml/rss/nyt/ArtandDesign.xml",
    title: "Art & Design",
  },
  {
    url: "https://rss.nytimes.com/services/xml/rss/nyt/Books/Review.xml",
    title: "Book Review",
  },
  {
    url: "https://rss.nytimes.com/services/xml/rss/nyt/Dance.xml",
    title: "Dance",
  },
  {
    url: "https://rss.nytimes.com/services/xml/rss/nyt/Movies.xml",
    title: "Movies",
  },
  {
    url: "https://rss.nytimes.com/services/xml/rss/nyt/Music.xml",
    title: "Music",
  },
  {
    url: "https://rss.nytimes.com/services/xml/rss/nyt/Television.xml",
    title: "Television",
  },
  {
    url: "https://rss.nytimes.com/services/xml/rss/nyt/Theater.xml",
    title: "Theater",
  },
  // Style
  {
    url: "https://rss.nytimes.com/services/xml/rss/nyt/FashionandStyle.xml",
    title: "Fashion & Style",
  },
  {
    url: "https://rss.nytimes.com/services/xml/rss/nyt/DiningandWine.xml",
    title: "Dining & Wine",
  },
  {
    url: "https://rss.nytimes.com/services/xml/rss/nyt/Weddings.xml",
    title: "Love",
  },
  {
    url: "https://rss.nytimes.com/services/xml/rss/nyt/tmagazine.xml",
    title: "T Magazine",
  },
  // Travel
  {
    url: "https://www.nytimes.com/services/xml/rss/nyt/Travel.xml",
    title: "Travel",
  },
  // Marketplace
  {
    url: "https://rss.nytimes.com/services/xml/rss/nyt/Jobs.xml",
    title: "Jobs",
  },
  {
    url: "https://rss.nytimes.com/services/xml/rss/nyt/RealEstate.xml",
    title: "Real Estate",
  },
  {
    url: "https://rss.nytimes.com/services/xml/rss/nyt/Automobiles.xml",
    title: "Autos",
  },
  // Other
  {
    url: "https://rss.nytimes.com/services/xml/rss/nyt/Lens.xml",
    title: "Lens Blog",
  },
  {
    url: "https://rss.nytimes.com/services/xml/rss/nyt/Obituaries.xml",
    title: "Obituaries",
  },
  {
    url: "https://rss.nytimes.com/services/xml/rss/nyt/recent.xml",
    title: "Times Wire",
  },
  {
    url: "https://rss.nytimes.com/services/xml/rss/nyt/MostEmailed.xml",
    title: "Most E-Mailed",
  },
  {
    url: "https://rss.nytimes.com/services/xml/rss/nyt/MostShared.xml",
    title: "Most Shared",
  },
  {
    url: "https://rss.nytimes.com/services/xml/rss/nyt/MostViewed.xml",
    title: "Most Viewed",
  },
  // Opinion - Columnists
  {
    url: "https://www.nytimes.com/svc/collections/v1/publish/www.nytimes.com/column/charles-m-blow/rss.xml",
    title: "Charles M. Blow",
  },
  {
    url: "https://www.nytimes.com/svc/collections/v1/publish/www.nytimes.com/column/jamelle-bouie/rss.xml",
    title: "Jamelle Bouie",
  },
  {
    url: "https://www.nytimes.com/svc/collections/v1/publish/www.nytimes.com/column/david-brooks/rss.xml",
    title: "David Brooks",
  },
  {
    url: "https://www.nytimes.com/svc/collections/v1/publish/www.nytimes.com/column/frank-bruni/rss.xml",
    title: "Frank Bruni",
  },
  {
    url: "https://www.nytimes.com/svc/collections/v1/publish/www.nytimes.com/column/gail-collins/rss.xml",
    title: "Gail Collins",
  },
  {
    url: "https://www.nytimes.com/svc/collections/v1/publish/www.nytimes.com/column/ross-douthat/rss.xml",
    title: "Ross Douthat",
  },
  {
    url: "https://www.nytimes.com/svc/collections/v1/publish/www.nytimes.com/column/maureen-dowd/rss.xml",
    title: "Maureen Dowd",
  },
  {
    url: "https://www.nytimes.com/svc/collections/v1/publish/www.nytimes.com/column/thomas-l-friedman/rss.xml",
    title: "Thomas L. Friedman",
  },
  {
    url: "https://www.nytimes.com/svc/collections/v1/publish/www.nytimes.com/column/michelle-goldberg/rss.xml",
    title: "Michelle Goldberg",
  },
  {
    url: "https://www.nytimes.com/svc/collections/v1/publish/www.nytimes.com/column/ezra-klein/rss.xml",
    title: "Ezra Klein",
  },
  {
    url: "https://www.nytimes.com/svc/collections/v1/publish/www.nytimes.com/column/nicholas-kristof/rss.xml",
    title: "Nicholas D. Kristof",
  },
  {
    url: "https://www.nytimes.com/svc/collections/v1/publish/www.nytimes.com/column/paul-krugman/rss.xml",
    title: "Paul Krugman",
  },
  {
    url: "https://www.nytimes.com/svc/collections/v1/publish/www.nytimes.com/column/farhad-manjoo/rss.xml",
    title: "Farhad Manjoo",
  },
  {
    url: "https://www.nytimes.com/svc/collections/v1/publish/www.nytimes.com/column/bret-stephens/rss.xml",
    title: "Bret Stephens",
  },
  // Opinion - Sunday Review
  {
    url: "https://rss.nytimes.com/services/xml/rss/nyt/sunday-review.xml",
    title: "Sunday Opinion",
  },
] as const;

export const NYTimesRule = new StaticFeedRule(
  "NYTimes",
  ["nytimes.com", "www.nytimes.com"],
  NYT_FEEDS,
);
