import { ComponentProps, children } from "solid-js";
import { styled } from "solid-styled-components";
import animations from './animations.module.css'

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
    <div class="circle"></div>
    <div class="circle"></div>
</div>
</LoaderComponent>

interface ToastContainerProps extends ComponentProps<any> {
    status: "success" | "warning" | "danger" | "loading" | undefined;
    children: any
}
export const ToastContainer = (prop: ToastContainerProps) => {
    const T = styled('div')`
        width: 100%;
        height: 100%;
        padding: 10px;
        display: flex;
        align-items: center;
        justify-content: center;
        position: relative;
        overflow: hidden;
        border-radius: 7px;
        height: 70px;
        gap: 20px;
        *{
            z-index: 3;
        }
        div{
            color: white;
        }
        svg{
            padding:3px;
            border-radius: 50%;
            background: linear-gradient(-45deg, ${prop.status === "danger" ? "red" : prop.status === "success" ? "turquoise" : prop.status === "warning" ? "yellow" : prop.status === "loading" ? "brown" : "turquoise"},lightblue,${prop.status === "danger" ? "red" : prop.status === "success" ? "turquoise" : prop.status === "warning" ? "yellow" : prop.status === "loading" ? "brown" : "turquoise"});
            background-size: 400% 400%;
            animation: ${animations.svgBackAnim} 5s ease-in-out infinite;
            *{

                animation: ${prop.status === "loading" ? animations.rotateAnim : ""} 2s linear infinite;
                transform-origin: center center;
            }
        }
        &::before{
            content: '';
            position: absolute;
            background: linear-gradient(to right, ${prop.status === "danger" ? "red" : prop.status === "success" ? "turquoise" : prop.status === "warning" ? "yellow" : prop.status === "loading" ? "brown" : "turquoise"} 50%,blue);
            inset: 0;
            height: 75%;
            /* height: 800px;
            width: 100px; */
            animation: ${animations.rotateAnim} 8s linear infinite;
            z-index:1; 
        }
        &::after{
            position: absolute;
            content: '';
            inset: 3px;
            background: #545454;
            border-radius: 7px;
            z-index:2;
        }
    `
    const c = children(() => prop.children)
    return <T>{c()}</T>
}