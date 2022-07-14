// import { notificationService } from '@hope-ui/solid';
import { AxiosError } from 'axios';
import { Link, useNavigate } from 'solid-app-router';
import { BiSolidRadiation } from 'solid-icons/bi';
import { FaSolidAtom } from 'solid-icons/fa';
import { Accessor, Component, ComponentProps, createEffect, createSignal } from 'solid-js';
import toast from 'solid-toast';
import { FormContainer, Form, Logo, Title, InputContainer, Input, JustLink, DateContainer, DateLabel, DateInfo, Button, ToastContainer } from '../../components'
import { privateRequest, publicRequest } from '../../functions/requestMethods';
import { schema } from '../../functions/validate';
import { store, setStore } from '../../store/store';

interface SignUpPart2Props extends ComponentProps<any> {
    handleChange: (e: any) => void;
    values: Accessor<{
        username: string;
        contact: {
            email: string;
            phone: string;
        };
        dateOfBirth: Date;
        name: string;
        otp: string;
        hashedOtp: string;
        avatar: string;
    }>;
    toastId: string;
}

const SignUpPart2: Component<SignUpPart2Props> = (props: SignUpPart2Props) => {
    const { handleChange, values, toastId } = props;
    const navigate = useNavigate();
    createEffect(() => {
        console.log(store.user.name);
    });
    // notificationService.show({
    //     id: "signin",
    //     status: "info",
    //     title: "Verifying OTP",
    //     description: "Trying to verify otp",
    //     loading: true
    // })
    // notificationService.show({
    //     id: "signinnn",
    //     status: "danger",
    //     title: "Invalid Creditentials",
    //     description: "Invalid Creditentials",
    //     duration: 5_000,
    // })

    const nextHandler = async () => {

        if (validate()) {
            toast.custom(() =>
                <ToastContainer status="loading">s
                    <FaSolidAtom size="30px" />
                    <div>Verifying OTP</div>
                </ToastContainer>
                , { id: toastId, duration: 100_000_000 })

            try {
                console.log("Trying to signup")
                const { data } = await privateRequest.post('/auth/signup', values())
                setStore("user", () => data.user)
                store.user?.username && localStorage.setItem('user', JSON.stringify(store.user));
                console.log(store.user.email)
                navigate('/chat')
            } catch (error: any) {
                if (error instanceof AxiosError) {
                    console.log(error);
                    console.log(error.response?.data.message[0])
                    console.log(error)
                    if (error.response?.data.message[0] == "OTP") {
                        toast.custom(() =>
                            <ToastContainer status="danger">s
                                <BiSolidRadiation size="30px" />
                                <div>{error.response?.data.message[1]}</div>
                            </ToastContainer>
                            , { id: toastId, duration: 100_000_000 })
                    } else {
                        toast.custom(() =>
                            <ToastContainer status="danger">s
                                <BiSolidRadiation size="30px" />
                                <div>{error.response?.data.message[0]}</div>
                            </ToastContainer>
                            , { id: toastId, duration: 100_000_000 })
                        console.log(error.response?.data.message[0])
                        navigate('/signup/')
                    }
                }
            }
        }
    }

    const validate = () => {
        const { otp } = values();
        if (schema.validate({ otp }).error) {
            // notificationService.update({
            //     id: "otp",
            //     status: "danger",
            //     title: "Invalid OTP",
            //     description: "The OTP has to be 6 digits long and should be a number!",
            // })
            toast.custom(() =>
                <ToastContainer status="danger">s
                    <BiSolidRadiation size="30px" />
                    <div>{"The OTP has to be 6 digits long and should be a number!"}</div>
                </ToastContainer>
                , { id: toastId, duration: 100_000_000 })
            return false;
        }
        return true;
    }

    return (
        <>
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
                            name="otp"
                            onChange={handleChange}
                        />
                        <label>OTP</label>
                        <JustLink><a>Resend OTP</a></JustLink>
                    </InputContainer>
                </Form>
                <InputContainer>
                    <Button onClick={nextHandler}>NEXT</Button>
                    <JustLink><Link href="/login">Already have an account?</Link></JustLink>
                </InputContainer>
            </FormContainer>
        </>
    )
}

export default SignUpPart2;