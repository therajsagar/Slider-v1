import "./styles.css";
import { Slider } from "./components/Slider";
import React from "react";

import { data } from "./data";

const onChange = (val) => {
  console.log(val);
};

export default () => {
  return (
    <div className="App">
      <h1>Slider</h1>
      <Slider
        {...data}
        onChange={onChange}
        showMarks={false}
        instantUpdate={false}
      />
    </div>
  );
};
