import React, { useEffect, useRef, useState } from "react";
import { TOKEN_LIFE_TIME } from "../Consts";

import "../static/css/testStyles.css";

const Test = () => {
  const [error, setError] = useState(null);
  const [tokens, setTokens] = useState(null);
  const [updated, setUpdated] = useState(false);

  const refreshing = useRef(false);

  const refreshImitation = () => {
    if (updated) {
      console.error("Token already updated");
      return;
    }

    console.log("Start refreshing ....Some refreshing checks.");
    refreshing.current = true;

    setTimeout(() => {
      setTokens({ access: "sdasdasd", refresh: "asdasdasd" });
      console.log("Time is out.");
    }, 1500);
  };

  useEffect(() => {
    console.log("Set_Error");

    if (error) {
      console.log("Refreshing", refreshing.current);
      if (!refreshing.current) refreshImitation();
    }
  }, [error]);

  useEffect(() => {
    if (tokens && tokens.access && tokens.refresh) {
      console.log("Tokens_Refreshing:", refreshing.current);
      console.log("Tokens setted");

      refreshing.current = false;
      setUpdated(true);
    } else {
      console.error("Invalid tokens", tokens);
    }
  }, [tokens]);

  useEffect(() => {
    let timeoutId;

    console.log("Updated change.", updated);

    if (updated) {
      timeoutId = setTimeout(
        () => setUpdated(false),
        TOKEN_LIFE_TIME * 1000
      );
    }

    return () => {
      if (timeoutId) {
        clearTimeout(timeoutId);
      }
    };
  }, [updated]);

  return (
    <div className="container">
      <div>Test</div>

      <button
        onClick={() => setError({ status: 401, text: "!312edadw" })}
      >
        Click to set Error
      </button>
      <button
        onClick={() => setError({ status: 401, text: "!312edadw" })}
      >
        Click to set Error
      </button>

      <pre>{JSON.stringify(tokens, null, 2)}</pre>
    </div>
  );
};

export default Test;
