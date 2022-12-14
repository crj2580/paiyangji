import React, { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import axios from "axios";
import apiPaths from "@api";
import SensingDevice from "src/assets/js/sensing-device-sdk-quorra-1.0";
import "@css/page_four.scss";

let mSensingDevice = SensingDevice.getInstance();
let SecurityKey =
  mSensingDevice.getSecurityKey() || "f57b83f26c83419a91b88ce94ac2ab65";
let actionDataByIdTimer;


export default function End() {
  const [qrCode, setQrCode] = useState(null);
  const [showModal, setShowModal] = useState(false);
  const [modalInfo, setModalInfo] = useState("");
  const navigate = useNavigate();
  console.log(1111);

  const goHome = () => {
    navigate("/");
  };

  const doLotteryAwardByAction = (actionId) => {
    axios({
      method: "post",
      url: apiPaths.doLotteryAwardByAction,
      contentType: "application/json; charset=utf-8",
      data: JSON.stringify({
        "isNeedSendNotify": false,
        "score": 0,
        "actionId": actionId,
        "securityKey":SecurityKey,
      })
    }).then(res=>{
      const result = res.data.result;
      console.log(result);
    }).catch(err=>{
      console.log(err);
    })
  };

  const actionDataById = (actionId) => {
    //发送actionId查询是否扫码
    axios({
      method: "post",
      url: apiPaths.actionDataById,
      params: {
        actionId: actionId,
      },
    })
      .then((res) => {
        const result = res.data.result;
        // console.log("actionDataById ----------------------", result);
        if (!result.snsUserInfo) {
          // actionDataByIdTimer = setTimeout(actionDataById(actionId),10020);
          console.log("未扫描", actionId);
          return;
        } else {
          console.log("已扫描");
          //请求扫码状态，决定能否发货
          axios
            .get(apiPaths.getAwardsByUserAndAction, {
              params: {
                OpenId: result.openId,
                actionId: actionId,
                QrType: "AfterGame",
                SecurityKey,
              },
            })
            .then((getRes) => {
              let getResult = getRes.data.result;
              if (getResult.canNextAward) {
                doLotteryAwardByAction(actionId);
              } else {
                setShowModal(true);
                setModalInfo("每天仅可参与一次，请把机会留给其他人");
                setTimeout(() => {
                  navigate("/");
                }, 3000);
              }
            });
        }
      })
      .catch((err) => {
        console.log(err);
      });
  };

  useEffect(() => {
    axios({
      method: "post",
      url: apiPaths.postPlayerData4ActionQrcode,
      params: {
        QrType: "AfterGame",
        SecurityKey: SecurityKey,
        IsSendWeChatMsg: false,
        SnsType: "WeChat",
        FromType: "mobile",
      },
    })
      .then(async (res) => {
        const result = res.data.result;
        setQrCode(result.qrCodeImage);
        actionDataById(result.actionId);
      })
      .catch((err) => {
        throw err;
      });
  }, []);

  return (
    <div id="pagefour">
      <img className="logo" src={require("../../static/logo.png")} alt="logo" />
      <img
        className="section"
        src={require("../../static/pg4/pg4-section.png")}
        alt="title"
      />
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
      <div className="time-wrapper">23s</div>
      <div className="qr-wrapper">
        <img className="qr-code" src={qrCode ? qrCode : ""} alt="qr" />
      </div>
      <img
        src={require("../../static/pg4/pg-bottom.png")}
        alt="pr-text"
        className="qr-text"
      />
    </div>
  );
}
