import { lazy, Suspense } from "react";
import { BrowserRouter, Navigate, Route, Routes } from "react-router-dom";
import Form from "./components/Form/Form.tsx";

const Homepage = lazy(() => import("./pages/Homepage/Homepage.tsx"));
const PageNotFound = lazy(
  () => import("./pages/PageNotFound/PageNotFound.tsx")
);
const Product = lazy(() => import("./pages/Product/Product.tsx"));
const Pricing = lazy(() => import("./pages/Pricing/Pricing.tsx"));
const Login = lazy(() => import("./pages/Login/Login.tsx"));
const AppLayout = lazy(() => import("./pages/AppLayout/AppLayout.tsx"));

import CityList from "./components/CityList/CityList.tsx";
import CountryList from "./components/CountryList/CountryList.tsx";
import City from "./components/City/City.tsx";

import GeoContextProvider from "./store/geo-context.tsx";
import AuthContextProvider from "./store/auth-context.tsx";
import ProtectedRoute from "./pages/ProtectedRoute.tsx";
import SpinnerFullPage from "./components/SpinnerFullPage/SpinnerFullPage.tsx";

function App() {
  return (
    <GeoContextProvider>
      <AuthContextProvider>
        <BrowserRouter>
          <Suspense fallback={<SpinnerFullPage />}>
            <Routes>
              <Route index element={<Homepage></Homepage>} />
              <Route path="pricing" element={<Pricing></Pricing>} />
              <Route path="product" element={<Product></Product>} />
              <Route path="login" element={<Login></Login>} />
              <Route
                path="app"
                element={
                  <ProtectedRoute>
                    <AppLayout />
                  </ProtectedRoute>
                }
              >
                <Route index element={<Navigate replace to="cities" />}></Route>
                <Route path="form" element={<Form />} />
                <Route path="cities" element={<CityList />}></Route>
                <Route path="cities/:id" element={<City />}></Route>
                <Route path="countries" element={<CountryList />}></Route>
              </Route>
              <Route path="*" element={<PageNotFound></PageNotFound>} />
            </Routes>
          </Suspense>
        </BrowserRouter>
      </AuthContextProvider>
    </GeoContextProvider>
  );
}

export default App;
