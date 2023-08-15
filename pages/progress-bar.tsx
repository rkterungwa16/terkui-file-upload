import CircularProgressBar from "../src/circular-progress-bar";

export default function ProgressBar() {
  return (
    <div
      style={{
        width: "100%",
        height: "100%",
        display: "flex",
        alignItems: "center",
        justifyContent: "center",
      }}
    >
      <CircularProgressBar
        width="35"
        height="38"
        viewBox="0 0 35 38"
        radius={24}
        firstArcEndAngle={60}
      />
    </div>
  );
}

// width: "45",
//   height: "48",
//   viewBox: "0 0 45 48",
//   radius: 24,
