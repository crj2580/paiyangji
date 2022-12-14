import React, { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import axios from "axios";
import apiPaths from "@api";
import SensingDevice from "src/assets/js/sensing-device-sdk-quorra-1.0";
import "@css/page_two.scss";

let mSensingDevice = SensingDevice.getInstance();
let SecurityKey =
  mSensingDevice.getSecurityKey() || "f57b83f26c83419a91b88ce94ac2ab65";
let subKey = mSensingDevice.getSubKey() || "cef6a90331f14ef4b74060b692548cfd";

export default function Passwords() {
  const itemsArray = [
    { id: 1 },
    { id: 2 },
    { id: 3 },
    { id: 4 },
    { id: 5 },
    { id: 6 },
    { id: 7 },
    { id: 8 },
    { id: 9 },
    { id: "首页" },
    { id: 0 },
    { id: "清除" },
  ];

  const [passwordList, setPasswordList] = useState([]);
  const [showModal, setShowModal] = useState(false);

  const navigate = useNavigate();

  const goHome = () => {
    navigate("/");
  };

  const inputCode = (id) => {
    if (id === "首页") navigate("/");
    if (id === "清除") {
      if (passwordList.length > 0) {
        passwordList.pop();
        setPasswordList([...passwordList]);
        return;
      }
      return;
    }
    setPasswordList([...passwordList, id]);
  };

  useEffect(() => {
    if (passwordList.length === 6) {
      axios
        .get(apiPaths.useTicketByTicketNo, {
          params: {
            ticketNo: passwordList.join(""),
            securityKey: SecurityKey,
            subKey: subKey,
          },
        })
        .then((res) => {
          setPasswordList([]);
          setShowModal(true);
          setTimeout(()=>{
            setShowModal(false);
          },2000)
          console.log(res);
        })
        .catch((err) => {
          setPasswordList([]);
          setShowModal(true);
          setTimeout(()=>{
            setShowModal(false);
          },2000);
          throw err;
        });
    }
  }, [passwordList]);

  return (
    <div id="pagetwo">
      <img className="logo" src={require("../../static/logo.png")} alt="logo" />
      <img
        className="section"
        src={require("../../static/pg2/pg2-section.png")}
        alt="title"
      />
      <div className="password-border">
        <div className="password-text">
          {passwordList.length > 0 ? passwordList : "请输入您的兑换码"}
        </div>
      </div>
      <div className="password-items-wrapper">
        {itemsArray.map((item) => {
          return (
            <div
              className="password-item"
              onClick={() => inputCode(item.id)}
              key={item.id}
            >
              <div className="password-item-text">{item.id}</div>
            </div>
          );
        })}
      </div>
      <img
        onClick={goHome}
        className="home-btn"
        src={require("../../static/btn.png")}
        alt="btn"
      />
      <img
        className="bottom-text"
        src={require("../../static/text-2.png")}
        alt="text"
      />
      {showModal ? (
        <>
          <div className="modal">
            aaa
          </div>
        </>
      ) : (
        ""
      )}
    </div>
  );
}
