import React,{useEffect,useState} from "react";
import {useNavigate} from "react-router-dom";
import axios from "axios";
import apiPaths from "@api";
import SensingDevice from "src/assets/js/sensing-device-sdk-quorra-1.0";
import "@css/page_one.scss"

let mSensingDevice = SensingDevice.getInstance();
let SecurityKey =
  mSensingDevice.getSecurityKey() || "f57b83f26c83419a91b88ce94ac2ab65";

export default function Home(){

  const [qrCode,setQrCode] = useState(null);

  const navigate = useNavigate();

  const goGame = () => {
    navigate('/game')
  }

  const goPasswords = () => {
    navigate('/passwords')
  }

  useEffect(()=>{
    axios({
      method : 'post',
      url : apiPaths.postPlayerData4ActionQrcode,
      params : {
        QrType: 'BeforeGame',
        SecurityKey:SecurityKey,
        IsSendWeChatMsg: false,
        SnsType: 'WeChat',
        FromType: 'mobile'
      }
    }).then(res=>{
      console.log(res);
      setQrCode(res.data.result.qrCodeImage)
    }).catch(err=>{
      throw err
    })
  },[])

  return(
    <div id="pageone">
      <img className="qr-code" src={qrCode?qrCode:''} alt="qr"/>
      <img className="qr-text" src={require('../../static/pg1/qr-text.png')} alt="qr-text"/>
      <img className="logo" src={require('../../static/logo.png')} alt="logo"/>
      <img className="title" src={require('../../static/pg1/pg1-top-title.png')} alt="title"/>
      <img className="bottom" src={require('../../static/pg1/pg1-bottom.png')} alt="bottom"/>
      <img className="bottom-text" src={require('../../static/text.png')} alt="text"/>
      <img onClick={goGame} className="bottom-btn-left" src={require('../../static/pg1/pg1-bottom-left-btn.png')} alt="btn" />
      <img onClick={goPasswords} className="bottom-btn-right" src={require('../../static/pg1/pg1-bottom-right-btn.png')} alt="btn" />
    </div>
  );
}