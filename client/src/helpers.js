import { genres } from "./filters";

export const transform = user => ({
  id: user.u_id,
  firstName: user.first_name,
  lastName: user.last_name,
  email: user.email,
  creditCard: user.card_number,
  expiryDate: user.expiry_date,
  cvv: user.cvv,
  holderName: user.holder_name,
  billingAddress: user.billing_address
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
    const byPriceLessThan10 = priceLessThan10 ? book.price < 10 : true;
    const byPriceFrom10To20 = priceFrom10To20
      ? book.price >= 10 && book.price <= 20
      : true;
    const byPriceMoreThan20 = priceMoreThan20 ? book.price > 20 : true;
    const byGenreFiction = genreFiction
      ? book.genres.some(genre => genres.fiction.includes(genre))
      : true;
    const byGenreNonfiction = genreNonfiction
      ? book.genres.some(genre => genres.nonfiction.includes(genre))
      : true;
    const byShueisha = Shueisha ? book.publisher === "Shueisha" : true;
    const bySpringerNature = SpringerNature
      ? book.publisher === "SpringerNature"
      : true;
    const byHoughtonMifflinHarcourt = HoughtonMifflinHarcourt
      ? book.publisher === "HoughtonMifflinHarcourt"
      : true;
    const byPenguinRandomHouse = PenguinRandomHouse
      ? book.publisher === "PenguinRandomHouse"
      : true;
    const byGrupoSantillana = GrupoSantillana
      ? book.publisher === "GrupoSantillana"
      : true;
    const byOthers = Others
      ? ![
          "Shueisha",
          "SpringerNature",
          "HoughtonMifflinHarcourt",
          "PenguinRandomHouse",
          "GrupoSantillana"
        ].includes(book.publisher)
      : true;
    return (
      byKeyword &&
      byPriceLessThan10 &&
      byPriceFrom10To20 &&
      byPriceMoreThan20 &&
      byGenreFiction &&
      byGenreNonfiction &&
      byShueisha &&
      bySpringerNature &&
      byHoughtonMifflinHarcourt &&
      byPenguinRandomHouse &&
      byGrupoSantillana &&
      byOthers
    );
  });
};

const matchAuthors = (authors, keyword) =>
  authors.some(author => includesIgnoreCase(author, keyword));

const includesIgnoreCase = (string, keyword) =>
  string.toLowerCase().includes(keyword.toLowerCase());
