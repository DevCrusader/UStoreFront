import React, { useEffect, useState } from "react";
import PropTypes from "prop-types";
import useFetch from "../hooks/useFetch";

import capitalizeString from "../utils/capitalizeString";
import List from "../utils/List";
import { BACKEND_PATH } from "../Consts";

import "../static/css/userSearchStyles.css";

const UserSearch = ({ onChoose = () => {} }) => {
  const [usersList, setUsersList] = useState(null);
  const [fetchConfig, setFetchConfig] = useState({});
  const { loading, error, data } = useFetch(fetchConfig);

  const [search, setSearch] = useState("");

  useEffect(() => {
    if (data) {
      setUsersList(data);
    }
  }, [data]);

  useEffect(() => {
    setUsersList(null);
  }, [search]);

  useEffect(() => {
    let timeoutId;

    if (search) {
      timeoutId = setTimeout(() => {
        const [lastName, firstName, patronymic] = search
          .split(" ")
          .map((word) => capitalizeString(word));

        const searchParams = new URLSearchParams({
          lastName: lastName ? lastName : "*",
          firstName: firstName ? firstName : "*",
          patronymic: patronymic ? patronymic : "*",
          "per-page": 4,
        });

        setFetchConfig({
          url: `${BACKEND_PATH}/user/search-customers/?${searchParams.toString()}`,
        });
      }, 1500);
    }

    return () => clearTimeout(timeoutId);
  }, [search]);

  return (
    <div className="user-search">
      <input
        type="text"
        value={search}
        onChange={(e) => setSearch(e.target.value)}
        placeholder={"Фамилия Имя Отчество"}
      />

      <img
        className="search-icon"
        src={require("../static/svg/SearchIcon.svg").default}
        alt="Поиск"
      />

      {search ? (
        <div className="after-block">
          {loading ? (
            <div
              style={{ width: "42px", height: "42px" }}
              className="lds-dual-ring"
            ></div>
          ) : error ? (
            <pre style={{ color: "red" }}>
              {JSON.stringify(error, null, 2)}
            </pre>
          ) : Array.isArray(usersList) ? (
            <>
              {usersList.length ? (
                <List
                  listClassName="result"
                  data={usersList}
                  renderItem={(item) => (
                    <>
                      <span
                        className="name"
                        onClick={() => {
                          onChoose(item);
                          setSearch("");
                        }}
                      >
                        {item.name}
                      </span>
                    </>
                  )}
                  renderEmpty={
                    <>Пользователей по данному запросу не найдено.</>
                  }
                />
              ) : (
                <div>
                  Пользователей по данному запросу не найдено.
                </div>
              )}
            </>
          ) : (
            <div
              style={{ width: "42px", height: "42px" }}
              className="lds-dual-ring"
            ></div>
          )}
        </div>
      ) : (
        <></>
      )}
    </div>
  );
};

UserSearch.propTypes = {
  onChoose: PropTypes.func.isRequired,
};

export default UserSearch;
