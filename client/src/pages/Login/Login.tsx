import { Component, ComponentProps, onMount } from 'solid-js';
import { styled, css } from 'solid-styled-components';
import { createSignal, createEffect } from 'solid-js';
import { Link, Route, Routes, useNavigate } from 'solid-app-router';
import { Button, Form, FormContainer, Input, InputContainer, JustLink, Logo, Title } from '../../components';
import { schema } from '../../functions/validate';
import { notificationService } from '@hope-ui/solid';
import { publicRequest } from '../../functions/requestMethods';
import { AxiosError } from 'axios';
import { setStore, store } from '../../store/store';

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
`
const Right = styled('div')`
    width: 50%;
    height: 100%;
    background-color: #f5f5f5;
`

interface LoginProps extends ComponentProps<any> {
    // add props here
}

const Login: Component<LoginProps> = (props: LoginProps) => {
    const navigate = useNavigate();
    const [step, setStep] = createSignal(1);
    const [values, setValues] = createSignal({
        contact: {
            email: '',
            phone: '',
            username: ''
        },
        otp: '',
    })

    const nextHandler = async () => {
        const { contact, otp } = values();
        notificationService.show({
            id: "otp",
            status: "info",
            title: "Trying to send OTP",
            description: "You will receive an OTP on your registered email or phone number",
            loading: true
        })
        if (contact.email || contact.phone || contact.username) {
            console.log("was 2 here")
            try {
                const { data } = await publicRequest.post('/auth/generate-otp', {
                    contact: contact
                })
                setValues({ ...values(), hashedOtp: data.hashedOtp })
                console.log(values())
                setStep(2)
            } catch (error: any) {
                if (error instanceof AxiosError) {
                    console.log(error);
                    notificationService.update({
                        id: "otp",
                        status: "danger",
                        title: "Invalid Email or Phone Number",
                        description: error.response?.data?.message || "Invalid Email or Phone Number",
                        duration: 20_000,
                    })
                }
            }
        } else {
            notificationService.update({
                id: "otp",
                status: "danger",
                title: "Invalid Username",
                description: "username should have a minimum of 3 amd maximum of 50 characters and should not start with '+' !",
                duration: 20_000,
            })
        }
    }

    const handleLogIn = async () => {
        try {
            const { data } = await publicRequest.post('/auth/login', values())
            setStore("user", () => data)
            store.user?.username && localStorage.setItem('user', JSON.stringify(store.user));
            console.log(store.user)
            // navigate('/chat')

        } catch (error: any) {
            if (error instanceof AxiosError) {
                console.log(error);
                notificationService.update({
                    id: "otp",
                    status: "danger",
                    title: "Invalid Creditentials",
                    description: error.response?.data?.message || "Invalid Creditentials",
                    duration: 5_000,
                })
            }
        }
    }

    const handleChange = (e: any) => {
        if (e.target.name == "otp") {
            setValues({ ...values(), otp: e.target.value })
            return;
        } else if (e.target.name = "contact") {
            if (!schema.validate({ phone: e.target.value }).error) {
                setValues({ ...values(), contact: { phone: e.target.value, email: '', username: '' } })
                return;
            } else if (!schema.validate({ email: e.target.value }).error) {
                setValues({ ...values(), contact: { email: e.target.value, phone: '', username: '' } })
                return;
            } else if (!schema.validate({ username: e.target.value }).error) {
                setValues({ ...values(), contact: { username: e.target.value, phone: '', email: '' } })
            }
        }
    }

    return (
        <div>
            <Container>
                <Left className={center}>
                    CHATTY
                </Left>
                <Right className={center}>
                    <FormContainer>
                        <Form onSubmit={(e) => { e.preventDefault() }}>
                            <Logo >
                                <svg xmlns="http://www.w3.org/2000/svg" class="h-5 w-5" viewBox="0 0 20 20" fill="currentColor">
                                    <path d="M2 5a2 2 0 012-2h7a2 2 0 012 2v4a2 2 0 01-2 2H9l-3 3v-3H4a2 2 0 01-2-2V5z" />
                                    <path d="M15 7v2a4 4 0 01-4 4H9.828l-1.766 1.767c.28.149.599.233.938.233h2l3 3v-3h2a2 2 0 002-2V9a2 2 0 00-2-2h-1z" />
                                </svg>
                            </Logo>
                            <Title>ENTER OTP</Title>
                            <InputContainer>
                                <Input
                                    type="text"
                                    placeholder=" "
                                    name="contact"
                                    onChange={handleChange}
                                />
                                <label>Name or Email or Phone</label>
                            </InputContainer>
                            {step() === 2 &&
                                <InputContainer>
                                    <Input
                                        type="text"
                                        placeholder=" "
                                        name="otp"
                                        onChange={handleChange}
                                    />
                                    <label>OTP</label>
                                    <JustLink><a onClick={nextHandler}>Resend OTP</a></JustLink>
                                </InputContainer>
                            }
                        </Form>
                        <InputContainer>
                            {step() === 1 &&
                                <Button onClick={nextHandler}>NEXT</Button>
                            }
                            {step() === 2 &&
                                <Button onClick={handleLogIn}>Log In</Button>
                            }
                            <JustLink><Link href="/signup">Don't have an account?</Link></JustLink>
                        </InputContainer>
                    </FormContainer>
                </Right>
            </Container>
        </div>
    )
}

export default Login;