import React, { Component, useState, useEffect } from 'react';
import { useLocation } from 'react-router-dom';
import axios from 'axios';

const Detail = () => {
  const { state } = useLocation();
  const [title, setTitle] = useState();
  const [text, setText] = useState();

  useEffect(() => {
    setTitle(state.title);
    setText(state.text);
  }, []);

  return (
    <div>
      <input
        type="text"
        value={title}
        onChange={(e) => {
          setTitle(e.target.value);
        }}
      />
      <textarea
        name=""
        id=""
        cols="30"
        rows="10"
        value={text}
        onChange={(e) => {
          setText(e.target.value);
        }}
      ></textarea>
      <button
        onClick={() => {
          axios
            .post('http://218.234.193.153:5586/v1/newemp/update', {
              id: state.id,
              title,
              text,
              gu: 'JH',
            })
            .then(function (res) {
              console.log(res);
              if (res.data.Result == 'SUCC') {
                alert('수정되었습니다.');
              }
            });
        }}
      >
        수정하기
      </button>
      <button>리스트</button>
    </div>
  );
};

export default Detail;
