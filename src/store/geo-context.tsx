import {
  type ReactNode,
  createContext,
  useReducer,
  useContext,
  useEffect,
  useCallback,
} from "react";
import { get, post, remove } from "../util/html";

const BASE_URL = "https://api-for-world-wise.onrender.com";

export type City = {
  cityName: string;
  country: string;
  countryCode: string;
  date: string;
  notes: string;
  position: {
    lat: number;
    lng: number;
  };
  id: string;
};

type GeoState = {
  cities: City[];
  isLoading: boolean;
  currentCity: City | null;
};

type GeoContextValue = GeoState & {
  createCity: (city: City) => void;
  loadCity: (id: string) => void;
  deleteCity: (id: string) => void;
};

const GeoContext = createContext<GeoContextValue | null>(null);

export function useGeoContext() {
  const geoCtx = useContext(GeoContext);
  if (geoCtx === null) throw new Error("geoContext is null!");
  return geoCtx;
}

type CitiesLoadAction = {
  type: "cities/load";
  payload: City[];
};
type LoadingAction = {
  type: "loading";
};
type CityCreateAction = {
  type: "city/create";
  payload: City;
};
type CityLoadAction = {
  type: "city/load";
  payload: City;
};
type CityDeleteAction = {
  type: "city/delete";
  payload: string;
};
type RejectAction = {
  type: "reject";
  payload: string;
};

type GeoAction =
  | CitiesLoadAction
  | LoadingAction
  | CityCreateAction
  | CityLoadAction
  | CityDeleteAction
  | RejectAction;

function geoReducer(state: GeoState, action: GeoAction) {
  switch (action.type) {
    case "loading":
      return { ...state, isLoading: true };
    case "cities/load":
      return { ...state, cities: action.payload, isLoading: false };
    case "city/create":
      return {
        ...state,
        cities: [...state.cities, action.payload],
        isLoading: false,
        currentCity: action.payload,
      };
    case "city/load":
      return { ...state, currentCity: action.payload, isLoading: false };
    case "city/delete":
      return {
        ...state,
        cities: state.cities.filter((city) => city.id !== action.payload),
        isLoading: false,
        currentCity: null,
      };
    case "reject":
      return { ...state, error: action.payload, isLoading: false };
    default:
      throw new Error("Unknown Action Error");
  }
}

const initialState: GeoState = {
  cities: [],
  isLoading: false,
  currentCity: null,
};

type GeoContextProviderProps = {
  children: ReactNode;
};

export default function GeoContextProvider({
  children,
}: GeoContextProviderProps) {
  const [geoState, dispatch] = useReducer(geoReducer, initialState);

  useEffect(function () {
    async function loadCities() {
      try {
        dispatch({ type: "loading" });
        const cities = (await get(`${BASE_URL}/cities`)) as City[];
        dispatch({ type: "cities/load", payload: cities });
      } catch (error) {
        if (error instanceof Error)
          dispatch({ type: "reject", payload: error.message });
      }
    }
    loadCities();
  }, []);

  const ctx: GeoContextValue = {
    ...geoState,
    createCity: async (city) => {
      try {
        dispatch({ type: "loading" });
        await post(`${BASE_URL}/cities`, city);
        dispatch({
          type: "city/create",
          payload: city,
        });
      } catch (error) {
        if (error instanceof Error)
          dispatch({ type: "reject", payload: error.message });
      }
    },
    loadCity: useCallback(
      async (id) => {
        if (id === geoState.currentCity?.id) return;
        try {
          dispatch({ type: "loading" });
          const city = (await get(`${BASE_URL}/cities/${id}`)) as City;
          dispatch({ type: "city/load", payload: city });
        } catch (error) {
          if (error instanceof Error)
            dispatch({ type: "reject", payload: error.message });
        }
      },
      [geoState.currentCity?.id]
    ),
    deleteCity: async (id) => {
      try {
        dispatch({ type: "loading" });
        await remove(`${BASE_URL}/cities/${id}`);
        dispatch({ type: "city/delete", payload: id });
      } catch (error) {
        if (error instanceof Error)
          dispatch({ type: "reject", payload: error.message });
      }
    },
  };

  return <GeoContext.Provider value={ctx}>{children}</GeoContext.Provider>;
}
