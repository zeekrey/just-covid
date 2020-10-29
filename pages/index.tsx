import React from "react";
import styled from "styled-components";

const Title = styled.h1`
  color: red;
  font-size: 50px;
`;

const Home = () => {
  React.useEffect(() => {
    fetch(
      "https://services7.arcgis.com/mOBPykOjAyBO2ZKk/arcgis/rest/services/RKI_Landkreisdaten/FeatureServer/0/query?where=1%3D1&outFields=GEN,BEZ,EWZ,KFL,death_rate,cases,deaths,cases_per_100k,cases_per_population,BL,BL_ID,county,last_update,cases7_per_100k,recovered,EWZ_BL,cases7_bl_per_100k&returnGeometry=false&outSR=4326&f=json"
    )
      .then((res) => res.json())
      .then((data) => console.log(data));
  }, []);

  return <Title>My page</Title>;
};

export default Home;
