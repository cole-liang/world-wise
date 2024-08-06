// "https://api.bigdatacloud.net/data/reverse-geocode-client?latitude=0&longitude=0"

import { type FormEvent, useEffect, useState } from "react";

import styles from "./Form.module.css";
import Button from "../Button/Button";
import BackButton from "../Button/BackButton";
import { useUrlLocation } from "../../hooks/useUrlLocation";
import { get } from "../../util/html";
import Spinner from "../Spinner/Spinner";
import Message from "../Message/Message";
import DatePicker from "react-datepicker";
import "react-datepicker/dist/react-datepicker.css";
import { useGeoContext, type City } from "../../store/geo-context";
import { countryCodeToUrl } from "../../util/helper";
import { useNavigate } from "react-router-dom";

const BASE_URL = "https://api.bigdatacloud.net/data/reverse-geocode-client";

type GeoCityData = {
  city: string;
  locality: string;
  countryCode: string;
  countryName: string;
};

function Form() {
  const [cityName, setCityName] = useState<string>("");
  const [country, setCountry] = useState<string>("");
  const [date, setDate] = useState<Date>(new Date());
  const [notes, setNotes] = useState<string>("");
  const [countryCode, setCountryCode] = useState<string>("");
  const [error, setError] = useState<string>("");
  const [isLoadingGeoDetail, setIsLoadingGeoDetail] = useState<boolean>(false);
  const { mapLat: lat, mapLng: lng } = useUrlLocation();
  const { createCity, isLoading } = useGeoContext();
  const navigate = useNavigate();

  useEffect(
    function () {
      if (!lat || !lng) return;
      async function fetchCityData() {
        try {
          setIsLoadingGeoDetail(true);
          setError("");
          const city = (await get(
            `${BASE_URL}?latitude=${lat}&longitude=${lng}`
          )) as GeoCityData;
          if (!city.countryCode)
            throw new Error(
              "That doesn't seem to be a city. Click somewhere else"
            );
          setCityName(city.city || city.locality || "");
          setCountry(city.countryName);
          setCountryCode(city.countryCode.toLowerCase());
        } catch (error) {
          if (error instanceof Error) setError(error.message);
        } finally {
          setIsLoadingGeoDetail(false);
        }
      }
      fetchCityData();
    },
    [lat, lng]
  );

  async function handleSubmit(e: FormEvent) {
    e.preventDefault();
    if (!cityName) {
      setError("City name should not be blank");
      return;
    }
    if (!lat || !lng) {
      setError("Please do not modify URL");
      return;
    }
    const newCity: City = {
      cityName: cityName,
      country: country,
      countryCode: countryCode,
      date: JSON.stringify(date).slice(1, -1),
      notes: notes,
      position: {
        lat: lat,
        lng: lng,
      },
      id: crypto.randomUUID(),
    };
    await createCity(newCity);
    navigate("/app/cities");
  }

  if (!lat || !lng)
    return <Message message="Start by clicking any places on the map" />;
  if (isLoadingGeoDetail) return <Spinner />;
  if (error) return <Message message={error} />;

  return (
    <form className={`${styles.form} ${isLoading ? "loading" : ""}`}>
      <div className={styles.row}>
        <label htmlFor="cityName">City name</label>
        <input
          id="cityName"
          onChange={(e) => setCityName(e.target.value)}
          value={cityName}
        />
        <span className={styles.flag}>
          <img src={countryCodeToUrl(countryCode)} />
        </span>
      </div>

      <div className={styles.row}>
        <label htmlFor="date">When did you go to {cityName}?</label>
        <DatePicker
          selected={date}
          onChange={(date) => setDate(date!)}
          dateFormat="dd/MM/yyyy"
        ></DatePicker>
      </div>

      <div className={styles.row}>
        <label htmlFor="notes">Notes about your trip to {cityName}</label>
        <textarea
          id="notes"
          onChange={(e) => setNotes(e.target.value)}
          value={notes}
        />
      </div>

      <div className={styles.buttons}>
        <Button onClick={handleSubmit} type="primary">
          Add
        </Button>
        <BackButton />
      </div>
    </form>
  );
}

export default Form;
