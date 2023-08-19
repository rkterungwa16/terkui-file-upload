import styled from "styled-components";

export const StyledPageHeaderWrapper = styled.div`
  width: 90%;
  display: flex;
  justify-content: center;
  font-size: 20px;
  padding-bottom: 16px;
  font-weight: 400;
  line-height: 20px;
  letter-spacing: 0em;
  text-align: left;
`;

export const StyledCard = styled.div`
  display: flex;
  flex-direction: column;
  align-items: center;
  width: 100%;
  background: #ffffff;
  border-radius: 1rem;
  box-shadow: 0px 2px 4px 0px rgba(0, 0, 0, 0.1);
  padding: 1rem;
  color: #6f6f6f;
`;

const buttonStyles = `
  padding: 0.6rem;
  margin-left: 0.5rem;
  cursor: pointer;
  height: 48px;
  border: none;
  border-radius: 8px;
  box-shadow: 0px 1px 1px 0px rgba(0, 0, 0, 0.06), 0px 0px 0px 1px rgba(60, 66, 87, 0.08), 0px 2px 5px 0px rgba(60, 66, 87, 0.04);
`;
export const StyledPrimaryButton = styled.label`
  ${buttonStyles}
  color: #f3f1f2;
  background: #1458DD;
  font-weight: bold;
  margin: 0;
  display: flex;
  align-items: center;
`;
