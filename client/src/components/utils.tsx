import { styled } from "solid-styled-components";

const LoaderComponent = styled('div')`
    width: 100%;
    height: 100%;
    display: grid;
    place-items: center;
    div{
        height:50px;
        width:50px;
        transform-origin: bottom center;
        animation: rotate 3s linear infinite;
        .circle{
            background-color:turquoise;
            height:40px;
            width:40px;
            border-radius: 50%;
            transform: scale(0.2);
            animation: grow 1.5s linear infinite;
        }
        .circle:nth-child(2){
            background-color:white;
            animation-delay: 0.75s;
            margin: -20px;
        }
        @keyframes rotate {
            to{
                transform: rotate(360deg);
            }
        }
        @keyframes grow{
            50%{
                transform: scale(0.8);
            }
        } 
    }
`
export const Loader = <LoaderComponent><div>
    <div className="circle"></div>
    <div className="circle"></div>
</div>
</LoaderComponent>