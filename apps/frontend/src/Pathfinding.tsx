import "./Pathfinding.css";
import { TransformWrapper, TransformComponent } from "react-zoom-pan-pinch";
import { useState } from "react";
function Pathfinding() {
  const [floor, setfloor] = useState(
    "./src/assets/floorMaps/00_thelowerlevel1.png"
  );
  function groundFloor() {
    setfloor("./src/assets/floorMaps/00_thegroundfloor.png");
  }
  function FloorL1() {
    setfloor("./src/assets/floorMaps/00_thelowerlevel1.png");
  }
  function FloorL2() {
    setfloor("./src/assets/floorMaps/00_thelowerlevel2.png");
  }
  function Floor1() {
    setfloor("./src/assets/floorMaps/01_thefirstfloor.png");
  }
  function Floor2() {
    setfloor("./src/assets/floorMaps/02_thesecondfloor.png");
  }
  function Floor3() {
    setfloor("./src/assets/floorMaps/03_thethirdfloor.png");
  }

  return (
    <div className={"Pathfinding"}>
      <div className={"pathfinding-inputs"}>
        <h1>Get Directions</h1>
        <input />
        <input />
        <button className={"pathfindingButton"}>Submit</button>
      </div>
      <div className={"mapdiv"}>
        <TransformWrapper>
          <TransformComponent
            wrapperStyle={{
              width: parent.parent.outerWidth * 0.85,
              height: parent.parent.outerHeight * 0.85,
            }}
          >
            <img src={floor} height={1000} width={1600} />
          </TransformComponent>
        </TransformWrapper>
        <div className={"buttondiv"}>
          <button onClick={groundFloor}>Ground</button>
          <button onClick={FloorL1}>L1</button>
          <button onClick={FloorL2}>L1</button>
          <button onClick={Floor1}>1</button>
          <button onClick={Floor2}>2</button>
          <button onClick={Floor3}>3</button>
        </div>
      </div>
    </div>
  );
}

export default Pathfinding;
