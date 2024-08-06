import { useGeoContext } from "../../store/geo-context";
import CityItem from "../CityItem/CityItem";
import styles from "./CityList.module.css";
import Message from "../Message/Message";
import Spinner from "../Spinner/Spinner";

function CityList() {
  const { cities, isLoading } = useGeoContext();

  if (isLoading) return <Spinner />;

  if (!cities.length)
    return (
      <Message message="Add your first city by clicking a city on the map" />
    );

  return (
    <ul className={styles.cityList}>
      {cities.map((city) => (
        <CityItem city={city} key={city.id} />
      ))}
    </ul>
  );
}

export default CityList;
