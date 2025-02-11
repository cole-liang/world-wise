import { useParams } from "react-router-dom";
import styles from "./City.module.css";
import BackButton from "../Button/BackButton";
import { useGeoContext } from "../../store/geo-context";
import { useEffect } from "react";
import { countryCodeToUrl, formatDate } from "../../util/helper";
import Spinner from "../Spinner/Spinner";

function City() {
  const { currentCity, loadCity, isLoading } = useGeoContext();
  const { id } = useParams();

  useEffect(
    function () {
      loadCity(id!);
    },
    [id, loadCity]
  );

  if (isLoading) return <Spinner />;
  if (currentCity === null) return;

  const { cityName, countryCode, date, notes } = currentCity!;

  return (
    <div className={styles.city}>
      <div className={styles.row}>
        <h6>City name</h6>
        <h3>
          <span>
            <img src={countryCodeToUrl(countryCode)}></img>
          </span>
          {cityName}
        </h3>
      </div>

      <div className={styles.row}>
        <h6>You went to {cityName} on</h6>
        <p>{formatDate(date || null)}</p>
      </div>

      {notes && (
        <div className={styles.row}>
          <h6>Your notes</h6>
          <p>{notes}</p>
        </div>
      )}

      <div className={styles.row}>
        <h6>Learn more</h6>
        <a
          href={`https://en.wikipedia.org/wiki/${cityName}`}
          target="_blank"
          rel="noreferrer"
        >
          Check out {cityName} on Wikipedia &rarr;
        </a>
      </div>

      <div>
        <BackButton />
      </div>
    </div>
  );
}

export default City;
