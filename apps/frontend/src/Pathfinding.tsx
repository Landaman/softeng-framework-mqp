import "./Pathfinding.css";
import { TransformWrapper, TransformComponent } from "react-zoom-pan-pinch";
function Pathfinding() {
  return (
    <div className={"Pathfinding"}>
      <div className={"pathfinding-inputs"}>
        <h1>Get Directions</h1>
        <input />
        <input />
        <button className={"pathfindingButton"}>Submit</button>
      </div>
      <div>
        <TransformWrapper>
          <TransformComponent
            wrapperStyle={{
              width: parent.outerWidth * 0.85,
              height: parent.outerHeight * 0.85,
            }}
          >
            <img
              src={"./src/assets/floorMaps/00_thegroundfloor.png"}
              height={1000}
              width={1600}
            />
          </TransformComponent>
        </TransformWrapper>
      </div>
    </div>
  );
}

export default Pathfinding;
