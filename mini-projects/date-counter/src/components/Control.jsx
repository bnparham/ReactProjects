const Control = ({ decreaseHandeler, addHandeler, addState, lable }) => {
    return (
      <div
        style={{
          display: "flex",
          justifyContent: "center",
          margin: "20px",
          fontSize: "30px"
        }}
      >
        <button onClick={decreaseHandeler}>-</button>
        <p style={{ margin: "0 10px" }}>{lable} : {addState} </p>
        <button onClick={addHandeler}>+</button>
      </div>
    );
  };
  export default Control;
  