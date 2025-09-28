import styles from "./styles.module.css";
export const SvgMask = () => {
  return (
    <div className={styles.wrapper}>
      <video autoPlay playsInline muted loop preload="true">
        <source src="https://storage.coverr.co/videos/7RzPQrmB00s01rknm8VJnXahEyCy4024IMG?token=eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJhcHBJZCI6Ijg3NjdFMzIzRjlGQzEzN0E4QTAyIiwiaWF0IjoxNjI5MTg2NjA0fQ.M8oElp5VNO8bWEWmdF2nGiu3qDOOYRFfP8wkKvl8I20" />
      </video>
      <svg
        width="558"
        height="303"
        xmlns="http://www.w3.org/2000/svg"
        viewBox="0 0 558 310"
        preserveAspectRatio="xMidYMid slice"
      >
        <defs>
          <mask id="mask" x="0" y="0" width="100%" height="100%">
            {/* <rect x="0" y="0" width="100%" height="101%" /> */}
            <path d="M59.6226 29.9828C64.1888 12.3305 80.1147 0 98.348 0H517.336C543.494 0 562.612 24.6933 556.062 50.0173L498.377 273.017C493.811 290.669 477.885 303 459.652 303H40.6635C14.506 303 -4.61247 278.307 1.93819 252.983L59.6226 29.9828Z" />
          </mask>
        </defs>
        {/* <rect x="0" y="0" width="100%" height="101%" /> */}
      </svg>
    </div>
  );
};
