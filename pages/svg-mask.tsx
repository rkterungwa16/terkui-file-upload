import { SvgMask } from "../src/SvgMask";


export default function ProgressBar() {
  return (
    <div
      style={{
        width: "100%",
        height: "100vh",
        display: "flex",
        alignItems: "center",
        justifyContent: "center",
      }}
    >
      <SvgMask />
    </div>
  );
}
