import { type City, useGeoContext } from "../../store/geo-context";
import CountryItem, { type Country } from "../CountryItem/CountryItem";
import styles from "./CountryList.module.css";
import Message from "../Message/Message";
import Spinner from "../Spinner/Spinner";

function CountryList() {
  const { cities, isLoading } = useGeoContext();

  if (isLoading) return <Spinner />;

  if (!cities.length)
    return (
      <Message message="Add your first city by clicking a city on the map" />
    );

  const countries: Country[] = cities.reduce((arr: Country[], curr: City) => {
    if (!arr.map((el) => el.countryName).includes(curr.country))
      return [
        ...arr,
        { countryName: curr.country, countryCode: curr.countryCode },
      ];
    else return arr;
  }, []);

  return (
    <ul className={styles.countryList}>
      {countries.map((country) => (
        <CountryItem country={country} key={country.countryCode} />
      ))}
    </ul>
  );
}

export default CountryList;
