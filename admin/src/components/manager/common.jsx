import styled from "styled-components";

export const Customer = styled.table`
    font-family: Arial, Helvetica, sans-serif;
    border-collapse: collapse;
    width: 100%;
`;

export const Td1 = styled.td`
    border: 1px solid #ddd;
    padding: 8px;
`;

export const Tr1 = styled.tr`
    border: 1px solid #ddd;
    padding: 8px;
    &:hover {
        background-color: rgb(70, 64, 253);
      }
`;

export const Th1 = styled.th`
    border: 1px solid #ddd;
    padding-top: 12px;
    padding-bottom: 12px;
    padding: 8px;
    text-align: left;
    background-color: #4CAF50;
    color: white;
`;

export const DivA = styled.div`
    position: absolute;
    left: 50%;
    transform: translateX(-50%);
`;

export const DivB = styled.div`
margin-top: 5%;
`;

export const RatingButton = styled.button`
  width: 100%;
  left: 50%;
  padding: 8px 30%;
  color: #fff;
  font-size: 15px;
  font-weight: 600;
  border: none;
  border-radius: 100px 50px 100px 50px;
  cursor: pointer;
  transition: all, 240ms ease-in-out;
  background: ${props => props.enabled ? 'enabledrgb(70, 64, 253)' : 'enabledrgb(150, 64, 253)'};
  background: linear-gradient(
    58deg,
    ${props => props.enabled ? 'rgba(70, 64, 253, 1) 20%' : 'rgba(150, 64, 253, 1) 20%'},
    ${props => props.enabled ? 'rgba(70, 64, 253, 1) 100%' : 'rgba(150, 64, 253, 1) 100%'}
  );

  &:hover {
    filter: brightness(1.03);
  }
`;

export const InputRating = styled.input`
  margin-left: 40%;
  margin-bottom: 10px;
`;