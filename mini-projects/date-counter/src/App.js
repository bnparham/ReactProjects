import { useState } from "react";
import Control from "./components/Control";
import ShowDate from "./components/ShowDate";

const App = () => {
  const [addCount, setAddCount] = useState(0);
  const [addStep, setAddStep] = useState(1);

  const date = new Date();
  date.setDate(date.getDate() + addCount);

  const addHandelCount = () => {
    setAddCount((c) => {
      const value = addStep !== 0 ? 1 * addStep : 1;
      return c + value;
    });
  };

  const decreaseHandelCount = () => {
    setAddCount((c) => {
      const value = addStep !== 0 ? 1 * addStep : 1;
      return c - value;
    });
  };

  const addHandelStep = () => {
    setAddStep((c) => c + 1);
  };

  const decreaseHandelStep = () => {
    setAddStep((c) => c - 1);
  };

  return (
    <div style={{ textAlign: "center", margin: "20px", fontSize: "20px" }}>
      {/* increse Count */}
      <Control
        decreaseHandeler={decreaseHandelCount}
        addHandeler={addHandelCount}
        addState={addCount}
        lable="Count"
      />
      {/* increse Steps */}
      <Control
        decreaseHandeler={decreaseHandelStep}
        addHandeler={addHandelStep}
        addState={addStep}
        lable="Step"
      />
      {/* Date */}
      <ShowDate addCount={addCount} date={date} />
    </div>
  );
};
export default App;
