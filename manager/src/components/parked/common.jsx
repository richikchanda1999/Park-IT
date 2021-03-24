import styled from "styled-components";

export const Customer = styled.table`
    font-family: Arial, Helvetica, sans-serif;
    border-collapse: collapse;
    width: 100%;
`;

export const Td1 = styled.td`
    border: 1px solid #ddd;
    padding: 8px;
    text-align: center;
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