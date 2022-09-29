import React, { Component, useEffect, useState } from 'react';
import axios from 'axios';

const Main = () => {
  // 게시판 리스트
  const [boards, setBoards] = useState([]);

  // 조회 String
  const [find, setFind] = useState('');

  // 아이디, 제목, 내용
  const [id, setId] = useState(0);
  const [title, setTitle] = useState('');
  const [text, setText] = useState('');

  // Toggle
  const [insert, setinsert] = useState(false);
  const [btnUpdate, setBtnUpdate] = useState(false);
  const [isShow, setIsShow] = useState(false);

  // 자주 사용하는 String
  const URL = 'http://218.234.193.153:5586/v1/newemp';
  const JH = 'JH';

  // ------ axios 함수로 만들기 -------

  // 게시물 조회
  const selBoard = () => {
    let url = 'http://218.234.193.153:5586/v1/newemp/table/JH/' + find;
    if (find == '') {
      url = "http://218.234.193.153:5586/v1/newemp/table/JH/''";
    }
    axios.get(url).then(function (res) {
      if (res.data.Result == 'SUCC') {
        setBoards(res.data.Msg);
      }
    });
  };

  // 게시물 삭제
  const delBoard = (id) => {
    axios
      .post(URL + '/delete', {
        id,
        gu: JH,
      })
      .then(function (res) {
        if (res.data.Result === 'SUCC') {
          alert('삭제되었습니다.');
          // 게시판 다시 조회
          selBoard();
        }
      });
  };

  // 게시물 등록
  const insBoard = (title, text) => {
    axios
      .post(URL + '/insert', {
        title,
        text,
        gu: JH,
      })
      .then(function (res) {
        // 게시판 다시 조회
        selBoard();
      });
  };

  // 게시물 수정
  const updBoard = (id, title, text) => {
    axios
      .post(URL + '/update', {
        id,
        title,
        text,
        gu: JH,
      })
      .then(function (res) {
        if (alert('수정되었습니다.')) {
          // 작성 폼 닫기
          setinsert(false);
        }
        // 게시판 다시 조회
        selBoard();
      });
  };

  // 게시물 조회수 증가
  const countBoard = (id) => {
    axios
      .post(URL + '/count', {
        id,
        gu: JH,
      })
      .then(function (res) {
        console.log('카운트 올라감');
        // 게시판 다시 조회
        selBoard();
      });
  };

  // 전체 조회
  useEffect(() => {
    axios.get(URL + "/table/JH/''").then(function (res) {
      if (res.data.Result == 'SUCC') {
        setBoards(res.data.Msg);
      }
    });
  }, []);

  useEffect(() => {
    console.log(id);
    countBoard(id);
  }, [id]);

  return (
    <div className="main">
      <header>
        <input
          type="text"
          value={find || ''}
          onChange={(e) => {
            setFind(e.target.value);
          }}
          placeholder="글 입력"
        />
        <button
          // ----------- 조회 검색 -----------
          onClick={() => {
            selBoard();
            setIsShow(false);
          }}
        >
          확인
        </button>
      </header>
      <div className="main-container">
        <ul>
          {boards.map((board) => {
            return (
              <li key={board.id}>
                <div className="idx">{board.id}</div>
                <div
                  className="title"
                  // ----------- 상세보기 -----------
                  onClick={() => {
                    setId(board.id);
                    setIsShow(true);
                    setTitle(board.title);
                    setText(board.text);
                  }}
                >
                  {board.title}
                </div>
                <div className="count">{board.selectcount}회</div>
                <div className="btn">
                  <button
                    // ----------- 수정 -----------

                    onClick={() => {
                      // 게시글 등록 폼 부분
                      setinsert(true);
                      // 수정 버튼 클릭 시 기존 내용 넣어주기
                      setTitle(board.title);
                      setText(board.text);
                      setId(board.id);
                      // 버튼을 저장에서 수정으로 바꿈
                      setBtnUpdate(true);
                    }}
                  >
                    수정
                  </button>

                  <button
                    className="btn-delete"
                    // ----------- 삭제 -----------
                    onClick={() => {
                      if (confirm('정말 삭제하시겠습니까?')) {
                        // 해당 게시물 삭제
                        delBoard(board.id);
                        selBoard();
                      } else {
                        alert('취소되었습니다.');
                      }
                    }}
                  >
                    삭제
                  </button>
                </div>
              </li>
            );
          })}
        </ul>

        {isShow ? (
          // ----------- 상세보기 내용 -----------
          <div className="detail">
            <div className="detail-header">
              <button
                className="close"
                onClick={() => {
                  setIsShow(false);
                }}
              >
                닫기
              </button>
            </div>

            <div className="title">제목 : {title}</div>
            <div className="text">내용 : {text}</div>
          </div>
        ) : null}
        <div>
          <button
            className="btn-write"
            // ----------- 입력 폼 토글버튼 -----------
            onClick={() => {
              setinsert(!insert);
              setTitle('');
              setText('');
              setBtnUpdate(false);
            }}
          >
            글작성
          </button>
        </div>
        {/* 게시글 등록 폼 부분 */}
        {insert ? (
          <div className="insertform">
            <button
              className="close"
              onClick={() => {
                // 게시글 등록 폼 닫기
                setinsert(false);
              }}
            >
              닫기
            </button>
            <input
              type="text"
              className="input"
              placeholder="제목"
              value={title}
              onChange={(e) => {
                setTitle(e.target.value);
              }}
            />
            <textarea name="" id="" cols="30" rows="10" placeholder="내용" value={text} onChange={(e) => setText(e.target.value)}></textarea>
            {btnUpdate ? (
              <button
                className="btn-update"
                onClick={() => {
                  // 게시글 등록 폼 닫기
                  setinsert(false);
                  // 게시글 수정 axios 보내기
                  updBoard(id, title, text);
                }}
              >
                글수정
              </button>
            ) : (
              <button
                className="btn-insert"
                // ----------- 글 등록 버튼 -----------
                onClick={() => {
                  // 게시글 등록 axios 보내기
                  insBoard(title, text);
                  setinsert(false);
                }}
              >
                저장
              </button>
            )}
          </div>
        ) : null}
      </div>
    </div>
  );
};

export default Main;
