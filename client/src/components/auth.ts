import { styled } from 'solid-styled-components';

export const FormContainer = styled('div')`
    width: 80%;
    background-color: #21292f;
    border-radius: 20px;
    color: white;
    display: flex;
    flex-direction: column;
    align-items: center;
    justify-content: space-between;
    padding: 20px 50px 30px 50px;
    gap: 30px;
`
export const Form = styled('form')`
    display: flex;
    width: 100%;
    flex-direction: column;
    align-items: center;
    gap: 20px;
    position: relative;
`
export const Logo = styled('div')`
    width: 80px;
    color: turquoise;
    margin: -15px;
`
export const Title = styled('h1')`
    font-size: 30px;
    font-weight: 200;
`
export const Input = styled('input')`
    width: 100%;
    height: 50px;
    background: none ;
    border: 2px solid white;
    border-radius: 7px;
    color: white;
    font-size: 15px;
    padding: 20px 10px 0px 20px;
    transition: all 0.1s ease;
    z-index: 10;
    &[type='date'] {
        padding: 10px;
        background-color: turquoise;
        background-image: linear-gradient(to right, rgba(0,0,0,0.5), #f5f5f5);
    }
    &:focus-visible {
        outline: none;
        border: 2px solid turquoise;
        box-shadow: 0 0 5px 2px turquoise;
    }
    &::-ms-reveal{
        filter: invert();
        transform: translate(0, -50%);
    }
    &::-webkit-calendar-picker-indicator{
        background-image: url('https://static.vecteezy.com/system/resources/previews/000/441/099/original/vector-calendar-icon.jpg');
        transform: scale(3.4,3.4) translate(6%,0);
        mix-blend-mode: multiply;
    }
`
export const InputContainer = styled('div')`
    display: flex;
    flex-direction: column;
    width: 100%;
    position: relative;
    gap: 3px;
    label{
        font-size: 15px;
        font-weight: 200;
        position: absolute;
        top: 15px;
        left: 20px;
        transition: all 0.1s ease;
        cursor: text;
    }
    ${Input.class}:focus-visible + label,${Input.class}:not(:placeholder-shown) + label{
        top: 3px;
        left:10px;
        color: turquoise;
        font-size: 12px;
    }
`
export const JustLink = styled('div')`
    color: turquoise;
    text-align: right;
    color: turquoise;
    text-decoration: underline;
    a { cursor: pointer; color: turquoise;}
`
export const DateContainer = styled('div')`
    display: flex;
    flex-direction: column;
    gap: 10px;
`
export const DateLabel = styled('label')`
    font-size: 18px;
    font-weight: 400;
    margin-bottom: -5px;
`
export const DateInfo = styled('div')`
    font-size: 15px;
    font-weight: 600;
    color: gray;
`
export const Button = styled('button')`
    width: 100%;
    height: 50px;
    background: none ;
    border: 2px solid turquoise;
    border-radius: 7px;
    color: turquoise;
    font-size: 25px;
    font-weight: 200;
    transition: all 0.2s ease;
    &:hover{
        cursor: pointer;
        background: turquoise;
        color: black;
        font-weight: 600;
        font-size: 23px;
    }
    &:focus-visible,&:focus {
        outline: none;
    }
`
