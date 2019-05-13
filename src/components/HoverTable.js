import React, { useContext } from 'react';
import styled, { keyframes } from "styled-components";
import AppContext from "./AppContext";

//Styled Components to dynamically animate coin falling into field, adjusting the amount value when triggering animation in updateCb of Game component
const moveDown = (amount) => keyframes`
    0% {top: 0;}
  100%{top: ${amount}rem;}
`;

const AnimatedTd = styled.td`
  animation: ${({ amount }) => moveDown(amount)} 1s;`;

export default props => {
    //Hover table on top of canvas that shows coin if user hovers row and loads animation if animationClass is triggered from context
    const { activePlayer, activeRow, animationClass, animationDepth } = useContext(AppContext);

    return (
        <table className="hover-table">
            <tr>
                {Array(7).fill(0).map((_, i) => {
                    const className = `hover-table__field ${
                        activeRow === i + 1 &&
                        "hover" + activePlayer + "hover-active"
                        } `;
                    return animationClass ? <AnimatedTd className={className} amount={animationDepth} /> : <td className={className} />
                })}
            </tr>
        </table>
    );
};