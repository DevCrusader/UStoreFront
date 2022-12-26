import React from "react";
import { Link } from "react-router-dom";
import PersonalPart from "../../components/PersonalPart";

import "../../static/css/presonalPageStyles.css";

const PersonalPage = () => {
  return (
    <div className="personal-page">
      <PersonalPart />
      <PromoPart />
    </div>
  );
};

export default PersonalPage;

const PromoPart = () => {
  return (
    <div className="promo-part">
      <div className="header container"></div>

      <div className="banner curator container"></div>
      <div className="banner social container"></div>
      <div className="banner event container"></div>
      <div className="banner good container"></div>
      <div className="banner flag container"></div>
      <div className="rule-link">
        <Link to="/ucoin-rule">Посмотреть все правила</Link>
      </div>
    </div>
  );
};
