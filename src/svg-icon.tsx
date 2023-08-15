import { FC, SVGProps } from "react";

export const SVGIcon: FC<SVGProps<SVGSVGElement>> = ({
  children,
  ...others
}) => {
  return (
    <svg xmlns="http://www.w3.org/2000/svg" {...others}>
      {children}
    </svg>
  );
};

export default SVGIcon;
