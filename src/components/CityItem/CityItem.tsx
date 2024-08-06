import { Link } from "react-router-dom";
import { useGeoContext, type City } from "../../store/geo-context";
import { countryCodeToUrl, formatDate } from "../../util/helper";
import styles from "./CityItem.module.css";
import { type FormEvent } from "react";
import Spinner from "../Spinner/Spinner";

type CityItemProps = {
  city: City;
};

function CityItem({ city }: CityItemProps) {
  const { cityName, country, countryCode, date, id, position } = city;
  const { currentCity, deleteCity, isLoading } = useGeoContext();

  async function handleDelete(e: FormEvent) {
    e.preventDefault();
    await deleteCity(id);
  }

  if (isLoading) return <Spinner />;

  return (
    <li>
      <Link
        className={`${styles.cityItem} ${
          currentCity?.id === id ? styles["cityItem--active"] : ""
        }`}
        to={`${id}?lat=${position.lat}&lng=${position.lng}`}
      >
        <span>
          <img
            className={styles.emoji}
            src={countryCodeToUrl(countryCode)}
            alt={`flag of ${country}`}
          />
        </span>
        <h3 className={styles.name}>{cityName}</h3>
        <time className={styles.date}>{formatDate(date, false)}</time>
        <button className={styles.deleteBtn} onClick={handleDelete}>
          &times;
        </button>
      </Link>
    </li>
  );
}

export default CityItem;
