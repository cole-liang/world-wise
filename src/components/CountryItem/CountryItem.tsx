import { countryCodeToUrl } from "../../util/helper";
import styles from "./CountryItem.module.css";

export type Country = {
  countryCode: string;
  countryName: string;
};

type CountryItemProps = {
  country: Country;
};

function CountryItem({ country }: CountryItemProps) {
  const { countryCode, countryName } = country;
  return (
    <li className={styles.countryItem}>
      <span>
        <img
          className={styles.emoji}
          src={countryCodeToUrl(countryCode)}
          alt={`flag of ${country}`}
        />
      </span>
      <span>{countryName}</span>
    </li>
  );
}

export default CountryItem;
