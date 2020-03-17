import { genres } from "./filters";

export const getAmountsToPay = cart => {
  const subTotal = cart.reduce(
    (sum, item) => sum + item.addedToCart * item.book.price,
    0
  );
  const tax = subTotal * 0.08;
  const shipping = 10;
  const total = subTotal + tax + shipping;
  return { subTotal, tax, shipping, total };
};

export const truncateLink = (link, length) => {
  if (link.length <= length) {
    return link;
  }
  return link.slice(0, length) + "...";
};

export const truncateText = (text, length) => {
  if (text.length <= length) {
    return text;
  }
  const prevSpaceIndex = text.lastIndexOf(" ", length);
  return text.slice(0, prevSpaceIndex) + "...";
};

export const getCurrencyString = amount =>
  amount.toLocaleString("en-CA", {
    style: "currency",
    currency: "CAD"
  });

export const filter = (books, filters) => {
  const {
    keyword,
    priceLessThan10,
    priceFrom10To20,
    priceMoreThan20,
    genreFiction,
    genreNonfiction,
    Shueisha,
    SpringerNature,
    HoughtonMifflinHarcourt,
    PenguinRandomHouse,
    GrupoSantillana,
    Others
  } = filters;
  return books.filter(book => {
    const byKeyword =
      includesIgnoreCase(book.title, keyword) ||
      matchAuthors(book.authors, keyword) ||
      book.isbn.includes(keyword);
    const byPrice = priceLessThan10 || priceFrom10To20 || priceMoreThan20;
    const byPriceLessThan10 = priceLessThan10 ? book.price < 10 : false;
    const byPriceFrom10To20 = priceFrom10To20
      ? book.price >= 10 && book.price <= 20
      : false;
    const byPriceMoreThan20 = priceMoreThan20 ? book.price > 20 : false;
    const byGenre = genreFiction || genreNonfiction;
    const byGenreFiction = genreFiction
      ? book.genres.some(genre => genres.fiction.includes(genre))
      : false;
    const byGenreNonfiction = genreNonfiction
      ? book.genres.some(genre => genres.nonfiction.includes(genre))
      : false;
    const byPublisher =
      Shueisha ||
      SpringerNature ||
      HoughtonMifflinHarcourt ||
      PenguinRandomHouse ||
      GrupoSantillana ||
      Others;
    const byShueisha = Shueisha ? book.publisher === "Shueisha" : false;
    const bySpringerNature = SpringerNature
      ? book.publisher === "Springer Nature"
      : false;
    const byHoughtonMifflinHarcourt = HoughtonMifflinHarcourt
      ? book.publisher === "Houghton Mifflin Harcourt"
      : false;
    const byPenguinRandomHouse = PenguinRandomHouse
      ? book.publisher === "Penguin Random House"
      : false;
    const byGrupoSantillana = GrupoSantillana
      ? book.publisher === "Grupo Santillana"
      : false;
    const byOthers = Others
      ? ![
          "Shueisha",
          "Springer Nature",
          "Houghton Mifflin Harcourt",
          "Penguin Random House",
          "Grupo Santillana"
        ].includes(book.publisher)
      : false;
    return (
      byKeyword &&
      (!byPrice ||
        byPriceLessThan10 ||
        byPriceFrom10To20 ||
        byPriceMoreThan20) &&
      (!byGenre || byGenreFiction || byGenreNonfiction) &&
      (!byPublisher ||
        byShueisha ||
        bySpringerNature ||
        byHoughtonMifflinHarcourt ||
        byPenguinRandomHouse ||
        byGrupoSantillana ||
        byOthers)
    );
  });
};

const matchAuthors = (authors, keyword) =>
  authors.some(author => includesIgnoreCase(author, keyword));

const includesIgnoreCase = (string, keyword) =>
  string.toLowerCase().includes(keyword.toLowerCase());
