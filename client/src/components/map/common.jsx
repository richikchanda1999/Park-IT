import styled from "styled-components";
export const BookButton = styled.button`
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
