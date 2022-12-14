import React, { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import axios from "axios";
import apiPaths from "@api";
import SensingDevice from "src/assets/js/sensing-device-sdk-quorra-1.0";
import "@css/page_three.scss";

let mSensingDevice = SensingDevice.getInstance();
let subKey = mSensingDevice.getSubKey() || "cef6a90331f14ef4b74060b692548cfd";

export default function Game() {
  //随机选择的5个问题
  const [realQuestionsList, setRealQuestionsList] = useState(null);
  //当前是第几问的索引
  const [currQuestionIndex, setCurrQuestionIndex] = useState(0);
  //做错题
  const [isWrong, setIsWrong] = useState(false);
  //显示重新做题和继续做题
  const [showChoices, setShowChoices] = useState(false);
  //选择继续做题，结束时
  const [showOver, setShowOver] = useState(false);
  const navigate = useNavigate();
  const goHome = () => {
    navigate("/");
  };

  const getQuestion = async () => {
    //获取问题
    const res = await axios({
      method: "get",
      url: apiPaths.getPapersByTags,
      params: {
        Tags: "答题",
        Subkey: subKey,
      },
    });
    const questions = res.data.result.items[0].questions;
    //根据UI，限制问题与答案的字数
    const questionsList = questions.filter((question) => {
      return (
        question.title.length <= 24 &&
        question.questionItems.length === 4 &&
        question.questionItems.every((answer) => {
          return answer.content.length <= 6;
        })
      );
    });
    //随机获取5道问题
    const realQuestionList = questionsList
      .sort(() => {
        return Math.random() - 0.5;
      })
      .slice(0, 5)
      .map((question) => {
        return {
          id: question.id,
          title: question.title,
          hasSelected: false,
          questionItems: question.questionItems.map((answer) => {
            return {
              content: answer.content,
              isAnswer: answer.isAnswer,
              hasSelected: false,
            };
          }),
        };
      });
    setRealQuestionsList([...realQuestionList]);
  };

  useEffect(() => {
    getQuestion();
  }, []);

  //验证答案是否正确
  const checkAnswer = async (e) => {
    const index = e.target.dataset.itemindex;
    //将该题目的设置为已做
    realQuestionsList[currQuestionIndex].hasSelected = true;
    //将选择的答案设置为已选
    realQuestionsList[currQuestionIndex].questionItems[
      index
    ].hasSelected = true;
    const rightIndex = realQuestionsList[currQuestionIndex].questionItems.findIndex(item=>{
      return item.isAnswer
    });
    realQuestionsList[currQuestionIndex].questionItems[
      rightIndex
    ].hasSelected = true;
    setRealQuestionsList([...realQuestionsList]);
    //第一次错题
    if (
      !isWrong &&
      !realQuestionsList[currQuestionIndex].questionItems[index].isAnswer
    ) {
      setIsWrong(true);
      await setTimeout(() => {
        setShowChoices(true);
      }, 1000);
      return;
    }
    setTimeout(() => {
      if (currQuestionIndex === 4) {
        //继续做题状态结束
        if (isWrong) {
          setShowOver(true);
          return;
        }
        //正常结束
        navigate("/end");
        return;
      }
      setCurrQuestionIndex(currQuestionIndex + 1);
    }, 1000);
  };

  //选择继续做题
  const handleContinue = () => {
    setShowChoices(false);
    if(currQuestionIndex === 4){
      setShowOver(true);
      return;
    }
    setCurrQuestionIndex(currQuestionIndex + 1);
  };

  //选择重新做题
  const handleRestart = () => {
    //重置状态
    setIsWrong(false);
    //除去模态框
    setShowChoices(false);
    setShowOver(false);
    //重置题目
    setCurrQuestionIndex(0);
    getQuestion();
  };

  return (
    <div id="pagethree">
      <img className="logo" src={require("../../static/logo.png")} alt="logo" />
      <img
        className="section"
        src={require("../../static/pg3/pg3-section.png")}
        alt="title"
      />
      <div className="question-wrapper">
        <div className="question">
          {realQuestionsList
            ? realQuestionsList[currQuestionIndex].title
            : "正在读取数据"}
        </div>
      </div>
      <div className="answer-wrapper">
        {realQuestionsList
          ? realQuestionsList[currQuestionIndex].questionItems.map(
              (item, index) => {
                return (
                  <div
                    key={index}
                    className={`answer a${index}`}
                    onClick={
                      !realQuestionsList[currQuestionIndex].hasSelected
                        ? checkAnswer
                        : null
                    }
                    data-itemindex={index}
                  >
                    <div
                      className="answer-text"
                      data-itemindex={index}
                    >
                      {item.content}
                    </div>
                    {realQuestionsList[currQuestionIndex].hasSelected &&
                    realQuestionsList[currQuestionIndex].questionItems[index]
                      .hasSelected ? (
                      item.isAnswer ? (
                        <img
                          className="answer-check-gif"
                          alt="img"
                          src={require('../../static/pg3/correct.gif')}
                        />
                      ) : (
                        <img
                          className="answer-check-gif"
                          alt="img"
                          src={require('../../static/pg3/wrong.gif')}
                        />
                      )
                    ) : (
                      ""
                    )}
                  </div>
                );
              }
            )
          : ""}
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
      {showChoices ? (
        <>
          <div className="wrong-modal">
            您已经答错题了，继续答题将不会获得奖品，是否继续?
          </div>
          <img
            onClick={handleContinue}
            className="continue"
            alt="img"
            src={require("../../static/pg3/continue.png")}
          />
          <img
            onClick={handleRestart}
            className="restart"
            alt="img"
            src={require("../../static/pg3/restart.png")}
          />
        </>
      ) : (
        ""
      )}
      {showOver ? (
        <>
          <div className="wrong-modal">
            您已经答错题了，不能获取到奖品，请重新做题。
          </div>
          <img
            onClick={handleRestart}
            className="restart-over"
            alt="img"
            src={require("../../static/pg3/restart.png")}
          />
        </>
      ) : (
        ""
      )}
    </div>
  );
}
