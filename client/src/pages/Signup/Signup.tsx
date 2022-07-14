import { Component, ComponentProps, JSX, onMount } from 'solid-js';
import { styled, css, keyframes } from 'solid-styled-components';
import { createSignal, createEffect } from 'solid-js';
import SignUpPart1 from './SignUpPart1';
import SignUpPart2 from './SignUpPart2';
import { Route, Routes, useNavigate } from 'solid-app-router';
import axios from 'axios';
import { Loader, ToastContainer } from '../../components'
import toast, { Toaster } from 'solid-toast';
import { BiSolidBug } from 'solid-icons/bi'

const center = css`
    display: flex;
    justify-content: center;
    align-items: center;
`
const Container = styled('div')`
    height: 100vh;
    width: 100vw;
    display: flex;
`
const Left = styled('div')`
    width: 50%;
    height: 100%;
    background-color: #21292f;
    color: #fff;
    font-size: 90px;
    font-weight: 100;
    display: grid;
    grid-template-rows: 25% 55%;
    padding-top: 175px;
`
const Right = styled('div')`
    width: 50%;
    height: 100%;
    background-color: #f5f5f5;
`
const avatarItem = css`
    width: 120px;
    border-radius: 50%;
    padding: 5px;
    transition: all 0.3s ease-in-out;
    cursor: pointer;
    /* border: 1px solid #fff; */
`
const notSelected = css`
    border: 5px solid transparent;
`
const AvatarList = styled('div')`
    padding: 0 50px 0 50px;
    height: 100%;
    width:100%;
    display: grid;
    grid-template-columns: repeat(3, 1fr);
    grid-gap: 20px;
    place-items: center;
`
const selected = css`
    border: 5px solid #fff;
`
interface SignupProps extends ComponentProps<any> {
    // add props here
}

const Signup: Component<SignupProps> = (props: SignupProps) => {
    const navigate = useNavigate();
    const [contactValue, setContactValue] = createSignal('email');
    const [avaList, setAvaList] = createSignal([] as JSX.Element[]);
    const [buffering, setBuffering] = createSignal(true);
    const [values, setValues] = createSignal({
        username: '',
        contact: {
            email: '',
            phone: '',
        },
        dateOfBirth: new Date(),
        name: '',
        otp: '',
        hashedOtp: '',
        avatar: '',
    })
    // const toastOptions=

    createEffect(() => {
        console.log(values());
    })

    const toastId = toast.custom(() =>
        <ToastContainer status="success">
            <BiSolidBug size="30px" />
            <div>This is a toast.</div>
        </ToastContainer>, { duration: 100_000_000, })

    onMount(async () => {
        let data: any = [];

        for (let i = 0; i < 6; i++) {
            const response = await axios.get(`https://avatars.dicebear.com/api/avataaars/${Math.random()}.svg`);
            const svg: string = response.data;
            const blob = new Blob([svg], { type: 'image/svg+xml' });
            const url = URL.createObjectURL(blob);
            const avatar = document.createElement('img');
            avatar.src = url;
            avatar.classList.add(avatarItem)
            avatar.addEventListener('load', () => URL.revokeObjectURL(url), { once: true });

            avatar.addEventListener('click', () => {
                document.querySelectorAll(`.${avatarItem}`).forEach(img => {
                    img.classList.remove(selected)
                    img.classList.add(notSelected)
                })
                avatar.classList.add(selected);
                avatar.classList.remove(notSelected);
                setValues({ ...values(), avatar: svg })
            })
            setBuffering(false);
            data.push(avatar);
        }
        setAvaList(data);
    })

    const handleChange = (e: any) => {
        if (e.target.name === 'email' || e.target.name === 'phone') {
            setValues({ ...values(), contact: { ...values().contact, [e.target.name]: e.target.value } })
            return;
        } if (e.target.name === 'dateOfBirth') {
            setValues({ ...values(), dateOfBirth: new Date(e.target.value) })
            return;
        }
        setValues({ ...values(), [e.target.name]: e.target.value })
    }

    return (
        <div>
            <Container>
                <Left style={{ "flex-direction": "column" }}>
                    <div class={center} style={{
                        width: '100%', height: '100%',
                    }}><div style={{ "letter-spacing": "20px" }}>CHATTY</div></div>
                    {buffering() ? Loader :
                        <AvatarList style={{ padding: "30px" }}>
                            {avaList().map((ava, index) => {
                                return ava;
                            })}
                        </AvatarList>}
                </Left>
                <Right class={center}>
                    <Routes>
                        <Route path="/*" element={<SignUpPart1
                            handleChange={handleChange}
                            values={values}
                            setValues={setValues}
                            contactValue={contactValue}
                            setContactValue={setContactValue}
                            toastId={toastId}
                        />} />
                        <Route path="/part2" element={<SignUpPart2
                            handleChange={handleChange}
                            values={values}
                            toastId={toastId}
                        />} />
                    </Routes>
                </Right>
            </Container>
            <Toaster
                containerStyle={{
                    width: '45%',
                    height: "fit-content",
                    inset: "30px"
                }}
            />
        </div>
    )
}

export default Signup;